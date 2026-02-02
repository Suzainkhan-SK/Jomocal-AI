const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Integration = require('../models/Integration');
const { sanitizeIntegration, sanitizeIntegrations } = require('../utils/sanitize');

// All routes are scoped to req.user.id – each user sees only their own data.

// @route   GET api/integrations
// @desc    Get current user's integrations (credentials never sent to client)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const integrations = await Integration.find({ userId: req.user.id });
        res.json(sanitizeIntegrations(integrations));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/integrations/connect
// @desc    Connect or update an integration for the current user
// @access  Private
router.post('/connect', auth, async (req, res) => {
    const { platform, credentials } = req.body;
    const userId = req.user.id;

    if (!platform) {
        return res.status(400).json({ msg: 'Platform is required.' });
    }
    if (!credentials || typeof credentials !== 'object') {
        return res.status(400).json({ msg: 'Credentials object is required.' });
    }

    try {
        // Telegram: one bot token per account (cannot be used by another user)
        if (platform === 'telegram' && credentials.token) {
            const existingIntegration = await Integration.findOne({
                platform: 'telegram',
                'credentials.token': credentials.token,
                userId: { $ne: userId }
            });
            if (existingIntegration) {
                return res.status(400).json({
                    msg: 'This Telegram bot token is already connected to another account.',
                    error: 'duplicate_token'
                });
            }
        }

        let integration = await Integration.findOne({ userId, platform });

        if (integration) {
            integration.credentials = credentials;
            integration.isConnected = true;
            integration.updatedAt = Date.now();
        } else {
            integration = new Integration({
                userId,
                platform,
                credentials,
                isConnected: true
            });
        }

        await integration.save();
        res.json(sanitizeIntegration(integration));
    } catch (err) {
        console.error('Integration Error:', err.message);
        if (err.code === 11000) {
            return res.status(400).json({
                msg: 'This integration is already linked to your account.',
                error: 'duplicate'
            });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/integrations/disconnect
// @desc    Disconnect a platform for the current user (clears credentials, sets isConnected false)
// @access  Private
router.post('/disconnect', auth, async (req, res) => {
    const { platform } = req.body;
    const userId = req.user.id;

    if (!platform) {
        return res.status(400).json({ msg: 'Platform is required.' });
    }

    try {
        const integration = await Integration.findOne({ userId, platform });
        if (!integration) {
            return res.status(404).json({ msg: 'Integration not found.' });
        }

        if (platform === 'youtube') {
            return res.status(400).json({
                msg: 'Use the YouTube disconnect endpoint.',
                error: 'use_oauth_disconnect',
                endpoint: '/api/oauth/google/youtube/disconnect'
            });
        }
        if (platform === 'google') {
            return res.status(400).json({
                msg: 'Use the Google disconnect endpoint.',
                error: 'use_oauth_disconnect',
                endpoint: '/api/oauth/google/disconnect'
            });
        }

        integration.credentials = {};
        integration.isConnected = false;
        integration.updatedAt = Date.now();
        await integration.save();

        res.json(sanitizeIntegration(integration));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
