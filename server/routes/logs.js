const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

// @route   GET api/logs
// @desc    Get current user's activity logs only (strict per-user isolation)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const logs = await ActivityLog.find({ userId: req.user.id })
            .sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/logs/debug
// @desc    Debug endpoint for current user's logs only
// @access  Private
router.get('/debug', auth, async (req, res) => {
    try {
        const userLogs = await ActivityLog.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(20);
        
        // Also get user info
        const User = require('../models/User');
        const currentUser = await User.findById(req.user.id);
        
        res.json({
            currentUser: {
                id: req.user.id,
                email: currentUser?.email,
                name: currentUser?.name
            },
            totalLogs: userLogs.length,
            logs: userLogs.map(log => ({
                id: log._id,
                userId: log.userId,
                automationName: log.automationName,
                action: log.action,
                status: log.status,
                timestamp: log.timestamp
            }))
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/logs/n8n
// @desc    Add a log from n8n (Public) - with deduplication
// @access  Public
router.post('/n8n', async (req, res) => {
    try {
        const { userId, automationName, action, status, platform, messageData, details } = req.body;
        
        // Validate required fields
        console.log('🔍 Log request body:', req.body);
        console.log('🔍 Extracted fields:', { userId, automationName, action, status });
        console.log('🔍 Full req.body keys:', Object.keys(req.body));
        
        if (!userId || !automationName || !action || !status) {
            console.log('❌ Missing fields detected');
            return res.status(400).json({ 
                msg: 'Missing required fields', 
                received: { userId: !!userId, automationName: !!automationName, action: !!action, status: !!status },
                values: { userId, automationName, action, status },
                allBodyFields: Object.keys(req.body)
            });
        }

        // Create a hash of the log entry to detect duplicates
        const crypto = require('crypto');
        const logContent = `${userId}-${automationName}-${action}-${status}-${platform || 'other'}`;
        const logHash = crypto.createHash('md5').update(logContent).digest('hex');
        
        // Check for recent duplicate logs (within last 30 seconds)
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        const existingLog = await ActivityLog.findOne({
            userId,
            automationName,
            action,
            status,
            platform: platform || 'other',
            timestamp: { $gte: thirtySecondsAgo }
        });

        if (existingLog) {
            console.log(`📝 Log: Duplicate entry detected and prevented`);
            return res.json({ msg: 'Duplicate log entry prevented' });
        }

        // Process messageData: if it's a string, parse it; if it's already an object, keep it as is
        let processedMessageData = messageData || {};
        if (typeof messageData === 'string') {
            try {
                processedMessageData = JSON.parse(messageData);
                console.log('📝 Parsed messageData from string:', processedMessageData);
            } catch (parseError) {
                console.log('⚠️ Error parsing messageData string, keeping as is:', messageData);
                processedMessageData = messageData; // Keep original if parsing fails
            }
        }

        // Create new log entry
        console.log(`📝 Creating log for userId: ${userId}`);
        console.log(`📝 Processed messageData:`, processedMessageData);
        const newLog = new ActivityLog({
            userId,
            automationName,
            action,
            status,
            platform: platform || 'other',
            messageData: processedMessageData, // Store the properly processed messageData
            details: details || ''
        });
        
        await newLog.save();
        console.log(`📝 Log: Entry created - ${automationName} - ${action} - ${status}`);
        res.json({ msg: 'Log added successfully' });
    } catch (err) {
        console.error('❌ Log Error:', err.message);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
