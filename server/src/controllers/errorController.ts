// Express
import { Response, ErrorRequestHandler } from 'express';

// Utils
import HttpError from '../utils/HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';
import { tMongoDuplicateError } from '../types/typeError.js';

/* eslint-disable no-console */

///////////////////////////////////////////////////////////////////
// Handle unmarked error
///////////////////////////////////////////////////////////////////
const handleDuplicateFieldsDB = (error: tMongoDuplicateError) => {
  const value = Object.keys(error.keyValue).join(', ');
  const message = `This ${value} is already being used.`;
  return new HttpError(eStatusCode['bad request'], message);
};

const handleJWTError = () => {
  return new HttpError(
    eStatusCode.unauthorized,
    'Invalid token. Please login again.'
  );
};

const handleJWTExpired = () => {
  return new HttpError(
    eStatusCode.unauthorized,
    'Your token has expired! Please login again.'
  );
};

///////////////////////////////////////////////////////////////////
// Send response
///////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendErrorForProd = (error: any | HttpError, res: Response) => {
  if (error instanceof HttpError || error.isOperational) {
    return res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  }

  return res
    .status(500)
    .json({ status: 'error', message: 'internal server error!' });
};

///////////////////////////////////////////////////////////////////
// Error handler
///////////////////////////////////////////////////////////////////
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let error = { ...err };

  error.statusCode = err.statusCode || eStatusCode['internal server error'];
  error.status = err.status || 'error';

  if (error.code === 11000)
    error = handleDuplicateFieldsDB(error as tMongoDuplicateError);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpired();

  // Send response in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log('error log from errorController.ts\n', error);

    return res.status(error.statusCode).json({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
      error,
      stack: error.stack,
    });
  }

  // Send response in prod mode
  return sendErrorForProd(error, res);
};

export default globalErrorHandler;
