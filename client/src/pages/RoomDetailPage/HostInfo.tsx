/* React */
import React from 'react';

/* Components */
import SectionTitle from './SectionTitle';
/* Types */
import type { TRoom } from '../../types/type-http-res-body';
/* Styles */
import './HostInfo.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  host: TRoom['creator'];
};

export default function HostInfo({ host }: Props) {
  const { name, email, photo } = host;

  /* JSX ---------------------------------------------------------- */
  return (
    <section className="room-detail__host">
      <SectionTitle>Host</SectionTitle>

      <div className="room-detail__host__content">
        <figure className="room-detail__host__figure">
          <img
            src={`${import.meta.env.VITE_SERVER_USER_IMG}${photo}`}
            alt={`${name}`}
          />
        </figure>
        <div className="room-detail__host__info">
          <p className="room-detail__host__name">
            <span>Host name :&nbsp;</span>
            <span>{name}</span>
          </p>
          <a
            href={`mailto:${email}`}
            className="room-detail__host__contact"
            target="_blank"
            rel="noreferrer"
          >
            Contact Host
          </a>
        </div>
      </div>
    </section>
  );
}
