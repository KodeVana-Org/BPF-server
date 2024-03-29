const DistrictMember = require("../models/distMember.Model");
const User = require("../models/user.Model");

exports.auth = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const Memeber = await DistrictMember.findOne({ user: userId });

    if (!user || !userId) {
      return res.status(403).json({
        success: false,
        message: "User is not exist or Invalid token",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
      data: {
        message: "token verified successfully",
        email: user.email,
        userId: user.userID,
        name: user.firstName + user.lastName,
        userType: user.userType,
        id: user._id,
        profileImage: user.profileImage ? user.profileImage : null,
        email: user.email ? user.email : null,
        member: Memeber ? Memeber : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify token",
      error: error.message,
    });
  }
};
