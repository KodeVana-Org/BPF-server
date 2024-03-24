const Member = require("../../models/distMember.Model.js");
const User = require("../../models/user.Model.js");
const {
  generateToken,
  verifyToken,
} = require("../../utils/randomTokenForMember.js");

// Function to generate a deep link URL with the token
const generateDeepLink = (token, userType) => {
  // Generate your deep link URL here based on the token and userType
  // Example: return `https://example.com/register?token=${token}&userType=${userType}`;
  return `bpf://profile?token=${token}&userType=${userType}`;
};

exports.GenerateRegisterLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    // Look up the user in the database
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const userType = user.userType;
    if (userType && (userType === "admin" || userType === "superAdmin")) {
      // Generate token
      const token = generateToken(user._id, email);

      user.token = token;
      user.email = email;
      await user.save();

      // Generate deep link URL
      const url = generateDeepLink(token, userType);

      res.status(200).json({ url });
      console.log(url);
    } else {
      res.status(400).send("Invalid user type");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate Register link",
      error: error.message,
    });
  }
};

exports.ValidateTokenAndSaveData = async (req, res) => {
  try {
    const { token, data } = req.body;
    const { email } = req.query;

    // Verify the token
    const decodedToken = verifyToken(token);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the decoded token matches the user's token in the database
    if (
      decodedToken.id !== user._id.toString() ||
      decodedToken.email !== email ||
      decodedToken !== user.token
    ) {
      return res.status(401).send("Invalid token");
    }

    const userType = req.query.userType;

    // Check if the user type allows the submitted type
    if (
      (userType === "admin" && type !== "distMember") ||
      (userType === "superadmin" &&
        type !== "distMember" &&
        type !== "parentMember")
    ) {
      return res
        .status(403)
        .send("User type is not allowed to submit this type of data");
    }

    user.firstName = data.firstName || null;
    user.lastName = data.lastName || null;
    user.dist = data.dist || null;
    user.fatherName = data.fatherName || null;
    user.profileImage = data.profileImage || null;

    // Save the updated user document
    await user.save();

    // Create a new DistMember document and save it
    const distMemberData = {
      position: data.position || null,
      desc: data.desc || null,
      photo: data.photo || null,
      memberType: type,
      postionStatus: data.postionStatus || null,
      user: user._id,
    };
    const distMember = new Member(distMemberData);
    await distMember.save();
    user.member = distMember._id;
    await user.save();
    res.status(200).send("Data saved successfully");
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    return res.status(500).json({
      success: false,
      message: "Failed to save data",
      error: error.message,
    });
  }
};
