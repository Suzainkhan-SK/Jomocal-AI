const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: [
            'telegram', 'whatsapp', 'instagram', 'gmail', 'google_sheets',
            'youtube', 'google', // google = unified OAuth (YouTube + Gmail + Sheets)
            'twitter', 'tiktok', 'linkedin', 'facebook',
            'slack', 'discord', 'notion', 'trello',
            'stripe', 'mailchimp', 'calendly', 'shopify'
        ]
    },
    credentials: {
        type: Object, // Stores tokens, API keys, etc.
        default: {}
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one platform per user
integrationSchema.index({ userId: 1, platform: 1 }, { unique: true });

// Note: Removed unique constraint to allow multiple Telegram integrations per user
// Users can now connect multiple Telegram bots for different automations

module.exports = mongoose.model('Integration', integrationSchema);
