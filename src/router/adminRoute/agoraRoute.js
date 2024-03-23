const express = require("express");
const router = express.Router();
// const { generateAccessToken, nocache } = require("../../../agora/index.js");
const generateToken = require("../../../agora/server.js");

router.get("/token", generateToken.GenerateToken);

module.exports = router;
