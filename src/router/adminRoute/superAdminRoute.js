const express = require("express");
const router = express.Router();
const UpdateUser = require("../../controllers/admin/update-all-user-details.js");
const randomToken = require("../../controllers/member/createMember.js");
const getAllUserBydisctrict = require("../../controllers/admin/getUsrBydistrict.js");
const getallUser = require("../../controllers/admin/getAllUser.js");

//router to fetch
router.patch("/update-user/:userId", UpdateUser.UpdateUserDet);
router.post("/random-token/:id", randomToken.GenerateRegisterLink);
router.post("/random-register/:id", randomToken.ValidateTokenAndSaveData);
router.get("/user-by-dist/:district", getAllUserBydisctrict.getUserByDistrict);
router.get("/all-user", getallUser.getAllUser);

module.exports = router;
