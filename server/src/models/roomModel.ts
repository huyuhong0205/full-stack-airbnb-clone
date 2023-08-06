// MongoDB
import mongoose, { Model, Document, Schema } from 'mongoose';

/* eslint-disable @typescript-eslint/ban-types -- for mongodb schema type */

///////////////////////////////////////////////////////////////////
// Schema
///////////////////////////////////////////////////////////////////

interface iRoom extends Document, iRoomMethod {
  title: string;
  price: number;
  rating: {
    average: number;
    quantity: number;
  };
  description: string;
  images: string[];
  address: string;
  location: {
    type: 'Point';
    coordinates: [lng: number, lat: number];
  };
  creator: typeof mongoose.Types.ObjectId;
}

interface iRoomMethod {}

type tRoomModel = Model<iRoom, {}, iRoomMethod>;

const roomSchema = new Schema<iRoom, tRoomModel, iRoomMethod>({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },

  price: {
    type: Number,
    required: true,
    min: 1,
    max: 999999,
  },

  rating: {
    average: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },

  description: {
    type: String,
    required: true,
    maxlength: 3000,
  },

  images: {
    type: [String],
    required: true,
  },

  address: { type: String, required: true },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  },

  creator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

// Export model
const Room = mongoose.model<iRoom>('Room', roomSchema);

export default Room;
