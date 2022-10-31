const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-reques-err');

module.exports.createCard = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((chosenСard) => {
          res.send(chosenСard);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким id не найдена.');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким id не найдена.');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
    } else {
      next(err);
    }
  });
