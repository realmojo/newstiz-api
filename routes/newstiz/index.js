const express = require("express");
const router = express.Router();
const categoryController = require("./category");

router.get("/category", categoryController.getCateogories);
module.exports = router;
