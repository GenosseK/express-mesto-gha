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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
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
};
