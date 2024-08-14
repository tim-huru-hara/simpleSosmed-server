require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const errorsHandler = require("./middlewares/errorsHandler");
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const { User } = require("./models");
const { signToken, verifyToken } = require("./utils/jwt");
const { postPost, getPosts } = require("./controllers/postController");
const { getInfo, EditProfile } = require("./controllers/userController");
const authentication = require("./middlewares/authentication");
const { addLike } = require("./controllers/likeController");
const { addComment } = require("./controllers/commentsController");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res, next) => res.send("Home"));

app.post("/register", async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    if (!email) {
      throw { name: "NoEmail" };
    }
    if (!password) {
      throw { name: "NoPassword" };
    }

    const user = await User.create({
      email,
      username,
      password: hashPassword(password),
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email) {
      throw { name: "NoEmail" };
    }
    if (!password) {
      throw { name: "NoPassword" };
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { name: "Invalid email/password" };
    }

    const checkPass = comparePassword(password, user.password);
    if (!checkPass) {
      throw { name: "Invalid email/password" };
    }

    const token = signToken({
      id: user.id,
    });
    res.status(200).json({
      access_token: token,
    });
  } catch (err) {
    next(err);
  }
});

// rofiq
app.post("/post", authentication, postPost);
app.get("/post", getPosts);
app.get("/userInfo", authentication, getInfo);
app.post("/likes/:id", authentication, addLike);
app.post("/comments/:id", authentication, addComment);

// test errorHandler
app.get("/heino", (req, res, next) => {
  try {
    res.send("fail");
  } catch (error) {
    next(error);
  }
});

app.put("/user/edit", authentication, EditProfile);

app.use(errorsHandler);
module.exports = app;
