/* eslint-disable react/no-unused-prop-types -- for google-maps-react-markers use */

/* React */
import React from 'react';
/* Icon */
import { HiOutlineX } from 'react-icons/hi';

/* Components */
import { RoomItem } from '../../components/room';
/* Types */
import type { TRooms } from '../../types/type-http-res-body';
/* Styles */
import './MapMarker.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  room: TRooms;
  isHover: boolean;
  showPopup: boolean;
  onShowPopup: (id: TRooms['id']) => void;
  onHidePopup: () => void;
  onMouseHoverMapMarker: (id: TRooms['id']) => void;
  onMouseLeaveMapMarker: () => void;

  lat: number;
  lng: number;
  zIndex: number;
};

export default function MapMarker({
  room,
  isHover,
  showPopup,
  onShowPopup,
  onHidePopup,
  onMouseHoverMapMarker,
  onMouseLeaveMapMarker,
}: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <div className="marker">
      {/* Marker */}
      <button
        onClick={() => onShowPopup(room.id)}
        className={`marker__price ${isHover ? 'marker__price--hover' : ''}`}
        type="button"
        onMouseEnter={onMouseHoverMapMarker.bind(null, room.id)}
        onMouseLeave={onMouseLeaveMapMarker}
      >
        ${room.price} TWD
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="marker__popup">
          <button
            onClick={() => onHidePopup()}
            className="marker__btn"
            type="button"
          >
            <HiOutlineX className="marker__btn-icon" />
          </button>

          <RoomItem room={room} asPopup />
        </div>
      )}
    </div>
  );
}
