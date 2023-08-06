/* React */
import React, { useCallback, useState } from 'react';
/* Google map */
import GoogleMap from 'google-maps-react-markers';

/* Components */
import MapMarker from './MapMarker';
/* Types */
import type { TRooms } from '../../types/type-http-res-body';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  rooms: TRooms[];
  curHoverRoomId: TRooms['id'] | null;
  onMouseHoverMapMarker: (id: TRooms['id']) => void;
  onMouseLeaveMapMarker: () => void;
};

export default function Map({
  rooms,
  curHoverRoomId,
  onMouseHoverMapMarker,
  onMouseLeaveMapMarker,
}: Props) {
  const [curPopup, setCurPopup] = useState<TRooms['id'] | null>(null);

  /* Event handler ------------------------------------------------ */
  const handleGoogleApiLoaded = useCallback(
    ({ map }: { map: google.maps.Map; maps: typeof google.maps }) => {
      // Auto center and zoom for all makers
      const bounds = new window.google.maps.LatLngBounds();
      rooms.forEach((room) => {
        bounds.extend({
          lat: room.location.coordinates[1],
          lng: room.location.coordinates[0],
        });
      });
      map.fitBounds(bounds);
    },
    [rooms]
  );

  const handleShowPopup = useCallback((roomId: TRooms['id']) => {
    setCurPopup(roomId);
  }, []);

  const handleHidePopup = useCallback(() => {
    setCurPopup(null);
  }, []);

  /* JSX ---------------------------------------------------------- */
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMap
        key={JSON.stringify(rooms)} // [NOTE] when loaded room change render map
        apiKey={import.meta.env.VITE_GOOGLE_KEY}
        defaultCenter={{
          lat: 23.6978,
          lng: 120.9605,
        }}
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleGoogleApiLoaded}
      >
        {rooms.map((room) => (
          <MapMarker
            key={room.id}
            room={room}
            isHover={curHoverRoomId === room.id}
            showPopup={curPopup === room.id}
            onShowPopup={handleShowPopup}
            onHidePopup={handleHidePopup}
            onMouseHoverMapMarker={onMouseHoverMapMarker}
            onMouseLeaveMapMarker={onMouseLeaveMapMarker}
            lat={room.location.coordinates[1]}
            lng={room.location.coordinates[0]}
            zIndex={
              // eslint-disable-next-line no-nested-ternary
              curPopup === room.id ? 11 : curHoverRoomId === room.id ? 10 : 9
            }
          />
        ))}
      </GoogleMap>
    </div>
  );
}
