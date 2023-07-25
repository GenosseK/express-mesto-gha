const { NODE_ENV, ALLOWED_CORS_PRODUCTION } = process.env;
const ALLOWED_CORS = NODE_ENV === 'production' ? ALLOWED_CORS_PRODUCTION.split(', ') : ['https://localhost:3000', 'http://localhost:3000', 'localhost:3000', 'http://genossek.mesto.nomoredomains.xyz/', 'https://genossek.mesto.nomoredomains.xyz/'];

const CORS_OPTIONS = {
  origin: ALLOWED_CORS,
};

module.exports = {
  CORS_OPTIONS,
};
