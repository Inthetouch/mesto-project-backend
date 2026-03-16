import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { SessionRequest } from './types';

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

app.use((req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69b85ba05af0d8680be5b276'
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на порту ${PORT}`);
});