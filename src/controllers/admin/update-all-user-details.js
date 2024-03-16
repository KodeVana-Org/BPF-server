// NOTE: this is only for superadmin
const User = require("../../models/user.Model");
const JoinModel = require("../../models/join.Model.js");
const DistMemeber = require("../../models/distMember.Model.js");

exports.UpdateUserDet = async (req, res) => {
  try {
    const { superAdId } = req.body;
    const { userId } = req.params;
    const supAdminExist = await User.findById(superAdId);
    const userExist = await User.findById(userId);

    if (!supAdminExist || supAdminExist.userType !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "You re not authorize to change user Details",
      });
    }

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found to be update",
      });
    }

    if (req.body.userType === "superAdmin") {
      return res.status(400).json({
        success: false,
        message: "Cannot assign userType to superAdmin",
      });
    }
    // Update all fields based on the request body
    Object.assign(userExist, req.body);
    await userExist.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      updatedUser: userExist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating useType",
      error: error.message,
    });
  }
};

exports.DeleteAnyUser = async (req, res) => {
  try {
    const { superAdId } = req.body;
    const { userId } = req.params;
    const supAdminExist = await User.findById(superAdId);
    const userExist = await User.findById(userId);

    if (!supAdminExist || !userId) {
      return res.status(404).json({
        success: false,
        message: "User not found ",
      });
    }
    if (supAdminExist.userType !== "superAdmin") {
      return res.status(404).json({
        success: false,
        message: "aunthorize access",
      });
    }

    if (userExist.userType === "joined") {
      await JoinModel.deleteMany({ user: userId });
    }
    if (userExist.userType === "member") {
      await DistMemeber.deleteMany({ user: userId });
    }
    if (userExist.userType === "admin") {
      await admin.deleteMany({ user: userId });
    }

    await User.findByIdAndDelete(userId);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the user",
      error: error.message,
    });
  }
};
