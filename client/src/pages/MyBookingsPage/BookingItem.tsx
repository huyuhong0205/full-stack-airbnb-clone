/* React */
import React from 'react';
/* Router */
import { Link } from 'react-router-dom';
/* Date fns */
import { format } from 'date-fns';

/* Types */
import type { TBooking } from '../../types/type-http-res-body';
/* Styles */
import './BookingItem.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  booking: TBooking;
};

export default function BookingItem({ booking }: Props) {
  const { room } = booking;

  const formattedStartDate = format(new Date(booking.startDate), 'yyyy/MM/dd');
  const formattedEndDate = format(new Date(booking.endDate), 'yyyy/MM/dd');

  /* JSX ---------------------------------------------------------- */
  return (
    <Link to={`/rooms/${room.id}`} className="booking">
      <figure className="booking__figure">
        <img
          src={`${import.meta.env.VITE_SERVER_ROOM_IMG}${room.images[0]}`}
          alt={`${room.title}`}
        />
      </figure>

      <div className="booking__info">
        <h2 className="booking__title">{room.title}</h2>
        <div className="booking__underline" />

        <p className="booking__address">{room.address}</p>

        <div className="booking__dates">
          <p className="booking__date">
            <span>check-in</span>
            {formattedStartDate}
          </p>
          <p className="booking__date">
            <span>check-out</span>
            {formattedEndDate}
          </p>
        </div>

        <p className="booking__price">${booking.price}TWD</p>
      </div>
    </Link>
  );
}
