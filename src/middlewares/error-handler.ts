import { Request, Response, NextFunction } from 'express';

interface ICustomError extends Error {
  statusCode?: number;
}

function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Error) {
    const customError = err as ICustomError;
    const statusCode = customError.statusCode || 500;
    const message = statusCode === 500 ? 'На сервере произошла ошибка' : customError.message;
    res.status(statusCode).send({ message });
    return next();
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
  return next();
}

export default errorHandler;
