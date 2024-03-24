const Room = require("../../models/agora.Model.js");
const User = require("../../models/user.Model.js");

exports.CreateRoom = async (req, res) => {
  try {
    const { channelName } = req.body;
    const { userId } = req.params;
    if (!channelName || !userId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required ",
      });
    }

    const userExist = await User.findById(userId);

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found ",
      });
    }
    const existingRoom = await Room.findOne({ channelName }).sort({
      createdAt: -1,
    });

    if (existingRoom) {
      if (existingRoom.status === "active") {
        return res.status(200).json({
          success: true,
          message: "Room with the same name exists and is not expired",
        });
      }
    }
    const newRoom = new Room({
      channelName,
      user: userId,
      host: userId,
    });

    await newRoom.save();
    return res.status(200).json({
      success: true,
      message: "room created successfull",
      data: newRoom,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in creating room",
      err: err.message,
    });
  }
};

exports.JoinRoom = async (req, res) => {
  try {
    const { channelName } = req.body;
    const { userId } = req.params;

    if (!channelName || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await User.findById(userId);
    const roomExist = await Room.findOne({ channelName }).sort({
      createdAt: -1,
    });

    if (!userExist || !roomExist) {
      return res.status(404).json({
        success: false,
        message: "User or Room not found",
      });
    }
    if (roomExist.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Room is expired or not valid",
      });
    }

    roomExist.user.push(userExist._id);
    // roomExist.members.push(userExist._id);
    roomExist.members.push({ userId: userExist._id, userActive: true });
    await roomExist.save();

    return res.status(200).json({
      success: true,
      message: "User joined room successfully",
      data: roomExist,
    });
  } catch (error) {
    console.error("Error in joining room:", error);
    return res.status(500).json({
      success: false,
      message: "Error in joining room",
      error: error.message,
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const allRoom = await Room.find().populate({
      path: "user",
      select: "-password",
    });
    if (allRoom.length === 0) {
      return res.status(200).json({
        success: true,
        message: "no room found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "fetched all room",
      room: allRoom,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching room",
      error: error.message,
    });
  }
};

exports.getAllUserInsideChannel = async (req, res) => {
  try {
    // const { channelName } = req.params;
    const { channelName } = req.body;
    if (!channelName) {
      return res.status(400).json({
        success: false,
        message: "channelName is required",
      });
    }
    const channelExist = await Room.findOne({ channelName: channelName })
      .sort({ createdAt: -1 }) //get the latest room
      .populate("host")
      .populate({
        path: "members",
        populate: { path: "userId" }, // Populate the userId field with user data
      });

    // If the channel doesn't exist, return a 404 response
    if (!channelExist) {
      return res.status(404).json({
        success: false,
        message: "Channel does not exist",
      });
    }

    const host = channelExist.host;
    let member = channelExist.members;

    return res.status(200).json({
      success: true,
      message: "Room found",
      data: {
        host,
        member,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch the user by channleName",
      error: error.message,
    });
  }
};

exports.leaveRoom = async (req, res) => {
  try {
    const { channelName } = req.body;
    const { userId } = req.params;

    // Validate request parameters
    if (!channelName || !userId) {
      return res.status(400).json({
        success: false,
        message: "channelName and userId are required",
      });
    }

    // Find the room by channelName
    const room = await Room.findOne({ channelName }).sort({ createdAt: -1 });

    // If the room doesn't exist, return a 404 response
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Find the index of the user in the members array
    const userIndex = room.members.findIndex(
      (member) => member.userId.toString() === userId,
    );

    // If the user is not found in the members array, return a 404 response
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User not found in the room",
      });
    }

    // Set userActive to false for the user leaving the room
    room.members[userIndex].userActive = false;

    // Save the updated room document
    await room.save();

    return res.status(200).json({
      success: true,
      message: "User left the room successfully",
    });
  } catch (error) {
    console.error("Error leaving room:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to leave room",
      error: error.message,
    });
  }
};
