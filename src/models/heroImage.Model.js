const { default: mongoose } = require("mongoose");

const heroImageSchma = new mongoose.Schema({
  ImageUrl: {
    type: String,
    required: true,
  },
});

const HeroImage = mongoose.model("HeroImage", heroImageSchma);

module.exports = HeroImage;
