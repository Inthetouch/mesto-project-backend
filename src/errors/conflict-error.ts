import { ERROR_CODE_CONFLICT } from '../utils/constants';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_CONFLICT;
  }
}
