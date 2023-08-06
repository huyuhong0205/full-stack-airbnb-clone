/* Redux */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Type of redux auth slice state
 */
export type TAuthState = {
  isLogin: boolean;
  role: 'user' | 'host' | 'admin' | null;
};

const initialState: TAuthState = {
  isLogin: false,
  role: null,
};

/* Slice ---------------------------------------------------------- */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<Payload>) {
      state.isLogin = true;
      state.role = action.payload.role;
    },
    logout(state) {
      state.isLogin = false;
      state.role = null;
    },
  },
});

const authAction = authSlice.actions;

export default authAction;

/* Type of actions payload ---------------------------------------- */
type Payload = {
  role: TAuthState['role'];
};
