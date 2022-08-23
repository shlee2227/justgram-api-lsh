const userDao = require("../models/userDao");

const bcrypt = require("bcryptjs");

const createUser = async (email, nickname, password) => {
  console.log("s1");
  const salt = bcrypt.genSaltSync(12);
  const hashedPw = bcrypt.hashSync(password, salt);
  const user = await userDao.createUser(email, nickname, hashedPw);
  console.log("s2");

  return user;
};

const login = async (email, password) => {
  let user = (await userDao.findUserByEmail(email))[0];
  //if (!user.id) {return user.id}
  user.isPasswordCorrect = bcrypt.compareSync(password, user.password);
  return user;
};

const createPost = async (title, user_id, contents) => {
  const isPostCreated = await userDao.createPost(title, user_id, contents);
  return isPostCreated;
};

const getPostList = async () => {
  const post = await userDao.getPostList();
  return post;
};

const getUserPost = async (userId) => {
  const userPosts = await userDao.getPostListByUserId(userId);
  return userPosts;
};

const updatePost = async (id, contents) => {
  const updated = await userDao.updatePost(id, contents);
  if (updated) {
    const post = await userDao.getPost(id);
    return post;
  } //데이터가 안 넘어온 경우 컨트롤
};

const deletePost = async (id) => {
  const isDeleted = await userDao.deletePost(id);
  return isDeleted;
};

module.exports = {
  createUser,
  login,
  createPost,
  getPostList,
  getUserPost,
  updatePost,
  deletePost,
};
