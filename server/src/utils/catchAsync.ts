import { Request, Response, NextFunction } from 'express';

type tAsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const catchAsync =
  (fn: tAsyncRequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };

export default catchAsync;
