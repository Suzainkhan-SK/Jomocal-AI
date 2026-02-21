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

## 2. Update Render backend environment variables

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

## 3. Update n8n Cloud workflows (HTTP Request nodes)

Important:
- Do not use `localhost` inside n8n Cloud workflows.
- Use your backend API domain for backend calls:
  - `https://jomocal-backend.onrender.com`

### 3.1 Replace n8n webhook base inside workflow nodes (if hardcoded)

In n8n workflow editor:
- Open each active workflow.
- Search all nodes for `cmpunktg4.app.n8n.cloud`.
- Replace with `cmpunktg5.app.n8n.cloud`.
- Save and re-activate workflow.

### 3.2 Keep backend API calls pointing to backend URL

These should remain backend URLs (not n8n URL):
- `https://jomocal-backend.onrender.com/api/automations/status/...`
- `https://jomocal-backend.onrender.com/api/automations/public/...`
- `https://jomocal-backend.onrender.com/api/logs/n8n`
- `https://jomocal-backend.onrender.com/api/automations/youtube/callback`

## 4. Optional best practice in n8n: use variables

To avoid future manual node edits:
- In n8n: `Settings -> Variables`
- Create: `N8N_BASE_URL=https://cmpunktg5.app.n8n.cloud`
- Create: `API_BASE_URL=https://jomocal-backend.onrender.com`

Use in nodes:
- `{{$vars.N8N_BASE_URL}}/webhook/telegram-master-listener`
- `{{$vars.API_BASE_URL}}/api/automations/status/{{$json.query.userId}}`

## 5. Update local repo docs/config (recommended)

In this repo, update old URL references to new URL in docs/config files.

From project root, run:

```powershell
rg -n "cmpunktg4.app.n8n.cloud" -S .
```

Replace each hit with `cmpunktg5.app.n8n.cloud` where appropriate.

## 6. Validation checklist after change

1. Trigger `run-youtube-automation` from app UI and confirm n8n workflow receives execution.
2. Activate Telegram automation and verify Telegram webhook registration succeeds.
3. Send Telegram message and verify response flow.
4. Send unread test Gmail and verify email listener workflow runs.
5. Verify logs reach backend endpoint (`/api/logs/n8n`).

## 7. Rollback plan

If any issue occurs:
1. Revert Render env vars back to old URL values.
2. Re-activate workflows with old URL.
3. Restart backend service.

## 8. Notes

- Frontend URL `https://jomocal-frontend.onrender.com` is UI only.
- Backend API calls from n8n should use backend URL `https://jomocal-backend.onrender.com`.
- n8n workflow webhooks should use `https://cmpunktg5.app.n8n.cloud/webhook/...` after migration.
