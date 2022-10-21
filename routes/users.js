const usersRouter = require('express').Router();
const rateLimit = require('express-rate-limit');

const {
  createUser, getUsers, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Вы отправляете слишком много запросов. Подождите немного и попробуйте снова.',
  standardHeaders: true,
  legacyHeaders: false,
});

usersRouter.use('/', limiter);

usersRouter.post('/users', createUser);
usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
