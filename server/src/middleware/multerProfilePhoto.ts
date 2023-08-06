// Express
import { Request, RequestHandler } from 'express';
// Multer
import multer, { FileFilterCallback } from 'multer';
// Sharp
import sharp from 'sharp';

// Utils
import HttpError from '../utils/HttpError.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////

// multer storage
const profilePhotoStorage = multer.memoryStorage();
// multer filter
const profilePhotoFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new HttpError(eStatusCode['bad request'], 'Please upload only image.')
    );
  }
};
// multer middleware ----------------------------------------------
export const uploadProfilePhoto = multer({
  storage: profilePhotoStorage,
  fileFilter: profilePhotoFilter,
});

// sharp middleware -----------------------------------------------
export const profilePhotoProcessing: RequestHandler = async (
  req,
  res,
  next
) => {
  // (1) if user does not upload image, go next
  if (!req.file) return next();

  // (2) put filename in req.file let updateProfile middleware use
  req.file.filename = `user-${req.user!.id}.webp`;

  // (3) convert to webp, resize image and save to file system
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('webp')
    .toFile(`public/images/profile/${req.file.filename}`);

  // (4) go next middleware
  return next();
};
