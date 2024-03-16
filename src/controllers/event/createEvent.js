const Event = require("../../models/events.Model.js"); // Import the event model
const cloudinary = require("../../utils/cloudinary.js");
const fs = require("fs");

exports.createEvent = async (req, res) => {
  try {
    const { desc, dateOfEvent } = req.body;
    const file = req.file; // Use req.file for single file upload

    if (!file) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    if (!desc || !dateOfEvent) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "gallery_images",
    });

    // Delete the file from the server
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    } else {
      console.warn(`File ${file.path} does not exist.`);
    }

    // Create a new event object with uploaded image URL
    const newEvent = new Event({
      desc: desc,
      banner: uploadedImage.secure_url,
      dateOfEvent: dateOfEvent,
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No event found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};
