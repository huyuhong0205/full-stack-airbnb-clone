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
export const protect = catchAsync(async (req, res, next) => {
  // (1) getting token and check if it's here
  let token: string | undefined;
  if (req.cookies.jwt) token = req.cookies.jwt;
  if (!token)
    return next(new HttpError(eStatusCode.unauthorized, 'You are not login.'));

  // (2) verify JWT token
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (typeof decode !== 'object' || !decode.id || !decode.iat || !decode.exp)
    return next(new HttpError(eStatusCode.unauthorized, 'You are not login.'));

  // (3) check if user still exist
  const currentUser = await User.findById(decode.id);
  if (!currentUser)
    return next(
      new HttpError(eStatusCode.unauthorized, 'Cannot find this user.')
    );

  // (4) check if user change password after the JWT token was issued
  if (currentUser.changePasswordAfter(decode.iat))
    return next(
      new HttpError(
        eStatusCode.unauthorized,
        'User recently changed password, please login again'
      )
    );

  // (5) grant access to protected route
  req.user = {
    id: currentUser.id,
    role: currentUser.role,
  };

  // (6) go next middleware
  return next();
});

export default {};
