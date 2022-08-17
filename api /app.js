const http = require("http");
require("dotenv").config();
const { DataSource } = require("typeorm");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
app.use(cors());
dotenv.config();
app.use(morgan("combined"));
app.use(express.json());

//typeorm
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch(() => {
    console.log("fail");
  });

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

//회원가입, 사용자 생성, 로그인, 포스트 작성, 포스트 목록 보기, 포스트 수정하기

app.post("/signup", (req, res) => {
  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공메시지 반환
  const { email, nickname, password } = req.body;
  const queryRes = myDataSource.query(
    `
    INSERT INTO users (email, nickname, password)
    VALUES (?, ?, ?)
  `,
    [email, nickname, password]
  );
  queryRes
    .then(() => {
      res.status(201).json({ massage: "user created" });
    })
    .catch((err) => {
      res.status(500).json({
        massage: "user create failed", //err
      });
    });
});

app.post("/createpost", (req, res) => {
  const { title, user_id, contents } = req.body.data;
  const queryRes = myDataSource.query(
    `
    INSERT INTO postings (title, user_id, contents)
    VALUES (?, ?, ?)
  `,
    [title, user_id, contents]
  );
  queryRes
    .then(() => {
      res.status(201).json({ massage: "post created" });
    })
    .catch((err) => {
      res.status(500).json({ massage: "post create failed", err });
    });
});

//////////////////////////////////////////////

app.get("/postlist", async (req, res) => {
  //포스트 전체 리스트를 유저 정보와 함께 반환
  const queryRes = await myDataSource.query("SELECT * FROM postings");
  const queryResusers = await myDataSource.query("SELECT * FROM users");
  let newPosts = queryRes;
  newPosts = newPosts.map((data) => {
    const user = queryResusers.find((user) => user.id === data.user_id);
    return { ...data, userName: user.nickname };
  });
  res.json({ data: newPosts });
});

// app.patch("/editpost", (req, res) => {
//   //기존 포스트의 아이디와 일부 정보를 받아와서 해당 아이디의 포스트를 수정하고, 수정된 내용을 유저 정보와 함께 반환
//   const newPost = req.body.data;
//   const post = posts.find((req) => req.id === newPost.id);
//   for (let key in newPost) {
//     post[key] = newPost[key];
//   }
//   const user = users.find((req) => req.id === post.userId);
//   const newData = {
//     id: post.id,
//     title: post.title,
//     content: post.content,
//     userId: post.userId,
//     userName: user.name,
//   };
//   res.json({ data: newData });
// });

// app.delete("/deletepost", (req, res) => {
//   //기존 포스트의 아이디를 받아서 해당 포스트를 배열에서 삭제하고 삭제 코멘트 반환
//   const deleteInfo = req.body.data;
//   const postId = posts.findIndex((req) => req.id === deleteInfo.id);
//   posts.splice(postId, 1);
//   res.json({ message: "posting deleted" });
// }); //배열 요소를 filter로 찾기도 함

// app.post("/userpostlist", (req, res) => {
//   const targetUser = req.body.data;
//   const user = users.find((req) => req.id === targetUser.userId);
//   let userAndPosts = {
//     userId: user.id,
//     userName: user.name,
//     postings: [],
//   };

//   console.log(userAndPosts);

//   for (let i = 0; i < posts.length; i++) {
//     if (posts[i].userId === targetUser.userId) {
//       let pushPost = {
//         postingId: posts[i].id,
//         postingTitle: posts[i].title,
//         postingContent: posts[i].content,
//       };

//       userAndPosts.postings.push(pushPost);
//     }
//   }
//   console.log(userAndPosts);

//   res.json({ data: userAndPosts });
// });

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});

//try catch 구문
// try {
//   if ("예외설정된 상황이 발생하면") {
//     const error = new Error("발생한 예외 상황");
//     error.statusCode = "err code";
//     throw error;
//   }
// } catch (err) {
//   res.status("err code").json;
// }
