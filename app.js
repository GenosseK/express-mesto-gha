const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

// Подключение к серверу MongoDB
mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });

app.use(express.json());

app.use(router);

// Обработка корневого маршрута
app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

// Запуск сервера на порту 3000
app.listen(PORT);
