/* React */
import React, { useEffect, useState } from 'react';
/* Router */
import { useNavigate, useSearchParams } from 'react-router-dom';

/* Components */
import { LoadingSpinner, Pagination } from '../../components/ui';
import BookingItem from './BookingItem';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
/* Types */
import type { TGetBookingsResponse } from '../../types/type-http-res-body';
/* Styles */
import './MyBookingsPage.scss';

const bookingsPerPage = 4;

/* //////////////////////////////////////////////////////////////// */
export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [URLSearchParam] = useSearchParams();
  const page = Number(URLSearchParam.get('page')) || 1;

  const [loadedBookings, setLoadedBookings] =
    useState<TGetBookingsResponse | null>(null);

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);

  useEffect(() => {
    (async function fetchBookings() {
      try {
        // (1) send request
        const body = (await sendHttpRequest(
          `/bookings/my?page=${page}&limit=${bookingsPerPage}`
        )) as TGetBookingsResponse;

        // (2) set loadedBookings state
        setLoadedBookings(body);

        // (3) if the user is on a page that exceeds the count, redirects to the latest page
        if (body.results === 0 && body.count !== 0) {
          const redirectPage = Math.ceil(body.count / bookingsPerPage);
          navigate(`/booking?page=${redirectPage}`);
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

      <main className="my-booking">
        {loadedBookings && loadedBookings.results !== 0 && (
          <>
            <div className="my-booking__bookings">
              {loadedBookings.data.bookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>

            <Pagination
              totalPages={Math.ceil(loadedBookings.count / bookingsPerPage)}
              curQuery="?"
              curPage={page}
            />
          </>
        )}

        {loadedBookings && loadedBookings.count === 0 && (
          <div className="my-booking__no-results">
            <h2>You don&apos;t have any bookings.</h2>
          </div>
        )}
      </main>
    </>
  );
}
