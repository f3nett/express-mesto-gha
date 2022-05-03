const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/constants');
const { getJwtToken } = require('../utils/jwt');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((users) => {
      const usersResult = users.map((user) => ({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      }));
      res.send(usersResult);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).orFail(() => {
    throw new Error('NotFound');
  })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(() => {
    throw new Error('NotFound');
  })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректный идентификатор пользователя');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => res.send({
      _id: user._id, name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.code === 11000) {
        throw new ConflictError('Такой пользователь уже существует');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new Error('NotFound');
  })
    .then((user) => {
      if (!name && !about) {
        throw new ValidationError('Не указаны атрибуты для обновления');
      }
      return res.send({ _id: user._id, name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail(() => {
    throw new Error('NotFound');
  })
    .then((user) => {
      if (!avatar) {
        throw new ValidationError('Не указан аватар для обновления');
      }
      return res.send({ _id: user._id, avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = getJwtToken(user._id);
      res.send({ token });
    })
    .catch(next);
};
