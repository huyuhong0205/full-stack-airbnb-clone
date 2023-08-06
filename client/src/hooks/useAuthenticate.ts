/* React */
import { useCallback } from 'react';
/* Redux */
import { useDispatch } from 'react-redux';

/* Store */
import authAction, { TAuthState } from '../store/auth-slice';

// Type of data from localStorage
type TAuthLocalStore = {
  expired: string | null;
  role: TAuthState['role'];
};

/* //////////////////////////////////////////////////////////////// */
export default function useAuthenticate() {
  const dispatch = useDispatch();

  /**
   * Read data from localStorage and check if user login
   */
  const checkIfLogin = useCallback((): void => {
    // (1) get data from local storage
    const authLocal = localStorage.getItem('auth');
    if (!authLocal) return;
    const { expired, role } = JSON.parse(authLocal) as TAuthLocalStore;

    // (2) check if user have no token or token is expired
    if (!role || !expired || Date.now() > new Date(expired).getTime()) return;

    // (3) use redux auth slice login action
    dispatch(authAction.login({ role }));
  }, [dispatch]);

  /**
   * Dispatch `authAction.login` action and write data to localStorage
   * @param token Token get from server response
   * @param role Role get from server response
   */
  const login = useCallback(
    (role: TAuthState['role']): void => {
      // (1) dispatch state to redux
      dispatch(authAction.login({ role }));

      // (2) write data to local storage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          // JWT expires is 30 days
          expired: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 - 10 * 1000
          ).toISOString(),
          role,
        })
      );
    },
    [dispatch]
  );

  /**
   * Dispatch `authAction.logout` action and clear data from localStorage
   */
  const logout = useCallback(() => {
    // (1) use redux auth slice login action
    dispatch(authAction.logout());

    // (2) clear data from localStorage
    localStorage.removeItem('auth');
  }, [dispatch]);

  return { checkIfLogin, login, logout };
}
