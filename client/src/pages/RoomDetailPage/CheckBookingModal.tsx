/* React */
import React from 'react';
/* Date fns */
import { format } from 'date-fns';

/* Components */
import { Button, Modal } from '../../components/atoms';
import { LoadingSpinner } from '../../components/ui';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useToast from '../../hooks/useToast';
/* Types */
import type { TRoom } from '../../types/type-http-res-body';
/* Styles */
import './CheckBookingModal.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  show: boolean;
  onCloseModal: () => void;
  id: TRoom['id'];
  title: TRoom['title'];
  price: TRoom['price'];
  startDate: Date;
  endDate: Date;
};

export default function CheckBookingModal({
  show,
  onCloseModal,
  id,
  title,
  price,
  endDate,
  startDate,
}: Props) {
  const { isLoading, sendHttpRequest } = useHttpRequest();
  const { showToast } = useToast();

  const formattedStartDate = format(startDate, 'yyyy/MM/dd');
  const formattedEndDate = format(endDate, 'yyyy/MM/dd');

  // Calculate nights
  const night = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  /* Event handler ------------------------------------------------ */
  const handleBooking = async () => {
    // if nights not grater then 0 don't send request
    if (formattedStartDate === formattedEndDate || isLoading) return;

    try {
      // (1) send request
      await sendHttpRequest('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      // (2) close modal
      onCloseModal();

      // (3) show toast
      showToast({ message: 'Booking success' });
    } catch (_) {
      showToast({ mode: 'error', message: 'Error, please try again latter' });
    }
  };

  const handleCloseCheckBookingModal = () => {
    if (isLoading) return; // user can't close modal while isLoading

    onCloseModal();
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <Modal show={show} onClose={handleCloseCheckBookingModal}>
        <div className="check-booking">
          <h2 className="check-booking__title--primary">{title}</h2>

          <div className="check-booking__info">
            <div className="check-booking__dates">
              <h3 className="check-booking__title--secondary">date</h3>
              <div>
                <span>{formattedStartDate}</span>
                <span>-</span>
                <span>{formattedEndDate}</span>
              </div>
            </div>

            <div className="check-booking__price">
              <h3 className="check-booking__title--secondary">price</h3>
              <div>
                <span className="check-booking__price-calc">
                  ${price} * {night} night
                </span>
                <span className="check-booking__price-total">
                  ${price * night} TWD
                </span>
              </div>
            </div>
          </div>

          <Button onClick={handleBooking} className="check-booking__btn">
            Booking
          </Button>
        </div>
      </Modal>
    </>
  );
}
