# n8n Cloud URL Change Runbook

Current production base URL in this repo is:
- `https://cmpunktg10.app.n8n.cloud`

Use this runbook whenever you move to another n8n Cloud subdomain.

## 1. Define old/new values

- `OLD_N8N_BASE_URL=https://cmpunktg10.app.n8n.cloud`
- `NEW_N8N_BASE_URL=https://<your-new-subdomain>.app.n8n.cloud`

## 2. Exact backend/frontend file changes

### Backend: `server/services/telegramBridge.js`
Replace:
```js
const defaultCloudBaseUrl = 'https://cmpunktg10.app.n8n.cloud';
```
With:
```js
const defaultCloudBaseUrl = 'https://<your-new-subdomain>.app.n8n.cloud';
```

### Backend: `server/services/GmailPoller.js`
Replace:
```js
const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL || 'https://cmpunktg10.app.n8n.cloud/webhook/email-master-listener';
```
With:
```js
const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL || 'https://<your-new-subdomain>.app.n8n.cloud/webhook/email-master-listener';
```

### Backend: `server/routes/automations.js`
Replace these defaults:
```js
const defaultCloudBaseUrl = 'https://cmpunktg10.app.n8n.cloud';
```
```js
youtubeWebhookUrl = process.env.N8N_SCIFI_HINDI_WEBHOOK_URL || 'https://cmpunktg10.app.n8n.cloud/webhook/scifi-future-worlds-hindi';
```
```js
youtubeWebhookUrl = process.env.N8N_SCIFI_ENGLISH_WEBHOOK_URL || 'https://cmpunktg10.app.n8n.cloud/webhook/scifi-future-worlds-english';
```
```js
youtubeWebhookUrl = process.env.N8N_YOUTUBE_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || 'https://cmpunktg10.app.n8n.cloud/webhook/run-youtube-automation';
```
```js
const DEFAULT_LEAD_HUNTER_WEBHOOK_URL = 'https://cmpunktg10.app.n8n.cloud/webhook/lead-hunter-start';
```

### Backend: `server/services/leadHunterQueue.js`
Replace:
```js
const DEFAULT_SENDER_WEBHOOK_URL = 'https://cmpunktg10.app.n8n.cloud/webhook/lead-hunter-sender';
```

### Docs/config: `RENDER_DEPLOYMENT.md`, `.env.example`, optional `server/.env`
Replace all old base URL occurrences with new base URL.

### Frontend files
No frontend code file needs direct n8n base URL changes.
Frontend talks only to backend API (`VITE_API_URL`).

## 3. Render backend environment variables

Update these in Render backend service:
- `N8N_WEBHOOK_BASE_URL`
- `N8N_WEBHOOK_URL`
- `N8N_YOUTUBE_WEBHOOK_URL`
- `N8N_TELEGRAM_WEBHOOK_URL`
- `N8N_EMAIL_WEBHOOK_URL`
- `N8N_SCIFI_ENGLISH_WEBHOOK_URL`
- `N8N_SCIFI_HINDI_WEBHOOK_URL`
- `N8N_LEAD_QUALIFICATION_WEBHOOK_URL`
- `N8N_HUNTER_WEBHOOK_URL`
- `N8N_SENDER_WEBHOOK_URL`

Then redeploy backend.

## 4. n8n workflow updates

In n8n Cloud, for all active workflows:
1. Find `OLD_N8N_BASE_URL` in HTTP/Webhook node URLs.
2. Replace with `NEW_N8N_BASE_URL`.
3. Save and Activate.

Keep backend API URLs as:
- `https://jomocal-backend.onrender.com/api/...`

Do not use `localhost` in n8n Cloud workflows.

## 5. Verification commands

From repo root:
```powershell
rg -n "cmpunktg10.app.n8n.cloud|<your-new-subdomain>.app.n8n.cloud" -S server src .env.example RENDER_DEPLOYMENT.md
```

After migration, ensure no stale old URL references remain.

## 6. Post-change validation

1. Launch Lead Hunter from frontend and confirm queueing response.
2. Confirm Hunter webhook execution in n8n.
3. Confirm delayed sender webhook jobs execute.
4. Verify Google Sheet rows change status to `Sent`.
5. Verify Telegram/Gmail/Youtube automations still trigger correctly.

## 7. Rollback

If issues appear:
1. Revert Render env vars to old URL.
2. Revert code/doc URL changes.
3. Re-activate n8n workflows using old URL.
4. Redeploy backend.
