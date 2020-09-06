const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { showAllUsers, showUser } = require('../controllers/users');

usersRouter.get('/', showAllUsers);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24),
  }),
}), showUser);

module.exports = usersRouter;
