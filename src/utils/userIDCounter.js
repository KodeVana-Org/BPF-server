const Counter = require("../models/counter.Model.js"); // Import the Counter model

async function getNextSequenceValue(sequenceName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true },
  );

  // Start from 100 and add the sequence value
  const sequenceValue = counter.sequence_value + 100;

  // Pad the sequence value to ensure it's 7 digits long with leading zeros
  const paddedSequenceValue = sequenceValue.toString().padStart(7, "0");

  return paddedSequenceValue;
}

module.exports = getNextSequenceValue;
