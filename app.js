const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { ERROR_NOT_FOUND } = require('./errors/errors');
// Подключение к серверу MongoDB
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

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649bfc0ea884cfaf2a5539b3',
  };

  next();
});

app.use(router);
app.use('/', (reg, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло не так...' });
});

// Обработка корневого маршрута
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

// Запуск сервера на порту 3000
app.listen(PORT);
