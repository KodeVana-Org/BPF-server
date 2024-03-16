const HeroImage = require("../../models/heroImage.Model.js");

exports.getAllHeroImage = async (req, res) => {
  try {
    const AllHeroImage = await HeroImage.find();

    if (!AllHeroImage || AllHeroImage.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Heor image not found",
      });
    }
    return res.status(201).json({
      data: {
        success: true,
        message: "Fetched all images successfully",
        image: AllHeroImage,
        tatalImage: AllHeroImage.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Hero Image",
    });
  }
};
