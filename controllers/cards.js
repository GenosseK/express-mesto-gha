const Card = require('../models/card');

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((error) => {
      res.status(500).send(error);
    });
};

const getCards = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch((error) => {
      res.status(500).send(error);
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ error: 'Card not found' });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ error: 'Card not found' });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ error: 'Card not found' });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
