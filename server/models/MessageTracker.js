const mongoose = require('mongoose');

const messageTrackerSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    chatId: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['telegram', 'whatsapp', 'instagram'],
        required: true
    },
    processedAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Expire after 24 hours to save space
    }
});

// Add indexes for efficient querying
messageTrackerSchema.index({ messageId: 1 });
messageTrackerSchema.index({ userId: 1, platform: 1, processedAt: -1 });

module.exports = mongoose.model('MessageTracker', messageTrackerSchema);