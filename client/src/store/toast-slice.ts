/* Redux */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Type of redux toast slice state
 */
export type TToastState = {
  showToast: boolean;
  mode: 'success' | 'warning' | 'error';
  message: string;
  autoClose: boolean;
  autoCloseTime: number;
};

const initialState: TToastState = {
  showToast: false,
  mode: 'success',
  message: '',
  autoClose: true,
  autoCloseTime: 3,
};

/* Slice ---------------------------------------------------------- */
export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<Payload>) {
      state.showToast = true;
      state.mode = action.payload.mode || 'success';
      state.message = action.payload.message;
      state.autoClose = action.payload.autoClose || true;
      state.autoCloseTime = action.payload.autoCloseTime || 3;
    },
    hideToast(state) {
      state.showToast = false;
    },
  },
});

const toastAction = toastSlice.actions;

export default toastAction;

/* Type of actions payload ---------------------------------------- */
export type Payload = {
  mode?: 'success' | 'warning' | 'error';
  message: string;
  autoClose?: boolean;
  autoCloseTime?: number;
};
