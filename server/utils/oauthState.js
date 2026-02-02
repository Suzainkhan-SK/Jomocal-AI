const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * OAuth state must link callback -> user securely, without cookies/headers.
 * We sign a short-lived JWT in the `state` parameter.
 */

function getStateSecret() {
  return process.env.OAUTH_STATE_SECRET || process.env.JWT_SECRET;
}

function createOauthState({ userId, platform, services }) {
  const secret = getStateSecret();
  if (!secret) throw new Error('Missing env: OAUTH_STATE_SECRET (or JWT_SECRET fallback)');

  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = { userId, platform, nonce };
  if (Array.isArray(services) && services.length > 0) payload.services = services;
  return jwt.sign(payload, secret, { expiresIn: '10m' });
}

function verifyOauthState(state) {
  const secret = getStateSecret();
  if (!secret) throw new Error('Missing env: OAUTH_STATE_SECRET (or JWT_SECRET fallback)');
  return jwt.verify(state, secret);
}

module.exports = {
  createOauthState,
  verifyOauthState,
};

