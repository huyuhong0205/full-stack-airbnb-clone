/* React */
import React from 'react';

/* Components */
import { Button, Input } from '../../components/atoms';
/* Hooks */
import useInputValidate from '../../hooks/useInputValidate';
/* Utils */
import {
  valNotEmpty,
  valIsEmail,
  valIsSame,
  valMaxLength,
  valMinLength,
} from '../../utils/input-validators';

/* Styles */
import './AuthForm.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  inLoginMode: boolean;
  onSubmit: (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => void;
  onChangeMode: () => void;
};

export default function AuthForm({
  inLoginMode,
  onSubmit,
  onChangeMode,
}: Props) {
  // prettier-ignore
  const { ...usernameField } = useInputValidate([valNotEmpty, valMaxLength(30)]);
  // prettier-ignore
  const { ...emailField } = useInputValidate([valNotEmpty, valIsEmail]);
  // prettier-ignore
  const { ...passwordField } = useInputValidate([valMinLength(6), valMaxLength(12)]);
  // prettier-ignore
  const { ...passwordConfirmField } = useInputValidate([valNotEmpty, valIsSame(passwordField.value)]);

  // Disable form submit when has error
  let formIsNotValid: boolean;
  formIsNotValid = emailField.hasError || passwordField.hasError;
  if (!inLoginMode)
    formIsNotValid =
      formIsNotValid || usernameField.hasError || passwordConfirmField.hasError;

  /* Event handler ------------------------------------------------ */
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsNotValid) return;

    onSubmit(
      usernameField.value,
      emailField.value,
      passwordField.value,
      passwordConfirmField.value
    );
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <form onSubmit={handleFormSubmit} className="auth__form">
      {!inLoginMode && (
        <Input
          label="User Name"
          value={usernameField.value}
          isTouched={usernameField.isTouched}
          hasError={usernameField.hasError}
          errorMessage={
            usernameField.value.trim().length === 0
              ? 'please provide your name'
              : 'name up to 30 characters'
          }
          onBlur={usernameField.onBlur}
          onChange={usernameField.onChange}
        />
      )}
      <Input
        label="Email"
        placeholder="email@example.com"
        value={emailField.value}
        isTouched={emailField.isTouched}
        hasError={emailField.hasError}
        errorMessage="please provide a valid email"
        onBlur={emailField.onBlur}
        onChange={emailField.onChange}
      />
      <Input
        type="password"
        label="Password"
        value={passwordField.value}
        isTouched={passwordField.isTouched}
        hasError={passwordField.hasError}
        errorMessage={
          inLoginMode
            ? 'invalid password'
            : 'password must be between 6 - 12 characters'
        }
        onBlur={passwordField.onBlur}
        onChange={passwordField.onChange}
      />
      {!inLoginMode && (
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
      )}

      <span onClick={onChangeMode} className="auth__switch" role="presentation">
        {inLoginMode ? 'Switch to sign up' : 'Switch to login'}
      </span>

      <Button type="submit" disabled={formIsNotValid}>
        {inLoginMode ? 'Login' : 'Sign up'}
      </Button>
    </form>
  );
}
