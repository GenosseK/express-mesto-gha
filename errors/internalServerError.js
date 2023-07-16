const { ERROR_INTERNAL_SERVER } = require('./errors');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_INTERNAL_SERVER;
  }
}

module.exports = InternalServerError;
