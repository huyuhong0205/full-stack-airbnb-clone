/* React */
import React from 'react';
/* Date range */
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

/* Components */
import SectionTitle from './SectionTitle';
/* Styles */
import './DateRangePicker.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  startDate: Date;
  endDate: Date;
  onSelectDate: (dateRange: RangeKeyDict) => void;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onSelectDate,
}: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <section className="room-detail__date-range">
      <SectionTitle>Select dates</SectionTitle>

      <div className="room-detail__date-range-picker">
        <DateRange
          onChange={onSelectDate}
          rangeColors={['#ff5a5f']}
          ranges={[{ startDate, endDate, key: 'selection' }]}
          minDate={new Date()}
          maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
        />
      </div>
    </section>
  );
}
