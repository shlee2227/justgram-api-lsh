const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
//외부 모듈
const {
  signup,
  login,
  createPost,
  postList,
  editPost,
  deletePost,
  userPostList,
} = require("./appdata");

//회원가입, 사용자 생성, 로그인, 포스트 작성, 포스트 목록 보기, 포스트 수정하기

app.post("/signup", signup);
app.post("/login", login);
app.post("/createpost", createPost);
app.get("/postlist", postList);
app.patch("/editpost", editPost);
app.delete("/deletepost", deletePost);
app.post("/userpostlist", userPostList);

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
