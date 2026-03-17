import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { SessionRequest } from './types';
import { ERROR_CODE_NOT_FOUND } from './utils/constants';
import rateLimit from 'express-rate-limit';

const app = express();

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter);

app.use(express.json());

app.use((req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69b85ba05af0d8680be5b276'
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к базе данных:', err));

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на порту ${PORT}`);
});