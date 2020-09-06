const usersRouter = require('express').Router();

const { showAllUsers, showUser } = require('../controllers/users');

usersRouter.get('/', showAllUsers);
usersRouter.get('/:id', showUser);

module.exports = usersRouter;
