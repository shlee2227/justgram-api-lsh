const http = require("http");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DataSource, Column } = require("typeorm");

const { title } = require("process");

const userController = require("./controllers/userControllers");

app.use(cors()); //최상단에  작성(const app 바로 아래)
dotenv.config();
app.use(morgan("combined"));
app.use(express.json());

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

//회원가입, 사용자 생성, 로그인, 포스트 작성, 포스트 목록 보기, 포스트 수정하기
app.post("/login", userController.login); //done

app.post("/signup", userController.createUser); //done

app.post("/createpost", userController.createPost); //done

app.get("/postlist", userController.readPostList); //done

app.post("/userpostlist", userController.readUserPost); //done

app.patch("/editpost", userController.updatePost);

app.delete("/deletepost", userController.deletePost);

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
