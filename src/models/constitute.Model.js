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

const Pdf = mongoose.model("Pdf", pdfSchema);

module.exports = Pdf;
