// const agoraModel = require("../src/models/agora.Model.js");
require("dotenv").config();
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

const nocache = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
};

const generateAccessToken = async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(APP_ID, APP_CERTIFICATE);

    const channelName = req.query.channelName;
    if (!channelName) {
      return res.status(400).json({ error: "channelName is required" });
    }

    const uid = req.query.uid;
    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    let role = RtcRole.PUBLISHER;
    if (req.query.role === "audience") {
      role = RtcRole.SUBSCRIBER;
    }
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime === "") {
      expireTime = 3600;
    } else {
      expireTime = parseInt(expireTime, 10);
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTime + expireTime;
    console.log(role, privilegeExpiredTs);
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "server error" });
  }
};

module.exports = { nocache, generateAccessToken };
