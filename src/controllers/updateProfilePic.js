const User = require("../models/user.Model.js");
const cloudinary = require("../utils/cloudinary.js");

exports.UpdateProfilePic = async (req, res) => {
  try {
    const { picture } = req.body;
    const userId = req.params;

    if (!userId || !picture) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not exist",
      });
    }

    //upload to cloud
    const uploadedImage = await cloudinary.uploader.upload(picture, {
      folder: "profile_pics",
    });

    userExist.profileImage = uploadedImage.secure_url;
    await userExist.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      updatedUser: userExist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the profile pic",
    });
  }
};
