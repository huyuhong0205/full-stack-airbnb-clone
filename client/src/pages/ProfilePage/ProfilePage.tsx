/* React */
import React, { useState } from 'react';
/* Router */
import { NavLink, Outlet } from 'react-router-dom';

/* Components */
import { ConfirmModal, LoadingSpinner } from '../../components/ui';
/* Hooks */
import useAuthenticate from '../../hooks/useAuthenticate';
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Styles */
import './ProfilePage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function ProfilePage() {
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] =
    useState<boolean>(false);

  const { logout } = useAuthenticate();
  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();

  /* Event handler ------------------------------------------------ */
  const handleShowConfirmModal = () => {
    setShowLogoutConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowLogoutConfirmModal(false);
  };

  const handleLogout = async () => {
    try {
      // (1) send logout request to clear jwt cookies
      await sendHttpRequest('/users/logout');

      // (2) close modal
      handleCloseConfirmModal();

      // (3) show toast
      showToast({ message: 'Successful logout' });

      // (4) logout in redux and local storage
      logout();
    } catch (_) {
      // unused
    }
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <ConfirmModal
        show={showLogoutConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleLogout}
        title="Confirm"
        message="Are you want to logout?"
        confirmActionText="Logout"
      />

      <div className="profile__container">
        <main className="profile">
          <nav className="profile__nav">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `profile__nav-link ${
                  isActive ? 'profile__nav-link--active' : ''
                }`
              }
              end // [NOTE] `exact`, `strict` props in react router dom@6
            >
              Profile
            </NavLink>

            <NavLink
              to="/profile/password"
              className={({ isActive }) =>
                `profile__nav-link ${
                  isActive ? 'profile__nav-link--active' : ''
                }`
              }
            >
              Password
            </NavLink>

            <button
              onClick={handleShowConfirmModal}
              className="profile__logout"
              type="button"
            >
              Logout
            </button>
          </nav>

          <div className="profile__content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
