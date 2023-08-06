/* Redux */
import { configureStore } from '@reduxjs/toolkit';

/* Slices */
import { authSlice, TAuthState } from './auth-slice';
import { errorModalSlice, TErrorModalState } from './error-modal-slice';
import { toastSlice, TToastState } from './toast-slice';

/**
 * Type of redux state
 */
export interface IRootState {
  auth: TAuthState;
  errorModal: TErrorModalState;
  toast: TToastState;
}

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    errorModal: errorModalSlice.reducer,
    toast: toastSlice.reducer,
  },
});

export default store;
