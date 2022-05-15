const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCard = (req, res, next) => {
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
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail(() => {
    throw new Error('NotFound');
  })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Error('Forbidden');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: `Удалена карточка ${req.params.cardId}` }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректный идентификатор карточки');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка не найдена');
      }
      if (err.message === 'Forbidden') {
        throw new ForbiddenError('Карточка не принадлежит пользователю');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    throw new Error('NotFound');
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректный идентификатор карточки');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    throw new Error('NotFound');
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректный идентификатор карточки');
      }
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};
