/* React */
import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
/* Redux */
import { useDispatch, useSelector } from 'react-redux';
/* Icon */
import { HiOutlineX } from 'react-icons/hi';
/* Transition group */
import { CSSTransition } from 'react-transition-group';

/* Store */
import toastAction from '../../store/toast-slice';
import type { IRootState } from '../../store/store';
/* Styles */
import './Toast.scss';

/* //////////////////////////////////////////////////////////////// */
export default function Toast() {
  const dispatch = useDispatch();
  const { showToast, mode, message, autoClose, autoCloseTime } = useSelector(
    (state: IRootState) => state.toast
  );

  const nodeRef = useRef(null);

  useEffect(() => {
    let timerId: number; // store timer id

    if (showToast && autoClose)
      timerId = setTimeout(() => {
        dispatch(toastAction.hideToast());
      }, autoCloseTime * 1000);

    return () => clearTimeout(timerId);
  }, [dispatch, showToast, autoClose, autoCloseTime]);

  /* Event handler ------------------------------------------------ */
  const handleHideToast = useCallback(() => {
    dispatch(toastAction.hideToast());
  }, [dispatch]);

  /* JSX ---------------------------------------------------------- */
  return ReactDOM.createPortal(
    <CSSTransition
      classNames="toast"
      nodeRef={nodeRef}
      in={showToast}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      <div ref={nodeRef} className={`toast toast--${mode}`}>
        <span className="toast__message">{message}</span>

        <button onClick={handleHideToast} className="toast__btn" type="button">
          <HiOutlineX className="toast__btn-icon" />
        </button>
      </div>
    </CSSTransition>,
    document.getElementById('portal-toast') as HTMLDivElement
  );
}
