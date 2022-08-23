const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.post("/create", userController.createPost);
router.get("/list", userController.readPostList);
router.post("/userlist", userController.readUserPost);
router.patch("/edit", userController.updatePost);
router.delete("/delete", userController.deletePost);

module.exports = router;
