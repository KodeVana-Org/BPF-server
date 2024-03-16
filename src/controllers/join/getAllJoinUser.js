const JoinUser = require("../../models/join.Model");
const User = require("../../models/user.Model");

exports.JoinUser = async (req, res) => {
  try {
    //Todo is we need to extract userType from token
    // const { token } = req.userId;
    // const { id } = req.body;
    const id = req.user.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }
    const token = await User.findById(id);
    console.log(token);

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "User  not found",
      });
    }
    // Check if the user is an admin or superAdmin
    if (token.userType !== "admin" && token.userType !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const allJoinUsers = await JoinUser.find().populate({
      path: "user",
      select: "-password",
    });
    const count = allJoinUsers.length;

    return res.status(200).json({
      success: true,
      message: "All Join Users fetched successfully",
      allUsers: allJoinUsers,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching all join users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all join users",
    });
  }
};
