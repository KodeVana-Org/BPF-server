const Post = require("../models/post.Model.js");
const User = require("../models/user.Model.js");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary.js");

exports.CreatePost = async (req, res) => {
  try {
    const { userId, postTitle } = req.body;
    const file = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.userType !== "admin" &&
      user.userType !== "superAdmin" &&
      user.userType !== "post-admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admin can create posts",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "post_images",
    });
    fs.unlinkSync(file.path);
    // Create the post
    const newPost = new Post({
      adminId: userId,
      postImages: uploadedImage.secure_url,
      postTitles: postTitle,
    });
    await newPost.save();

    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    let posts = await Post.find().sort({ createdAt: -1 });

    // Manually populate the memberId field with user data for each post
    posts = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.adminId).select("_id email");
        return {
          id: post._id,
          PostCreatorId: user,
          postImages: post.postImages,
          postComment: post.postTitles,
          createdAt: post.createdAt,
        };
      }),
    );

    const totalPost = posts.length;
    if (totalPost === 0) {
      return res.status(404).json({
        message: "No post found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: posts,
      totalPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch the posts",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = req.body;

    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check user permissions
    if (
      user.userType !== "admin" &&
      user.userType !== "superAdmin" &&
      !(
        user.userType === "post-admin" &&
        post.adminId &&
        post.adminId.toString() === userId
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete the post",
      });
    }
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the post",
      error: error.message,
    });
  }
};

exports.getPostByAdminWise = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "adminId",
      select: "_id email",
    });

    const postCounts = new Map();
    const allPostsByAdmin = {};

    posts.forEach((post) => {
      const userId = post.adminId._id.toString();

      // Increment the post count for the admin user
      if (postCounts.has(userId)) {
        postCounts.set(userId, postCounts.get(userId) + 1);
      } else {
        postCounts.set(userId, 1);
      }

      // Store all posts by admin in the object
      if (!allPostsByAdmin[userId]) {
        allPostsByAdmin[userId] = [];
      }
      allPostsByAdmin[userId].push(post);
    });

    // Convert the map to an array of objects for response
    const postCountByAdmin = Array.from(postCounts, ([userId, count]) => ({
      userId: userId,
      postCount: count,
      posts: allPostsByAdmin[userId], // Include all posts by admin
    }));

    // Calculate total number of posts across all users
    const totalPost = postCountByAdmin.reduce(
      (total, { postCount }) => total + postCount,
      0,
    );

    if (totalPost === 0) {
      return res.status(404).json({
        message: "No post found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Posts by admin fetched successfully",
      postCountByAdmin: postCountByAdmin,
      totalPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts by admin",
      error: error.message,
    });
  }
};

exports.getSinglePostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate({
      path: "adminId",
      select: "_id email",
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the post",
      error: error.message,
    });
  }
};
