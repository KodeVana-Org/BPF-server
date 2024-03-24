const express = require("express");
const router = express.Router();
const Payment = require("../controllers/payment");

//router to fetch
router.post("/payment", Payment.Pyament);
module.exports = router;
