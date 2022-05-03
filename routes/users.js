const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getCurrentUser, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUser);
usersRoutes.get('/me', getCurrentUser);

usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = usersRoutes;
