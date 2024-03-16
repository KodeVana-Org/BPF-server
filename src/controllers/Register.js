const User = require("../models/user.Model.js");
const OTP = require("../models/otp.Model.js");
const otpSender = require("../utils/OtpSender.js");
const jwt = require("jsonwebtoken");
const { renderEmailTemplate } = require("../utils/template/loginWithOtp.js");
const validator = require("validator");

exports.RegisterForm = async (req, res) => {
  try {
    const { emailPhone } = req.body;
    console.log(emailPhone);
    let email;
    let phone;
    let phoneNumberWithCountryCode;

    if (!emailPhone) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: " Enter an Phone or Email ",
      });
    }

    // Check if the provided input is an email or a phone number
    if (emailPhone.includes("@")) {
      email = emailPhone;
    } else {
      phone = emailPhone;
      phoneNumberWithCountryCode = "+91" + phone;
    }

    // Find existing OTP entry based on email or phone number
    let existingOTP;
    let existingUser;
    if (email) {
      existingOTP = await OTP.findOne({ email: email });
      existingUser = await User.findOne({ email: email });
    } else if (phoneNumberWithCountryCode) {
      existingOTP = await OTP.findOne({ phone: phoneNumberWithCountryCode });
      existingUser = await User.findOne({ phone: phone });
    }
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exist",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    if (existingOTP) {
      // Update existing OTP entry with new OTP
      existingOTP.otp = otp;
      existingOTP.expiration = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes in milliseconds
      existingOTP.createdAt = new Date();
      await existingOTP.save();
    } else {
      // Create new OTP entry
      const newOTP = new OTP({
        email: email,
        phone: phoneNumberWithCountryCode,
        otp: otp,
        expiration: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes in milliseconds
        createdAt: new Date(),
      });
      await newOTP.save();
    }

    // Send OTP to user via email or SMS based on verificationMethod
    if (email) {
      const htmlTemplate = renderEmailTemplate(email, otp);
      otpSender.sendOTPByEmail(email, otp, htmlTemplate);
    } else if (phoneNumberWithCountryCode) {
      otpSender.sendOTPViaSMS(phoneNumberWithCountryCode, otp);
    }

    return res.status(200).json({
      message: "OTP sent successfully. Please verify.",
      data: otp,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

exports.VerifyOTP = async (req, res) => {
  try {
    const { emailPhone, otp, password } = req.body;
    let email, phone;
    // Check if email or phone is provided
    if (
      !emailPhone ||
      (emailPhone.includes("@") && /^\d+$/.test(emailPhone)) ||
      (!emailPhone.includes("@") && !/^\d+$/.test(emailPhone))
    ) {
      throw new Error("Provide either email or phone, but not both");
    }

    if (emailPhone.includes("@")) {
      email = emailPhone;
    } else {
      phone = "+91" + emailPhone;
    }
    const otpQury = {};
    if (email) {
      otpQury.email = email;
    } else {
      otpQury.phone = phone;
    }
    const userQuery = {};
    if (email) {
      userQuery.email = email;
    } else {
      userQuery.phone = phone;
    }
    const userExist = await User.exists(userQuery);
    if (userExist) {
      return res.status(404).json({
        success: false,
        message: "User already registerd",
      });
    }
    const otpData = await OTP.findOne(otpQury);
    if (!otpData || otpData.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "OTP is invalid",
        data: {
          message:message
        }
       
      });
    }

    // Save email or phone in User model
    let user;
    if (email) {
      user = new User({ email, password });
    } else {
      user = new User({ phone, password });
    }
    await user.save();

    //token-generate
    let tokenPayload = {
      userType: user.userType,
      id: user._id,
    };

    if (user.email && user.phone) {
      tokenPayload = {
        email: user.email,
        phone: user.phone,
        ...tokenPayload,
      };
    } else if (user.email) {
      tokenPayload.email = user.email;
    } else if (user.phone) {
      tokenPayload.phone = user.phone;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
    return res.status(200).json({
      data: {token: token},
      message: "User saved successfully",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// exports.VerifyOTP = async (req, res) => {
//   try {
//     const { emailPhone, otp, password } = req.body;
//     let email;
//     let phone;
//     let phoneNumberWithCountryCode;
//
//     if (!otp || !password || !emailPhone) {
//       return res.status(404).json({
//         success: false,
//         message: "All fileds are required",
//       });
//     }
//
//     if (emailPhone.includes("@")) {
//       email = emailPhone;
//     } else {
//       phone = emailPhone;
//       phoneNumberWithCountryCode = "+91" + phone;
//     }
//
//     let verificationMethod;
//     let contactInfo;
//
//     if (email) {
//       verificationMethod = "email";
//       contactInfo = email;
//     } else {
//       verificationMethod = "phone";
//       contactInfo = phone;
//     }
//
//     // Find the user in the OTP collection based on email or phone
//     const userOTP = await OTP.findOne({
//       [verificationMethod]: contactInfo,
//     });
//
//     // If user not found or OTP doesn't match, return error
//     if (!userOTP || !userOTP.otp || userOTP.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP or email/phone" });
//     }
//
//     // Check if OTP is expired (e.g., after 5 minutes)
//     const otpTimestamp = userOTP.createdAt.getTime();
//     const currentTimestamp = Date.now();
//
//     const otpValidityDuration = 2 * 60 * 1000;
//     if (currentTimestamp - otpTimestamp > otpValidityDuration) {
//       await OTP.deleteOne({ _id: userOTP._id });
//       return res.status(400).json({ error: "OTP expired" });
//     }
//
//     // If OTP is valid, save the user and remove the OTP data
//     const newUser = new User();
//     if (email) {
//       newUser.email = email;
//     } else {
//       newUser.phone = phone;
//     }
//     newUser.password = password;
//     await newUser.save();
//
//     // Remove the user data from the OTP collection
//     await OTP.deleteOne({ _id: userOTP._id });
//
//     //token-generate
//     const token = jwt.sign(
//       {
//         emailPhone: contactInfo,
//         userType: newUser.userType,
//         id: newUser._id,
//       },
//       process.env.JWT_SECRET_KEY,
//     );
//
//     return res
//       .status(200)
//       .json({ message: "User Registered  successfully", token: token });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return res.status(500).json({ error: "Failed to verify OTP" });
//   }
// };
//
exports.loginWithOtp = async (req, res) => {
  try {
    const { emailPhone } = req.body;
    let email, phone, phoneNumberWithCountryCode;

    if (!emailPhone) {
      return res.status(403).json({
        success: false,
        message: "All fileds are required",
      });
    }
    if (validator.isEmail(emailPhone)) {
      email = emailPhone;
    } else if (
      validator.isMobilePhone(emailPhone, "any", { strictMode: false })
    ) {
      phone = emailPhone;
      phoneNumberWithCountryCode = "+91" + phone;
    } else {
      // throw new Error("Invalid email or phone number format.");
      return res.status(403).json({
        success: false,
        message: " Invalid email or phone number format",
      });
    }

    const verificationMethod = email ? "email" : "phone";

    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ phone: phoneNumberWithCountryCode });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User not found. Please register first." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);

    if (verificationMethod === "email") {
      const htmlTemplate = renderEmailTemplate(email, otp);
      otpSender.sendOTPByEmail(email, otp, htmlTemplate);
    } else {
      otpSender.sendOTPViaSMS(phoneNumberWithCountryCode, otp);
    }

    await User.updateOne(
      { _id: user._id },
      { otp, expiration: otpExpiration, createdAt: new Date() },
    );

    return res.status(200).json({
      data: { otp },
      message: "OTP sent successfully. Please verify and login.",
    });
  } catch (error) {
    console.error("Error logging in with OTP:", error);
    return res.status(500).json({ error: "Failed to login with OTP" });
  }
};

exports.verifyOtpAndLogin = async (req, res) => {
  try {
    const { otp, emailPhone } = req.body;
    if (!otp || !emailPhone) {
      return res.status(404).json({
        success: false,
        message: " All fileds are required",
      });
    }
    let verificationMethod;
    let contactInfo;

    if (validator.isEmail(emailPhone)) {
      verificationMethod = "email";
      contactInfo = emailPhone;
    } else if (
      validator.isMobilePhone(emailPhone, "any", { strictMode: false })
    ) {
      verificationMethod = "phone";
      contactInfo = emailPhone;
    } else {
      throw new Error("Invalid email or phone number format.");
    }

    const userOTP = await User.findOne({
      [verificationMethod]: contactInfo,
    });

    if (!userOTP || userOTP.otp !== otp || (!userOTP.email && !userOTP.phone)) {
      return res.status(400).json({ error: "Invalid OTP or email/phone" });
      console.log('Wrong OTP');
    }
    
    const otpValidityDuration = 3 * 60 * 1000; // 5 minutes in milliseconds
    const otpTimestamp = userOTP.createdAt.getTime();
    const currentTimestamp = Date.now();
    
    if (currentTimestamp - otpTimestamp > otpValidityDuration) {
      await User.updateOne({ _id: userOTP._id }, { $unset: { otp: 1 } });
      return res.status(404).json({ error: "OTP expired" });
      console.log('OTP expired');
    }

    await User.updateOne({ _id: userOTP._id }, { $unset: { otp: 1 } });

    const token = jwt.sign(
      {
        data: contactInfo,
        userType: userOTP.userType,
        id: userOTP._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    return res
      .status(200)
      .json({ message: "User logged in successfully", token: token });
  } catch (error) {
    await User.updateOne({ _id: userOTP._id }, { $unset: { otp: 1 } });
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};
