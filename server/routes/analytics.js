const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Analytics = require('../models/Analytics');
const ActivityLog = require('../models/ActivityLog');

// @route   GET api/analytics/dashboard
// @desc    Get dashboard analytics summary
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get analytics for the last 30 days
        const analytics = await Analytics.find({
            userId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: 1 });

        // Calculate totals
        const totals = analytics.reduce((acc, day) => {
            acc.messagesReceived += day.metrics.messagesReceived;
            acc.messagesSent += day.metrics.messagesSent;
            acc.uniqueUsers += day.metrics.uniqueUsers;
            acc.timeSaved += day.metrics.timeSaved;
            acc.leadsCapture += day.metrics.leadsCapture;
            return acc;
        }, {
            messagesReceived: 0,
            messagesSent: 0,
            uniqueUsers: 0,
            timeSaved: 0,
            leadsCapture: 0
        });

        // Get recent activity count
        const recentActivityCount = await ActivityLog.countDocuments({
            userId,
            timestamp: { $gte: thirtyDaysAgo }
        });

        // Format data for charts
        const chartData = analytics.map(day => ({
            date: day.date.toISOString().split('T')[0],
            messagesReceived: day.metrics.messagesReceived,
            messagesSent: day.metrics.messagesSent,
            uniqueUsers: day.metrics.uniqueUsers
        }));

        res.json({
            totals,
            chartData,
            recentActivityCount
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/analytics/messages
// @desc    Get detailed message history with pagination
// @access  Private
router.get('/messages', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const platform = req.query.platform; // Optional filter

        const query = { userId };
        if (platform) {
            query.platform = platform;
        }

        const total = await ActivityLog.countDocuments(query);
        const messages = await ActivityLog.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            messages,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/analytics/track
// @desc    Track a metric (called by n8n or internal services)
// @access  Public (but should validate source in production)
router.post('/track', async (req, res) => {
    try {
        const { userId, platform, metric, value } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create today's analytics document
        let analytics = await Analytics.findOne({
            userId,
            platform,
            date: today
        });

        if (!analytics) {
            analytics = new Analytics({
                userId,
                platform,
                date: today,
                metrics: {}
            });
        }

        // Update the specific metric
        if (metric === 'messageReceived') {
            analytics.metrics.messagesReceived += value || 1;
        } else if (metric === 'messageSent') {
            analytics.metrics.messagesSent += value || 1;
            analytics.metrics.timeSaved += 2; // Assume 2 minutes saved per auto-reply
        } else if (metric === 'uniqueUser') {
            analytics.metrics.uniqueUsers += value || 1;
        } else if (metric === 'leadCaptured') {
            analytics.metrics.leadsCapture += value || 1;
        }

        await analytics.save();
        res.json({ msg: 'Metric tracked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
