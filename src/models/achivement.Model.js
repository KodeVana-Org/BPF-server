const mongoose = require("mongoose");
const moment = require("moment");

const achivementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  photo: {
    type: [String],
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  dateOfAchMent: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return isValidDate(v);
      },
      message: (props) =>
        `${props.value} is not a valid date string in format MM/DD/YYYY!`,
    },
  },
});

function isValidDate(dateString) {
  return moment(dateString, "MM/DD/YYYY", true).isValid();
}

const AchiveMent = mongoose.model("AchiveMent", achivementSchema);
module.exports = AchiveMent;
