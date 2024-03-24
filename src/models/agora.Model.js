const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userActive: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

roomSchema.methods.updateStatusAfter12Hours = async function () {
  const expirationThreshold = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours in milliseconds
  if (this.createdAt < expirationThreshold) {
    this.status = "inactive";
    await this.save();
  }
};

module.exports = mongoose.model("Room", roomSchema);
