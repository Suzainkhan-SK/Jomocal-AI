const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        required: true
    },
    icon: String,
    color: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'paused'],
        default: 'inactive'
    },
    config: {
        type: Object,
        default: {}
    },
    botPersonality: {
        type: String,
        default: "Professional and helpful"
    },
    botWelcomeMessage: {
        type: String,
        default: "Hello! How can I help you?"
    },
    knowledgeBaseText: {
        type: String,
        default: ""
    },
    emailAutomationStatus: {
        type: String,
        enum: ['active', 'inactive', 'paused'],
        default: 'inactive'
    },
    emailAutomationWebhook: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

automationSchema.index({ userId: 1, type: 1 });
automationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Automation', automationSchema);