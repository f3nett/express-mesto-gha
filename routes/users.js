const usersRoutes = require('express').Router();
const {
  getUserValidation, patchUserValidation, patchAvatarValidation,
} = require('../validation/users');
const {
  getUser, getCurrentUser, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUser);
usersRoutes.get('/me', getCurrentUser);
usersRoutes.get('/:userId', getUserValidation, getUserById);

usersRoutes.patch('/me', patchUserValidation, updateUser);
usersRoutes.patch('/me/avatar', patchAvatarValidation, updateUserAvatar);

module.exports = usersRoutes;
