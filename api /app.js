const http = require("http");
require("dotenv").config();
const { DataSource, Column } = require("typeorm");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
app.use(cors()); //최상단에  작성(const app 바로 아래)
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
    console.log("Date source initializing fail");
  });

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

//회원가입, 사용자 생성, 로그인, 포스트 작성, 포스트 목록 보기, 포스트 수정하기

app.post("/signup", (req, res) => {
  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공
  const hasKey = { email: false, nickname: false, password: false };
  const requireKey = Object.keys(hasKey);
  Object.entries(req.body.data).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });
  const hasKeyArray = Object.entries(hasKey); //여기서  for each 쓰면 전체 함수에 영향을 주지 못하므로 변수 선언해서 for 문을 돌림f
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `please enter ${key}` });
      return;
    }
  }

  try {
    const { email, nickname, password } = req.body.data;
    myDataSource.query(
      `
    INSERT INTO users (email, nickname, password)
    VALUES (?, ?, ?)
  `,
      [email, nickname, password]
    );
    res.status(201).json({ massage: "user created" });
  } catch (err) {
    res.status(500).json({
      massage: "user create failed",
    });
    console.log(err);
  }
});

app.post("/createpost", (req, res) => {
  const hasKey = { title: false, user_id: false, contents: false };
  const requireKey = Object.keys(hasKey);

  Object.entries(req.body.data).forEach((keyValue) => {
    const [key, value] = keyValue;
    if (requireKey.includes(key) && value) {
      hasKey[key] = true;
    }
  });
  const hasKeyArray = Object.entries(hasKey); //여기서  for each 쓰면 전체 함수에 영향을 주지 못하므로 변수 선언해서 for 문을 돌림f
  for (let i = 0; i < hasKeyArray.length; i++) {
    const [key, value] = hasKeyArray[i];
    if (!value) {
      res.status(400).json({ message: `please enter ${key}` });
      return;
    }
  }

  try {
    const { title, user_id, contents } = req.body.data;
    const queryRes = myDataSource.query(
      `
    INSERT INTO postings (title, user_id, contents)
    VALUES (?, ?, ?)
  `,
      [title, user_id, contents]
    );
    res.status(201).json({ massage: "post created" });
  } catch (err) {
    res.status(500).json({ massage: "post create failed" });
    console.log(err);
  }
});

app.get("/postlist", async (req, res) => {
  //포스트 전체 리스트를 유저 정보와 함께 반환
  try {
    const post = await myDataSource.query("SELECT * FROM postings");
    const users = await myDataSource.query("SELECT * FROM users");
    let queryRes = post;
    queryRes = queryRes.map((data) => {
      const user = users.find((user) => user.id === data.user_id);
      return { ...data, userName: user.nickname };
    });
    res.status(201).json({ data: queryRes });
  } catch (err) {
    res.status(500).json({ massage: "post loading fail" });
    console.log(err);
  }
});

//////////////////////////////////////////////

app.patch("/editpost", async (req, res) => {
  //기존 포스트의 아이디와 일부 정보를 받아와서 해당 아이디의 포스트를 수정하고, 수정된 내용을 유저 정보와 함께 반환
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

  try {
    const newPost = req.body.data;
    for (let key in newPost) {
      if (key === "id") {
      } else {
        await myDataSource.query(
          `
        UPDATE postings
        SET ? = ?
        WHERE id = ?`,
          [key, newPost[key], newPost.id] //<--오류 나는 부분 contents 가 아니라 'contents'로 들어가는게 문제인것 처럼 보임
        );
      }
    } //db 수정을 못하고있음

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

    res.status(201).json({ data: newData });
  } catch (err) {
    res.status(500).json({ massage: "post editing fail" });
    console.log(err);
  }
});

app.delete("/deletepost", async (req, res) => {
  //기존 포스트의 아이디를 받아서 해당 포스트를 배열에서 삭제하고 삭제 코멘트 반환/커스텀 에러 (해당 정보가 없을 경우 추가)
  const targetPostId = req.body.data.id;
  if (!targetPostId) {
    res.status(400).json({ message: "please enter post id" });
    return;
  }
  try {
    const deleteInfo = req.body.data.id;
    await myDataSource.query("DELETE FROM postings WHERE id = ?", [deleteInfo]);
    res.status(201).json({ message: "posting deleted" });
  } catch (err) {
    res.status(500).json({ massage: "post editing fail" });
    console.log(err);
  }
});

app.post("/userpostlist", async (req, res) => {
  //요청한 유저의 전체 포스팅 목록을 형식에 맞게 출력함
  const targetUserId = req.body.data.userId;
  if (!targetUserId) {
    res.status(400).json({ message: "please enter user id" });
    return;
  }
  try {
    const user = await myDataSource.query("SELECT * FROM users WHERE Id = ?", [
      targetUserId,
    ]);
    const post = await myDataSource.query(
      "SELECT * FROM postings WHERE user_id = ?",
      [targetUserId]
    );

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
    res.status(201).json({ data: userAndPosts });
  } catch (err) {
    res.status(500).json({ massage: "user post loading fail" });
    console.log(err);
  }
});

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
