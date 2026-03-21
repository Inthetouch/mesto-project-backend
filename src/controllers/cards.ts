import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { SessionRequest } from '../types';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export async function getCards(req: Request, res: Response, next: NextFunction) {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
}

export async function createCard(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const newCard = await Card.create({ name, link, owner });
    return res.status(201).send(newCard);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
}

export async function deleteCard(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    }

    if (card.owner.toString() !== req.user?._id) {
      return next(new ForbiddenError('У вас нет прав на удаление чужой карточки'));
    }

    await card.deleteOne();

    return res.send({ message: 'Карточка удалена', card });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Передан некорректный _id карточки'));
    }
    return next(err);
  }
}

export async function likeCard(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { returnDocument: 'after' },
    );

    if (!card) {
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    }
    return next(err);
  }
}

export async function dislikeCard(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { returnDocument: 'after' },
    );

    if (!card) {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    }
    return next(err);
  }
}
