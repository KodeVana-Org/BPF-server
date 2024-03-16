const express = require("express");
const router = express.Router();
const constituteController = require("../../controllers/constitution.js");
const upload = require("../../utils/multer.js");

router.post(
  "/create-constitute",
  upload.single("pdf"),
  constituteController.createConstitude,
);
router.get("/get-all-constitute", constituteController.getAllConstitude);

module.exports = router;