const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BotSettings = require('../models/BotSettings');

// @route   GET api/settings/:platform
// @desc    Get bot settings for a specific platform
// @access  Private
router.get('/:platform', auth, async (req, res) => {
    try {
        const { platform } = req.params;
        let settings = await BotSettings.findOne({
            userId: req.user.id,
            platform
        });

        // Create default settings if none exist
        if (!settings) {
            settings = new BotSettings({
                userId: req.user.id,
                platform,
                welcomeMessage: 'Hello {{name}}! 👋\n\nI am your automated assistant. How can I help you today?',
                personality: 'friendly'
            });
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/settings/:platform
// @desc    Update bot settings
// @access  Private
router.put('/:platform', auth, async (req, res) => {
    try {
        const { platform } = req.params;
        const { welcomeMessage, personality, autoReplyEnabled, responseDelay } = req.body;

        let settings = await BotSettings.findOne({
            userId: req.user.id,
            platform
        });

        if (!settings) {
            settings = new BotSettings({
                userId: req.user.id,
                platform
            });
        }

        // Update fields
        if (welcomeMessage !== undefined) settings.welcomeMessage = welcomeMessage;
        if (personality !== undefined) settings.personality = personality;
        if (autoReplyEnabled !== undefined) settings.autoReplyEnabled = autoReplyEnabled;
        if (responseDelay !== undefined) settings.responseDelay = responseDelay;

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
