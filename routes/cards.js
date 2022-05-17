const cardsRoutes = require('express').Router();
const { postCardValidation, cardIdValidation } = require('../validation/cards');
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.get('/', getCard);
cardsRoutes.post('/', postCardValidation, createCard);
cardsRoutes.delete('/:cardId', cardIdValidation, deleteCard);

cardsRoutes.put('/:cardId/likes', cardIdValidation, likeCard);
cardsRoutes.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = cardsRoutes;
