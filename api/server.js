const http = require("http");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { DataSource, Column } = require("typeorm");
const { title } = require("process");
const { createApp } = require("./app");

app.use(cors()); //최상단에  작성(const app 바로 아래)
dotenv.config();
app.use(morgan("combined"));
app.use(express.json());
app.use(router);

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
