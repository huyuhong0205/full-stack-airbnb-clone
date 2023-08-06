/* React */
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
/* Icon */
import { HiOutlineX } from 'react-icons/hi';
/* Transition group */
import { CSSTransition } from 'react-transition-group';

/* Components */
import Backdrop from './Backdrop';
/* Styles */
import './Modal.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
};

export default function Modal({ children, show, onClose }: Props) {
  const nodeRef = useRef(null);

  /* JSX ---------------------------------------------------------- */
  const modal = ReactDOM.createPortal(
    <CSSTransition
      classNames="modal"
      nodeRef={nodeRef}
      in={show}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      <div className="modal" ref={nodeRef}>
        <button onClick={onClose} className="modal__cancel-btn" type="button">
          <HiOutlineX className="modal__cancel-btn__icon" />
        </button>

        {children}
      </div>
    </CSSTransition>,
    document.getElementById('portal-modal') as HTMLDivElement
  );

  return (
    <>
      {modal}
      {show && <Backdrop onClick={onClose} />}
    </>
  );
}
