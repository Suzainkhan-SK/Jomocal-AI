const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['telegram', 'whatsapp', 'instagram']
    },
    metrics: {
        messagesReceived: {
            type: Number,
            default: 0
        },
        messagesSent: {
            type: Number,
            default: 0
        },
        uniqueUsers: {
            type: Number,
            default: 0
        },
        timeSaved: {
            type: Number, // in minutes
            default: 0
        },
        leadsCapture: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Compound index for efficient querying by user and date range
AnalyticsSchema.index({ userId: 1, date: -1 });
AnalyticsSchema.index({ userId: 1, platform: 1, date: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
