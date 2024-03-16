const express = require("express");
const router = express.Router();
const deleteUsrAccRoute = require("../../controllers/admin/deleteAccount.js");

//router to fetch
router.delete(
  "/delete-user-account/:userId",
  deleteUsrAccRoute.deleteUserAccount,
);

module.exports = router;
