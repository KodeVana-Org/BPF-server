const HeroImage = require("../../models/heroImage.Model.js");

exports.deleteHero = async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log(imageId);
    const imageExist = await HeroImage.findById(imageId);

    if (!imageId || !imageExist) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    await HeroImage.findByIdAndDelete(imageId);
    return res.status(200).json({
      success: true,
      message: "hero image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the hero image",
    });
  }
};
