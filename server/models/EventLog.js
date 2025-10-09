const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema({
  // Event Information
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  eventType: {
    type: String,
    required: true,
    enum: [
      'contact_form_submission',
      'email_sent',
      'email_failed',
      'page_view',
      'blog_post_view',
      'audio_comparison_played',
      'error',
      'api_call'
    ],
    index: true
  },

  // Event Details
  eventData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // User Context (anonymized as per privacy policy)
  ipAddress: String,
  ipHash: String,
  country: String,
  region: String,
  userAgent: String,

  // Success/Error tracking
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: String,
  errorStack: String,

  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
eventLogSchema.index({ eventType: 1, timestamp: -1 });
eventLogSchema.index({ success: 1, timestamp: -1 });
eventLogSchema.index({ 'eventData.email': 1 }); // For tracking specific user events

module.exports = mongoose.model('EventLog', eventLogSchema);

