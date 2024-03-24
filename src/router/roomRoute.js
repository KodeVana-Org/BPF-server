const express = require("express");
const router = express.Router();
const RoomRoute = require("../controllers/agora/agoraController.js");

router.post("/create-room/:userId", RoomRoute.CreateRoom);
router.post("/join-room/:userId", RoomRoute.JoinRoom);
router.get("/get-room", RoomRoute.getRoom);
router.get("/user-inside-room", RoomRoute.getAllUserInsideChannel);
router.post("/leave-room", RoomRoute.leaveRoom);

module.exports = router;
