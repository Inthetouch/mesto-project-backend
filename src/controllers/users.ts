import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SessionRequest } from '../types/index';
import User from '../models/user';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан некорректный _id пользователя'));
    }

    return next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    return res.status(201).send({
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
}

export async function updateProfile(req: SessionRequest, res: Response, next: NextFunction) {
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
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    }
    return next(err);
  }
}

export async function updateAvatar(req: SessionRequest, res: Response, next: NextFunction) {
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
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
    return res.send({ token });
  } catch (err) {
    return next(err);
  }
}

export async function getCurrentUser(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new NotFoundError('Пользователь с указанным _id не найден'));
    }
    return res.send(user);
  } catch (err) {
    return next(new BadRequestError('Переданы некорректные данные'));
  }
}
