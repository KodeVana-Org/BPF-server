const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const socketController = require("./src/socket/socket.js");

const io = require("socket.io")(server);
socketController(io);

//importing routess
const videosRoutes = require("./src/router/videoRoute.js");
const userRoute = require("./src/router/userRoute.js");
const paymentRoute = require("./src/router/paymentRoute.js");
const postRoute = require("./src/router/postRoute.js");
const adminRoute = require("./src/router/adminRoute/superAdminRoute.js");
const eventRotue = require("./src/router/adminRoute/eventRoute.js");
const achivementRoute = require("./src/router/adminRoute/achievementRoute.js");
const historyRotue = require("./src/router/historyRoute.js");
const usrRoute = require("./src/router/adminRoute/userRoute.js");
const constitutionRoute = require("./src/router/adminRoute/pdfRoute.js");
// Middleware to log requests
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   console.log(`Request received for ${req.url}`);
//   next();
// });

app.use("/youtube", videosRoutes);
app.use("/user", userRoute);
app.use("/pay", paymentRoute);
app.use("/post", postRoute);
app.use("/admin", adminRoute);
app.use("/event", eventRotue);
app.use("/achv", achivementRoute);
app.use("/history", historyRotue);
app.use("/api", usrRoute);
app.use("/pdf", constitutionRoute);

// Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "server is running..",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).send("Route is not matching!");
});

module.exports = server;
