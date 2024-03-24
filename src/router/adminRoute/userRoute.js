const express = require("express");
const router = express.Router();
const deleteUsrAccRoute = require("../../controllers/admin/deleteAccount.js");
const uploadeHeroImage = require("../../controllers/heroImage/uploadImage.js");
const singleHeroImage = require("../../controllers/heroImage/singHeroImage.js");
const getAllHeroImage = require("../../controllers/heroImage/getAllHeroImage.js");
const deleteHeroImage = require("../../controllers//heroImage/deleteHeroImage.js");
const upload = require("../../utils/multer.js");

//router to fetch
router.delete(
  "/delete-user-account/:userId",
  deleteUsrAccRoute.deleteUserAccount,
);
router.post(
  "/upload-hero",
  upload.single("image"),
  uploadeHeroImage.UploadHeroImage,
);
router.get("/single-hero/:imageId", singleHeroImage.GetSingleImage);
router.delete("/delete-hero/:imageId", deleteHeroImage.deleteHero);
router.get("/all-hero", getAllHeroImage.getAllHeroImage);

module.exports = router;
