const User = require("../models/user.Model.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("join_room", async ({ room, userId }, callback) => {
      try {
        // Check if the user is valid
        const user = await User.findById(userId);
        if (!user) {
          return callback({ error: "User not found" });
        }

        // Join the room
        socket.join(room);

        // Emit a message to the user who joined
        socket.emit("message", {
          user: "admin",
          text: `${user.username}, welcome to room ${room}`,
        });

        // Broadcast to all users in the room except the sender
        socket.broadcast.to(room).emit("message", {
          user: "admin",
          text: `${user.username} has joined`,
        });

        // Send user info back to the client
        callback({ user: user.username });
      } catch (error) {
        console.error("Error joining room:", error);
        callback({ error: "Error joining room" });
      }
    });

    socket.on("create_room", async ({ room, userId }, callback) => {
      try {
        // Check if the user is valid
        const user = await User.findById(userId);
        if (!user) {
          return callback({ error: "User not found" });
        }

        // Create the room
        // Your MongoDB logic to create a room (if needed)

        // Join the room
        socket.join(room);

        // Send user info back to the client
        callback({ user: user.username });
      } catch (error) {
        console.error("Error creating room:", error);
        callback({ error: "Error creating room" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
