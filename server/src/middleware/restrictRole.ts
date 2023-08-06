// Express
import { RequestHandler } from 'express';

// Utils
import HttpError from '../utils/HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////
export const restrictRole =
  (...roles: Array<'user' | 'host' | 'admin'>): RequestHandler =>
  (req, res, next) => {
    if (!roles.includes(req.user!.role))
      return next(
        new HttpError(
          eStatusCode.forbidden,
          'You do not have permission to perform this.'
        )
      );

    return next();
  };

export default {};
