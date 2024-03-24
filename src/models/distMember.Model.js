const mongoose = require("mongoose");

const districtMemberSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },

  photo: {
    type: String,
    required: true,
  },

  memberType: {
    type: String,
    enum: ["distMember", "parentMember"],
  },

  postionStatus: {
    type: String,
    enum: ["Ex", "Present"],
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const DistrictMember = new mongoose.model(
  "DistrictMember",
  districtMemberSchema,
);
module.exports = DistrictMember;
