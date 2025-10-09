const mongoose = require('mongoose');

const visitorLogSchema = new mongoose.Schema({
  // Request Information
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },

  // IP and Location (as per Privacy Policy Section 2.2)
  ipAddress: {
    type: String,
    required: true
  },
  ipHash: {
    type: String, // Hashed version for privacy
    index: true
  },
  country: String,
  region: String,
  city: String,
  timezone: String,

  // Browser and Device Information (as per Privacy Policy Section 2.2)
  userAgent: String,
  browser: String,
  browserVersion: String,
  os: String,
  osVersion: String,
  device: String,

  // Page Visit Information (as per Privacy Policy Section 2.2)
  path: {
    type: String,
    required: true,
    index: true
  },
  method: String,
  referrer: String,

  // Session tracking (anonymized)
  sessionId: String,

  // Performance metrics
  responseTime: Number,
  statusCode: Number
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for querying by date range
visitorLogSchema.index({ timestamp: -1 });
visitorLogSchema.index({ country: 1, timestamp: -1 });
visitorLogSchema.index({ path: 1, timestamp: -1 });

// Export the model
module.exports = mongoose.model('VisitorLog', visitorLogSchema);
