# Data isolation and multi-tenant rules

All user data is strictly scoped by **userId** from the JWT (`req.user.id` after auth middleware).

## Rules

- **Integrations**: Stored per user; credentials are never sent to the client (see `utils/sanitize.js`). Connect and disconnect affect only the current user.
- **Automations**: All reads/writes filter by `userId`. Toggle and config updates apply only to the requesting user’s automations. Telegram webhook registration uses that user’s token and `userId`.
- **Activity logs**: Fetched only for `req.user.id`. Logs created by services (e.g. Telegram bridge) use the integration’s `userId`.
- **Analytics, MessageTracker, BotSettings**: All keyed by `userId` (and platform where relevant).

## Adding new features

- New routes must use `auth` middleware and use **only** `req.user.id` for queries and writes.
- New models that hold user-specific data must have a **userId** field and an index on it (or compound with other query fields).
- Never return raw credentials to the client; use the sanitize helpers if you expose integration-like data.
- For new platforms or automation types, extend the enums/schemas as needed; keep credentials and config as flexible objects for future fields.

## Telegram auto-reply (unchanged)

- Bridge finds integrations with `platform: 'telegram'`, `isConnected: true`.
- For each integration it uses that integration’s `userId` and `credentials.token`.
- Automation status is read with `Automation.findOne({ userId, type: 'auto_reply', status: 'active' })`.
- Webhook URL includes `userId` so n8n can attribute traffic to the correct user.
