const HeroImage = require("../../models/heroImage.Model.js");

exports.GetSingleImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await HeroImage.findById(imageId);

    if (!imageId || !image) {
      return res.status(404).json({
        success: false,
        message: "Image not found ",
      });
    }

    return res.status(200).json({
      data: {
        success: true,
        message: "Fetched single user successfully",
        image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the single Image",
    });
  }
};
