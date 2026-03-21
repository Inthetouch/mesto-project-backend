import { ERROR_CODE_NOT_FOUND } from '../utils/constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
}
