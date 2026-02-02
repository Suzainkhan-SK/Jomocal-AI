const Integration = require('../models/Integration');
const { decryptString } = require('../utils/credentialCrypto');
const { getValidGoogleAccessToken } = require('./googleTokens');

/**
 * Return a valid YouTube access token for the user.
 * Uses unified getValidGoogleAccessToken(userId, 'youtube'); supports both
 * platform 'google' (with scopes) and legacy platform 'youtube'.
 */
async function getValidYoutubeTokensForUser(userId) {
  const { accessToken } = await getValidGoogleAccessToken(userId, 'youtube');

  // Optional: attach channel title for callers that need it (e.g. webhook payload)
  let channelTitle = null;
  const googleInt = await Integration.findOne({ userId, platform: 'google', isConnected: true });
  if (googleInt?.credentials?.scopes?.includes('youtube') && googleInt.credentials.youtube_channel_title) {
    channelTitle = googleInt.credentials.youtube_channel_title;
  }
  const youtubeInt = await Integration.findOne({ userId, platform: 'youtube', isConnected: true });
  if (!channelTitle && youtubeInt?.credentials?.youtube_channel_title) {
    channelTitle = youtubeInt.credentials.youtube_channel_title;
  }

  return { accessToken, channelTitle: channelTitle || null };
}

module.exports = {
  getValidYoutubeTokensForUser,
};

