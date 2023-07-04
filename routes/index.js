const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { ERROR_NOT_FOUND } = require('../errors/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Такой страницы нет :(' });
});

module.exports = router;
