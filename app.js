const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(express.json());

/*
app.use((req, res, next) => {
  req.user = {
    _id: '649bfc0ea884cfaf2a5539b3',
  };

  next();
}); */

app.use(router);

app.listen(PORT);
