const User = require("../../models/user.Model.js");

// TODO: not tested
exports.getUserByDistrict = async (req, res) => {
  try {
    const district = req.params.district;
    console.log(district);

    if (!district) {
      return res.status(403).json({
        success: false,
        message: "district is required",
      });
    }
    const user = await User.find({ dist: district });
    if (!user || user.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No user found in this district",
      });
    }
    return res.status(200).json({
      success: false,
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching the user by district",
      error: error.message,
    });
  }
};
