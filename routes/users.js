const usersRoutes = require('express').Router();
const {
  getUser, getUserById, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUser);
usersRoutes.get('/:userId', getUserById);
usersRoutes.post('/', createUser);
usersRoutes.patch('/me', updateUser);
usersRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = usersRoutes;
