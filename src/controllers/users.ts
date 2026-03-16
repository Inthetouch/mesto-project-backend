import { Request, Response } from 'express';
import User from '../models/user';
import {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER_ERROR,
} from '../utils/constants';

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id найден' });
    }

    return res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).send(newUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}
