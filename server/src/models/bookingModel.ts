// MongoDB
import mongoose, { Model, Schema, Document } from 'mongoose';

/* eslint-disable @typescript-eslint/ban-types -- for mongodb schema type */

///////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////

interface iBooking extends Document, iBookingMethods {
  user: typeof mongoose.Types.ObjectId;
  room: typeof mongoose.Types.ObjectId;
  price: number;
  startDate: Date;
  endDate: Date;
  bookingAt: Date;
}

interface iBookingMethods {}

type tBookingModel = Model<iBooking, {}, iBookingMethods>;

const bookingSchema = new Schema<iBooking, tBookingModel, iBookingMethods>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

  room: {
    type: mongoose.Types.ObjectId,
    ref: 'Room',
  },

  price: {
    type: Number,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  bookingAt: {
    type: Date,
    default: new Date(),
  },
});

// Export model
const Booking = mongoose.model<iBooking>('Booking', bookingSchema);

export default Booking;
