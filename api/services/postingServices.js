const postingDao = require("../models/postingDao");

const bcrypt = require("bcryptjs");

const createPost = async (title, user_id, contents) => {
  const isPostCreated = await postingDao.createPost(title, user_id, contents);
  return isPostCreated;
};

const getPostList = async () => {
  const post = await postingDao.getPostList();
  return post;
};

const getUserPost = async (userId) => {
  const userPosts = await postingDao.getPostListByUserId(userId);
  return userPosts;
};

const updatePost = async (id, contents) => {
  const updated = await postingDao.updatePost(id, contents);
  if (updated) {
    const post = await postingDao.getPost(id);
    return post;
  } //데이터가 안 넘어온 경우 컨트롤
};

const deletePost = async (id) => {
  const isDeleted = await postingDao.deletePost(id);
  return isDeleted;
};

module.exports = {
  createPost,
  getPostList,
  getUserPost,
  updatePost,
  deletePost,
};
