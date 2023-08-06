/* React */
import React, { useCallback, useState } from 'react';
/* Router */
import { Link } from 'react-router-dom';
/* Icon */
import { FaBars } from 'react-icons/fa';

/* Components */
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';
/* Styles */
import './Header.scss';

/* //////////////////////////////////////////////////////////////// */
export default function Header() {
  const [showNavLinks, setShowNavLinks] = useState<boolean>(false);

  /* Event handler ------------------------------------------------ */

  const handleShowNavLinks = useCallback(() => {
    setShowNavLinks(true);
  }, []);

  const handleHideNavLinks = useCallback(() => {
    setShowNavLinks(false);
  }, []);

  /* JSX ---------------------------------------------------------- */
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img
          src="/Airbnb-logo.png"
          alt="Airbnb Logo"
          className="header__img header__img--large"
        />
        <img
          src="/Airbnb-logo-small.png"
          alt="Airbnb Logo"
          className="header__img header__img--small"
        />
      </Link>

      <SearchBar />

      <NavLinks show={showNavLinks} onHide={handleHideNavLinks} />

      <button
        onClick={handleShowNavLinks}
        type="button"
        className="header__button header__button--open"
      >
        <FaBars className="header__button__icon" />
      </button>
    </header>
  );
}
