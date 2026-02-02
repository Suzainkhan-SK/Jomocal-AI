const crypto = require('crypto');

/**
 * Backend-only encryption for stored credentials (AES-256-GCM).
 *
 * Why:
 * - Tokens must never reach the frontend
 * - DB should not store raw OAuth tokens
 *
 * Env:
 * - CREDENTIALS_ENCRYPTION_KEY_BASE64 must be a 32-byte key, base64 encoded.
 *   Example generation:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 */

function getKey() {
  const keyB64 = process.env.CREDENTIALS_ENCRYPTION_KEY_BASE64;
  if (!keyB64) {
    throw new Error('Missing env: CREDENTIALS_ENCRYPTION_KEY_BASE64');
  }
  const key = Buffer.from(keyB64, 'base64');
  if (key.length !== 32) {
    throw new Error('CREDENTIALS_ENCRYPTION_KEY_BASE64 must decode to 32 bytes');
  }
  return key;
}

function encryptString(plaintext) {
  const key = getKey();
  const iv = crypto.randomBytes(12); // recommended IV length for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Store as a compact JSON blob (safe to store as a string in Mongo).
  return JSON.stringify({
    v: 1,
    alg: 'aes-256-gcm',
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: ciphertext.toString('base64'),
  });
}

function decryptString(blob) {
  if (!blob) return null;
  const key = getKey();

  let payload;
  try {
    payload = typeof blob === 'string' ? JSON.parse(blob) : blob;
  } catch (e) {
    // Backward-compat: if plaintext was stored (not recommended), return it as-is.
    return String(blob);
  }

  if (!payload || payload.alg !== 'aes-256-gcm' || !payload.iv || !payload.tag || !payload.data) {
    // Backward-compat: unknown format -> return as-is
    return String(blob);
  }

  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const data = Buffer.from(payload.data, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return plaintext.toString('utf8');
}

module.exports = {
  encryptString,
  decryptString,
};

