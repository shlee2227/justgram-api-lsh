const express = require("express");
const router = require("./routers");
const createApp = () => {
  const app = express();

  //app.use(cors()); //최상단에  작성(const app 바로 아래)
  // app.use(morgan("combined"));

  app.use(express.json());
  app.use(router);

  // app.get("/ping", function (req, res, next) {
  //   res.json({ message: "pong" });
  // });

  return app;
};

module.exports = { createApp };
