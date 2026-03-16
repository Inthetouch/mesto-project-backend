import { Request, Response } from 'express';
import Card from '../models/card';
import { SessionRequest } from '../types';
import {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER_ERROR,
} from '../utils/constants';

export async function getCards(req: Request, res: Response) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
}

export async function createCard(req: SessionRequest, res: Response) {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const newCard = await Card.create({ name, link, owner });
    res.status(201).send(newCard);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function deleteCard(req: Request, res: Response) {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND)
        .send({ message: 'Карточка по указанному _id найдена' });
    }

    return res.send({ message: 'Карточка удалена', card });
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function likeCard(req: SessionRequest, res: Response) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { returnDocument: 'after' },
    );

    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND)
        .send({ message: 'Карточка по указанному _id найдена' });
    }

    res.send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}

export async function dislikeCard(req: SessionRequest, res: Response) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { returnDocument: 'after' },
    );

    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND)
        .send({ message: 'Передан несуществующий _id карточки' });
    }

    return res.send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
}
