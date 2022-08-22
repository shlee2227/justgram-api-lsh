const http = require("http");
require("dotenv").config();
const { DataSource, Column } = require("typeorm");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { title } = require("process");

app.use(cors()); //최상단에  작성(const app 바로 아래)
dotenv.config();
app.use(morgan("combined"));
app.use(express.json());

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
app.post("/login", async (req, res) => {
  const { email, password } = req.body.data;

  //required key 입력 여부 확인
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
  //email validation (@ . 있는지)
  // const isVaildEmail =
  //email이 데이터에 있느지 확인
  const [user] = await myDataSource.query(
    `
SELECT 
id, password FROM users WHERE email = ?
`,
    [email]
  );
  if (!user) {
    res.status(400).json({ message: `No user in DB` });
    return;
  }

  //email이 있으면 입력값에 따른 user db 불러오고 사용자가 넣은 비밀번호를 암호화해서 저장된 패스워드와 비교
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ message: "invalid password" });
  }
  const token = jwt.sign({ userId: user.id }, "secretKey");
  res.status(200).json({ message: "login success", token: token });
});

app.post("/signup", async (req, res) => {
  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공
  //required key 입력 여부 확인
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
  const { email, nickname, password } = req.body.data;

  //pw 암호화
  //이건 공홈에서 받아온 코드... 아직 안써봄
  // bcrypt.genSalt(10, function (err, salt) {
  //   bcrypt.hash("password", salt, function (err, hash) {
  //     //암호화된 비밀번호를 db에 저장하는 코드 입력
  //   });
  // });
  const salt = bcrypt.genSaltSync(12);
  const hashedPw = bcrypt.hashSync(password, salt);

  //data db에 입력
  try {
    await myDataSource.query(
      `
    INSERT INTO users (email, nickname, password)
    VALUES (?, ?, ?)
  `,
      [email, nickname, hashedPw]
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
    const postingData = await myDataSource.query(`SELECT
     postings.id as id, 
     users.id as user_id,
     users.nickname as user_name,
     postings.title as title,
     postings.contents as contents,
     postings.created_at as created_at
     FROM justgram.postings JOIN justgram.users ON users.id  = postings.user_id`);
    res.status(201).json({ data: postingData });
  } catch (err) {
    res.status(500).json({ massage: "post loading fail" });
    console.log(err);
  }
});

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
    //for (let key in newPost) {} 객체 내에서 있는 키만 받아서 수정하도록 하고싶은데 잘 안됨 -> key 값을 변수로 입력할때 'key'형태로 들어감
    await myDataSource.query(
      `
        UPDATE postings
        SET contents = ?
        WHERE id = ?`,
      [newPost.contents, newPost.id]
    );

    const editedData = await myDataSource.query(
      `SELECT 
      postings.id as id, 
      users.id as user_id,
      users.nickname as user_name,
      postings.title as title,
      postings.contents as contents
     FROM justgram.postings JOIN justgram.users
     ON users.id = postings.user_id
     WHERE postings.id = ?`,
      [newPost.id]
    );
    res.status(201).json({ data: editedData });
  } catch (err) {
    res.status(500).json({ massage: "post editing fail" });
    console.log(err);
  }
});

app.delete("/deletepost", async (req, res) => {
  const targetPostId = req.body.data.id;
  if (!targetPostId) {
    res.status(400).json({ message: "please enter post id" });
    return;
  }
  try {
    const deleteInfo = req.body.data.id;
    await myDataSource.query(`DELETE FROM comments WHERE posting_id = ?`, [
      deleteInfo,
    ]);
    await myDataSource.query(`DELETE FROM postings WHERE id = ?`, [deleteInfo]);
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
    const userPosts = await myDataSource.query(
      `SELECT 
      postings.id as id, 
      users.id as user_id,
      users.nickname as user_name,
      postings.title as title,
      postings.contents as contents,
      postings.created_at as created_at
      FROM justgram.users JOIN justgram.postings
      ON users.id = postings.user_id
      WHERE users.id = ?`,
      [targetUserId]
    );

    res.status(201).json({ data: userPosts });
  } catch (err) {
    res.status(500).json({ massage: "user post loading fail" });
    console.log(err);
  }
});

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
