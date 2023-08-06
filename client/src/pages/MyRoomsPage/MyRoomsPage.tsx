/* React */
import React, { useEffect, useState } from 'react';
/* Router */
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

/* Components */
import { LoadingSpinner, Pagination } from '../../components/ui';
import MyRoomItem from './MyRoomItem';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
/* Types */
import type { TGetRoomsResponse } from '../../types/type-http-res-body';
/* Styles */
import './MyRoomsPage.scss';

const roomsPerPage = 4;

/* //////////////////////////////////////////////////////////////// */
export default function MyRoomsPage() {
  const navigate = useNavigate();
  const [URLSearchParam] = useSearchParams();
  const page = Number(URLSearchParam.get('page')) || 1;

  const [loadedRooms, setLoadedRooms] = useState<TGetRoomsResponse | null>(
    null
  );

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);

  useEffect(() => {
    (async function fetchMyRooms() {
      try {
        const body = (await sendHttpRequest(
          `/rooms/my?page=${page}&limit=${roomsPerPage}`
        )) as TGetRoomsResponse;

        setLoadedRooms(body);

        // If the user is on a page that exceeds the count, redirects to the latest page
        if (body.results === 0 && body.count !== 0) {
          const redirectPage = Math.ceil(body.count / roomsPerPage);
          navigate(`/my-rooms?page=${redirectPage}`);
        }
      } catch (_) {
        // unused
      }
    })();
  }, [navigate, sendHttpRequest, page]);

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <main className="my-rooms__container">
        <Link to="/new-room" className="my-rooms__btn">
          +Add new room
        </Link>

        {loadedRooms && loadedRooms.results !== 0 && (
          <>
            <div className="my-rooms__rooms">
              {loadedRooms.data.rooms.map((room) => (
                <MyRoomItem key={room.id} room={room} />
              ))}
            </div>

            <div className="my-rooms__pagination">
              <Pagination
                totalPages={Math.ceil(loadedRooms.count / roomsPerPage)}
                curQuery="?"
                curPage={page}
              />
            </div>
          </>
        )}

        {loadedRooms && loadedRooms.count === 0 && (
          <div className="my-rooms__no-result">
            <h2>You don&apos;t have any rooms.</h2>
          </div>
        )}
      </main>
    </>
  );
}
