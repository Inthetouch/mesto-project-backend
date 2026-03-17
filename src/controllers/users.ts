import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SessionRequest } from '../types/index';
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
        .send({ message: 'Пользователь по указанному _id не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя' });
    }

    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(201).send(newUser);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function updateProfile(req: SessionRequest, res: Response) {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function updateAvatar(req: SessionRequest, res: Response) {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}
