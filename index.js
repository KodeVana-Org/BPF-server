const app = require("./app");
const cors = require("cors");
const { connectToDatabase } = require("./src/config/db.js");
require("dotenv").config();
const PORT = process.env.PORT || 8000;

// Middleware to handle 404 errors
app.use(cors());
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find route! check route again");
});
app.use("/", (req, res) => {
  console.log("app is working fine");
});
connectToDatabase();
// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
