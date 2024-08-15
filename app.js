if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const errorsHandler = require("./middlewares/errorsHandler");
const { postPost, getPosts } = require("./controllers/postController");
const {
  getInfo,
  EditProfile,
  register,
  login,
} = require("./controllers/userController");
const authentication = require("./middlewares/authentication");
const { addLike } = require("./controllers/likeController");
const { addComment } = require("./controllers/commentsController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.post("/post", authentication, postPost);
app.get("/post", getPosts);
app.get("/userInfo", authentication, getInfo);
app.post("/likes/:id", authentication, addLike);
app.post("/comments/:id", authentication, addComment);
app.put("/user/edit", authentication, EditProfile);

app.use(errorsHandler);
module.exports = app;
