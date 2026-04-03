const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
            return res.status(403).json({ msg: 'Access denied: Admin resources only.' });
        }
        next();
    } catch (err) {
        console.error("isAdmin error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

const isOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied: Owner privileges required.' });
        }
        next();
    } catch (err) {
        console.error("isOwner error:", err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = { isAdmin, isOwner };
