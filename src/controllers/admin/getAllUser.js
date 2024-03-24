const User = require("../../models/user.Model.js");

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find(
      {},
      { email: 1, phone: 1, userType: 1, userID: 1, status: 1, _id: 0 },
    );
    if (!user || user.length === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User found",
      data: user,
      totalUser: user.length,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Some error occurred while retrieving users.",
    });
  }
};
