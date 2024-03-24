const User = require("../models/user.Model");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  try {
    const { emailPhone, password } = req.body;

    if (!emailPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email/phone and password.",
      });
    }

    let query;
    let email;
    let phone;

    // Check if the provided value is an email or a phone number
    if (emailPhone.includes("@")) {
      email = emailPhone;
      query = { email: email };
    } else {
      phone = "+91"+ emailPhone;
      query = { phone: phone };
    }

    // Find the user based on the provided email or phone
    const user = await User.findOne(query);
    // If no user found, return error
    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User not found.",
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Password is Invalid",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        email: email,
        phone: phone,
        userType: user.userType,
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    // If email is provided, return user's email; otherwise, return phone
    const contactInfo = email ? user.email : user.phone;

    return res.status(200).json({
      data: { token: token },
      success: true,
      status: 200,
      message: "Login successful.",
      contactInfo: contactInfo,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to log in." });
  }
};
