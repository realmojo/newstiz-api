const express = require("express");
const router = express.Router();
const categoryController = require("./category");
const postController = require("./post");

router.get("/category", categoryController.getCateogories);
router.get("/post/list", postController.getPostList);
router.get("/post/:_id", postController.getPost);
module.exports = router;
