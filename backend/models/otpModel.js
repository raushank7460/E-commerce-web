const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['email', 'mobile'],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' } // Automatically removed after 10 minutes by MongoDB TTL
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema);
