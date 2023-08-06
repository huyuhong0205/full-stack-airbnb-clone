/* eslint-disable react/no-unused-prop-types -- for google-maps-react-markers use */

/* React */
import React from 'react';
/* Google map */
import GoogleMap from 'google-maps-react-markers';
/* Icon */
import { FaHome } from 'react-icons/fa';

/* Components */
import SectionTitle from './SectionTitle';
/* Styles */
import './RoomLocation.scss';

/* //////////////////////////////////////////////////////////////// */
type MapMarkerProps = {
  children: React.ReactNode;
  lat: number;
  lng: number;
};

function MapMarker({ children }: MapMarkerProps) {
  return <div>{children}</div>;
}

/* //////////////////////////////////////////////////////////////// */
type Props = {
  lat: number;
  lng: number;
};

export default function RoomLocation({ lat, lng }: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <section className="room-detail__location">
      <SectionTitle>Location</SectionTitle>

      <div className="room-detail__location__map">
        <GoogleMap
          apiKey={import.meta.env.VITE_GOOGLE_KEY}
          defaultCenter={{ lat, lng }}
          defaultZoom={13}
        >
          <MapMarker lat={lat} lng={lng}>
            <FaHome className="room-detail__location__marker-icon" />
          </MapMarker>
        </GoogleMap>
      </div>
    </section>
  );
}
