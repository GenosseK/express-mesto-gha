const Card = require('../models/card');

const { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER } = require('../errors/errors');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== _id) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }

      return Card.findByIdAndRemove(cardId);
    })
    .then((removedCard) => {
      res.status(200).send(removedCard);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданные данные некорректны' });
      } else if (error.message === 'Карточка не найдена') {
        res.status(ERROR_NOT_FOUND).send({ message: error.message });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла неизвестная ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
