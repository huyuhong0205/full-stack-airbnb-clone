/* React */
import React from 'react';
/* Icon */
import { FaGithub } from 'react-icons/fa';

/* Styles */
import './Footer.scss';

/* //////////////////////////////////////////////////////////////// */
export default function Footer() {
  /* JSX ---------------------------------------------------------- */
  return (
    <footer className="footer">
      <div className="footer__links">
        <h2 className="footer__links-title">Contact me</h2>
        <a
          href="https://github.com/huyuhong0205"
          className="footer__link"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub className="footer__link-icon" />
          huyuhong0205
        </a>
        {/* [TODO] add other links */}
      </div>

      <p className="footer__copyright">
        <span>
          &copy; A demo project for practicing web development skills,
        </span>
        <span>&nbsp;made by HU YU-HONG</span>
      </p>
    </footer>
  );
}
