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

app.use(errorsHandler)
module.exports = app;