require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');

const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_DB } = require('./utils/constant');
const { CORS_OPTIONS } = require('./middlewares/cors');

mongoose.connect(MONGO_DB);

// const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(CORS_OPTIONS));

app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
