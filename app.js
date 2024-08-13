require('dotenv').config()

const express = require('express');
const app = express();
const cors = require('cors');
const errorsHandler = require('./middlewares/errorsHandler');
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const { User } = require("./models");
const { signToken, verifyToken } = require("./utils/jwt");
const { postPost, getPosts } = require('./controllers/postController');
const { getInfo } = require('./controllers/userController');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next) => res.send('Home'));

app.post("/register", async (req, res, next) => {
    try {
        let { email, username, password } = req.body
        if (!email) {
            throw { name: "NoEmail" }
        }
        if (!password) {
            throw { name: "NoPassword" }
        }

        const user = await User.create({ email, username, password: hashPassword(password) });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email
        })
    } catch (err) {
        next(err)
    }
});

app.post("/login", async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email) {
            throw { name: "NoEmail" }
        }
        if (!password) {
            throw { name: "NoPassword" }
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw { name: "Invalid email/password" }
        }

        const checkPass = comparePassword(password, user.password)
        if (!checkPass) {
            throw { name: "Invalid email/password" }
        }

        const token = signToken({
            id: user.id
        })
        res.status(200).json({
            access_token: token
        })
    } catch (err) {
        next(err)
    }
});

// rofiq
app.post('/post', auth, postPost)
app.get('/post', getPosts)
app.get('/userInfo', auth, getInfo)

// test errorHandler
app.get('/heino', (req, res, next) => {
    try {
        res.send('fail')
    } catch (error) {
        next(error)
    }
})

// auth function
async function auth(req, res, next) {
    try {
        const access_token = req.headers.authorization
        if (!access_token) throw { name: "InvalidToken" };

        const [type, token] = access_token.split(' ');
        if (type !== `Bearer`) throw { name: `InvalidToken` }

        const payload = verifyToken(token)

        const user = await User.findByPk(payload.id)
        if (!user) throw { name: `InvalidToken` }

        req.user = {
            id: user.id
        }

        next()
    } catch (error) {
        next(error)
    }
}

//authentication --Febri
app.use(auth)


// edit user --Febri
app.put('/user/edit', async (req, res, next) => {
    try {
        const { id } = req.user;

        const { username, password, bio, imageUrl } = req.body;
        if (!username) throw { name: "EmptyUsername" }
        if (!password) throw { name: "EmptyPassword" }
        if (!bio) throw { name: "EmptyBio" }
        if (!imageUrl) throw { name: "EmptyImageUrl" }

        const user = await User.findByPk(id)
        if (!user) throw { name: "UserNotFound" }

        const editUser = await user.update({ username, password: hashPassword(password), bio, imageUrl })

        res.status(201).json({ message: "User update success" })
    } catch (error) {
        next(error)
    }
})

app.use(errorsHandler)
module.exports = app;