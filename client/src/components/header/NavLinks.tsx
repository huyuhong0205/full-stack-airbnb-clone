/* React */
import React from 'react';
/* Router */
import { NavLink } from 'react-router-dom';
/* Redux */
import { useSelector } from 'react-redux';
/* Icon */
import { FaTimes } from 'react-icons/fa';
import { HiHome, HiCalendar, HiUser } from 'react-icons/hi';

/* Store */
import { IRootState } from '../../store/store';
/* Styles */
import './NavLinks.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  show: boolean;
  onHide: () => void;
};

export default function NavLinks({ show, onHide: handleHideNavLinks }: Props) {
  const { isLogin, role } = useSelector((state: IRootState) => state.auth);

  /* JSX ---------------------------------------------------------- */
  return (
    <nav className={`nav-links ${show ? 'nav-links--response-open' : ''}`}>
      {isLogin ? (
        <>
          {role === 'host' && (
            <NavLink
              to="/my-rooms"
              onClick={handleHideNavLinks}
              className={({ isActive }) =>
                `nav-links__link ${isActive ? 'nav-links__link--active' : ''}`
              }
            >
              <HiHome className="nav-links__link__icon" />
              <span className="nav-links__link__text">My rooms</span>
            </NavLink>
          )}

          <NavLink
            to="/booking"
            onClick={handleHideNavLinks}
            className={({ isActive }) =>
              `nav-links__link ${isActive ? 'nav-links__link--active' : ''}`
            }
          >
            <HiCalendar className="nav-links__link__icon" />
            <span className="nav-links__link__text">My bookings</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={handleHideNavLinks}
            className={({ isActive }) =>
              `nav-links__link ${isActive ? 'nav-links__link--active' : ''}`
            }
          >
            <HiUser className="nav-links__link__icon" />
            <span className="nav-links__link__text">Profile</span>
          </NavLink>
        </>
      ) : (
        <NavLink
          to="/auth"
          onClick={handleHideNavLinks}
          className={({ isActive }) =>
            `nav-links__link ${isActive ? 'nav-links__link--active' : ''}`
          }
        >
          Sign in
        </NavLink>
      )}

      <button
        onClick={handleHideNavLinks}
        type="button"
        className="nav-links__button nav-links__button--close"
      >
        <FaTimes className="nav-links__button-icon" />
      </button>
    </nav>
  );
}
