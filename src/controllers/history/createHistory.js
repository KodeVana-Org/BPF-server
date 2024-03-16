const History = require("../../models/history.Model.js");
const fs = require("fs");
const User = require("../../models/user.Model.js");
const cloudinary = require("../../utils/cloudinary.js");

exports.createHistory = async (req, res) => {
  try {
    const { desc, title, year } = req.body;
    const image = req.file;
    const { userId } = req.params;

    if (!desc || !title || !image || !userId) {
      return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
    }

    // Check if the user exists and is authorized
    const user = await User.findById(userId);
    if (!user || user.userType !== "superAdmin") {
      return res.status(404).json({
        success: false,
        message: "User not found or unauthorized",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image.path, {
      folder: "history_images", // Corrected folder name
    });

    // Delete image file from server
    fs.unlinkSync(image.path);

    // Create new history entry
    const newHistory = new History({
      desc: desc, // Corrected field name
      title: title,
      images: uploadedImage.secure_url,
      year: year || null,
    });

    // Save history entry to database
    const savedHistory = await newHistory.save();

    return res.status(200).json({
      success: true,
      message: "History created successfully",
      history: savedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create history",
      error: error.message,
    });
  }
};

exports.getAllHistory = async (req, res) => {
  try {
    const history = await History.find();
    if (!history || !history.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No history found",
      });
    }

    return res.status(200).json({
      success: false,
      message: "Fetched all history successfully",
      history: history,
      totalHistory: history.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the history",
      error: error.message,
    });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const historyId = req.params.historyId;
    const { userId } = req.body;
    console.log(historyId, userId);
    const history = await History.findById(historyId);
    const userExist = await User.findById(userId);

    if (
      !historyId ||
      !history ||
      !userId ||
      userExist.userType !== "superAdmin"
    ) {
      return res.status(404).json({
        success: false,
        message: "Post or user not exist or authorized",
      });
    }
    const deltedHistory = await History.findByIdAndDelete(historyId);
    return res.status(200).json({
      success: true,
      message: "history deleted successfully",
      deltedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the history",
    });
  }
};

exports.SingleHistory = async (req, res) => {
  try {
    const historyId = req.params.historyId; // Corrected line
    const historyExist = await History.findById(historyId);
    if (!historyId || !historyExist) {
      return res.status(404).json({
        success: false,
        message: "History not found or does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History fetched successfully",
      history: historyExist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch single history",
      error: error.message,
    });
  }
};
