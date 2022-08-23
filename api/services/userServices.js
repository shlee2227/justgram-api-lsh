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
  console.log("2-1");
  let user = (await userDao.findUserByEmail(email))[0];
  //if (!user.id) {return user.id}
  console.log("2-2");
  user.isPasswordCorrect = bcrypt.compareSync(password, user.password);
  return user;
};

module.exports = {
  createUser,
  login,
};
