const express = require("express");
const router = express.Router();
const lognRoute = require("../controllers/login.js");
const userRoute = require("../controllers/Register.js");
const profileRoute = require("../profile/me.js");
const profilePicture = require("../controllers/updateProfilePic.js");
const auth = require('../profile/auth.js')
const verifyToken = require("../utils/verifyToken.js");
const DeleteAccount = require("../profile/deleteAccount.js");
const ForgotPass = require("../controllers/forgotPassword.js");
const joinMember = require("../controllers/join.js");
const getJoinUser = require("../controllers/join/getAllJoinUser.js");
const updateJoinUser = require("../controllers/join/updatejoinUser.js");

//router to fetch
router.post("/register", userRoute.RegisterForm);
router.post("/login-with-otp", userRoute.loginWithOtp);
router.post("/verify-for-login", userRoute.verifyOtpAndLogin);
router.post("/login", lognRoute.Login);
router.post("/update-profile/:userId", profilePicture.UpdateProfilePic);
router.post("/forgot-password", ForgotPass.ForgotPassword);
router.post("/reset-password", ForgotPass.ResetPassword);
router.post("/reset-pass", ForgotPass.ResetPass);
router.post("/verify-otp", userRoute.VerifyOTP);
router.get("/me", verifyToken, profileRoute.Profile);
router.get("/auth", verifyToken,auth.auth );
router.post("/delete-account", verifyToken, DeleteAccount.DeleteAccount);
router.post("/cancel-delete", verifyToken, DeleteAccount.CancelDeletion);
router.post("/join", joinMember.Join);
router.get("/get-join-user", verifyToken, getJoinUser.JoinUser);
router.patch("/update-join-user/:userid", updateJoinUser.UpdateJoinerUser);

module.exports = router;
