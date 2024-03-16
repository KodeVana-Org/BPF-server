const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdfUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SixSchedulePdf = mongoose.model("SixSchedulePdf", pdfSchema);

module.exports = SixSchedulePdf;
