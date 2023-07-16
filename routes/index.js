const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { ERROR_NOT_FOUND } = require('../errors/errors');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Такой страницы нет :(' });
});

module.exports = router;
