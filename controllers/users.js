const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      next(new Error('Произошла неизвестная ошибка'));
      return;
    }

    User.create({
      name, about, avatar, email, password: hashedPassword,
    })
      .then(() => {
        res.status(201).send({
          name, about, avatar, email,
        });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          next(new BadRequestError('Переданные данные некорректны'));
        } else {
          next(new Error('Произошла неизвестная ошибка'));
        }
      });
  });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданные данные некорректны'));
      } else if (error.message === 'Пользователь не найден') {
        next(new NotFoundError(error.message));
      } else {
        next(new Error('Произошла неизвестная ошибка'));
      }
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданные данные некорректны'));
      } else if (error.message === 'Пользователь не найден') {
        next(new NotFoundError(error.message));
      } else {
        next(new Error('Произошла неизвестная ошибка'));
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданные данные некорректны'));
      } else if (error.message === 'Пользователь не найден') {
        next(new NotFoundError(error.message));
      } else {
        next(new Error('Произошла неизвестная ошибка'));
      }
    });
};

/*
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .then((user) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          next(new Error('Произошла неизвестная ошибка'));
          return;
        }

        if (!isMatch) {
          next(new BadRequestError('Неправильные почта или пароль'));
          return;
        }

        const token = jwt.sign({ _id: user._id }, 'my-secret-key', { expiresIn: '7d' });

        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }).send({ message: 'Успешный вход' });
      });
    })
    .catch((error) => {
      if (error.message === 'Неправильные почта или пароль') {
        next(new UnauthorizedError(error.message));
      } else if (error.name === 'CastError') {
        next(new BadRequestError('Переданные данные некорректны'));
      } else {
        next(new Error('Произошла неизвестная ошибка'));
      }
    });
};
*/

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((validUser) => {
          if (validUser) {
            const token = jwt.sign({ _id: user._id }, 'my-secret-key', { expiresIn: '7d' });
            res.send({ token });
          } else {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  login,
  getUserInfo,
};
