const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      return;
    }

    User.create({ name, about, avatar, email, password: hashedPassword })
      .then((user) => {
        res.status(201).send(user);
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
        } else {
          res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
        }
      });
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Пользователь не найден') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(() => {
      throw new Error('Неправильные почта или пароль');
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
          return;
        }

        if (!isMatch) {
          res.status(ERROR_BAD_REQUEST).send({ message: 'Неправильные почта или пароль' });
          return;
        }

        const token = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '7d' });

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }).send({ message: 'Успешный вход' });
      });
    })
    .catch((error) => {
      if (error.message === 'Неправильные почта или пароль') {
        res.status(ERROR_BAD_REQUEST).send({ message: error.message });
      } else if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
};
