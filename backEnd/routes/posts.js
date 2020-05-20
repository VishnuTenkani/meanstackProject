const express = require("express");
const Post = require("../model/post");
const router = express.Router();
const checkAuth = require("../middleware/check-auth")
const postControllerr = require("../controllers/posts")
const fileUpload = require("../middleware/file")

router.post("/api/posts", checkAuth, fileUpload, postControllerr.createPost);

router.get("/api/posts/:id", postControllerr.getPostById);

router.put("/api/posts/:id", checkAuth, fileUpload, postControllerr.updatePosts)

router.get("/api/posts", postControllerr.getAllPosts);

router.delete("/api/posts/:id", checkAuth, postControllerr.deletePost);

router.put("/api/posts/",checkAuth, postControllerr.like);
router.put("/api/dislike/",checkAuth, postControllerr.dislike);

module.exports = router;