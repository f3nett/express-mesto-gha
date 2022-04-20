const User = require('../models/user');

const DEFAULT_ERROR_CODE = 500;
const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERR_CODE = 404;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      const usersResult = users.map((user) => ({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      }));
      res.send(usersResult);
    })
    .catch((err) => res.status(500).send({ message: `Ошибка - ${err}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      else if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не существует` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      else if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не существует` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не существует` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};
