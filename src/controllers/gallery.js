const cloudinary = require("../utils/cloudinary.js");
const Gallery = require("../models/gallery.Model.js");
const fs = require("fs");

exports.UploadImagesToGallery = async (req, res) => {
  try {
    const files = req.files;
    const descriptions = req.body.descriptions;
    if (!files || files.length === 0) {
      return res.status(404).json({
        message: "Image not found ",
      });
    }
    const uploadedImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "gallery_images",
      });

      // Push the image URL to the uploadedImages array
      uploadedImages.push(uploadedImage.secure_url);

      // Delete the file from the server's upload folder
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      } else {
        console.warn(`File ${file.path} does not exist.`);
      }
    }

    const newGallery = new Gallery({
      imageName: req.body.imageName,
      imageUrl: uploadedImages,
      descriptions: descriptions,
    });
    const savedGallery = await newGallery.save();
    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      savedGallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload images to gallery",
      error: error.message,
    });
  }
};

exports.DeleteImageFromGallery = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Gallery.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Extract the public_id from the imageUrl or use another field where you store the public_id
    const publicId = image.imageUrl[0].split("/").pop().split(".")[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the image document from the Gallery model
    await Gallery.findByIdAndDelete(imageId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      deletedImage: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

exports.GetAllGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();

    if (gallery.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No photos found in the gallery",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery fetched successfully",
      gallery: gallery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the gallery",
      error: error.message,
    });
  }
};

exports.GetSinglePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    const photo = await Gallery.findById(photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Photo fetched successfully",
      photo: photo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the photo",
      error: error.message,
    });
  }
};

exports.GetSinglePhotoWithIndex = async (req, res) => {
  try {
    const { galleryId, photoIndex } = req.params;

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const imagesCount = gallery.imageUrl.length;
    console.log("imags are", imagesCount);

    // Check if the photoIndex is valid
    if (photoIndex < 0 || photoIndex >= imagesCount) {
      return res.status(404).json({
        success: false,
        message: `Invalid photo index. The gallery contains ${imagesCount} images.`,
      });
    }

    const photo = gallery.imageUrl[photoIndex];

    return res.status(200).json({
      success: true,
      message: "Photo fetched successfully",
      photo: photo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the photo",
      error: error.message,
    });
  }
};
