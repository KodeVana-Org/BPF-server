const User = require("../../models/user.Model.js");
const Achievement = require("../../models/achivement.Model.js");
const AchiveMent = require("../../models/achivement.Model.js");
const cloudinary = require("../../utils/cloudinary.js");
const fs = require("fs");

exports.createAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    const { title, desc, dateOfAchMent } = req.body;

    if (!title || !desc || !dateOfAchMent) {
      return res.status(402).json({
        message: "All fields are required",
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const userExist = await User.findById(id);
    if (!userExist || userExist.userType !== "superAdmin") {
      return res.status(404).json({
        success: false,
        message: "User not found or not authorized",
      });
    }

    const uploadedImages = [];
    for (const file of files) {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "achievement_images",
      });
      uploadedImages.push(uploadedImage.secure_url);
      fs.unlinkSync(file.path);
    }

    const newAchievement = new Achievement({
      title: title,
      desc: desc, // Corrected typo
      photo: uploadedImages,
      dateOfAchMent: dateOfAchMent,
    });

    const savedAchievement = await newAchievement.save();

    return res.status(200).json({
      success: true,
      message: "Achievement saved successfully",
      achievement: savedAchievement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create achievement",
      error: error.message,
    });
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    if (!achievements || achievements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No achievements found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Achievements fetched successfully",
      achievements: achievements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
      error: error.message,
    });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievementId = req.params.id;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user || user.userType !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Only superAdmin can delete achievements",
      });
    }

    const achievement = await Achievement.findByIdAndDelete(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    // Delete images from Cloudinary
    for (const imageUrl of achievement.photo) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    return res.status(200).json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete achievement",
      error: error.message,
    });
  }
};

exports.getAchievementById = async (req, res) => {
  try {
    const achievementId = req.params.id;

    const achievement = await Achievement.findById(achievementId);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Single Achievement fetched successfully",
      achievement: achievement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievement",
      error: error.message,
    });
  }
};
