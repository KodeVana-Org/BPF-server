const fs = require("fs");
const Pdf = require("../models/constitution.Model.js");
const cloudinary = require("../utils/cloudinary");

exports.createConstitude = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "constitude_pdf",
    });
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    const newPdf = new Pdf({
      pdfUrl: uploadedImage.secure_url,
      name: req.file.originalname,
    });
    const savedPdf = await newPdf.save();
    return res.status(200).json({
      success: true,
      message: "Constitute created successfully",
      savedPdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create the constitude",
      error: error.message,
    });
  }
};

exports.getAllConstitude = async (req, res) => {
  try {
    const allPdf = await Pdf.find();
    if (!allPdf || allPdf.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No constitude found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All constitude",
      allPdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get the constitude",
      error: error.message,
    });
  }
};