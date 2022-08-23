const { DataSource, Column } = require("typeorm");

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

//dao는 어떤 데이터를 어떻게 처리하는지를 기준으로 이름을 정함

const createUser = async (email, nickname, hashedPw) => {
  console.log("D1");

  const user = await myDataSource.query(
    `
  INSERT INTO users (email, nickname, password)
  VALUES (?, ?, ?)
`,
    [email, nickname, hashedPw]
  );
  console.log("D2", user);
  return user;
};

const findUserByEmail = async (email) => {
  console.log("3-1");
  const user = await myDataSource.query(
    `
SELECT 
id, password FROM users WHERE email = ?
`,
    [email]
  );
  console.log("3-2");
  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
};
