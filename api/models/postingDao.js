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

const createPost = async (title, user_id, contents) => {
  const isPostCreated = myDataSource.query(
    `
  INSERT INTO postings (title, user_id, contents)
  VALUES (?, ?, ?)
`,
    [title, user_id, contents]
  );
  console.log(isPostCreated);
  return isPostCreated;
};

const getPostList = async () => {
  const post = await myDataSource.query(`SELECT
   postings.id as id, 
   users.id as user_id,
   users.nickname as user_name,
   postings.title as title,
   postings.contents as contents,
   postings.created_at as created_at
   FROM justgram.postings JOIN justgram.users ON users.id  = postings.user_id`);
  return post;
};

const getPostListByUserId = async (userId) => {
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
    [userId]
  );
  return userPosts;
};

const updatePost = async (id, contents) => {
  return await myDataSource.query(
    `
      UPDATE postings
      SET contents = ?
      WHERE id = ?`,
    [contents, id]
  );
};

const getPost = async (id) => {
  const post = await myDataSource.query(
    `SELECT 
    postings.id as id, 
    users.id as user_id,
    users.nickname as user_name,
    postings.title as title,
    postings.contents as contents
   FROM justgram.postings JOIN justgram.users
   ON users.id = postings.user_id
   WHERE postings.id = ?`,
    [id]
  );
  return post;
};

const deletePost = async (id) => {
  const isDeleted =
    (await myDataSource.query(`DELETE FROM comments WHERE posting_id = ?`, [
      id,
    ]),
    await myDataSource.query(`DELETE FROM postings WHERE id = ?`, [id]));
  return isDeleted;
};

module.exports = {
  createPost,
  getPostList,
  getPostListByUserId,
  updatePost,
  getPost,
  deletePost,
};
