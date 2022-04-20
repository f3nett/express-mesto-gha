const Card = require('../models/card');

const DEFAULT_ERROR_CODE = 500;
const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERR_CODE = 404;

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate('likes', { name: 1, about: 1, avatar: 1 })
    .populate('owner', { name: 1, about: 1, avatar: 1 })
    .then((cards) => {
      const cardsResult = cards.map((card) => ({
        likes: card.likes,
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        createdAt: card.createdAt,
      }));
      res.send(cardsResult);
    })
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ message: `Создана карточка ${card._id}` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: `Удалена карточка ${req.params.cardId}` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Карта ${req.params.cardId} не найдена` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.send({ message: `Лайк карточки ${card._id}` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Карта ${req.params.cardId} не найдена` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.send({ message: `Дизлайк карточки ${card._id}` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(NOT_FOUND_ERR_CODE).send({ message: `Карта ${req.params.cardId} не найдена` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: `Ошибка - ${err}` });
    });
};
