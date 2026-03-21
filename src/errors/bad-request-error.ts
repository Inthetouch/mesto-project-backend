import { ERROR_CODE_BAD_REQUEST } from '../utils/constants';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_BAD_REQUEST;
  }
}
