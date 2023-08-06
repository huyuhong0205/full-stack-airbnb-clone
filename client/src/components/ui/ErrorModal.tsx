/* React */
import React, { useCallback } from 'react';
/* Redux */
import { useDispatch, useSelector } from 'react-redux';
/* Icon */
import { HiOutlineExclamation } from 'react-icons/hi';

/* Components */
import { Button, Modal } from '../atoms';
/* Store */
import errorModalAction from '../../store/error-modal-slice';
import type { IRootState } from '../../store/store';
/* Styles */
import './ErrorModal.scss';

/* //////////////////////////////////////////////////////////////// */
export default function ErrorModal() {
  const dispatch = useDispatch();
  const { showErrorModal, message } = useSelector(
    (state: IRootState) => state.errorModal
  );

  /* Event handler ------------------------------------------------ */
  const handleHideErrorModal = useCallback(() => {
    dispatch(errorModalAction.hideErrorModal());
  }, [dispatch]);

  /* JSX ---------------------------------------------------------- */
  return (
    <Modal show={showErrorModal} onClose={handleHideErrorModal}>
      <div className="error-modal">
        <h2 className="error-modal__title">
          <HiOutlineExclamation />
          Failed
        </h2>

        <p className="error-modal__message">{message}</p>

        <Button
          onClick={handleHideErrorModal}
          className="error-modal__btn"
          color="red"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
}
