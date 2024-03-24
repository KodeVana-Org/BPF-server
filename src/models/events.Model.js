const mongoose = require("mongoose");
const moment = require("moment");

const eventSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  dateOfEvent: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return isValidDate(v); // Example function to check if v is a valid date
      },
      message: (props) =>
        `${props.value} is not a valid date string in format MM/DD/YYYY!`,
    },
  },
});

function isValidDate(dateString) {
  return moment(dateString, "MM/DD/YYYY", true).isValid();
}

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
