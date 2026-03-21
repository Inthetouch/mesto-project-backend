import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_CODE_UNAUTHORIZED } from '../utils/constants';
import { SessionRequest } from '../types';

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }

  req.user = payload as { _id: string };
  return next();
};
