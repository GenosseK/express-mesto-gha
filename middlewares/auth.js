const jwt = require('jsonwebtoken');
const { ERROR_UNAUTHORIZED } = require('../errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'my-secret-key');
  } catch (error) {
    return res.status(ERROR_UNAUTHORIZED).send({ message: 'Неверный токен авторизации' });
  }

  req.user = payload;
  next();
};

module.exports = auth;
