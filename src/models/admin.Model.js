const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminType: {
    type: String,
    enum: ["distAdmin", "memberAdmin"],
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
