/* React */
import React from 'react';
/* Date fns */
import { format } from 'date-fns';

/* Components */
import { Button } from '../../components/atoms';
import SectionTitle from './SectionTitle';
/* Types */
import type { TRoom } from '../../types/type-http-res-body';
/* Styles */
import './NewBooking.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  price: TRoom['price'];
  startDate: Date;
  endDate: Date;
  onPressBookingButton: () => void;
};

export default function NewBooking({
  price,
  startDate,
  endDate,
  onPressBookingButton,
}: Props) {
  const formattedStartDate = format(startDate, 'yyyy/MM/dd');
  const formattedEndDate = format(endDate, 'yyyy/MM/dd');

  // Calculate nights
  const night = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  /* JSX ---------------------------------------------------------- */
  return (
    <section className="room-detail__new-booking">
      <div className="room-detail__new-booking__section-title">
        <SectionTitle>Booking</SectionTitle>
      </div>

      <div className="new-booking__container">
        <div className="new-booking">
          <div className="new-booking__info">
            <p className="new-booking__price">
              <span>${price} TWD</span>&nbsp;night&nbsp;
            </p>
          </div>

          <div className="new-booking__dates">
            <div className="new-booking__date">
              <span>check-in</span>
              {formattedStartDate}
            </div>
            <div className="new-booking__date">
              <span>checkout</span>
              {formattedEndDate}
            </div>
          </div>

          <div className="new-booking__total">
            <div className="new-booking__total-calc">
              ${price} TWD x {night} night
            </div>
            <div className="new-booking__total-amount">
              ${price * night} TWD
            </div>
          </div>

          <Button
            onClick={onPressBookingButton}
            className="new-booking__btn"
            type="button"
            disabled={formattedStartDate === formattedEndDate}
          >
            Booking
          </Button>
        </div>
      </div>
    </section>
  );
}
