const http = require("http");
require("dotenv").config();
const { DataSource, Column } = require("typeorm");
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

//////////////////////////////////////////////

app.patch("/editpost", async (req, res) => {
  //기존 포스트의 아이디와 일부 정보를 받아와서 해당 아이디의 포스트를 수정하고, 수정된 내용을 유저 정보와 함께 반환
  const postId = req.body.data.id;
  console.log(newPost);
  // for (let key in newPost) {
  //   if (key === "id") {
  //   } else {
  //     const col = eval(key);
  //     await myDataSource.query(
  //       `
  //     UPDATE postings
  //     SET ? = ?
  //     WHERE id = ?`,
  //       [col, newPost[key], postId]
  //     );
  //   }
  // }             db 수정을 못하고있음

  const queryRes = await myDataSource.query("SELECT * FROM postings");
  const post = queryRes.find((req) => req.id === newPost.id);
  const queryResusers = await myDataSource.query("SELECT * FROM users");
  const user = queryResusers.find((user) => user.id === post.user_id);

  const newData = {
    id: post.id,
    title: post.title,
    content: post.contents,
    userd: post.user_id,
    userName: user.nickname,
  };
  res.json({ data: newData });
});

app.delete("/deletepost", async (req, res) => {
  //기존 포스트의 아이디를 받아서 해당 포스트를 배열에서 삭제하고 삭제 코멘트 반환
  const deleteInfo = req.body.data.id;
  await myDataSource.query("DELETE FROM postings WHERE id = ?", [deleteInfo]);
  res.json({ message: "posting deleted" });
});

app.post("/userpostlist", async (req, res) => {
  const targetUserId = req.body.data.userId;
  const user = await myDataSource.query("SELECT * FROM users WHERE Id = ?", [
    targetUserId,
  ]);
  const post = await myDataSource.query(
    "SELECT * FROM postings WHERE user_id = ?",
    [targetUserId]
  );

  console.log(user);
  let userAndPosts = {
    userId: user[0].id,
    userName: user[0].nickname,
    postings: [],
  };

  for (let i = 0; i < post.length; i++) {
    let pushPost = {
      postingId: post[i].id,
      postingTitle: post[i].title,
      postingContent: post[i].contents,
    };
    userAndPosts.postings.push(pushPost);
  }

  res.json({ data: userAndPosts });
});

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
