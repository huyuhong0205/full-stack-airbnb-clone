/* React */
import React, { useEffect, useState } from 'react';
/* Router */
import { useNavigate, useParams } from 'react-router-dom';
/* Redux */
import { useSelector } from 'react-redux';
/* Date range */
import type { RangeKeyDict } from 'react-date-range';

/* Components */
import { LoadingSpinner } from '../../components/ui';
import CheckBookingModal from './CheckBookingModal';
import Header from './Header';
import Gallery from './Gallery';
import Description from './Description';
import DateRangePicker from './DateRangePicker';
import NewBooking from './NewBooking';
import HostInfo from './HostInfo';
import RoomLocation from './RoomLocation';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import { delaySeconds } from '../../utils/delay-seconds';
/* Store */
import type { IRootState } from '../../store/store';
/* Types */
import type { TGetRoomResponse, TRoom } from '../../types/type-http-res-body';
/* Styles */
import './RoomDetailPage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function RoomDetailPage() {
  const navigate = useNavigate();
  const { roomId } = useParams() as { roomId: string };

  const { isLogin } = useSelector((state: IRootState) => state.auth);

  const [loadedRoom, setLoadedRoom] = useState<TRoom | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showCheckBookingModal, setShowCheckBookingModal] =
    useState<boolean>(false);

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();

  useEffect(() => {
    (async function fetchRoomData() {
      try {
        const body = (await sendHttpRequest(
          `/rooms/${roomId}`
        )) as TGetRoomResponse;

        setLoadedRoom(body.data.room);
      } catch (_) {
        // unused
      }
    })();
  }, [sendHttpRequest, roomId]);

  /* Event handler ------------------------------------------------ */
  const handleSelectDate = (range: RangeKeyDict) => {
    setStartDate(range.selection.startDate || new Date());
    setEndDate(range.selection.endDate || new Date());
  };

  const handlePressBookingButton = async () => {
    // (A) if user login show booking modal
    if (isLogin) {
      setShowCheckBookingModal(true);
      return;
    }

    // (B) if user not login show warning toast and redirect to auth page
    showToast({ mode: 'warning', message: 'Please login before booking' });
    await delaySeconds(3);
    navigate('/auth');
  };

  const handleCloseCheckBookingModal = () => {
    setShowCheckBookingModal(false);
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      {loadedRoom && (
        <main className="room-detail">
          <CheckBookingModal
            show={showCheckBookingModal}
            onCloseModal={handleCloseCheckBookingModal}
            id={loadedRoom.id}
            title={loadedRoom.title}
            price={loadedRoom.price}
            startDate={startDate}
            endDate={endDate}
          />

          <Header
            title={loadedRoom.title}
            average={loadedRoom.rating.average}
            quantity={loadedRoom.rating.quantity}
          />

          <Gallery title={loadedRoom.title} images={loadedRoom.images} />

          <Description
            title={loadedRoom.title}
            description={loadedRoom.description}
          />

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onSelectDate={handleSelectDate}
          />

          <NewBooking
            price={loadedRoom.price}
            startDate={startDate}
            endDate={endDate}
            onPressBookingButton={handlePressBookingButton}
          />

          <HostInfo host={loadedRoom.creator} />

          <RoomLocation
            lat={loadedRoom.location.coordinates[1]}
            lng={loadedRoom.location.coordinates[0]}
          />
        </main>
      )}
    </>
  );
}
