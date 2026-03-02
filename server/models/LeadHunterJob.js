const mongoose = require('mongoose');

const leadHunterJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  spreadsheetId: {
    type: String,
    required: true,
    index: true,
  },
  leadEmail: {
    type: String,
    required: true,
    index: true,
  },
  businessName: {
    type: String,
    default: '',
  },
  icebreaker: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    enum: ['Auto-Pilot', 'Review in Drafts'],
    default: 'Review in Drafts',
  },
  rowIndex: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  runAt: {
    type: Date,
    required: true,
    index: true,
  },
  lockedAt: {
    type: Date,
    default: null,
  },
  lastError: {
    type: String,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

leadHunterJobSchema.index({ status: 1, runAt: 1 });

module.exports = mongoose.model('LeadHunterJob', leadHunterJobSchema);
