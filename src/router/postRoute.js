const express = require("express");
const router = express.Router();
const postRouter = require("../controllers/createPost.js");
const upload = require("../utils/multer.js");
const verifyToken = require("../utils/verifyToken.js");

router.post("/create-post", upload.single("postImage"), postRouter.CreatePost);
router.get("/get-all-post", postRouter.getAllPost);
router.get("/get-post-by-admin", postRouter.getPostByAdminWise);
router.delete("/delete-post/:postId", postRouter.deletePost);
router.get("/get-post/:postId", postRouter.getSinglePostById);

module.exports = router;