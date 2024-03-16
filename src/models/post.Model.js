const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postImages: {
      type: String,
      required: true,
    },
    postTitles: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
