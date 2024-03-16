const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  try {
    const dbURI = process.env.DB_URI;
    await mongoose.connect(dbURI);

    console.log(`Connected to the database at ${dbURI}`);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

module.exports = { connectToDatabase };
