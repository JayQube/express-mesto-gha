const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;
  Card
    .create({
      name, link, owner: req.user._id,
    })
    .then((card) => res.send(card))
    .catch(next);
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
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((chosenСard) => {
            res.send(chosenСard);
          });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((id) => {
    if (!id) {
      throw new NotFoundError('Карточка с таким id не найдена.');
    }
    res.send(id);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((id) => {
    if (!id) {
      throw new NotFoundError('Карточка с таким id не найдена.');
    }
    res.send(id);
  })
  .catch(next);
