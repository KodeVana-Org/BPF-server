const fs = require("fs");
const Pdf = require("../models/sixSchedule.Model.js");
const cloudinary = require("../utils/cloudinary");

exports.createSixSchedule = async (req, res) => {
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
      folder: "sixSchedule_pdf",
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
      message: "sixSchedule reated successfully",
      savedPdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create the sixSchedule",
      error: error.message,
    });
  }
};

exports.getsixSchedule = async (req, res) => {
  try {
    const Pdf = await Pdf.find();
    if (!Pdf || Pdf.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sixSchedule  found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "fetched sixSchedule successfully",
      data: Pdf,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get the sixSchedule",
      error: error.message,
    });
  }
};

exports.deletesixSchedule = async (req, res) => {
  try {
    const visionId = req.params.visionId;

    if (!visionId) {
      return res.status(400).json({
        success: false,
        message: "No sixSchedule id provided",
      });
    }
    const deletedVision = await Pdf.findById(visionId);

    if (!deletedVision) {
      return res.status(404).json({
        success: false,
        message: "sixSchedule not found",
      });
    }

    await Pdf.findByIdAndDelete(visionId);
    const pdfUrl = deletedVision.pdfUrl;

    const publicId = pdfUrl.substring(
      pdfUrl.lastIndexOf("/") + 1,
      pdfUrl.lastIndexOf("."),
    );
    const deleteResponse = await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "sixSchedule deleted successfully",
      deletedVision,
      deleteResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the sixSchedule",
      error: error.message,
    });
  }
};
