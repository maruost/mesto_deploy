/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const NotFoundError = require('../middlewares/errors/not-found-error');
const AuthErorr = require('../middlewares/errors/authorization-error');

module.exports.showAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Запрашиваемой карточки не существует');
    })
    .then((card) => {
      if (!(String(card.owner) === req.user._id)) {
        throw new AuthErorr('Недостаточно прав для совершения данного действия');
      }
      card.remove();
      return res.send({ data: card });
    })
    .catch(next);
};
