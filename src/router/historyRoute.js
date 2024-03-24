const express = require("express");
const router = express.Router();
const historyRouter = require("../controllers/history/createHistory.js");
const upload = require("../utils/multer.js");

router.post(
  "/create-history/:userId",
  upload.single("images"),
  historyRouter.createHistory,
);
router.get("/get-history", historyRouter.getAllHistory);
router.delete("/delete-history/:historyId", historyRouter.deleteHistory);
router.get("/get-single-history/:historyId", historyRouter.SingleHistory);

module.exports = router;
