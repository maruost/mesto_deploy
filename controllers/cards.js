/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

module.exports.showAllCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name.includes('ValidationError')) {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => res.status(404).send({ message: 'Запрашиваемой карточки не существует' }))
    .then((card) => {
      if (!(String(card.owner) === req.user._id)) {
        return res.status(403).send({ message: 'Недостаточно прав для совершения данного действия' });
      }
      card.remove();
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name.includes('CastError')) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(500).send({ message: err.name });
    });
};
