/* Redux */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Type of redux errorModal slice state
 */
export type TErrorModalState = {
  showErrorModal: boolean;
  message: string;
};

const initialState: TErrorModalState = {
  showErrorModal: false,
  message: '',
};

/* Slice ---------------------------------------------------------- */
export const errorModalSlice = createSlice({
  name: 'errorModal',
  initialState,
  reducers: {
    showErrorModal(state, action: PayloadAction<Payload>) {
      state.showErrorModal = true;
      state.message = action.payload.message;
    },
    hideErrorModal(state) {
      state.showErrorModal = false;
    },
  },
});

const errorModalAction = errorModalSlice.actions;

export default errorModalAction;

/* Type of actions payload ---------------------------------------- */
type Payload = {
  message: string;
};
