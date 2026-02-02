const mongoose = require('mongoose');

const BotSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['telegram', 'whatsapp', 'instagram']
    },
    welcomeMessage: {
        type: String,
        default: 'Hello {{name}}! 👋\n\nI am your automated assistant. How can I help you today?'
    },
    personality: {
        type: String,
        enum: ['professional', 'friendly', 'casual', 'enthusiastic'],
        default: 'friendly'
    },
    autoReplyEnabled: {
        type: Boolean,
        default: true
    },
    responseDelay: {
        type: Number,
        default: 0, // in seconds
        min: 0,
        max: 60
    },
    customFields: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
});

// Ensure one settings document per user per platform
BotSettingsSchema.index({ userId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('BotSettings', BotSettingsSchema);
