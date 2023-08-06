import eStatusCode from '../types/eStatusCode.js';

class HttpError extends Error {
  public isOperational = true;

  public status: string;

  constructor(public statusCode: eStatusCode, public message: string) {
    super(message);

    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
