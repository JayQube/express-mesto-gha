const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_SERVER_ERROR,
} = require('../errors/errors-code');

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  Card
    .create({
      name, link, owner: req.user._id,
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.deleteCard = (req, res) => {
  Card
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
        return;
      }
      res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((id) => {
    if (!id) {
      res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.send(id);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(ERR_BAD_REQUEST).send({ message: '1Переданы некорректные данные для постановки лайка.' });
      return;
    }
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: '2Переданы некорректные данные для постановки лайка.' });
      return;
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  });

module.exports.dislikeCard = (req, res) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((id) => {
    if (!id) {
      res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    res.send(id);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      return;
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  });
