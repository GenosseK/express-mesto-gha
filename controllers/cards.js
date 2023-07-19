const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны'));
      } else {
        next(error);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.owner.toString() !== _id) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }

      return card.deleteOne();
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны'));
      } else {
        next(error);
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
