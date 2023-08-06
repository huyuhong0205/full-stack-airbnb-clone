/* React */
import React from 'react';

/* Components */
import { Button, Input } from '../../components/atoms';
import { LoadingSpinner } from '../../components/ui';
/* Hooks */
import useAuthenticate from '../../hooks/useAuthenticate';
import useHttpRequest from '../../hooks/useHttpRequest';
import useInputValidate from '../../hooks/useInputValidate';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import {
  valNotEmpty,
  valIsSame,
  valMaxLength,
  valMinLength,
} from '../../utils/input-validators';
/* Types */
import type { TGetTokenResponse } from '../../types/type-http-res-body';
/* Styles */
import './UpdatePasswordPage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function UpdatePasswordPage() {
  const { login } = useAuthenticate();
  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();
  // prettier-ignore
  const { ...currentPasswordField } = useInputValidate([valMinLength(6), valMaxLength(12)]);
  // prettier-ignore
  const { ...passwordField } = useInputValidate([valMinLength(6), valMaxLength(12)]);
  // prettier-ignore
  const { ...passwordConfirmField } = useInputValidate([valNotEmpty, valIsSame(passwordField.value)]);

  const formIsNotValid =
    currentPasswordField.hasError ||
    passwordField.hasError ||
    passwordConfirmField.hasError;

  /* Event handler------------------------------------------------- */
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsNotValid || isLoading) return;

    const currentPassword = currentPasswordField.value;
    const password = passwordField.value;
    const passwordConfirm = passwordConfirmField.value;

    try {
      // (1) send request
      const body = (await sendHttpRequest('/users/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          password,
          passwordConfirm,
        }),
      })) as TGetTokenResponse;

      // (2) if password change successful log user in
      login(body.data.role);

      // (3) show toast
      showToast({ message: 'Update password successfully' });
    } catch (_) {
      // unused
    }
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <div className="update-password__container">
        <form onSubmit={handleUpdatePassword} className="update-password">
          <Input
            type="password"
            label="Current password"
            value={currentPasswordField.value}
            isTouched={currentPasswordField.isTouched}
            hasError={currentPasswordField.hasError}
            errorMessage="invalid password"
            onBlur={currentPasswordField.onBlur}
            onChange={currentPasswordField.onChange}
          />
          <Input
            type="password"
            label="New password"
            value={passwordField.value}
            isTouched={passwordField.isTouched}
            hasError={passwordField.hasError}
            errorMessage="password must be between 6 - 12 characters"
            onBlur={passwordField.onBlur}
            onChange={passwordField.onChange}
          />
          <Input
            type="password"
            label="Password Confirm"
            value={passwordConfirmField.value}
            isTouched={passwordConfirmField.isTouched}
            hasError={passwordConfirmField.hasError}
            errorMessage="inconsistent password"
            onBlur={passwordConfirmField.onBlur}
            onChange={passwordConfirmField.onChange}
          />

          <Button
            className="update-password__btn"
            type="submit"
            disabled={formIsNotValid}
          >
            Update
          </Button>
        </form>
      </div>
    </>
  );
}
