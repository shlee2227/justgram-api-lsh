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

const signup = (req, res) => {
  console.log("name, email, password");

  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공메시지 반환
  const { name, email, password } = req.body;
  const queryRes = myDataSource.query(
    `
    INSERT INTO person (name, email,  password)
    VALUES (?, ?, ?)
  `,
    [name, email, password]
  );
  queryRes
    .then(() => {
      res.status(201).json({ massage: "user created" });
    })
    .catch(() => {
      res.status(500).json({ massage: "user create failed" });
    });
};

app.post("/signup", (req, res) => {
  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공메시지 반환
  const { name, email, password } = req.body;
  const queryRes = myDataSource.query(
    `
    INSERT INTO person (name, email,  password)
    VALUES (?, ?, ?)
  `,
    [name, email, password]
  );
  queryRes
    .then(() => {
      res.status(201).json({ massage: "user created" });
    })
    .catch(() => {
      res.status(500).json({ massage: "user create failed" });
    });
});

// app.post("/login", login);
// app.post("/createpost", createPost);
// app.get("/postlist", postList);
// app.patch("/editpost", editPost);
// app.delete("/deletepost", deletePost);
// app.post("/userpostlist", userPostList);

app.listen(8000, function () {
  console.log("server listening on port 8000");
});
