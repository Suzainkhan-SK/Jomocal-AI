const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Automation = require('../models/Automation');
const Integration = require('../models/Integration');
const axios = require('axios');
const ActivityLog = require('../models/ActivityLog');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const upload = multer({ storage: multer.memoryStorage() });
const { getValidYoutubeTokensForUser } = require('../services/youtubeTokens');
const { getValidGoogleAccessToken, hasGoogleServiceConnected } = require('../services/googleTokens');
const { createLeadHunterSheet } = require('../services/googleSheets');
const leadHunterQueue = require('../services/leadHunterQueue');

// In-memory soft rate limiting for YouTube triggers (per user, per hour).
// This is intentionally simple for demo/MANTHAN readiness and can be moved
// to Redis or a dedicated service later without changing the public API.
const youtubeTriggerBuckets = new Map(); // userId -> number[]
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_LEAD_HUNTER_WEBHOOK_URL = 'https://cmpunktg5.app.n8n.cloud/webhook/stateless-hunter';

function normalizeLeadRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    return list
        .map((lead, index) => ({
            leadEmail: String(
                lead?.leadEmail ||
                lead?.email ||
                lead?.Email ||
                ''
            ).trim(),
            businessName: String(
                lead?.businessName ||
                lead?.['Business Name'] ||
                lead?.title ||
                ''
            ).trim(),
            icebreaker: String(
                lead?.icebreaker ||
                lead?.Icebreaker ||
                ''
            ).trim(),
            website: String(
                lead?.website ||
                lead?.Website ||
                ''
            ).trim(),
            phone: String(
                lead?.phone ||
                lead?.Phone ||
                ''
            ).trim(),
            rowIndex: Number.isInteger(lead?.rowIndex)
                ? lead.rowIndex
                : (Number.isInteger(lead?.sheetRowIndex) ? lead.sheetRowIndex : (index + 2)),
        }))
        .filter((lead) => lead.leadEmail);
}

function buildHunterWebhookCandidates() {
    const configured = process.env.N8N_HUNTER_WEBHOOK_URL;
    const baseUrl = process.env.N8N_WEBHOOK_BASE_URL || 'https://cmpunktg5.app.n8n.cloud';
    const base = baseUrl.replace(/\/+$/, '');
    return [
        configured,
        `${base}/webhook/stateless-hunter`,
        `${base}/webhook/lead-hunter-start`,
        DEFAULT_LEAD_HUNTER_WEBHOOK_URL,
    ].filter(Boolean);
}

// Public helper: return a sanitized automation for a given user and type
// Used by backend automations like n8n; does NOT expose credentials (none are stored here anyway).

// @route   GET api/automations
// @desc    Get all user automations (with auto-seeding)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        let automations = await Automation.find({ userId });

        // Auto-seed core automations (idempotent). This ensures YouTube automation
        // exists for users who signed up before the feature was added.
        const requiredTypes = [
            {
                type: 'auto_reply',
                name: 'AI Customer Support Bot',
                description: 'Context-aware AI assistant trained on your business knowledge.',
                icon: 'MessageSquare',
                color: 'blue',
            },
            {
                type: 'lead_save',
                name: 'Lead Qualification AI',
                description: 'Automatically capture and qualify leads from your conversations.',
                icon: 'Users',
                color: 'green',
            },
            {
                type: 'lead_hunter',
                name: 'Lead Hunter',
                description: 'Find and drip-send personalized B2B leads with AI.',
                icon: 'Zap',
                color: 'amber',
            },
            {
                type: 'youtube_video_automation',
                name: 'YouTube AI Shorts',
                description: 'Automated AI video creation and publishing for YouTube.',
                icon: 'Youtube',
                color: 'red',
            },
        ];

        const existingByType = new Map(automations.map((a) => [a.type, a]));
        const toInsert = requiredTypes
            .filter((rt) => !existingByType.has(rt.type))
            .map((rt) => ({
                userId,
                name: rt.name,
                description: rt.description,
                type: rt.type,
                icon: rt.icon,
                color: rt.color,
                status: 'inactive',
            }));

        if (toInsert.length > 0) {
            const inserted = await Automation.insertMany(toInsert);
            automations = automations.concat(inserted);
        }

        res.json(automations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/automations/status/:userId
// @desc     Public status check for n8n gatekeeper node
// @access   Public
router.get('/status/:userId', async (req, res) => {
    try {
        const automation = await Automation.findOne({
            userId: req.params.userId,
            type: 'auto_reply'
        });

        if (!automation) {
            return res.json({
                status: 'inactive',
                botSettings: {
                    personality: "Professional and helpful", // Provide a default for AI agent
                    welcomeMessage: "",
                    knowledgeBase: ""
                }
            });
        }

        // Return current status and the specific structure n8n expects
        // 'active' if either Telegram or Gmail is active
        const isActive = automation.status === 'active' || automation.emailAutomationStatus === 'active';

        res.json({
            status: isActive ? 'active' : 'inactive',
            botSettings: {
                personality: automation.botPersonality || "Professional and helpful", // Provide a default for AI agent
                welcomeMessage: automation.botWelcomeMessage || "",
                knowledgeBase: automation.knowledgeBaseText || ""
            }
        });
    } catch (err) {
        console.error('Status check error:', err.message);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
});

// @route   GET api/automations/public/:userId/:type
// @desc    Public read-only access to a single automation (for backend workflows like n8n)
// @access  Public
router.get('/public/:userId/:type', async (req, res) => {
    try {
        const { userId, type } = req.params;
        const automation = await Automation.findOne({ userId, type });

        if (!automation) {
            return res.status(404).json({ msg: 'Automation not found' });
        }

        // Only expose fields that are safe and needed for workflows
        const { _id, name, description, status, config } = automation;
        return res.json({
            _id,
            userId,
            type,
            name,
            description,
            status,
            config: config || {}
        });
    } catch (err) {
        console.error('Public automation fetch error:', err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/automations/config
// @desc    Update AI Bot configuration (with PDF support)
// @access  Private
router.post('/config', [auth, upload.single('pdfFile')], async (req, res) => {
    try {
        const userId = req.user.id;
        const { personality, welcomeMessage, manualText } = req.body;

        console.log(`[BOT-CONFIG] User ${userId} is updating bot settings...`);
        console.log(`[BOT-CONFIG] Personality: ${personality}, Welcome: ${welcomeMessage}`);
        console.log(`[BOT-CONFIG] File: ${req.file ? req.file.originalname : 'No PDF'}`);

        let automation = await Automation.findOne({ userId, type: 'auto_reply' });

        if (!automation) {
            console.log(`[BOT-CONFIG] Seeding new AI Customer Support Bot for user ${userId}`);
            automation = new Automation({
                userId,
                type: 'auto_reply',
                name: 'AI Customer Support Bot',
                description: 'Context-aware AI assistant trained on your business knowledge.',
                status: 'inactive'
            });
        }

        if (personality) automation.botPersonality = personality;
        if (welcomeMessage) automation.botWelcomeMessage = welcomeMessage;

        let newKnowledge = '';
        if (req.file) {
            try {
                // Convert Node.js Buffer to Uint8Array for modern pdf-parse compatibility
                const uint8Array = new Uint8Array(req.file.buffer);
                const pdfParser = new PDFParse(uint8Array);
                const result = await pdfParser.getText();
                newKnowledge = result.text.trim();
                console.log(`[BOT-CONFIG] Successfully extracted ${newKnowledge.length} chars from PDF`);
            } catch (pdfErr) {
                console.error('[BOT-CONFIG] PDF parsing error:', pdfErr);
                return res.status(400).json({ msg: 'Failed to parse PDF file. Please ensure it is a valid document.' });
            }
        }

        if (manualText) {
            console.log(`[BOT-CONFIG] Adding manual text: ${manualText.length} chars`);
            newKnowledge = newKnowledge ? `${newKnowledge}\n\n${manualText.trim()}` : manualText.trim();
        }

        if (newKnowledge) {
            automation.knowledgeBaseText = automation.knowledgeBaseText
                ? `${automation.knowledgeBaseText}\n\n--- Information Added on ${new Date().toLocaleString()} ---\n${newKnowledge}`
                : newKnowledge;

            // Sanitize: remove excessive newlines
            automation.knowledgeBaseText = automation.knowledgeBaseText.replace(/\n{3,}/g, '\n\n');
        }

        automation.updatedAt = new Date();
        await automation.save();
        console.log(`[BOT-CONFIG] Automation saved successfully.`);

        res.json({
            msg: 'AI Brain Updated',
            automation
        });
    } catch (err) {
        console.error('[BOT-CONFIG] ERROR:', err.message);
        res.status(500).json({ msg: 'Server error while saving configuration. Please try again.' });
    }
});

// @route   PATCH api/automations/:id
// @desc    Update automation (name, description, config) for current user only
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const allowed = ['name', 'description', 'config', 'emailAutomationStatus', 'emailAutomationWebhook'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            if (key === 'config' && typeof req.body[key] === 'object') updates[key] = req.body[key];
            else if (key !== 'config') updates[key] = req.body[key];
        }
    }
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ msg: 'No valid fields to update.' });
    }
    try {
        const automation = await Automation.findOne({ _id: id, userId });
        if (!automation) return res.status(404).json({ msg: 'Automation not found.' });

        if (updates.name !== undefined) automation.name = updates.name;
        if (updates.description !== undefined) automation.description = updates.description;
        if (updates.config !== undefined) automation.config = { ...automation.config, ...updates.config };
        if (updates.emailAutomationStatus !== undefined) automation.emailAutomationStatus = updates.emailAutomationStatus;
        if (updates.emailAutomationWebhook !== undefined) automation.emailAutomationWebhook = updates.emailAutomationWebhook;
        automation.updatedAt = new Date();
        await automation.save();
        res.json(automation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/automations/toggle
// @desc    Toggle automation status and sync Telegram webhooks (per user)
// @access  Private
router.post('/toggle', auth, async (req, res) => {
    const { automationId, status } = req.body;
    const userId = req.user.id;

    try {
        const automation = await Automation.findOne({ _id: automationId, userId });

        if (!automation) {
            return res.status(404).json({ msg: 'Automation not found' });
        }

        // Block activation if required Google service is not connected (YouTube, Gmail, Sheets).
        const isYoutubeAutomation =
            automation.type === 'youtube_video_automation' ||
            automation.type.startsWith('youtube_');
        const requiredGoogleService = isYoutubeAutomation ? 'youtube' : null; // extend for gmail/sheets automations

        if (status === 'active' && requiredGoogleService) {
            const connected = await hasGoogleServiceConnected(userId, requiredGoogleService);
            if (!connected) {
                return res.status(400).json({
                    msg: `Connect your Google account and enable ${requiredGoogleService === 'youtube' ? 'YouTube' : requiredGoogleService} before activating this automation.`,
                    error: `${requiredGoogleService}_not_connected`
                });
            }
        }

        automation.status = status;
        automation.updatedAt = new Date();
        await automation.save();

        const integrations = await Integration.find({ userId, isConnected: true });
        const telegramIntegration = integrations.find(i => i.platform === 'telegram');

        if (automation.type === 'auto_reply' && telegramIntegration && telegramIntegration.credentials) {
            const telegramToken = telegramIntegration.credentials.token;
            if (!telegramToken) {
                console.warn('Telegram integration has no token; skipping webhook update.');
            } else if (status === 'active') {
                const defaultCloudBaseUrl = 'https://cmpunktg5.app.n8n.cloud';
                const telegramWebhookUrl = process.env.N8N_TELEGRAM_WEBHOOK_URL;
                const tunnelUrl = process.env.N8N_WEBHOOK_BASE_URL ||
                    (telegramWebhookUrl && telegramWebhookUrl.split('/webhook/')[0]) ||
                    (process.env.N8N_WEBHOOK_URL && process.env.N8N_WEBHOOK_URL.split('/webhook/')[0]) ||
                    defaultCloudBaseUrl;
                if (tunnelUrl) {
                    const webhookUrl = `${tunnelUrl}/webhook/telegram-master-listener?token=${telegramToken}&userId=${userId}`;
                    try {
                        await axios.get(`https://api.telegram.org/bot${telegramToken}/setWebhook?url=${webhookUrl}`);
                        console.log(`✅ Webhook registered for user ${userId} bot ${telegramToken.split(':')[0]}`);
                    } catch (webhookErr) {
                        console.error('❌ Failed to register Telegram webhook:', webhookErr.message);
                    }
                }
            } else {
                try {
                    await axios.get(`https://api.telegram.org/bot${telegramToken}/deleteWebhook`);
                    console.log(`🧹 Webhook cleared for user ${userId} bot ${telegramToken.split(':')[0]}`);
                } catch (webhookErr) {
                    console.log('ℹ️ Webhook already cleared or bot token invalid.');
                }
            }
        }

        res.json(automation);
    } catch (err) {
        console.error('Toggle Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/automations/lead-hunter/start
// @desc    Start stateless Lead Hunter campaign: scrape + AI now, drip send later via queue.
// @access  Private
router.post('/lead-hunter/start', [auth, upload.single('businessPdf')], async (req, res) => {
    const userId = req.user.id;
    try {
        let {
            targetNiche,
            targetLocation,
            campaignSize,
            offer,
            benefit,
            businessContext,
            sendingSpeed,
            mode,
        } = req.body || {};

        if (!targetNiche || !targetLocation || !offer || !benefit) {
            const leadHunterAutomation = await Automation.findOne({ userId, type: 'lead_hunter' });
            const cfg = leadHunterAutomation?.config || {};
            targetNiche = targetNiche || cfg.targetNiche;
            targetLocation = targetLocation || cfg.targetLocation;
            campaignSize = campaignSize || cfg.campaignSize;
            offer = offer || cfg.offer;
            benefit = benefit || cfg.benefit;
            businessContext = businessContext || cfg.businessContext;
            sendingSpeed = sendingSpeed || cfg.sendingSpeed;
            mode = mode || cfg.mode;
        }

        const cleanTargetNiche = String(targetNiche || '').trim();
        const cleanTargetLocation = String(targetLocation || '').trim();
        const cleanOffer = String(offer || '').trim();
        const cleanBenefit = String(benefit || '').trim();
        let cleanBusinessContext = String(businessContext || '').trim();
        const cleanMode = String(mode || 'Review in Drafts').trim();
        const campaignSizeNum = Math.max(1, Math.min(100, Number(campaignSize) || 25));
        const sendingSpeedNum = Math.max(1, Math.min(50, Number(sendingSpeed) || 20));

        if (!cleanTargetNiche || !cleanTargetLocation || !cleanOffer || !cleanBenefit) {
            return res.status(400).json({ msg: 'Missing required lead hunter inputs.' });
        }

        // Ensure Google Sheets + Gmail permissions are connected before launching campaign.
        await getValidGoogleAccessToken(userId, 'gmail');
        const { accessToken: sheetsAccessToken } = await getValidGoogleAccessToken(userId, 'sheets');

        const { spreadsheetId } = await createLeadHunterSheet({
            accessToken: sheetsAccessToken,
            targetNiche: cleanTargetNiche,
            targetLocation: cleanTargetLocation,
        });

        if (req.file) {
            try {
                const parser = new PDFParse(new Uint8Array(req.file.buffer));
                const pdfResult = await parser.getText();
                const extracted = String(pdfResult?.text || '').trim();
                if (extracted) {
                    cleanBusinessContext = cleanBusinessContext
                        ? `${cleanBusinessContext}\n\n--- EXTRACTED PDF DATA ---\n${extracted}`
                        : extracted;
                }
            } catch (pdfErr) {
                console.error('Lead Hunter PDF parsing error:', pdfErr.message);
                return res.status(400).json({ msg: 'Failed to parse business PDF. Upload a valid PDF document.' });
            }
        }

        const webhookPayload = {
            userId: String(userId),
            targetNiche: cleanTargetNiche,
            targetLocation: cleanTargetLocation,
            campaignSize: campaignSizeNum,
            offer: cleanOffer,
            benefit: cleanBenefit,
            businessContext: cleanBusinessContext,
            mode: cleanMode === 'Auto-Pilot' ? 'Auto-Pilot' : 'Review in Drafts',
            sendingSpeed: sendingSpeedNum,
            spreadsheetId,
            googleAccessToken: sheetsAccessToken,
        };

        const webhookCandidates = buildHunterWebhookCandidates();
        let workflowResponse = null;
        let lastHunterError = null;

        for (const hunterWebhookUrl of webhookCandidates) {
            try {
                workflowResponse = await axios.post(hunterWebhookUrl, webhookPayload, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: Number(process.env.N8N_HUNTER_TIMEOUT_MS || 300000),
                });
                break;
            } catch (hunterErr) {
                lastHunterError = hunterErr;
                const status = hunterErr.response?.status;
                // Retry next candidate if webhook path is wrong.
                if (status === 404) continue;
                // For non-404 errors, stop early and surface the upstream failure.
                break;
            }
        }

        if (!workflowResponse) {
            throw lastHunterError || new Error('Hunter workflow did not respond.');
        }

        const rawLeads =
            workflowResponse.data?.leads ||
            workflowResponse.data?.data ||
            workflowResponse.data?.items ||
            workflowResponse.data;
        const leads = normalizeLeadRows(rawLeads);

        if (leads.length === 0) {
            return res.status(200).json({
                ok: true,
                spreadsheetId,
                queuedCount: 0,
                message: 'No leads with valid emails were returned from hunter workflow.',
            });
        }

        const enqueueResult = await leadHunterQueue.scheduleJobs({
            userId,
            spreadsheetId,
            leads,
            mode: cleanMode,
            sendingSpeed: sendingSpeedNum,
        });

        // Persist latest campaign config on lead_hunter automation.
        await Automation.updateOne(
            { userId, type: 'lead_hunter' },
            {
                $setOnInsert: {
                    userId,
                    type: 'lead_hunter',
                    name: 'Lead Hunter',
                    description: 'Find and drip-send personalized B2B leads with AI.',
                    icon: 'Zap',
                    color: 'amber',
                    status: 'inactive',
                    createdAt: new Date(),
                },
                $set: {
                    updatedAt: new Date(),
                    config: {
                        targetNiche: cleanTargetNiche,
                        targetLocation: cleanTargetLocation,
                        campaignSize: campaignSizeNum,
                        offer: cleanOffer,
                        benefit: cleanBenefit,
                        businessContext: cleanBusinessContext,
                        sendingSpeed: sendingSpeedNum,
                        mode: cleanMode === 'Auto-Pilot' ? 'Auto-Pilot' : 'Review in Drafts',
                    },
                },
            },
            { upsert: true }
        );

        return res.json({
            ok: true,
            spreadsheetId,
            queuedCount: enqueueResult.queued,
            intervalMinutes: Number((enqueueResult.intervalMs / 60000).toFixed(2)),
            message: `Campaign started. ${enqueueResult.queued} leads queued for drip sending.`,
        });
    } catch (err) {
        console.error('Lead Hunter start error:', err.response?.data || err.message);
        const code = err.code || err.response?.data?.error;
        if (code === 'SERVICE_NOT_CONNECTED' || code === 'MISSING_REFRESH_TOKEN') {
            return res.status(400).json({ msg: 'Connect Google with Gmail and Sheets before launching Lead Hunter.' });
        }
        const upstreamStatus = Number(err.response?.status || 0);
        const upstreamMsg = typeof err.response?.data === 'string'
            ? err.response.data
            : (err.response?.data?.message || err.response?.data?.msg || err.message);
        if (upstreamStatus >= 400 && upstreamStatus < 500) {
            return res.status(400).json({ msg: `Lead Hunter rejected request: ${upstreamMsg}` });
        }
        return res.status(500).json({ msg: `Failed to start Lead Hunter campaign: ${upstreamMsg}` });
    }
});

/**
 * STEP 6: n8n integration (stateless execution engine) for YouTube automation.
 *
 * - backend fetches VALID YouTube tokens (refreshes if needed)
 * - backend sends tokens + minimal config to n8n in the webhook payload
 * - n8n uses HTTP Request nodes + Authorization: Bearer {{ $json.body.youtube_access_token }}
 *
 * This is the platform-ready trigger used by the frontend "Run Now" button.
 */
router.post('/run/youtube', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const limit = Number(process.env.YOUTUBE_TRIGGER_LIMIT_PER_HOUR || 30);
        const now = Date.now();

        // Soft rate limit: keep timestamps for the last hour only.
        const bucket = youtubeTriggerBuckets.get(String(userId)) || [];
        const recent = bucket.filter((ts) => now - ts < ONE_HOUR_MS);

        if (recent.length >= limit) {
            console.warn(`YouTube trigger rate limit exceeded for user ${userId}`);
            try {
                await ActivityLog.create({
                    userId,
                    automationName: 'YouTube AI Videos Automation',
                    platform: 'other',
                    action: 'Rate limit exceeded',
                    status: 'failed',
                    details: `Soft limit of ${limit} triggers per hour reached.`,
                });
            } catch (logErr) {
                console.error('Failed to log YouTube rate limit event:', logErr.message);
            }
            return res.status(429).json({
                msg: 'You have reached the safe limit for YouTube runs this hour. Please try again shortly.',
                error: 'rate_limited',
            });
        }

        recent.push(now);
        youtubeTriggerBuckets.set(String(userId), recent);

        // Require content type from saved config. Only "islamic_stories_hindi" triggers the live workflow.
        const youtubeAutomation = await Automation.findOne({ userId, type: 'youtube_video_automation' });
        const contentType = youtubeAutomation?.config?.contentType || '';
        if (!contentType) {
            return res.status(400).json({
                msg: 'Please select a content type in Configure before running.',
                error: 'content_type_required',
            });
        }
        if (contentType !== 'islamic_stories_hindi' && contentType !== 'scifi_future_worlds_hindi' && contentType !== 'scifi_future_worlds_english' && contentType !== 'mythical_creatures') {
            return res.status(400).json({
                msg: 'This content type is coming soon.',
                error: 'content_type_coming_soon',
            });
        }

        const { accessToken } = await getValidYoutubeTokensForUser(userId);

        let youtubeWebhookUrl;
        if (contentType === 'scifi_future_worlds_hindi') {
            youtubeWebhookUrl = process.env.N8N_SCIFI_HINDI_WEBHOOK_URL || 'https://cmpunktg5.app.n8n.cloud/webhook/scifi-future-worlds-hindi';
        } else if (contentType === 'scifi_future_worlds_english') {
            youtubeWebhookUrl = process.env.N8N_SCIFI_ENGLISH_WEBHOOK_URL || 'https://cmpunktg5.app.n8n.cloud/webhook/scifi-future-worlds-english';
        } else if (contentType === 'mythical_creatures') {
            youtubeWebhookUrl = process.env.N8N_MYTHICAL_CREATURES_WEBHOOK_URL;
        } else {
            youtubeWebhookUrl = process.env.N8N_YOUTUBE_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || 'https://cmpunktg5.app.n8n.cloud/webhook/run-youtube-automation';
        }

        if (!youtubeWebhookUrl) {
            return res.status(500).json({ msg: 'Missing n8n webhook configuration for this content type.' });
        }
        const payload = {
            userId: String(userId),
            youtube_access_token: accessToken,
            youtube_channel_title: null,
            automationConfig: {
                language: 'Hindi',
                videosPerRun: 1,
            },
            telegramChatId: null,
            callbackUrl: process.env.BACKEND_PUBLIC_URL
                ? `${process.env.BACKEND_PUBLIC_URL.replace(/\/+$/, '')}/api/automations/youtube/callback`
                : null,
        };

        await axios.post(youtubeWebhookUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        return res.json({ ok: true });
    } catch (err) {
        console.error('YouTube trigger error:', err.message);
        if (err.code === 'YOUTUBE_NOT_CONNECTED') {
            return res.status(400).json({ msg: 'YouTube not connected.', error: 'youtube_not_connected' });
        }
        return res.status(500).json({ msg: 'Failed to trigger YouTube workflow.' });
    }
});

// @route   GET api/automations/youtube/last-run
// @desc    Get last YouTube automation run status (for Retry button visibility)
// @access  Private
router.get('/youtube/last-run', auth, async (req, res) => {
    try {
        const log = await ActivityLog.findOne({
            userId: req.user.id,
            automationName: 'YouTube AI Videos Automation',
            action: 'YouTube automation run',
        })
            .sort({ timestamp: -1 })
            .select('status timestamp details')
            .lean();

        if (!log) {
            return res.json({ status: null, timestamp: null, details: null });
        }
        return res.json({
            status: log.status,
            timestamp: log.timestamp,
            details: log.details || null,
        });
    } catch (err) {
        console.error('YouTube last-run fetch error:', err.message);
        return res.status(500).json({ status: null });
    }
});

// @route   POST api/automations/youtube/callback
// @desc    Receive result from YouTube workflow completion (stateless callback)
// @access  Public (n8n only – secure via network in production)
router.post('/youtube/callback', async (req, res) => {
    try {
        const { userId, status, youtubeUploadId, videoTitle, errorMessage } = req.body || {};

        if (!userId || !status) {
            return res.status(400).json({ msg: 'Missing userId or status' });
        }

        try {
            await ActivityLog.create({
                userId,
                automationName: 'YouTube AI Videos Automation',
                platform: 'other',
                action: 'YouTube automation run',
                status: status === 'success' ? 'success' : 'failed',
                details: errorMessage || (status === 'success'
                    ? `Video uploaded successfully: ${videoTitle || ''} (${youtubeUploadId || 'no-id'})`
                    : `YouTube automation failed for ${videoTitle || 'unknown title'}`),
            });
        } catch (logErr) {
            console.error('Failed to log YouTube automation callback:', logErr.message);
        }

        return res.json({ ok: true });
    } catch (err) {
        console.error('YouTube callback error:', err.message);
        // Do not force retries from n8n; report success even on log failure.
        return res.json({ ok: false });
    }
});

module.exports = router;
