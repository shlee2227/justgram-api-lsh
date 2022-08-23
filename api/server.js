//const cors = require("cors");
//const morgan = require("morgan");
//const { title } = require("process");

const http = require("http");
require("dotenv").config();
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createApp } = require("./app");

dotenv.config(); //위에 require이랑 무슨 차이?

const server = http.createServer(createApp());
server.listen(8000, () => {
  console.log("server is listening on port 8000");
});
