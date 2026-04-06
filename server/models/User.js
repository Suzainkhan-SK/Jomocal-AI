const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; } // Only required if not logging in via Google
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'owner', 'msme', 'creator'],
        default: 'user'
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Explicit indexes for faster auth queries
userSchema.index({ verificationToken: 1 }, { sparse: true });

module.exports = mongoose.model('User', userSchema);
