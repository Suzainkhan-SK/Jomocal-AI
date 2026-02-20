const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    automationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Automation'
    },
    automationName: String, // Snapshot of name in case automation is deleted
    platform: {
        type: String,
        enum: ['telegram', 'whatsapp', 'instagram', 'email', 'gmail', 'other'],
        default: 'other'
    },
    action: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    details: String, // Error message or success details
    messageData: {
        recipient: String,
        recipientUsername: String,
        recipientName: String,
        messageContent: String,
        botResponse: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for efficient querying
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1, platform: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1, automationName: 1, action: 1, timestamp: -1 });

// TTL index to automatically expire old logs (keep 30 days)
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
