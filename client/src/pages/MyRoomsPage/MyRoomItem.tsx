/* React */
import React from 'react';
/* Router */
import { Link } from 'react-router-dom';

/* Types */
import type { TRooms } from '../../types/type-http-res-body';
/* Styles */
import './MyRoomItem.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  room: TRooms;
};

export default function MyRoomItem({ room }: Props) {
  const { id, title, price, images, address } = room;

  /* JSX ---------------------------------------------------------- */
  return (
    <div className="my-room-item">
      <Link to={`/rooms/${id}`}>
        <figure className="my-room-item__figure">
          <img
            src={`${import.meta.env.VITE_SERVER_ROOM_IMG}${images[0]}`}
            alt={`room ${title}`}
          />
        </figure>
      </Link>

      <div className="my-room-item__info">
        <h2 className="my-room-item__title">{title}</h2>
        <div className="my-room-item__underline" />

        <p className="my-room-item__address">{address}</p>

        <p className="my-room-item__price">
          <span>${price} TWD</span> night
        </p>

        <Link to={`/my-rooms/${id}`} className="my-room-item__btn">
          Edit
        </Link>
      </div>
    </div>
  );
}
