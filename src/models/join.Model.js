const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Join = mongoose.model("Join", joinSchema);

module.exports = Join;
