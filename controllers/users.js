const User = require('../models/user');
const { DEFAULT_ERROR_CODE, VALIDATION_ERROR_CODE, NOT_FOUND_ERR_CODE } = require('../lib/constants');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      const usersResult = users.map((user) => ({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      }));
      res.send(usersResult);
    })
    .catch((err) => res.status(500).send({ message: `Ошибка - ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(() => {
    throw new Error('NotFound');
  })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректный идентификатор пользователя' });
      }
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: 'Пользователь не найден' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err.message}` });
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
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err.message}` });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!name && !about) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не указаны атрибуты для обновления' });
      }
      return res.send({ _id: user._id, name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err.message}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!avatar) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не указан аватар для обновления' });
      }
      return res.send({ _id: user._id, avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err.message}` });
    });
};
