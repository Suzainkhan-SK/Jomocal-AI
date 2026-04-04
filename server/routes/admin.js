const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Automation = require('../models/Automation');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');
const { isAdmin, isOwner } = require('../middleware/adminAuth');

// Protected by `auth` layer to get req.user, then `isAdmin` to check roles
router.use(auth);

// @route   GET /api/admin/stats
// @desc    Get God Mode Platform Stats
// @access  Admin
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeAutomations = await Automation.countDocuments({ status: 'active' });
        const totalAutomations = await Automation.countDocuments();
        
        // Mocking revenue based on active automations for now
        const revenue = activeAutomations * 29;

        const newSignups24h = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        res.json({
            totalUsers,
            activeAutomations,
            totalAutomations,
            revenue,
            newSignups24h
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/users
// @desc    Get all users (with basic stats)
// @access  Admin
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        // For a true enterprise feel, we might fetch their automation counts as well
        // But for speed, let's just return users. In production you'd use aggregation.
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/suspend
// @desc    Suspend or unsuspend a user
// @access  Admin
router.put('/users/:id/suspend', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Cannot suspend owner
        if (user.role === 'owner') {
            return res.status(403).json({ msg: 'Cannot suspend the platform owner.' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();
        res.json({ msg: user.isSuspended ? 'User suspended' : 'User reactivated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user completely
// @access  Admin (Or just Owner, but we'll allow Admin)
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        if (user.role === 'owner') {
            return res.status(403).json({ msg: 'Cannot delete the platform owner.' });
        }

        // Must physically delete dependencies
        await Automation.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'User and all associated data permanently deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/manage-admins
// @desc    Promote or Demote an admin
// @access  Owner ONLY
router.post('/manage-admins', isOwner, async (req, res) => {
    try {
        const { userId, action } = req.body; // action: 'promote' or 'demote'
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        if (user.role === 'owner') {
            return res.status(403).json({ msg: 'Owner role cannot be changed.' });
        }

        if (action === 'promote') {
            user.role = 'admin';
        } else if (action === 'demote') {
            user.role = 'user';
        } else {
            return res.status(400).json({ msg: 'Invalid action.' });
        }

        await user.save();
        res.json({ msg: `User successfully ${action}d to ${user.role}.`, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/logs
// @desc    Get all platform logs for Mission Control
// @access  Admin
router.get('/logs', isAdmin, async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        let query = {};
        
        if (status && status !== 'All') {
            query.status = status.toLowerCase();
        }

        const logs = await ActivityLog.find(query)
            .populate('userId', 'email name')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (err) {
        console.error("Fetch logs error:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
