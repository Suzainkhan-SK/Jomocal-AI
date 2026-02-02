const axios = require('axios');

const GOOGLE_AUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_REVOKE_ENDPOINT = 'https://oauth2.googleapis.com/revoke';

/** Scopes per service. One OAuth client; scopes built dynamically from requested services. */
const SERVICE_SCOPES = {
  youtube: [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
  ],
  gmail: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
  ],
  sheets: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
};

const VALID_SERVICES = ['youtube', 'gmail', 'sheets'];

function getScopesForServices(services) {
  if (!Array.isArray(services) || services.length === 0) return [];
  const set = new Set();
  services.filter((s) => VALID_SERVICES.includes(s)).forEach((s) => SERVICE_SCOPES[s].forEach((scope) => set.add(scope)));
  return [...set];
}

const YOUTUBE_SCOPES = SERVICE_SCOPES.youtube;

function getGoogleClientConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:5000/api/oauth/google/callback';

  if (!clientId) throw new Error('Missing env: GOOGLE_CLIENT_ID');
  if (!clientSecret) throw new Error('Missing env: GOOGLE_CLIENT_SECRET');

  return { clientId, clientSecret, redirectUri };
}

function buildYoutubeAuthUrl({ state }) {
  return buildGoogleAuthUrl({ state, services: ['youtube'] });
}

/**
 * Build Google OAuth URL for requested services (youtube, gmail, sheets).
 * Reuses the same OAuth client; scopes are built from services.
 */
function buildGoogleAuthUrl({ state, services }) {
  const { clientId, redirectUri } = getGoogleClientConfig();
  const scopes = getScopesForServices(services);
  if (scopes.length === 0) throw new Error('At least one valid service (youtube, gmail, sheets) is required.');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes.join(' '),
    state,
    include_granted_scopes: 'true',
  });

  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

async function exchangeCodeForTokens({ code }) {
  const { clientId, clientSecret, redirectUri } = getGoogleClientConfig();

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await axios.post(GOOGLE_TOKEN_ENDPOINT, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });

  return res.data;
}

async function refreshAccessToken({ refreshToken }) {
  const { clientId, clientSecret } = getGoogleClientConfig();

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  const res = await axios.post(GOOGLE_TOKEN_ENDPOINT, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });

  return res.data;
}

async function revokeToken({ token }) {
  if (!token) return;
  const body = new URLSearchParams({ token });
  await axios.post(GOOGLE_REVOKE_ENDPOINT, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
    // Revoke can return non-200 if token already revoked/expired; we handle errors upstream.
    validateStatus: () => true,
  });
}

module.exports = {
  buildYoutubeAuthUrl,
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  revokeToken,
  getScopesForServices,
  VALID_SERVICES,
  YOUTUBE_SCOPES,
};

