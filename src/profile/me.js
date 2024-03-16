const User = require("../models/user.Model");
const member = require("../models/distMember.Model.js");
const Join = require("../models/join.Model.js");
const Admin = require("../models/admin.Model.js");

exports.Profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    if (user.userType === "user") {
      return res.status(200).json({
        success: true,
        message: "user data fetched successfully",
        user,
      });
    } else if (user.userType === "joined") {
      const joined = await Join.findOne({ user: userId });
      return res.status(200).json({
        success: true,
        joined,
      });
    } else if (user.userType === "member") {
      const member = await distMember.findOne({ user: userId });
      if (!member) {
        return res.status(404).json({
          message: "member not found",
          success: false,
        });
      }
      return res.status(200).json({
        success: true,
        member,
      });
    } else if (user.userType === "admin") {
      const admin = await Admin.findOne({ user: userId });
      if (!admin) {
        return res.json({ message: "falied to fetch the details" });
      }
      return res.status(200).json({
        success: true,
        admin,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
      member,
    });
  } catch (error) {
    console.error("Error fetching profile/me:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching profile/me",
    });
  }
};
