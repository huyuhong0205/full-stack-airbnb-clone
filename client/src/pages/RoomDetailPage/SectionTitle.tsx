/* React */
import React from 'react';

/* Styles */
import './SectionTitle.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  children: string;
};

export default function SectionTitle({ children }: Props) {
  /* JSX ---------------------------------------------------------- */
  return <h2 className="room-detail__section-title">{children}</h2>;
}
