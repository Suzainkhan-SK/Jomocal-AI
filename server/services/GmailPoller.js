const axios = require('axios');
const Automation = require('../models/Automation');
const { getValidGoogleAccessToken } = require('./googleTokens');

class GmailPoller {
    constructor() {
        this.interval = null;
        this.isPolling = false;
        this.POLL_INTERVAL = 60000; // 60 seconds
    }

    async start() {
        if (this.interval) return;
        console.log('📬 Gmail Poller Started');
        this.interval = setInterval(() => this.poll(), this.POLL_INTERVAL);
        // Run initial poll shortly after start
        setTimeout(() => this.poll(), 5000);
    }

    async poll() {
        if (this.isPolling) return;
        this.isPolling = true;

        try {
            // 1. Find all users with active email automation
            const activeAutomations = await Automation.find({
                type: 'auto_reply',
                emailAutomationStatus: 'active'
            });

            if (activeAutomations.length === 0) {
                this.isPolling = false;
                return;
            }

            console.log(`[GMAIL-POLL] Checking ${activeAutomations.length} active email bots...`);

            for (const automation of activeAutomations) {
                try {
                    await this.processUserEmails(automation);
                } catch (userErr) {
                    const errorDetails = userErr.response?.data || {};
                    const errorMessage = typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails;

                    console.error(`[GMAIL-POLL] ❌ 403 FORBIDDEN for user ${automation.userId}`);
                    console.error(`[GMAIL-POLL] Response Body: ${errorMessage}`);

                    if (errorMessage.includes('Gmail API has not been used') || errorMessage.includes('disabled')) {
                        console.error('[GMAIL-POLL] 💡 ACTION REQUIRED: You must enable the "Gmail API" in your Google Cloud Console (Library tab).');
                    } else if (errorMessage.includes('insufficient permissions')) {
                        console.error('[GMAIL-POLL] 💡 ACTION REQUIRED: User did not grant Gmail permissions. Re-connect on the Connections page.');
                    }
                }
            }
        } catch (err) {
            console.error('[GMAIL-POLL] Global Error:', err.message);
        } finally {
            this.isPolling = false;
        }
    }

    async processUserEmails(automation) {
        const userId = automation.userId;

        // 2. Get fresh Gmail Access Token
        let accessToken;
        try {
            const tokenRes = await getValidGoogleAccessToken(userId, 'gmail');
            accessToken = tokenRes.accessToken;
        } catch (err) {
            console.error(`[GMAIL-POLL] Failed to get Gmail token for ${userId}:`, err.message);
            return;
        }

        // 3. List messages (unread only)
        const listRes = await axios.get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
            params: { q: 'is:unread', maxResults: 5 },
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const messages = listRes.data.messages || [];
        if (messages.length === 0) return;

        console.log(`[GMAIL-POLL] User ${userId}: Found ${messages.length} unread emails.`);

        for (const msgSummary of messages) {
            // 4. Fetch details
            let msgDetail;
            try {
                msgDetail = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgSummary.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
            } catch (readErr) {
                console.error(`[GMAIL-POLL] [GMAIL-READ-ERROR] User ${userId}: Failed to fetch message ${msgSummary.id}:`, readErr.response?.data || readErr.message);
                continue;
            }

            const data = this.extractEmailData(msgDetail.data);

            // 5. Trigger n8n (cloud or self-hosted) via configured webhook URL
            try {
                const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL;
                if (!n8nUrl) {
                    console.warn('[GMAIL-POLL] Skipping n8n call: N8N_EMAIL_WEBHOOK_URL is not configured.');
                    continue;
                }

                const queryStr = `?userId=${userId}&token=${accessToken}`;

                await axios.post(n8nUrl + queryStr, {
                    threadId: msgDetail.data.threadId,
                    senderEmail: data.from,
                    subject: data.subject,
                    emailContent: data.body
                }, { timeout: 15000 });

                console.log(`[GMAIL-POLL] [N8N-SUCCESS] User ${userId}: Forwarded email from ${data.from} to n8n.`);
            } catch (n8nErr) {
                console.error(
                    `[GMAIL-POLL] [N8N-ERROR] User ${userId}: Failed to trigger n8n:`,
                    n8nErr.response?.status === 404
                        ? '404 (Check if workflow is ACTIVE in n8n)'
                        : n8nErr.message
                );
                continue; // Don't mark as read if n8n failed
            }

            // 6. Mark as Read (remove UNREAD label)
            try {
                await axios.post(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgSummary.id}/modify`, {
                    removeLabelIds: ['UNREAD']
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
            } catch (modifyErr) {
                console.error(`[GMAIL-POLL] [GMAIL-MODIFY-ERROR] User ${userId}: Failed to mark as read:`, modifyErr.message);
            }
        }
    }

    extractEmailData(message) {
        const headers = message.payload.headers;
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';

        // Extract email address from "Name <email@example.com>"
        const emailMatch = fromHeader.match(/<(.+?)>/) || [null, fromHeader];
        const senderEmail = emailMatch[1];

        // Extract body
        let body = '';
        if (message.payload.parts) {
            // Multipart message
            const part = message.payload.parts.find(p => p.mimeType === 'text/plain') || message.payload.parts[0];
            if (part && part.body && part.body.data) {
                body = this.decodeBase64(part.body.data);
            }
        } else if (message.payload.body && message.payload.body.data) {
            // Single part message
            body = this.decodeBase64(message.payload.body.data);
        }

        return {
            subject,
            from: senderEmail,
            body: body || message.snippet || ''
        };
    }

    decodeBase64(data) {
        // Handle Base64URL (Gmail standard)
        const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(base64, 'base64').toString('utf8');
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

module.exports = new GmailPoller();
