// Express
import { Request, Response, CookieOptions } from 'express';
// Express validator
import { body, validationResult } from 'express-validator';
// JWT
import jwt from 'jsonwebtoken';

// Models
import User from '../models/userModel.js';
// Utils
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////
// JWT token
///////////////////////////////////////////////////////////////////

// Generate JWT token ---------------------------------------------
const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// Send token to client -------------------------------------------
const createAndSendToken = (
  userId: string,
  role: string,
  res: Response,
  statusCode: eStatusCode
) => {
  // (1) generate token
  const token = signToken(userId);

  // (2) send token to cookie
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // can't access or modify cookie by browser
    sameSite: 'none',
    secure: true, // use ssl
  };
  res.cookie('jwt', token, cookieOptions);

  // (3) send response
  return res.status(statusCode).json({ status: 'success', data: { role } });
};

///////////////////////////////////////////////////////////////////
// Auth: signup, login, logout
///////////////////////////////////////////////////////////////////

// Signup ---------------------------------------------------------
export const checkSignup = [
  body('name').trim().notEmpty().isLength({ max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').trim().isLength({ min: 6, max: 12 }),
  body('passwordConfirm')
    .trim()
    .custom((value, { req }) => value === req.body.password),
];
/**
 * For api route: `POST /users/signup`
 */
export const signup = catchAsync(async (req, res, next) => {
  // handle validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  // (1) create new user in DB
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // (2) send response
  return createAndSendToken(newUser.id, newUser.role, res, eStatusCode.created);
});

// Login ----------------------------------------------------------
export const checkLogin = [body(['email', 'password']).trim().notEmpty()];
/**
 * For api route: `POST /users/login`
 */
export const login = catchAsync(async (req, res, next) => {
  // handle validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Please provide your email and password.'
      )
    );

  const { email, password } = req.body;

  // (1) check if user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user?.correctPassword(password, user?.password);

  if (!user || !correct)
    return next(
      new HttpError(eStatusCode.unauthorized, 'Incorrect email or password.')
    );

  // (2) send response
  return createAndSendToken(user.id, user.role, res, eStatusCode.created);
});

// Logout ---------------------------------------------------------
/**
 * For api route: `GET /users/logout`
 */
export const logout = (req: Request, res: Response) => {
  // (1) send a invalid token to replace original JWT in cookies
  const cookieOptions: CookieOptions = {
    expires: new Date(0),
    httpOnly: true, // can't access or modify cookie by browser
    secure: process.env.NODE_ENV === 'production', // use https, only use in prod mode
  };
  res.cookie('jwt', '', cookieOptions);

  // (2) send response
  res.status(eStatusCode.ok).json({ status: 'success' });
};

///////////////////////////////////////////////////////////////////
// Password
///////////////////////////////////////////////////////////////////

// Update password ------------------------------------------------
export const checkUpdatePassword = [
  body('currentPassword').trim().notEmpty(),
  body('password').trim().isLength({ min: 6, max: 12 }),
  body('passwordConfirm')
    .trim()
    .custom((value, { req }) => value === req.body.password),
];
/**
 * For api route: `PATCH /users/password`
 *
 * After: `protect`
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  // handle validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  const { id } = req.user!;
  const { currentPassword, password } = req.body as {
    currentPassword: string;
    password: string;
  };

  // (1) get user from user collection
  const user = (await User.findById(id).select('+password'))!;

  // (2) check if current password correct
  const correct = await user.correctPassword(currentPassword, user.password);
  if (!correct)
    return next(
      new HttpError(eStatusCode.unauthorized, 'Your password is incorrect.')
    );

  // (3) update password
  user.password = password;
  user.save();

  // (4) log user in, send new jwt token
  return createAndSendToken(user.id, user.role, res, eStatusCode.created);
});
