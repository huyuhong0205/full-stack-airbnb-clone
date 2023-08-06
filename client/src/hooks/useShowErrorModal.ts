/* React */
import { useEffect } from 'react';
/* Redux */
import { useDispatch } from 'react-redux';

/* Store */
import errorModalAction from '../store/error-modal-slice';
/* Types */
import type { THttpError } from '../types/type-http-res-body';

/* //////////////////////////////////////////////////////////////// */
export default function useShowErrorModal(
  httpError: THttpError | null,
  cleanupFn?: () => void
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (cleanupFn) cleanupFn();

    if (httpError)
      dispatch(errorModalAction.showErrorModal({ message: httpError.message }));
  }, [dispatch, cleanupFn, httpError]);
}
