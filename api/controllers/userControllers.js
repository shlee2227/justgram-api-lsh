const userService = require("../services/userServices");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  console.log("c1");
  const { email, nickname, password } = req.body.data;
  const hasKey = { email: false, nickname: false, password: false };
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

  try {
    const user = await userService.createUser(email, nickname, password);
    console.log("c2");
    res.status(201).json({ massage: "user created" });
  } catch (err) {
    res.status(500).json({ massage: "user create failed" });
    console.log(err);
  }
};

const login = async (req, res) => {
  console.log("1-1");
  const { email, password } = req.body.data;
  const hasKey = { email: false, password: false };
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
  //if (!user.id) {res.status(400).json({ message: `No user in DB`});}
  const user = await userService.login(email, password);
  console.log(user);
  if (!user.isPasswordCorrect) {
    return res.status(400).json({ message: "invalid password" });
  }
  console.log("1-2");

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
  return res.status(200).json({ message: "login success", token: token });
};

module.exports = {
  createUser,
  login,
};
