/**
 * Sanitize data before sending to client.
 * Ensures credentials and other sensitive fields never leave the server.
 */

/**
 * Return integration without credentials. Safe to send to client.
 * @param {Object} integration - Mongoose doc or plain object
 * @returns {Object} Safe representation
 */
function sanitizeIntegration(integration) {
  if (!integration) return null;
  const doc = integration.toJSON ? integration.toJSON() : { ...integration };
  delete doc.credentials;
  doc.hasCredentials = !!(integration.credentials && Object.keys(integration.credentials).length > 0);

  // Whitelist non-sensitive metadata for frontend display (read-only).
  if (integration.platform === 'youtube' && integration.credentials) {
    if (integration.credentials.youtube_channel_id) doc.youtube_channel_id = integration.credentials.youtube_channel_id;
    if (integration.credentials.youtube_channel_title) doc.youtube_channel_title = integration.credentials.youtube_channel_title;
  }
  if (integration.platform === 'google' && integration.credentials) {
    if (Array.isArray(integration.credentials.scopes)) doc.connected_services = integration.credentials.scopes;
    if (integration.credentials.youtube_channel_title) doc.youtube_channel_title = integration.credentials.youtube_channel_title;
  }

  return doc;
}

/**
 * Return multiple integrations sanitized.
 */
function sanitizeIntegrations(integrations) {
  return (integrations || []).map(sanitizeIntegration).filter(Boolean);
}

module.exports = {
  sanitizeIntegration,
  sanitizeIntegrations,
};
