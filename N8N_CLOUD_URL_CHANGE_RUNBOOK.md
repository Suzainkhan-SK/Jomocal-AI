# n8n Cloud URL Change Runbook

This guide explains how to switch your n8n Cloud base URL in the future.

Example migration:
- Old: `https://cmpunktg4.app.n8n.cloud`
- New: `https://cmpunktg5.app.n8n.cloud`

Use this when you move to a new n8n Cloud workspace/subdomain.

## 1. Decide the new base URL

Set these values first:
- `OLD_N8N_BASE_URL=https://cmpunktg4.app.n8n.cloud`
- `NEW_N8N_BASE_URL=https://cmpunktg5.app.n8n.cloud`

## 2. Exact repo file changes (backend/frontend)

This project is already cloud-ready. For a future base URL migration, update these exact files/snippets.

### 2.1 Backend file: `server/services/telegramBridge.js`

Find and replace:

```js
const defaultCloudBaseUrl = 'https://cmpunktg4.app.n8n.cloud';
```

with:

```js
const defaultCloudBaseUrl = 'https://cmpunktg5.app.n8n.cloud';
```

### 2.2 Backend file: `server/services/GmailPoller.js`

Find and replace:

```js
const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL || 'https://cmpunktg4.app.n8n.cloud/webhook/email-master-listener';
```

with:

```js
const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL || 'https://cmpunktg5.app.n8n.cloud/webhook/email-master-listener';
```

### 2.3 Backend file: `server/routes/automations.js`

Find and replace these three spots:

```js
const defaultCloudBaseUrl = 'https://cmpunktg4.app.n8n.cloud';
```

```js
youtubeWebhookUrl = process.env.N8N_SCIFI_HINDI_WEBHOOK_URL || 'https://cmpunktg4.app.n8n.cloud/webhook/scifi-future-worlds-hindi';
```

```js
youtubeWebhookUrl = process.env.N8N_SCIFI_ENGLISH_WEBHOOK_URL || 'https://cmpunktg4.app.n8n.cloud/webhook/scifi-future-worlds-english';
```

```js
youtubeWebhookUrl = process.env.N8N_YOUTUBE_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL || 'https://cmpunktg4.app.n8n.cloud/webhook/run-youtube-automation';
```

Replace `cmpunktg4` with `cmpunktg5` in all of them.

### 2.4 Docs/config file: `RENDER_DEPLOYMENT.md`

In the backend env block, replace all `cmpunktg4.app.n8n.cloud` with `cmpunktg5.app.n8n.cloud`.

### 2.5 Optional local-dev file: `server/.env`

If you use local backend testing, update these keys:
- `N8N_WEBHOOK_BASE_URL`
- `N8N_WEBHOOK_URL`
- `N8N_YOUTUBE_WEBHOOK_URL`
- `N8N_TELEGRAM_WEBHOOK_URL`
- `N8N_EMAIL_WEBHOOK_URL`
- `N8N_SCIFI_ENGLISH_WEBHOOK_URL`
- `N8N_SCIFI_HINDI_WEBHOOK_URL`
- `N8N_LEAD_QUALIFICATION_WEBHOOK_URL`

### 2.6 Frontend files

No frontend code file needs n8n URL changes in this repo.

- Keep frontend API URL pointing to backend API (`VITE_API_URL=https://jomocal-backend.onrender.com/api`).
- Frontend URL `https://jomocal-frontend.onrender.com` is only UI hosting; it is not used for n8n webhook calls.

## 3. Update Render backend environment variables

In Render Dashboard:
- Open your backend service (not frontend).
- Go to `Environment`.
- Replace all old n8n URLs with new ones.

Set these values:
- `N8N_WEBHOOK_BASE_URL=https://cmpunktg5.app.n8n.cloud`
- `N8N_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/run-youtube-automation`
- `N8N_YOUTUBE_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/run-youtube-automation`
- `N8N_TELEGRAM_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/telegram-master-listener`
- `N8N_EMAIL_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/email-master-listener`
- `N8N_SCIFI_ENGLISH_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/scifi-future-worlds-english`
- `N8N_SCIFI_HINDI_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/scifi-future-worlds-hindi`
- `N8N_LEAD_QUALIFICATION_WEBHOOK_URL=https://cmpunktg5.app.n8n.cloud/webhook/lead-qualification`

Then click `Save Changes` and redeploy/restart backend service.

## 4. Update n8n Cloud workflows (HTTP Request nodes)

Important:
- Do not use `localhost` inside n8n Cloud workflows.
- Use backend API domain for backend calls:
  - `https://jomocal-backend.onrender.com`

### 4.1 Replace n8n webhook base inside workflow nodes (if hardcoded)

In n8n workflow editor:
- Open each active workflow.
- Search all nodes for `cmpunktg4.app.n8n.cloud`.
- Replace with `cmpunktg5.app.n8n.cloud`.
- Save and re-activate workflow.

### 4.2 Keep backend API calls pointing to backend URL

These should remain backend URLs (not n8n URL):
- `https://jomocal-backend.onrender.com/api/automations/status/...`
- `https://jomocal-backend.onrender.com/api/automations/public/...`
- `https://jomocal-backend.onrender.com/api/logs/n8n`
- `https://jomocal-backend.onrender.com/api/automations/youtube/callback`

## 5. Optional best practice in n8n: use variables

To avoid future manual node edits:
- In n8n: `Settings -> Variables`
- Create: `N8N_BASE_URL=https://cmpunktg5.app.n8n.cloud`
- Create: `API_BASE_URL=https://jomocal-backend.onrender.com`

Use in nodes:
- `{{$vars.N8N_BASE_URL}}/webhook/telegram-master-listener`
- `{{$vars.API_BASE_URL}}/api/automations/status/{{$json.query.userId}}`

## 6. Fast search commands before commit

From project root:

```powershell
rg -n "cmpunktg4.app.n8n.cloud" -S server RENDER_DEPLOYMENT.md N8N_CLOUD_URL_CHANGE_RUNBOOK.md
```

After replacements, this should return zero results.

## 7. Validation checklist after change

1. Trigger `run-youtube-automation` from app UI and confirm n8n workflow receives execution.
2. Activate Telegram automation and verify Telegram webhook registration succeeds.
3. Send Telegram message and verify response flow.
4. Send unread test Gmail and verify email listener workflow runs.
5. Verify logs reach backend endpoint (`/api/logs/n8n`).

## 8. Rollback plan

If any issue occurs:
1. Revert Render env vars back to old URL values.
2. Revert repo code/docs old URL values.
3. Re-activate workflows with old URL.
4. Restart backend service.

## 9. Notes

- Frontend URL `https://jomocal-frontend.onrender.com` is UI only.
- Backend API calls from n8n should use backend URL `https://jomocal-backend.onrender.com`.
- n8n workflow webhooks should use `https://cmpunktg5.app.n8n.cloud/webhook/...` after migration.
