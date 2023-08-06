/* React */
import React, { memo } from 'react';
/* Icons */
import { FaStar } from 'react-icons/fa';

/* Styles */
import './Header.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  title: string;
  average: number;
  quantity: number;
};

function Header({ title, average, quantity }: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <header className="room-detail__header">
      <h1>{title}</h1>

      <p className="room-detail__header__rating">
        <FaStar className="room-detail__header__rating-icon" />
        <span>{average}</span>
        <span>&nbsp;·&nbsp;{quantity} reviews</span>
      </p>
    </header>
  );
}

const MemoedHeader = memo(Header);

export default MemoedHeader;
