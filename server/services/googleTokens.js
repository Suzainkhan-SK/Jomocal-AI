const Integration = require('../models/Integration');
const { decryptString, encryptString } = require('../utils/credentialCrypto');
const { refreshAccessToken } = require('./googleOAuth');

const VALID_SERVICES = ['youtube', 'gmail', 'sheets'];

/**
 * Get a valid Google access token for the given user and required service.
 * Reuses refresh token; never exposes tokens to frontend.
 *
 * @param {string} userId - User ID
 * @param {'youtube'|'gmail'|'sheets'} requiredService - Service needed (youtube, gmail, sheets)
 * @returns {Promise<{ accessToken: string }>}
 */
async function getValidGoogleAccessToken(userId, requiredService) {
  if (!VALID_SERVICES.includes(requiredService)) {
    const err = new Error(`Invalid requiredService: ${requiredService}`);
    err.code = 'INVALID_SERVICE';
    throw err;
  }

  // 1) Prefer unified Google integration (platform 'google' with scopes)
  let integration = await Integration.findOne({
    userId,
    platform: 'google',
    isConnected: true,
  });

  if (integration && integration.credentials?.scopes?.includes(requiredService)) {
    const accessToken = decryptString(integration.credentials?.google_access_token);
    const refreshToken = decryptString(integration.credentials?.google_refresh_token);
    const expiryTs = Number(integration.credentials?.token_expiry_timestamp || 0);

    if (!refreshToken) {
      const err = new Error(`${requiredService} not connected. Reconnect Google with consent.`);
      err.code = 'MISSING_REFRESH_TOKEN';
      throw err;
    }

    const now = Date.now();
    const isExpired = !expiryTs || expiryTs - now < 2 * 60 * 1000;

    if (!isExpired && accessToken) {
      return { accessToken };
    }

    console.log(`🔄 Refreshing Google access token for user ${userId} (${requiredService})`);
    const refreshed = await refreshAccessToken({ refreshToken });
    const newAccessToken = refreshed.access_token;
    const expiresIn = Number(refreshed.expires_in || 0);
    const newExpiryTs = expiresIn ? now + expiresIn * 1000 : now + 55 * 60 * 1000;

    if (!newAccessToken) {
      const err = new Error('Failed to refresh access token.');
      err.code = 'REFRESH_FAILED';
      throw err;
    }

    integration.credentials.google_access_token = encryptString(newAccessToken);
    integration.credentials.token_expiry_timestamp = newExpiryTs;
    integration.credentials.token_refreshed_at = now;
    integration.updatedAt = Date.now();
    await integration.save();

    return { accessToken: newAccessToken };
  }

  // 2) Legacy: YouTube-only integration (platform 'youtube')
  if (requiredService === 'youtube') {
    integration = await Integration.findOne({ userId, platform: 'youtube', isConnected: true });
    if (!integration) {
      const err = new Error('YouTube not connected.');
      err.code = 'YOUTUBE_NOT_CONNECTED';
      throw err;
    }

    const accessToken = decryptString(integration.credentials?.youtube_access_token);
    const refreshToken = decryptString(integration.credentials?.youtube_refresh_token);
    const expiryTs = Number(integration.credentials?.token_expiry_timestamp || 0);

    if (!refreshToken) {
      const err = new Error('Missing refresh token. Reconnect YouTube with consent.');
      err.code = 'MISSING_REFRESH_TOKEN';
      throw err;
    }

    const now = Date.now();
    const isExpired = !expiryTs || expiryTs - now < 2 * 60 * 1000;

    if (!isExpired && accessToken) {
      return { accessToken };
    }

    console.log(`🔄 Refreshing YouTube (legacy) access token for user ${userId}`);
    const refreshed = await refreshAccessToken({ refreshToken });
    const newAccessToken = refreshed.access_token;
    const expiresIn = Number(refreshed.expires_in || 0);
    const newExpiryTs = expiresIn ? now + expiresIn * 1000 : now + 55 * 60 * 1000;

    if (!newAccessToken) {
      const err = new Error('Failed to refresh access token.');
      err.code = 'REFRESH_FAILED';
      throw err;
    }

    integration.credentials.youtube_access_token = encryptString(newAccessToken);
    integration.credentials.token_expiry_timestamp = newExpiryTs;
    integration.credentials.token_refreshed_at = now;
    integration.updatedAt = Date.now();
    await integration.save();

    return { accessToken: newAccessToken };
  }

  const err = new Error(`${requiredService} not connected. Connect Google Account and enable ${requiredService}.`);
  err.code = 'SERVICE_NOT_CONNECTED';
  throw err;
}

/**
 * Check if a Google service is connected for the user (for activation guards).
 */
async function hasGoogleServiceConnected(userId, service) {
  if (!VALID_SERVICES.includes(service)) return false;
  const googleInt = await Integration.findOne({ userId, platform: 'google', isConnected: true });
  if (googleInt?.credentials?.scopes?.includes(service)) return true;
  if (service === 'youtube') {
    const youtubeInt = await Integration.findOne({ userId, platform: 'youtube', isConnected: true });
    return !!youtubeInt;
  }
  return false;
}

module.exports = {
  getValidGoogleAccessToken,
  hasGoogleServiceConnected,
  VALID_SERVICES,
};
