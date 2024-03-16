const mongoose = require("mongoose");

const updateUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ipAddress: { type: String, required: true },
  updatedFields: [{ type: String }],
  TimeDate: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const UpdateUser = mongoose.model("UpdateUser", updateUserSchema);

module.exports = UpdateUser;
