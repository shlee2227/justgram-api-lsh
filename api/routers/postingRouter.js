const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.post("/create", userController.createPost);
router.get("/list", userController.getPostList);
router.post("/userlist", userController.getUserPost);
router.patch("/edit", userController.updatePost);
router.delete("/delete", userController.deletePost);

module.exports = router;
