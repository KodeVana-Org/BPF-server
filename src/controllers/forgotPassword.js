const User = require("../models/user.Model");
const OTP = require("../models/otp.Model");
const otpSender = require("../utils/OtpSender");

exports.ForgotPassword = async (req, res) => {
  try {
    const { emailPhone } = req.body;

    if (!emailPhone) {
      throw new Error("Email or phone number is required.");
    }

    let verificationMethod, contactInfo;
    if (emailPhone.includes("@")) {
      verificationMethod = "email";
      contactInfo = emailPhone;
    } else if (/^\+?\d+$/.test(emailPhone)) {
      verificationMethod = "phone";
      contactInfo = emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }

    const existingUser = await User.findOne({
      [verificationMethod]: contactInfo,
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds

    // Update user document with OTP and expiration
    existingUser.otp = otp;
    existingUser.otpExpiration = otpExpiration;
    await existingUser.save();

    // Here you should define or import otpSender.sendOTPByEmail and otpSender.sendOTPViaSMS functions
    if (verificationMethod === "email") {
      otpSender.sendOTPByEmail(contactInfo, otp);
    } else if (verificationMethod === "phone") {
      otpSender.sendOTPViaSMS(contactInfo, otp);
    }

    return res.status(200).json({
      message: "OTP sent successfully. Please verify.",
      data: otp,
    });
  } catch (error) {
    console.error("Error sending OTP for password reset:", error);
    return res
      .status(500)
      .json({ error: "Failed to send OTP for password reset." });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { emailPhone, otp } = req.body;
    if (!emailPhone || !otp) {
      throw new Error("Email or phone and OTP are required.");
    }

    let verificationMethod, contactInfo;

    if (emailPhone.includes("@")) {
      verificationMethod = "email";
      contactInfo = emailPhone;
    } else if (/^\+?\d+$/.test(emailPhone)) {
      verificationMethod = "phone";
      contactInfo = emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }
    // Find the user in the OTP collection based on email or phone
    const userOTP = await User.findOne({
      [verificationMethod]: contactInfo,
    });

    // If user not found or OTP doesn't match, return error
    if (!userOTP || userOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP or email/phone" });
    }

    // Check if OTP is expired
    const currentTimestamp = Date.now();
    if (currentTimestamp > userOTP.otpExpiration) {
      return res.status(400).json({ error: "OTP expired" });
    }
    // return res.status(200).json({ message: "otp is verified successfully" });
    return res.status(200).json({
      message: "OTP sent successfully. Please verify.",
      data: otp,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Failed to reset password." });
  }
};

exports.ResetPass = async (req, res) => {
  try {
    const { emailPhone, password } = req.body;
    console.log(emailPhone)
    console.log(password)
    if (!emailPhone || !password) {
      return res.status(402).json({
        success: false,
        message: "All fields are required and opt must be greater than 7",
      });
    }
    let verificationMethod, contactInfo;

    if (emailPhone.includes("@")) {
      verificationMethod = "email";
      contactInfo = emailPhone;
    } else if (/^\+?\d+$/.test(emailPhone)) {
      verificationMethod = "phone";
      contactInfo = emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }
    // Find the user in the OTP collection based on email or phone
    const userOTP = await User.findOne({
      [verificationMethod]: contactInfo,
    });
    if (!userOTP) {
      return res.status(404).json({
        success: false,
        messaeg: "User not exist",
      });
    }
    userOTP.password = password;
    userOTP.save();
    // TODO: Replace with token
    const token = jwt.sign({
      email: email,
      phone: phone,
      userType: userOTP.userType,
      id: userOTP._id
    });
    return res.status(200).json({
      data: {token: token},
      message: "User saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " Failed to reset password",
    });
  }
};