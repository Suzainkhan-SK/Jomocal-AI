const axios = require('axios');
const Integration = require('../models/Integration');
const Automation = require('../models/Automation');
const MessageTracker = require('../models/MessageTracker');

class TelegramBridge {
    constructor() {
        this.running = false;
        this.offsets = new Map(); // botToken -> offset
        this.processingMessages = new Set(); // Track messages currently being processed
    }

    async start() {
        if (this.running) return;
        this.running = true;
        console.log('🚀 Telegram Polling Bridge Started (Local Development Mode)');
        this.poll();
    }

    async poll() {
        while (this.running) {
            try {
                // 1. Find all active Telegram integrations
                const integrations = await Integration.find({ platform: 'telegram', isConnected: true });

                for (const integration of integrations) {
                    const token = integration.credentials.token;
                    const userId = integration.userId;

                    // 2. Ensure webhook is disabled so polling works
                    if (!this.offsets.has(token)) {
                        try {
                            await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook`);
                            console.log(`🧹 Bridge: Webhook cleared for bot ${token.split(':')[0]}`);
                            this.offsets.set(token, 0);
                        } catch (e) {
                            console.error('❌ Bridge: Failed to clear webhook:', e.message);
                        }
                    }

                    // 3. Check if there's an active auto-reply automation for this user BEFORE fetching messages
                    const automation = await Automation.findOne({
                        userId,
                        type: 'auto_reply',
                        status: 'active'
                    });

                    if (!automation) {
                        // Automation is paused/inactive - skip this bot entirely
                        // Still update offset to prevent message buildup
                        const offset = this.offsets.get(token) || 0;
                        if (offset === 0) {
                            console.log(`⏸️  Bridge: Automation PAUSED for bot ${token.split(':')[0]} - skipping`);
                        }
                        try {
                            const response = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`, {
                                params: { offset, timeout: 1 },
                                timeout: 3000
                            });
                            // Mark messages as read but don't process them
                            if (response.data.result.length > 0) {
                                const lastUpdate = response.data.result[response.data.result.length - 1];
                                this.offsets.set(token, lastUpdate.update_id + 1);
                            }
                        } catch (e) {
                            // Silently ignore errors when automation is inactive
                        }
                        continue;
                    }

                    // 4. Automation is ACTIVE - fetch and process updates from Telegram
                    const offset = this.offsets.get(token) || 0;
                    try {
                        const response = await axios.get(`https://api.telegram.org/bot${token}/getUpdates`, {
                            params: { offset, timeout: 10 },
                            timeout: 15000
                        });

                        const updates = response.data.result;
                        for (const update of updates) {
                            if (!update.message) continue;
                            if (update.message.from?.is_bot) continue; // Skip bot's own messages or other bots

                            console.log(`📩 Bridge: Received message from @${update.message?.from?.username || 'unknown'}`);

                            // Track analytics - message received
                            try {
                                await axios.post('http://localhost:5000/api/analytics/track', {
                                    userId,
                                    platform: 'telegram',
                                    metric: 'messageReceived',
                                    value: 1
                                });
                            } catch (e) {
                                // Don't fail if analytics tracking fails
                            }

                            // Get bot settings directly from the automation object we already found
                            const botSettings = {
                                personality: automation.botPersonality || 'Professional and helpful',
                                welcomeMessage: automation.botWelcomeMessage || '',
                                knowledgeBase: automation.knowledgeBaseText || ''
                            };

                            // 5. Check for duplicates before processing
                            const messageId = update.message?.message_id;
                            const chatId = update.message?.chat?.id;

                            if (!messageId || !chatId) {
                                console.log('⚠️ Bridge: Skipping message - missing ID or chat ID');
                                this.offsets.set(token, update.update_id + 1);
                                continue;
                            }

                            // Create unique identifier for this message
                            const messageKey = `${userId}-${chatId}-${messageId}`;

                            // Skip if already being processed or processed very recently
                            if (this.processingMessages.has(messageKey)) {
                                console.log(`🔄 Bridge: Message ${messageKey} is ALREADY in flight, skipping redundant processing.`);
                                this.offsets.set(token, update.update_id + 1);
                                continue;
                            }

                            // Check if message was already processed recently
                            try {
                                const existing = await MessageTracker.findOne({
                                    messageId: messageId.toString(),
                                    chatId: chatId,
                                    userId: userId,
                                    platform: 'telegram'
                                });

                                if (existing) {
                                    console.log(`🔁 Bridge: Duplicate message detected (ID: ${messageId}), skipping`);
                                    this.offsets.set(token, update.update_id + 1);
                                    continue;
                                }
                            } catch (dbError) {
                                console.error('❌ Bridge: Database error checking duplicates:', dbError.message);
                                // Continue processing even if DB check fails to avoid losing messages
                            }

                            // Mark as processing
                            this.processingMessages.add(messageKey);

                            // 6. Forward to n8n (cloud or self-hosted) with settings.
                            // Prefer explicit webhook URLs from env; fall back to a base URL for local dev.
                            const baseUrl = process.env.N8N_WEBHOOK_BASE_URL || 'http://localhost:5678';
                            const prodWebhook =
                                process.env.N8N_TELEGRAM_WEBHOOK_URL ||
                                `${baseUrl.replace(/\/+$/, '')}/webhook/telegram-master-listener`;
                            const testWebhook =
                                process.env.N8N_TELEGRAM_WEBHOOK_TEST_URL ||
                                `${baseUrl.replace(/\/+$/, '')}/webhook-test/telegram-master-listener`;

                            const n8nUrls = [
                                `${prodWebhook}?token=${token}&userId=${userId}`,
                                `${testWebhook}?token=${token}&userId=${userId}`,
                            ].filter(Boolean);

                            // Enhance the update with bot settings and tracking info
                            const enrichedUpdate = {
                                ...update,
                                botSettings,
                                userId, // This will be in the body
                                messageTracking: {
                                    messageId: messageId.toString(),
                                    chatId: chatId,
                                    messageKey: messageKey
                                }
                            };

                            let success = false;
                            let errorMessage = null;

                            for (const n8nUrl of n8nUrls) {
                                try {
                                    await axios.post(n8nUrl, enrichedUpdate, {
                                        headers: { 'Content-Type': 'application/json' },
                                        timeout: 5000
                                    });
                                    console.log(`✅ Bridge: Forwarded to n8n successfully (${n8nUrl.includes('test') ? 'Test' : 'Prod'} URL)`);
                                    success = true;
                                    break;
                                } catch (err) {
                                    if (!err.response || err.response.status !== 404) {
                                        console.error(`❌ Bridge: Forwarding failed to ${n8nUrl}:`, err.message);
                                        errorMessage = err.message;
                                    }
                                }
                            }

                            if (success) {
                                // Track analytics - message sent
                                try {
                                    await axios.post('http://localhost:5000/api/analytics/track', {
                                        userId,
                                        platform: 'telegram',
                                        metric: 'messageSent',
                                        value: 1
                                    });
                                } catch (e) {
                                    // Don't fail if analytics tracking fails
                                }

                                // Record successful processing to prevent duplicates
                                try {
                                    await MessageTracker.create({
                                        messageId: messageId.toString(),
                                        chatId: chatId,
                                        userId: userId,
                                        platform: 'telegram'
                                    });
                                    console.log(`🔒 Bridge: Message ${messageId} marked as processed`);
                                } catch (dbError) {
                                    console.error('❌ Bridge: Failed to record message processing:', dbError.message);
                                }

                            } else {
                                console.error(`❌ Bridge: Failed to forward message ${messageId} to any n8n endpoint`);
                                // Log failure
                                try {
                                    const ActivityLog = require('../models/ActivityLog');
                                    await ActivityLog.create({
                                        userId,
                                        automationName: 'AI Customer Support Bot',
                                        platform: 'telegram',
                                        action: 'Auto-reply failed',
                                        status: 'failed',
                                        details: `Failed to process message: ${errorMessage || 'Unknown error'}`,
                                        messageData: {
                                            recipientUsername: update.message?.from?.username,
                                            recipientName: `${update.message?.from?.first_name || ''} ${update.message?.from?.last_name || ''}`.trim(),
                                            messageContent: update.message?.text || '[No text]'
                                        }
                                    });
                                } catch (logError) {
                                    console.error('❌ Bridge: Failed to log error:', logError.message);
                                }
                            }

                            // Clean up processing flag
                            this.processingMessages.delete(messageKey);

                            // 6. Update offset
                            this.offsets.set(token, update.update_id + 1);
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 409) {
                            console.log(`⚠️ Bridge: 409 Conflict for bot ${token.split(':')[0]}. Re-clearing webhook...`);
                            await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook`).catch(() => { });
                        } else if (err.code !== 'ECONNABORTED') {
                            console.error(`❌ Bridge Error (Bot ${token.split(':')[0]}):`, err.message);
                        }
                    }
                }
            } catch (err) {
                console.error('❌ Bridge Global Error:', err.message);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    stop() {
        this.running = false;
    }
}

module.exports = new TelegramBridge();
