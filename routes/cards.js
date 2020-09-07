const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkValidator = require('../helpers/linkValidator');
const { showAllCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', showAllCards);

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(linkValidator),
  }),
}), createCard);

cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

module.exports = cardsRouter;
