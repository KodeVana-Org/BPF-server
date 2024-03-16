const User = require('../models/user.Model');
const jwt = require('jsonwebtoken')

exports.Login = async (req, res) => {
  try {
    const { emailPhone, password } = req.body;

    if (!emailPhone || !password) {
      throw new Error("Email or phone and password are required.");
    }

    let query;
    let email;
    let phone;

    // Check if the provided value is an email or a phone number
    if (emailPhone.includes('@')) {
      email = emailPhone;
      query = { email: email };
    } else {
      phone = emailPhone;
      query = { phone: phone };
    }

    // Find the user based on the provided email or phone
    const user = await User.findOne(query);

    // If no user found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Generate token
    const token = jwt.sign({
      email: email,
      phone: phone,
      userType: user.userType,
      id: user._id
    },
      process.env.JWT_SECRET_KEY
    );

    // If email is provided, return user's email; otherwise, return phone
    const contactInfo = email ? user.email : user.phone;

    return res.status(200).json({
      data: { token: token },
      message: "Login successful.", contactInfo: contactInfo, 
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Failed to log in." });
  }
};
