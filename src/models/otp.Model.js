const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },

  email: {
    type: String,
  },

  phone: {
    type: String,
  },

  expiration: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
