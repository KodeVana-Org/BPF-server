const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  imageName: {
    type: String,
  },
  imageUrl: {
    type: [String],
  },
  descriptions: {
    type: String,
    required: true,
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;
