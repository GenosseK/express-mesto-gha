const { ERROR_INTERNAL_SERVER } = require('../errors/errors');

const errorHandler = (error, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER } = error;

  const message = statusCode === ERROR_INTERNAL_SERVER ? 'На сервере произошла ошибка' : error.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
