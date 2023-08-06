/* React */
import React from 'react';
/* Router */
import { useSearchParams } from 'react-router-dom';

/* Components */
import { LoadingSpinner } from '../../components/ui';
import AuthForm from './AuthForm';
/* Hooks */
import useAuthenticate from '../../hooks/useAuthenticate';
import useHttpRequest from '../../hooks/useHttpRequest';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import { delaySeconds } from '../../utils/delay-seconds';
/* Types */
import type { TGetTokenResponse } from '../../types/type-http-res-body';
/* Styles */
import './AuthPage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function AuthPage() {
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const mode = URLSearchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const { login } = useAuthenticate();
  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();

  /* Event handler ------------------------------------------------ */
  const handleSendHttpRequest = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      // (A) Send request for login
      if (mode === 'login') {
        // (1) send request
        const body = (await sendHttpRequest('/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })) as TGetTokenResponse;

        // (2) if no error login
        showToast({ message: 'Successful login' });
        await delaySeconds(1);
        login(body.data.role);
      }
      // (B) Send request for signup
      else {
        // (1) send request
        const body = (await sendHttpRequest('/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            passwordConfirm,
          }),
        })) as TGetTokenResponse;

        // (2) if no error login
        showToast({ message: 'Successful signup' });
        await delaySeconds(1);
        login(body.data.role);
      }
    } catch (_) {
      // unused
    }
  };

  const handleChangeMode = () => {
    SetURLSearchParams({ mode: mode === 'login' ? 'signup' : 'login' });
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />
      <div className="auth">
        <AuthForm
          inLoginMode={mode === 'login'}
          onSubmit={handleSendHttpRequest}
          onChangeMode={handleChangeMode}
        />
      </div>
    </>
  );
}
