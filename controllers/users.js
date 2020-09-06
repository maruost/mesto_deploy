/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.showAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.showUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => res.status(404).send({ message: 'Нет пользователя с таким id' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name.includes('CastError')) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (password && password.length >= 8 && password.match(/^[ ]{1,}$/) === null) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => res.status(201).send({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      }))
      .catch((err) => {
        if (err.name.includes('ValidationError')) {
          return res.status(400).send({ message: 'Ошибка валидации' });
        }
        if (err.name.includes('MongoError')) {
          return res.status(409).send({ message: 'Пользователь с такой почтой уже существует' });
        }
        return res.status(500).send({ message: err.code });
      });
  } else {
    res.status(400).send({ message: 'Неправильный формат пароля' });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      if (err.message.includes('Неправильные почта или пароль')) {
        return res.status(401).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
