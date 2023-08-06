// Express validator
import { body, validationResult } from 'express-validator';

// Models
import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
// Utils
import catchAsync from '../utils/catchAsync.js';
import HttpError from '../utils/HttpError.js';
import getCoordsForAddress from '../utils/getCoordsForAddress.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////
// CRUD
///////////////////////////////////////////////////////////////////

// Get rooms ------------------------------------------------------
/**
 * For api route: `GET /rooms`\
 * Query: `location`, `page`, `limit`
 */
export const getRooms = catchAsync(async (req, res, next) => {
  // (1) query
  const roomsQuery = Room.find().select(
    '_id title price rating images address location'
  );
  const countQuery = Room.find().countDocuments(); // [NOTE] count result's number before paginate
  // --(1a) for search
  if (req.query.location) {
    roomsQuery.where('address').regex(req.query.location as string);
    countQuery.where('address').regex(req.query.location as string);
  }
  // --(1b) for pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  roomsQuery.skip((page - 1) * limit).limit(limit);

  // (2) wait for query results
  const [rooms, count] = await Promise.all([roomsQuery, countQuery]);

  // (3) send response
  res.status(eStatusCode.ok).json({
    status: 'success',
    count,
    results: rooms.length,
    data: {
      rooms: rooms.map((room) => room.toObject({ getters: true })), // add id key
    },
  });
});

// Get room -------------------------------------------------------
/**
 * For api route: `GET /rooms/:roomId`
 */
export const getRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params as { roomId: string };

  // (1) get room by id and populate creator
  const room = await Room.findById(roomId).populate({
    path: 'creator',
    select: 'name email photo',
  });

  // (2) check if room exist
  if (!room)
    return next(
      new HttpError(eStatusCode['not found'], `Cannot find room with this ID.`)
    );

  // (3) send response
  return res.status(eStatusCode.ok).json({
    status: 'success',
    data: { room: room.toObject({ getters: true }) },
  });
});

// Get my rooms ---------------------------------------------------
/**
 * For api route: `GET: /rooms/my`\
 * Query: `page`, `limit`
 *
 * After: `protect`, `restrict(host, admin)`
 */
export const getMyRooms = catchAsync(async (req, res, next) => {
  const creator = req.user!.id;

  // (1) query
  const roomsQuery = Room.find({ creator });
  const countQuery = Room.find({ creator }).countDocuments(); // [NOTE] count result's number before paginate
  // --(1a) for pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  roomsQuery.skip((page - 1) * limit).limit(limit);

  // (2) wait for query results
  const [rooms, count] = await Promise.all([roomsQuery, countQuery]);

  // (3) send response
  return res.status(eStatusCode.ok).json({
    status: 'success',
    count,
    results: rooms.length,
    data: {
      rooms: rooms.map((room) => room.toObject({ getters: true })), // add id key
    },
  });
});

// Create room ----------------------------------------------------
export const checkCreateRoom = [
  body('title').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('price').custom(
    (value: string) => !!+value && +value >= 1 && +value <= 999999
  ), // check if the received price can be converted to a number
  body('description').trim().notEmpty().isLength({ max: 3000 }).escape(),
  body('images').custom(
    (value: string[]) =>
      value.length >= 3 &&
      value.length <= 10 &&
      value.every((image) => image.endsWith('.webp'))
  ),
  body('address').trim().notEmpty(),
];
/**
 * For api route: `POST /room`
 *
 * After: `protect`, `restrict(host, admin)`
 */
export const createRoom = catchAsync(async (req, res, next) => {
  // handle express-validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  // (1) converting address to coordinates
  const coordinates = await getCoordsForAddress(req.body.address);

  // (2) create new room in DB
  const newRoom = await Room.create({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    images: req.body.images,
    address: req.body.address,
    location: {
      coordinates,
    },
    creator: req.user!.id,
  });

  // (3) send response
  return res
    .status(eStatusCode.created)
    .json({ status: 'success', data: { room: newRoom } });
});

// Update room ----------------------------------------------------
export const checkUpdateRoom = [
  body('title').trim().notEmpty().isLength({ max: 100 }).escape(),
  body('price').custom(
    (value: string) => !!+value && +value >= 1 && +value <= 999999
  ), // check if the received price can be converted to a number
  body('description').trim().notEmpty().isLength({ max: 3000 }).escape(),
];
/**
 * For api route: `PATCH /room`
 *
 * After: `protect`, `restrict(host, admin)`
 */
export const updateRoom = catchAsync(async (req, res, next) => {
  // handle express-validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  const { roomId } = req.params as { roomId: string };
  const { id: userId } = req.user!;

  // (1) check if room exist
  const room = await Room.findById(roomId);
  if (!room)
    return next(
      new HttpError(eStatusCode['not found'], 'Cannot find room with this ID.')
    );

  // (2) check if the user sending the request is the creator
  if (room.creator.toString() !== userId)
    return next(
      new HttpError(
        eStatusCode.forbidden,
        'You do not have permission to perform this.'
      )
    );

  // (3) update room data
  const updateData = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
  };
  const updatedRoom = await Room.findByIdAndUpdate(roomId, updateData, {
    new: true,
    runValidators: true,
  });

  // (4) send response
  return res
    .status(eStatusCode.ok)
    .json({ status: 'success', data: { room: updatedRoom } });
});

// Delete room ----------------------------------------------------
/**
 * For api route: `DELETE /room`
 *
 * After: `protect`, `restrict(host, admin)`
 */
export const deleteRoom = catchAsync(async (req, res, next) => {
  const { roomId } = req.params as { roomId: string };
  const { id: userId } = req.user!;

  // (1) check if room exist
  const room = await Room.findById(roomId);
  if (!room)
    return next(
      new HttpError(eStatusCode['not found'], 'Cannot find room with this ID.')
    );

  // (2) check if the user sending the request is the creator
  if (room.creator.toString() !== userId)
    return next(
      new HttpError(
        eStatusCode.forbidden,
        'You do not have permission to perform this.'
      )
    );

  // (3) check if room has booking
  const bookings = await Booking.find({ room: roomId });
  if (bookings.length !== 0)
    return next(
      new HttpError(
        eStatusCode.forbidden,
        'This room has bookings, cannot be deleted.'
      )
    );

  // (4) delete room
  await Room.findByIdAndDelete(roomId);

  // (5) send response
  return res.status(eStatusCode.ok).json({ status: 'success', data: null });
});
