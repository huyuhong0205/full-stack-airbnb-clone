/* React */
import React from 'react';

/* Components */
import { Button, Modal } from '../atoms';
/* Styles */
import './ConfirmModal.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmActionText: string;
};

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmActionText,
}: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <Modal show={show} onClose={onClose}>
      <div className="confirm-modal">
        <h2 className="confirm-modal__title">{title}</h2>

        <p className="confirm-modal__message">{message}</p>

        <div className="confirm-modal__btns">
          <Button onClick={onClose} color="gray">
            Cancel
          </Button>

          <Button onClick={onConfirm} color="red">
            {confirmActionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
