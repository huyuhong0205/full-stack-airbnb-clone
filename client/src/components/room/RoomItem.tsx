/* React */
import React from 'react';
/* Router */
import { Link } from 'react-router-dom';
/* Icon */
import { FaStar } from 'react-icons/fa';

/* Types */
import type { TRooms } from '../../types/type-http-res-body';
/* Styles */
import './RoomItem.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  room: TRooms;
  asPopup?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const RoomItem = React.forwardRef<HTMLAnchorElement, Props>(function Component(
  { room, asPopup, onMouseEnter, onMouseLeave },
  ref
) {
  const { id, title, price, rating, images } = room;

  const className = asPopup ? 'room-item--popup' : 'room-item';

  /* JSX ---------------------------------------------------------- */
  return (
    <Link
      ref={ref}
      to={`/rooms/${id}`}
      className={`${className}__container`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <figure className={`${className}__figure`}>
        <img
          src={`${import.meta.env.VITE_SERVER_ROOM_IMG}${images[0]}`}
          alt={title}
        />
      </figure>

      <div className={`${className}__info`}>
        <div className={`${className}__info-top`}>
          <h3 className={`${className}__title`}>{title}</h3>
        </div>

        <div className={`${className}__info-bottom`}>
          <p className={`${className}__price`}>
            <span>${price}TWD</span> night
          </p>

          <p className={`${className}__rating`}>
            {rating.quantity > 0 && (
              <>
                <span className={`${className}__rating-average`}>
                  <FaStar className={`${className}__icon`} />
                  {rating.average}
                </span>

                <span className={`${className}__rating-quantity`}>
                  &nbsp;({rating.quantity})
                </span>
              </>
            )}
            {rating.quantity === 0 && (
              <span className={`${className}__rating-new`}>
                <FaStar className={`${className}__icon`} />
                New
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
});

RoomItem.defaultProps = {
  asPopup: false,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
};

export default RoomItem;
