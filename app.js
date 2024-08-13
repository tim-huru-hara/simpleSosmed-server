const express = require('express');
const app = express();
const cors = require('cors');
const errorsHandler = require('./middlewares/errorsHandler');
const { hashPassword } = require("./utils/bcrypt");
const { User } = require("./models");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next) => res.send('Home'));

app.post("/register", async (req, res, next) => {
    try {
        let { email, name, password } = req.body
        if (!email) {
            throw { name: "NoEmail" }
        }
        if (!password) {
            throw { name: "NoPassword" }
        }

        const user = await User.create({ email, name, password: hashPassword(password) });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email
        })
    } catch (err) {
        next(err)
    }
});

// test errorHandler
app.get('/heino', (req, res, next) => {
    try {
        res.send('fail')
    } catch (error) {
        next(error)
    }
})

app.use(errorsHandler)
module.exports = app;