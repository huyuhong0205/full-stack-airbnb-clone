// Express validator
import { body, validationResult } from 'express-validator';

// Models
import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
// Utils
import HttpError from '../utils/HttpError.js';
import catchAsync from '../utils/catchAsync.js';
// Types
import eStatusCode from '../types/eStatusCode.js';

///////////////////////////////////////////////////////////////////
// CRUD
///////////////////////////////////////////////////////////////////

// Get my bookings ------------------------------------------------
/**
 * For api route: `GET /bookings/my`\
 * Query: `page`, `limit`
 *
 * After: `protect`
 */
export const getMyBooking = catchAsync(async (req, res, next) => {
  const userId = req.user!.id;

  // (1) query
  const bookingsQuery = Booking.find({ user: userId }).populate({
    path: 'room',
    select: '_id title images address',
  });
  const countQuery = Booking.find({ user: userId }).countDocuments(); // [NOTE] count result's number before paginate
  // --(1a) paginate
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  bookingsQuery.skip((page - 1) * limit).limit(limit);

  // (2) wait for results
  const [bookings, count] = await Promise.all([bookingsQuery, countQuery]);

  // (3) send response
  return res.status(eStatusCode.ok).json({
    status: 'success',
    count,
    results: bookings.length,
    data: {
      bookings: bookings.map((room) => room.toObject({ getters: true })), // add id key
    },
  });
});

// Create booking -------------------------------------------------
export const checkCreateBooking = [
  body('roomId').notEmpty(),
  body('startDate').notEmpty(),
  body('endDate').notEmpty(),
];
/**
 * For api route: `POST /bookings`
 *
 * After: `protect`
 */
export const createBooking = catchAsync(async (req, res, next) => {
  // handle express-validate error
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  const {
    roomId,
    startDate: startDateStr,
    endDate: endDateStr,
  } = req.body as {
    roomId: string;
    startDate: string;
    endDate: string;
  };

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // (1) check if given date is valid
  if (!startDate.getTime() || !endDate.getTime())
    return next(
      new HttpError(
        eStatusCode['bad request'],
        'Invalid inputs passed, please check your data.'
      )
    );

  // (2) calc night
  const night = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  // (3) check if room exist and get price from room data
  const room = await Room.findById(roomId);
  if (!room)
    return next(
      new HttpError(eStatusCode['not found'], 'Cannot find room with this id.')
    );
  const priceOneNight = room.price;

  // (4) create booking on DB
  const newBooking = await Booking.create({
    user: req.user!.id,
    room: roomId,
    price: priceOneNight * night,
    startDate,
    endDate,
  });

  // (5) send response
  return res
    .status(eStatusCode.ok)
    .json({ status: 'success', data: { booking: newBooking } });
});
