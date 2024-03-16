const UploadHeroImage = require("../../models/heroImage.Model.js");
const cloudinary = require("../../utils/cloudinary.js");
const fs = require("fs");

exports.UploadHeroImage = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(image.path, {
      folder: "hero_image",
    });
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }
    const newHeroImage = new UploadHeroImage({
      ImageUrl: uploadedImage.secure_url,
    });
    const saveImage = await newHeroImage.save();

    return res.status(201).json({
      data: {
        success: true,
        message: "Image Uploaded Successfully",
        image: saveImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
