const User = require("../models/user.Model");

exports.auth = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
  
    if (!user || !userId) {
      return res.status(403).json({
        success: false,
        message: "User is not exist or Invalid token",
      });
    }
  
    return res.status(200).json({
      success: true,
      data: {
        message: "token verified successfully",
        email: user.email,
        userId: user.userID,
        name: user.firstName + user.lastName,
        userType: user.userType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:'Failed to verify token',
      error:error.message
    })
  }
};