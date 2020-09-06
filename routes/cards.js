const cardsRouter = require('express').Router();

const { showAllCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', showAllCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);

module.exports = cardsRouter;
