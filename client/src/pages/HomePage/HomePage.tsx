/* React */
import React, { useCallback, useEffect, useRef, useState } from 'react';

/* Components */
import { LoadingSpinner } from '../../components/ui';
import { RoomItem } from '../../components/room';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
/* Types */
import type { TGetRoomsResponse, TRooms } from '../../types/type-http-res-body';
/* Styles */
import './HomePage.scss';

const fetchRoomsOneTime = 12;

/* //////////////////////////////////////////////////////////////// */
export default function HomePage() {
  const [loadedRooms, setLoadedRooms] = useState<TRooms[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [curPage, setCurPage] = useState<number>(1);

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);

  // Intersection observer
  const observer = useRef<IntersectionObserver>();
  const lastRoomItemEl = useCallback(
    (node: HTMLAnchorElement) => {
      if (isLoading) return; // don't trigger new request if isLoading

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Check if last RoomItem display in viewport && hasMore
        if (entries[0].isIntersecting && hasMore) {
          setCurPage((prevState) => prevState + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (!hasMore) return;

    (async function fetchRooms() {
      try {
        const body = (await sendHttpRequest(
          `/rooms?page=${curPage}&limit=${fetchRoomsOneTime}`
        )) as TGetRoomsResponse;

        setLoadedRooms((prevRooms) => [...prevRooms, ...body.data.rooms]);
        setHasMore(Math.ceil(body.count / fetchRoomsOneTime) >= curPage + 1);
      } catch (_) {
        // unused
      }
    })();
  }, [sendHttpRequest, hasMore, curPage]);

  /* JSX ---------------------------------------------------------- */
  return (
    <div className="home">
      <div className="home__rooms">
        {loadedRooms.map((room, index) => {
          // Add ref to last RoomItem
          if (index === loadedRooms.length - 1)
            return <RoomItem ref={lastRoomItemEl} key={room.id} room={room} />;
          return <RoomItem key={room.id} room={room} />;
        })}
      </div>

      {isLoading && (
        <div className="home__loading">
          <LoadingSpinner isLoading />
        </div>
      )}

      {!hasMore && <p className="home__no-more">No more results.</p>}
    </div>
  );
}
