/* React */
import React, { useCallback, useEffect, useState } from 'react';
/* Router */
import { useNavigate, useSearchParams } from 'react-router-dom';

/* Components */
import { LoadingSpinner, Pagination } from '../../components/ui';
import { RoomItem } from '../../components/room';
import Map from './Map';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
/* Types */
import type { TGetRoomsResponse, TRooms } from '../../types/type-http-res-body';
/* Styles */
import './SearchPage.scss';

const roomsPerPage = 12;

/* //////////////////////////////////////////////////////////////// */
export default function SearchPage() {
  const navigate = useNavigate();
  const [URLSearchParams] = useSearchParams();
  const location = URLSearchParams.get('location');
  const page = Number(URLSearchParams.get('page')) || 1;

  const [loadedRooms, setLoadedRooms] = useState<TGetRoomsResponse | null>(
    null
  );
  const [curHoverRoomId, setCurHoverRoomId] = useState<TRooms['id'] | null>(
    null
  ); // string

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);

  useEffect(() => {
    (async function fetchRoomsWhenLocationOrPageChange() {
      try {
        // (1) fetch rooms
        const body = (await sendHttpRequest(
          `/rooms?location=${location}&page=${page}&limit=${roomsPerPage}`
        )) as TGetRoomsResponse;

        setLoadedRooms(body);

        // (2) if the user is on a page that exceeds the count, redirects to the latest page
        if (body.results === 0 && body.count !== 0) {
          const redirectPage = Math.ceil(body.count / roomsPerPage);
          navigate(`/search?location=${location}&page=${redirectPage}`);
        }
      } catch (_) {
        // unused
      }
    })();
  }, [navigate, sendHttpRequest, location, page]);

  /* Event handler ------------------------------------------------ */
  const handleMouseHoverRoomItem = useCallback((roomId: TRooms['id']) => {
    setCurHoverRoomId(roomId);
  }, []);

  const handleMouseLeaveRoomItem = useCallback(() => {
    setCurHoverRoomId(null);
  }, []);

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <main className="search">
        {loadedRooms && loadedRooms.results > 0 ? (
          <>
            <div className="search__rooms">
              <h2 className="search__title">
                <span>{loadedRooms.count} results for location&nbsp;</span>
                <span>{location}</span>
              </h2>

              <section className="search__list">
                {loadedRooms.data.rooms.map((room) => (
                  <RoomItem
                    key={room.id}
                    room={room}
                    onMouseEnter={handleMouseHoverRoomItem.bind(null, room.id)}
                    onMouseLeave={handleMouseLeaveRoomItem}
                  />
                ))}
              </section>

              <Pagination
                totalPages={Math.ceil(loadedRooms.count / roomsPerPage)}
                curQuery={`?location=${location}&`}
                curPage={page}
              />
            </div>

            <div className="search__map-container">
              <div className="search__map">
                <Map
                  rooms={loadedRooms.data.rooms}
                  curHoverRoomId={curHoverRoomId}
                  onMouseHoverMapMarker={handleMouseHoverRoomItem}
                  onMouseLeaveMapMarker={handleMouseLeaveRoomItem}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="search__not-found">
            <h2>No results found for location {location}</h2>
          </div>
        )}
      </main>
    </>
  );
}
