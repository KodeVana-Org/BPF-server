const User = require("../../models/user.Model.js");
const JoinedModel = require("../../models/join.Model.js");
const distMember = require("../../models/distMember.Model.js");
const Admin = require("../../models/admin.Model.js");

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).json({
        message: " User id not provided",
      });
    }
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({
        message: " User not found ",
      });
    }
    if (userExist.userType === "superAdmin") {
      return res.status(402).json({
        success: false,
        message: "superadmin can't be deleted",
      });
    }
    if (userExist.userType === "joined") {
      await JoinedModel.deleteMany({ user: userId });
    } else if (userExist.userType === "member") {
      await distMember.deleteMany({ user: userId });
    } else if (userExist.userType === "admin") {
      await Admin.deleteMany({ user: userId });
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user Account",
      error: error.message,
    });
  }
};
