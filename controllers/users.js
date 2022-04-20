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
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не найден` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ message: `Создан пользователь ${user._id}` }))
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
    .then(() => {
      if (!name && !about) {
        return res.send({ message: 'Нет изменений в информации о пользователе' });
      }
      return res.send({ message: `Информация о пользователе обновлена: ${name}, ${about}` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не найден` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => {
      if (!avatar) {
        return res.send({ message: 'Нет изменений в изображении аватара' });
      }
      return res.send({ message: `Аватар обновлен: ${avatar}` });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Пользователь ${req.params.userId} не найден` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};
