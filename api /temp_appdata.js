const e = require("express");

const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

//함수
const signup = (req, res) => {
  //유저 정보 받아와서 유저 배열에 추가하고 성공시 성공메시지 반환
  const { id, name, email, password } = req.body.data;
  users.push({
    id,
    name,
    email,
    password,
  });
  res.json("회원가입 완료");
};

const login = (req, res) => {
  //로그인 성공 메시지 반환
  res.json("로그인 완료");
};

const createPost = (req, res) => {
  //포스트 정보 받아와서 포스트 배열에 추가하고 성공시 포스트 내용을 유저 정보와 함께 반환
  const { id, title, content, userId } = req.body.data;
  posts.push({
    id,
    title,
    content,
    userId,
  });
  res.json("post created");
};

const postList = (req, res) => {
  //포스트 전체 리스트를 유저 정보와 함께 반환
  let newPosts = posts;
  newPosts = newPosts.map((data) => {
    const user = users.find((user) => user.id === data.userId);
    return { ...data, userName: user.name };
  });
  res.json({ data: newPosts });
};

const editPost = (req, res) => {
  //기존 포스트의 아이디와 일부 정보를 받아와서 해당 아이디의 포스트를 수정하고, 수정된 내용을 유저 정보와 함께 반환
  const newPost = req.body.data;
  const post = posts.find((req) => req.id === newPost.id);
  for (let key in newPost) {
    post[key] = newPost[key];
  }
  const user = users.find((req) => req.id === post.userId);
  const newData = {
    id: post.id,
    title: post.title,
    content: post.content,
    userId: post.userId,
    userName: user.name,
  };
  res.json({ data: newData });
};

const deletePost = (req, res) => {
  //기존 포스트의 아이디를 받아서 해당 포스트를 배열에서 삭제하고 삭제 코멘트 반환
  const deleteInfo = req.body.data;
  const postId = posts.findIndex((req) => req.id === deleteInfo.id);
  posts.splice(postId, 1);
  res.json({ message: "posting deleted" });
}; //배열 요소를 filter로 찾기도 함

const userPostList = (req, res) => {
  const targetUser = req.body.data;
  const user = users.find((req) => req.id === targetUser.userId);
  let userAndPosts = {
    userId: user.id,
    userName: user.name,
    postings: [],
  };

  console.log(userAndPosts);

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].userId === targetUser.userId) {
      let pushPost = {
        postingId: posts[i].id,
        postingTitle: posts[i].title,
        postingContent: posts[i].content,
      };

      userAndPosts.postings.push(pushPost);
    }
  }
  console.log(userAndPosts);

  res.json({ data: userAndPosts });
};

module.exports = {
  signup,
  login,
  createPost,
  postList,
  editPost,
  deletePost,
  userPostList,
};
