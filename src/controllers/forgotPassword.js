const User = require("../models/user.Model");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp.Model");
const otpSender = require("../utils/OtpSender");
const forgotPassword = require("../utils/template/resetPasswordOtp.js");

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
      contactInfo = "+91" + emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }

    const existingUser = await User.findOne({
      [verificationMethod]: contactInfo,
    });
    if (!existingUser) {
      return res.status(404).json({ status: 404, error: "User not found." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds

    // Update user document with OTP and expiration
    existingUser.otp = otp;
    existingUser.otpExpiration = otpExpiration;
    await existingUser.save();

    // Here you should define or import otpSender.sendOTPByEmail and otpSender.sendOTPViaSMS functions
    if (verificationMethod === "email") {
      const htmlTemplate = forgotPassword.resetPasswordOtp(contactInfo, otp);
      otpSender.sendOTPByEmail(contactInfo, otp, htmlTemplate);
    } else if (verificationMethod === "phone") {
      otpSender.sendOTPViaSMS(contactInfo, otp);
    }

    return res.status(200).json({
      message: "OTP sent successfully. Please verify.",
      status: 200,
      //data: otp,
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
      contactInfo = "+91" + emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }
    // Find the user in the OTP collection based on email or phone
    const userOTP = await User.findOne({
      [verificationMethod]: contactInfo,
    });

    // If user not found or OTP doesn't match, return error
    if (!userOTP || userOTP.otp !== otp) {
      return res
        .status(400)
        .json({ status: 404, error: "Invalid OTP or email/phone" });
    }

    // Check if OTP is expired
    const currentTimestamp = Date.now();
    if (currentTimestamp > userOTP.otpExpiration) {
      return res.status(400).json({ status: 400, error: "OTP expired" });
    }
    return res.status(201).json({
      message: "OTP sent successfully. Please verify.",
      status: 200,
      //data: otp,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Failed to reset password." });
  }
};

exports.ResetPass = async (req, res) => {
  try {
    const { emailPhone, password } = req.body;
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
      contactInfo = "+91" + emailPhone;
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
        message: "User not exist",
      });
    }
    userOTP.password = password;
    userOTP.save();
    const token = jwt.sign(
      {
        phone: contactInfo,
        email: contactInfo,
        userType: userOTP.userType,
        id: userOTP._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    return res.status(200).json({
      data: { token: token },
      status: 200,
      success: true,
      message: "User Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: " Failed to reset password",
    });
  }
};
