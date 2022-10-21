const User = require('../models/user');
const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_SERVER_ERROR,
} = require('../errors/errors-code');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;
  User
    .create({
      name, about, avatar,
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: `Произошла! ошибка ${err}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const {
    name, about,
  } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные id' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: `${err}Внутренняя ошибка сервера` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные id' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};
