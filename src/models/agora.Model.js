const mongoose = require("mongoose");

const agoraSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Agora", agoraSchema);
