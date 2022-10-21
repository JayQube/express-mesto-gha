const cardsRouter = require('express').Router();
const rateLimit = require('express-rate-limit');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Вы отправляете слишком много запросов. Подождите немного и попробуйте снова.',
  standardHeaders: true,
  legacyHeaders: false,
});

cardsRouter.use('/', limiter);

cardsRouter.post('/cards', createCard);
cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
