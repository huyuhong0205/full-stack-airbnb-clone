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
const roomImagesStorage = multer.memoryStorage();
// multer filter
const roomImagesFilter = (
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
export const uploadRoomImages = multer({
  storage: roomImagesStorage,
  fileFilter: roomImagesFilter,
});

// sharp middleware -----------------------------------------------
export const roomImagesProcessing: RequestHandler = async (req, res, next) => {
  const files = req.files as
    | { [images: string]: Express.Multer.File[] }
    | undefined;

  // (1) if user does not upload image, go next
  if (!files?.images) return next();

  // (2) put filename in req.body let updateProfile middleware use. Put in body because we need validate using express-validator
  req.body.images = [];

  // (3) wait until all image processed
  await Promise.all(
    files.images.map(async (file, index) => {
      const filename = `host-${req.user!.id}-room-${
        index + 1
      }-${Date.now()}.webp`;

      req.body.images.push(filename);

      // convert to webp, resize image and save to file system
      await sharp(files.images[index].buffer)
        .toFormat('webp')
        .resize(1920, 1080)
        .toFile(`public/images/room/${filename}`);
    })
  );

  // (4) go next middleware
  return next();
};
