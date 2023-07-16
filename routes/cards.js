const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validationCreateCard, validationDeleteCard, validationLikeCard, validationDislikeCard,
} = require('../middlewares/validation');

router.post('/', validationCreateCard, createCard);
router.get('/', getCards);
router.delete('/:cardId', validationDeleteCard, deleteCard);
router.put('/:cardId/likes', validationLikeCard, likeCard);
router.delete('/:cardId/likes', validationDislikeCard, dislikeCard);

module.exports = router;
