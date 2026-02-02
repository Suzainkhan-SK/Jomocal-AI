const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Integration = require('../models/Integration');
const { sanitizeIntegration } = require('../utils/sanitize');
const { createOauthState, verifyOauthState } = require('../utils/oauthState');
const { encryptString, decryptString } = require('../utils/credentialCrypto');
const {
  buildYoutubeAuthUrl,
  buildGoogleAuthUrl,
  exchangeCodeForTokens,
  revokeToken,
  VALID_SERVICES,
} = require('../services/googleOAuth');
const { getValidYoutubeTokensForUser } = require('../services/youtubeTokens');

/**
 * Unified Google OAuth start. Accepts requested services: youtube, gmail, sheets.
 * GET /api/oauth/google/start?services=youtube,gmail,sheets
 * Builds scopes dynamically; reuses same OAuth client. No tokens to frontend.
 */
router.get('/google/start', auth, (req, res) => {
  try {
    const raw = req.query.services || req.query.service || 'youtube';
    const services = (typeof raw === 'string' ? raw.split(',') : [raw])
      .map((s) => s.trim().toLowerCase())
      .filter((s) => VALID_SERVICES.includes(s));
    if (services.length === 0) {
      return res.status(400).json({ msg: 'At least one service (youtube, gmail, sheets) is required.' });
    }
    const state = createOauthState({ userId: req.user.id, services });
    const url = buildGoogleAuthUrl({ state, services });
    return res.json({ url });
  } catch (err) {
    console.error('OAuth start error:', err.message);
    return res.status(500).json({ msg: 'Failed to start OAuth.' });
  }
});

/**
 * Legacy: YouTube-only OAuth start (same as /google/start?services=youtube).
 */
router.get('/google/youtube/start', auth, async (req, res) => {
  try {
    const state = createOauthState({ userId: req.user.id, platform: 'youtube' });
    const url = buildYoutubeAuthUrl({ state });
    return res.json({ url });
  } catch (err) {
    console.error('OAuth start error:', err.message);
    return res.status(500).json({ msg: 'Failed to start OAuth.' });
  }
});

/**
 * STEP 2 + STEP 3:
 * Google redirects back with `code` + `state` to the backend callback.
 *
 * Route: GET /api/oauth/google/callback
 * - exchanges code for tokens
 * - stores tokens in DB (encrypted), scoped to user + platform=youtube
 * - never sends tokens to frontend
 * - redirects user back to dashboard/apps
 */
router.get('/google/callback', async (req, res) => {
  const { code, state, error } = req.query;

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectSuccess = `${frontendUrl}/dashboard/apps?google=connected`;
  const redirectFail = `${frontendUrl}/dashboard/apps?google=error`;

  if (error) {
    console.warn('Google OAuth denied:', error);
    return res.redirect(redirectFail);
  }
  if (!code || !state) {
    return res.status(400).send('Missing code/state.');
  }

  let decoded;
  try {
    decoded = verifyOauthState(state);
  } catch (err) {
    console.error('Invalid OAuth state:', err.message);
    return res.status(400).send('Invalid state.');
  }

  const isUnifiedFlow = Array.isArray(decoded.services) && decoded.services.length > 0;
  const isLegacyYoutube = decoded.platform === 'youtube';

  if (!isUnifiedFlow && !isLegacyYoutube) {
    return res.status(400).send('Unsupported OAuth state.');
  }

  try {
    const tokenData = await exchangeCodeForTokens({ code: String(code) });
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = Number(tokenData.expires_in || 0);
    const now = Date.now();
    const expiryTs = expiresIn ? now + expiresIn * 1000 : now + 55 * 60 * 1000;

    if (!accessToken) {
      console.error('OAuth token exchange missing access_token');
      return res.redirect(redirectFail);
    }

    if (isUnifiedFlow) {
      // Store in platform 'google' with credentials.scopes[] = requested services
      let integration = await Integration.findOne({ userId: decoded.userId, platform: 'google' });
      const existingRefreshEnc = integration?.credentials?.google_refresh_token;

      const credentials = {
        google_access_token: encryptString(accessToken),
        google_refresh_token: refreshToken ? encryptString(refreshToken) : existingRefreshEnc || null,
        token_expiry_timestamp: expiryTs,
        token_obtained_at: now,
        scopes: decoded.services,
      };

      if (decoded.services.includes('youtube')) {
        try {
          const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: { mine: 'true', part: 'snippet' },
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 10000,
          });
          const first = channelRes.data?.items?.[0];
          if (first) {
            credentials.youtube_channel_id = first.id || null;
            credentials.youtube_channel_title = first.snippet?.title || null;
          }
        } catch (metaErr) {
          console.warn('Failed to fetch YouTube channel info:', metaErr.message);
        }
      }

      if (integration) {
        integration.credentials = { ...(integration.credentials || {}), ...credentials };
        integration.isConnected = true;
        integration.updatedAt = Date.now();
      } else {
        integration = new Integration({
          userId: decoded.userId,
          platform: 'google',
          credentials,
          isConnected: true,
        });
      }
      await integration.save();
      console.log(`✅ Google connected for user ${decoded.userId} (${decoded.services.join(', ')})`);
      return res.redirect(redirectSuccess);
    }

    // Legacy: platform 'youtube' only
    const redirectSuccessYoutube = `${frontendUrl}/dashboard/apps?youtube=connected`;
    let integration = await Integration.findOne({ userId: decoded.userId, platform: 'youtube' });
    const existingRefreshEnc = integration?.credentials?.youtube_refresh_token;

    const credentials = {
      youtube_access_token: encryptString(accessToken),
      youtube_refresh_token: refreshToken ? encryptString(refreshToken) : existingRefreshEnc || null,
      token_expiry_timestamp: expiryTs,
      token_obtained_at: now,
    };

    try {
      const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: { mine: 'true', part: 'snippet' },
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10000,
      });
      const first = channelRes.data?.items?.[0];
      if (first) {
        credentials.youtube_channel_id = first.id || null;
        credentials.youtube_channel_title = first.snippet?.title || null;
      }
    } catch (metaErr) {
      console.warn('Failed to fetch YouTube channel info:', metaErr.message);
    }

    if (integration) {
      integration.credentials = { ...(integration.credentials || {}), ...credentials };
      integration.isConnected = true;
      integration.updatedAt = Date.now();
    } else {
      integration = new Integration({
        userId: decoded.userId,
        platform: 'youtube',
        credentials,
        isConnected: true,
      });
    }
    await integration.save();
    console.log(`✅ YouTube connected for user ${decoded.userId}`);
    return res.redirect(redirectSuccessYoutube);
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error('OAuth callback error:', status || '', data || err.message);
    return res.redirect(redirectFail);
  }
});

/**
 * Disconnect unified Google account (YouTube + Gmail + Sheets). Revokes token, clears credentials.
 */
router.post('/google/disconnect', auth, async (req, res) => {
  try {
    const integration = await Integration.findOne({ userId: req.user.id, platform: 'google' });
    if (!integration) return res.status(404).json({ msg: 'Google integration not found.' });

    const refreshEnc = integration.credentials?.google_refresh_token;
    const accessEnc = integration.credentials?.google_access_token;
    const refreshToken = refreshEnc ? decryptString(refreshEnc) : null;
    const accessToken = accessEnc ? decryptString(accessEnc) : null;

    try {
      await revokeToken({ token: refreshToken || accessToken });
    } catch (revokeErr) {
      console.warn('Token revoke failed:', revokeErr.message);
    }

    integration.credentials = {};
    integration.isConnected = false;
    integration.updatedAt = Date.now();
    await integration.save();

    return res.json(sanitizeIntegration(integration));
  } catch (err) {
    console.error('Disconnect error:', err.message);
    return res.status(500).json({ msg: 'Failed to disconnect Google.' });
  }
});

/**
 * Legacy: Disconnect YouTube-only integration.
 */
router.post('/google/youtube/disconnect', auth, async (req, res) => {
  try {
    const integration = await Integration.findOne({ userId: req.user.id, platform: 'youtube' });
    if (!integration) return res.status(404).json({ msg: 'YouTube integration not found.' });

    const refreshEnc = integration.credentials?.youtube_refresh_token;
    const accessEnc = integration.credentials?.youtube_access_token;
    const refreshToken = refreshEnc ? decryptString(refreshEnc) : null;
    const accessToken = accessEnc ? decryptString(accessEnc) : null;

    try {
      await revokeToken({ token: refreshToken || accessToken });
    } catch (revokeErr) {
      console.warn('Token revoke failed:', revokeErr.message);
    }

    integration.credentials = {};
    integration.isConnected = false;
    integration.updatedAt = Date.now();
    await integration.save();

    return res.json(sanitizeIntegration(integration));
  } catch (err) {
    console.error('Disconnect error:', err.message);
    return res.status(500).json({ msg: 'Failed to disconnect YouTube.' });
  }
});

module.exports = router;

