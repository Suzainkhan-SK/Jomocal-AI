const axios = require('axios');
const LeadHunterJob = require('../models/LeadHunterJob');
const { getValidGoogleAccessToken } = require('./googleTokens');

const DEFAULT_SENDER_WEBHOOK_URL =
  'https://cmpunktg5.app.n8n.cloud/webhook/lead-hunter-sender';

function buildSenderWebhookCandidates() {
  const configured = process.env.N8N_SENDER_WEBHOOK_URL;
  const baseUrl = process.env.N8N_WEBHOOK_BASE_URL || 'https://cmpunktg5.app.n8n.cloud';
  const base = baseUrl.replace(/\/+$/, '');
  return [
    configured,
    `${base}/webhook/lead-hunter-sender`,
    DEFAULT_SENDER_WEBHOOK_URL,
  ].filter(Boolean);
}

class LeadHunterQueue {
  constructor() {
    this.timer = null;
    this.running = false;
    this.pollMs = Number(process.env.LEAD_HUNTER_QUEUE_POLL_MS || 15000);
    this.maxAttempts = Number(process.env.LEAD_HUNTER_QUEUE_MAX_ATTEMPTS || 3);
    this.retryDelayMs = Number(process.env.LEAD_HUNTER_QUEUE_RETRY_DELAY_MS || 60000);
    this.lockTtlMs = Number(process.env.LEAD_HUNTER_QUEUE_LOCK_TTL_MS || 15 * 60 * 1000);
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.pollMs);
    // Warm start
    setTimeout(() => this.tick(), 2000);
    console.log('[LEAD-HUNTER-QUEUE] Worker started');
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  async scheduleJobs({ userId, spreadsheetId, leads, mode, sendingSpeed }) {
    const speed = Math.max(1, Math.min(50, Number(sendingSpeed) || 1));
    const intervalMs = Math.floor((24 * 60 * 60 * 1000) / speed);
    const now = Date.now();

    const docs = leads.map((lead, index) => ({
      userId,
      spreadsheetId,
      leadEmail: lead.leadEmail,
      businessName: lead.businessName || '',
      icebreaker: lead.icebreaker || '',
      website: lead.website || '',
      phone: lead.phone || '',
      mode: mode === 'Auto-Pilot' ? 'Auto-Pilot' : 'Review in Drafts',
      rowIndex: Number.isInteger(lead.rowIndex) ? lead.rowIndex : (index + 2),
      status: 'pending',
      runAt: new Date(now + index * intervalMs),
      attempts: 0,
      lockedAt: null,
    }));

    if (docs.length === 0) return { queued: 0, intervalMs };

    await LeadHunterJob.insertMany(docs, { ordered: false });
    return { queued: docs.length, intervalMs };
  }

  async tick() {
    if (this.running) return;
    this.running = true;

    try {
      const staleBefore = new Date(Date.now() - this.lockTtlMs);
      await LeadHunterJob.updateMany(
        { status: 'processing', lockedAt: { $lt: staleBefore } },
        {
          $set: {
            status: 'pending',
            lockedAt: null,
            runAt: new Date(Date.now() + this.retryDelayMs),
            lastError: 'Recovered stale lock',
          },
        }
      );

      const now = new Date();
      const job = await LeadHunterJob.findOneAndUpdate(
        {
          status: 'pending',
          runAt: { $lte: now },
          lockedAt: null,
        },
        {
          $set: {
            status: 'processing',
            lockedAt: now,
          },
          $inc: { attempts: 1 },
        },
        { sort: { runAt: 1 }, new: true }
      );

      if (!job) return;
      await this.processJob(job);
    } catch (err) {
      console.error('[LEAD-HUNTER-QUEUE] Tick error:', err.message);
    } finally {
      this.running = false;
    }
  }

  async processJob(job) {
    try {
      const { accessToken } = await getValidGoogleAccessToken(job.userId, 'gmail');

      const senderPayload = {
        userId: String(job.userId),
        spreadsheetId: job.spreadsheetId,
        leadEmail: job.leadEmail,
        businessName: job.businessName,
        icebreaker: job.icebreaker,
        website: job.website,
        phone: job.phone,
        mode: job.mode,
        rowIndex: job.rowIndex,
        googleAccessToken: accessToken,
      };
      const senderCandidates = buildSenderWebhookCandidates();
      let senderErr = null;
      let delivered = false;

      for (const senderWebhookUrl of senderCandidates) {
        try {
          await axios.post(senderWebhookUrl, senderPayload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          });
          delivered = true;
          break;
        } catch (err) {
          senderErr = err;
          if (err.response?.status === 404) continue;
          break;
        }
      }

      if (!delivered) {
        throw senderErr || new Error('Sender workflow did not respond.');
      }

      await LeadHunterJob.updateOne(
        { _id: job._id },
        {
          $set: {
            status: 'completed',
            lockedAt: null,
            completedAt: new Date(),
            lastError: null,
          },
        }
      );
    } catch (err) {
      const attempts = Number(job.attempts || 1);
      const failMsg = err.response?.data?.message || err.message;
      const canRetry = attempts < this.maxAttempts;

      await LeadHunterJob.updateOne(
        { _id: job._id },
        {
          $set: {
            status: canRetry ? 'pending' : 'failed',
            lockedAt: null,
            runAt: new Date(Date.now() + this.retryDelayMs),
            lastError: String(failMsg).slice(0, 1000),
          },
        }
      );

      console.error(`[LEAD-HUNTER-QUEUE] Job ${job._id} failed:`, failMsg);
    }
  }
}

module.exports = new LeadHunterQueue();
