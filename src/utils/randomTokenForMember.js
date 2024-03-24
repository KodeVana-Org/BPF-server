const jwt = require("jsonwebtoken");
// const { jwtSecret } = require("./config"); // Assuming you have a jwtSecret defined in your config file
const jwtSecret = "sljflsjflsjfs";

// Function to generate a token
exports.generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, jwtSecret, { expiresIn: "1h" });
};

// Function to verify a token
exports.verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};
