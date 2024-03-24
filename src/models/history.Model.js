const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
  },

  images: {
    type: String,
  },
});

const History = mongoose.model("History", historySchema);

module.exports = History;
