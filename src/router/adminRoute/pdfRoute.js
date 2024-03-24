const express = require("express");
const router = express.Router();
const constituteController = require("../../pdf/createConstitude.js");
const sixScheduleController = require("../../pdf/createSixSchedule.js");
const visionController = require("../../pdf/createVision.js");
const upload = require("../../utils/multer.js");

router.post(
  "/create-constitute",
  upload.single("pdf"),
  constituteController.createConstitude,
);
router.get("/get-constitute", constituteController.getAllConstitude);
router.get("/get-sixSchedule", sixScheduleController.getsixSchedule);
router.get("/get-vision", visionController.getVision);
router.post(
  "/create-sixSchedule",
  upload.single("pdf"),
  sixScheduleController.createSixSchedule,
);
router.post(
  "/create-vision",
  upload.single("pdf"),
  visionController.createVision,
);
router.delete(
  "/delete-sixSchedule/:visionId",
  sixScheduleController.deletesixSchedule,
);
router.delete(
  "/delete-constitute/:visionId",
  constituteController.deleteConstitute,
);
router.delete("/delete-vision/:visionId", visionController.deleteVision);

module.exports = router;

