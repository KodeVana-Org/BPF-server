const express = require("express");
const router = express.Router();
const createEvents = require("../../controllers/event/createEvent.js");
const singleEvent = require("../../controllers/event/singleEvent.js");
const upload = require("../../utils/multer.js");

//router to fetch
router.post("/create-event", upload.single("images"), createEvents.createEvent);
router.get("/get-event", createEvents.getAllEvents);
router.get("/single-event/:eventId", singleEvent.getEventById);
router.delete("/delete-event/:eventId", singleEvent.deleteEventById);

module.exports = router;
