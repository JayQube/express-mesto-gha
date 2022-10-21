const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  ERR_NOT_FOUND,
} = require('./errors/errors-code');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '635063ee24ae8983108a13dd',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Запрос на не существующий роут' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
