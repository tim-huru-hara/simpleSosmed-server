const express = require('express');
const app = express();
const cors = require('cors');
const errorsHandler = require('./middlewares/errorsHandler');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next) => res.send('Home'));

// test errorHandler
app.get('/heino', (req, res, next) => {
    try {
        res.snd('fail')
    } catch (error) {
        next(error)
    }
})

// edit user --Febri
const { User } = require('./models/index');
const { hashPassword } = require('./utils/bcrypt');
app.put('/user/edit', async (req, res, next) => {
    try {
        const { id } = req.user;

        const { username, password, bio, imageUrl } = req.body;
        if(!username) throw { name: "EmptyUsername" }
        if(!password) throw { name: "EmptyPassword" }
        if(!bio) throw { name: "EmptyBio" }
        if(!imageUrl) throw { name: "EmptyImageUrl" }

        const user = await User.findByPk(id)
        if(!user) throw { name: "UserNotFound" }

        const editUser = await user.update({ username, password: hashPassword(password), bio, imageUrl })

        res.send(201).json({ message: "User update success"})
        next()
    } catch (error) {
        next(error)
    }
})

app.use(errorsHandler)
module.exports = app;