const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
}), getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}\b([-a-zA-Z0-9/]*)/),
  }),
}), updateAvatar);

module.exports = userRouter;
