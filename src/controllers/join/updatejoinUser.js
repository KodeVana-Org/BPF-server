const JoinUser = require("../../models/join.Model.js");
const User = require("../../models/user.Model.js");
// const {
//   Tamulpur,
//   Baksa,
//   Chirang,
//   Kokrajhar,
//   Udalgury,
// } = require("../../models/dist.Model.js");

exports.UpdateJoinerUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const { adminId } = req.body;
    console.log("userid and admin id", userid, adminId);
    const userExist = await User.findById(userid);
    const adminExist = await User.findById(adminId);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "Invalid user id",
      });
    }

    let districtModel;
    switch (userExist.district) {
      case "Tamulpur":
        districtModel = Tamulpur;
        break;
      case "Baksa":
        districtModel = Baksa;
        break;
      case "Chirang":
        districtModel = Chirang;
        break;
      case "Kokrajhar":
        districtModel = Kokrajhar;
        break;
      case "Udalgury":
        districtModel = Udalgury;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid district",
        });
    }

    // Find the district associated with the user
    const districtRecord = await districtModel.findOne({ user: userid });

    if (adminExist.userType === "admin") {
      const { district } = req.body;

      districtRecord.nameOfDist = district;
      const dist = await districtRecord.save();
    } else if (userExist.userType === "joined") {
      const { firstName, lastName, fatherName, ps, po, district } = req.body;

      if (firstName) userExist.firstName = firstName;
      if (lastName) userExist.lastName = lastName;
      if (fatherName) userExist.fatherName = fatherName;
      if (ps) userExist.ps = ps;
      if (po) userExist.po = po;
      if (district) districtModel.nameOfDist = district;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized User Type",
      });
    }

    await userExist.save();

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user: userExist,
      dist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the user",
      error: error.message,
    });
  }
};
