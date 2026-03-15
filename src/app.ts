import express from 'express';
import mongoose from 'mongoose';

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на порту ${PORT}`);
});