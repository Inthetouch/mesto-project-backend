import { Request, Response, NextFunction } from 'express';
import { ERROR_CODE_INTERNAL_SERVER_ERROR } from '../utils/constants';

interface ICustomError extends Error {
  statusCode?: number;
}

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Error) {
    const customError = err as ICustomError;
    const statusCode = customError.statusCode || ERROR_CODE_INTERNAL_SERVER_ERROR;
    const message = statusCode === ERROR_CODE_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : customError.message;
    res.status(statusCode).send({ message });
    return next();
  }

  res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  return next();
}

export default errorHandler;
