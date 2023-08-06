// Express validator
import { body, validationResult } from 'express-validator';

// Models
import User from '../models/userModel.js';
// Utils
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////

// Get Profile ----------------------------------------------------
/**
 * For api route: `GET /users/profile`
 *
 * After: `protect`
 */
export const getProfile = catchAsync(async (req, res, next) => {
  const user = (await User.findById(req.user!.id).select('name email photo'))!;

  res.status(eStatusCode.ok).json({ status: 'success', data: { user } });
});

// Update Profile -------------------------------------------------
export const checkUpdateProfile = [
  body('name').trim().notEmpty().isLength({ max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
];
/**
 * For api route: `PATCH /users/profile`
 *
 * After: `protect`
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  // handle validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  const { name, email } = req.body as { name: string; email: string };

  // (1) Check if email already used
  const userInEmail = await User.findOne({ email });
  if (userInEmail && userInEmail.id !== req.user!.id)
    return next(
      new HttpError(eStatusCode['bad request'], 'This email has been used.')
    );

  // (2) Check if user upload image
  const updateData: Record<string, string> = { name, email };
  if (req.file) {
    updateData.photo = req.file.filename;
  }

  // (3) update user in DB
  await User.findByIdAndUpdate(req.user!.id, updateData, {
    new: true,
    runValidators: true,
  });

  // (4) send response
  return res.status(eStatusCode.ok).json({ status: 'success' });
});
