const express = require("express");
const router = express.Router();
const postingController = require("../controllers/postingControllers");

router.post("/create", postingController.createPost);
router.get("/list", postingController.getPostList);
router.post("/userlist", postingController.getUserPost);
router.patch("/edit", postingController.updatePost);
router.delete("/delete", postingController.deletePost);

module.exports = router;
