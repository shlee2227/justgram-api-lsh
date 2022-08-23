const postingService = require("../services/postingServices");
const jwt = require("jsonwebtoken");

const createPost = async (req, res) => {
  const hasKey = { title: false, user_id: false, contents: false };
  const requireKey = Object.keys(hasKey);

  Object.entries(req.body.data).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });
  const hasKeyArray = Object.entries(hasKey);
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `please enter ${key}` });
      return;
    }
  }
  const { title, user_id, contents } = req.body.data;

  const isPostCreated = await postingService.createPost(
    title,
    user_id,
    contents
  );
  if (!isPostCreated) {
    return res.status(500).json({ massage: "post create failed" });
  }
  return res.status(201).json({ massage: "post created" });
};

const getPostList = async (req, res) => {
  const post = await postingService.getPostList();
  if (!post) {
    return res.status(500).json({ massage: "post loading fail" });
  }
  return res.status(201).json({ data: post });
};

const getUserPost = async (req, res) => {
  const userId = req.body.data.userId;
  if (!userId) {
    res.status(400).json({ message: "please enter user id" });
    return;
  }
  const userPosts = await postingService.getUserPost(userId);
  console.log(userPosts);
  if (!userPosts[0]) {
    return res.status(500).json({ massage: "user post loading fail" }); //임시로 빈 배열 첫번째 요소를 넣어서 에러 반환 -> 어떻게 하는지 추가 필요
  }
  return res.status(201).json({ data: userPosts });
};

const updatePost = async (req, res) => {
  const hasKey = { id: false, contents: false };
  const requireKey = Object.keys(hasKey);

  Object.entries(req.body.data).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });
  const hasKeyArray = Object.entries(hasKey);
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `please enter ${key}` });
      return;
    }
  }

  const { id, contents } = req.body.data;
  const post = await postingService.updatePost(id, contents);
  if (!post) {
    return res.status(500).json({ massage: "post editing fail" });
  }
  return res.status(201).json({ data: post });
};

const deletePost = async (req, res) => {
  const id = req.body.data.id;
  if (!id) {
    res.status(400).json({ message: "please enter post id" });
    return;
  }
  const isDeleted = await postingService.deletePost(id);
  if (!isDeleted) {
    return res.status(500).json({ massage: "post deleting fail" });
  }
  return res.status(201).json({ message: "posting deleted" });
};

module.exports = {
  createPost,
  getPostList,
  getUserPost,
  updatePost,
  deletePost,
};
