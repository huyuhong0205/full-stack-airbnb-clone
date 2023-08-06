export type THttpError = {
  status: 'fail' | 'error';
  statusCode: number;
  message: string;
};

/**
 * For api route - POST:`/users/signup`, POST:`/users/login`
 */
export type TGetTokenResponse = {
  status: 'success' | string;
  data: { role: 'user' | 'host' | 'admin' };
};

/**
 * For api route - GET:`/users/profile`
 */
export type TGetProfileResponse = {
  status: 'success' | string;
  data: {
    user: {
      name: string;
      email: string;
      photo: string;
    };
  };
};

/**
 * For api route - GET:`/rooms`, Get:`rooms/my`
 */
export type TGetRoomsResponse = {
  status: 'success' | string;
  count: number; // total count
  results: number; // number of results
  data: {
    rooms: TRooms[];
  };
};
export type TRooms = {
  id: string;
  title: string;
  price: number;
  rating: {
    average: number;
    quantity: number;
  };
  images: [string];
  address: string;
  location: {
    coordinates: [lng: number, lat: number];
  };
};

/**
 * For api route - GET:`/rooms/:roomId`
 */
export type TGetRoomResponse = {
  status: 'success' | string;
  data: {
    room: TRoom;
  };
};
export type TRoom = {
  id: string;
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
    coordinates: [lng: number, lat: number];
  };
  creator: {
    name: string;
    email: string;
    photo: string;
  };
};

/**
 * For api route - Get `/bookings/my`
 */
export type TGetBookingsResponse = {
  status: 'success' | string;
  count: number;
  results: number;
  data: {
    bookings: TBooking[];
  };
};
export type TBooking = {
  id: string;
  room: {
    id: string;
    title: string;
    address: string;
    images: string[];
  };
  price: number;
  startDate: string;
  endDate: string;
  bookingAt: string;
};
