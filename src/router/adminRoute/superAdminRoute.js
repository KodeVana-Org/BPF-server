const express = require("express");
const router = express.Router();
const UpdateUser = require("../../controllers/admin/update-all-user-details.js");
const randomToken = require("../../controllers/member/createMember.js");

//router to fetch
router.patch("/update-user/:userId", UpdateUser.UpdateUserDet);
router.post("/random-token/:id", randomToken.GenerateRegisterLink);
router.post("/random-register/:id", randomToken.ValidateTokenAndSaveData);

module.exports = router;
