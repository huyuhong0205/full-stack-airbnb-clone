/* React */
import { useCallback } from 'react';
/* Redux */
import { useDispatch } from 'react-redux';

/* Store */
import toastAction, { Payload as TToastPayload } from '../store/toast-slice';

/* //////////////////////////////////////////////////////////////// */
export default function useToast() {
  const dispatch = useDispatch();

  const showToast = useCallback(
    (toastPayload: TToastPayload) => {
      dispatch(toastAction.showToast({ ...toastPayload }));
    },
    [dispatch]
  );

  const hideToast = useCallback(() => {
    dispatch(toastAction.hideToast());
  }, [dispatch]);

  return { showToast, hideToast };
}
