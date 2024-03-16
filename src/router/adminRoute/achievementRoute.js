const express = require("express");
const router = express.Router();
const upload = require("../../utils/multer.js");
const AchiveRoute = require("../../controllers/achievement/createAvchievement.js");

//router to fetch (achv)
router.post(
  "/create-achive/:id",
  upload.array("images", 5),
  AchiveRoute.createAchievement,
);
router.get("/get-achive", AchiveRoute.getAllAchievements);
router.delete("/delete-achive/:id", AchiveRoute.deleteAchievement);
router.get("/single-achive/:id", AchiveRoute.getAchievementById);

module.exports = router;
