/* React */
import React, { useEffect, useState } from 'react';

/* Components */
import { Button, Input } from '../../components/atoms';
import { LoadingSpinner } from '../../components/ui';
import Avatar from './Avatar';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useInputValidate from '../../hooks/useInputValidate';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import {
  valNotEmpty,
  valIsEmail,
  valMaxLength,
} from '../../utils/input-validators';
/* Types */
import type { TGetProfileResponse } from '../../types/type-http-res-body';
/* Styles */
import './UpdateProfilePage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function UpdateProfilePage() {
  const [imageFile, setImageFile] = useState<File>();
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>();

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();
  // prettier-ignore
  const { setInputValue: setNameValue, ...nameField } = useInputValidate([valNotEmpty, valMaxLength(30)]);
  // prettier-ignore
  const { setInputValue: setEmailValue, ...emailField } = useInputValidate([valIsEmail]);

  const formIsNotValid = nameField.hasError || emailField.hasError;

  useEffect(() => {
    (async function fetchUserProfileData() {
      try {
        const body = (await sendHttpRequest(
          '/users/profile'
        )) as TGetProfileResponse;

        setNameValue(body.data.user.name);
        setEmailValue(body.data.user.email);
        setCurrentPhotoUrl(body.data.user.photo);
      } catch (_) {
        // unused
      }
    })();
  }, [sendHttpRequest, setNameValue, setEmailValue]);

  /* Event handler ------------------------------------------------ */
  const handelUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsNotValid || isLoading) return;

    const formData = new FormData();

    formData.append('name', nameField.value);
    formData.append('email', emailField.value);
    if (imageFile) formData.append('photo', imageFile);

    try {
      await sendHttpRequest('/users/profile', {
        method: 'PATCH',
        headers: {},
        body: formData,
      });

      // Show success toast
      showToast({ message: 'Update profile successfully' });
    } catch (_) {
      // unused
    }
  };

  const handleSelectFile = (selectedFile: File) => {
    setImageFile(selectedFile);
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <form onSubmit={handelUpdateProfile} className="update-profile">
        <Avatar
          file={imageFile}
          currentPhotoUrl={currentPhotoUrl}
          onSelectFile={handleSelectFile}
        />

        <Input
          label="name"
          value={nameField.value}
          isTouched={nameField.isTouched}
          hasError={nameField.hasError}
          errorMessage={
            nameField.value.trim().length === 0
              ? 'please provide your name'
              : 'name up to 30 characters'
          }
          onBlur={nameField.onBlur}
          onChange={nameField.onChange}
        />
        <Input
          label="email"
          value={emailField.value}
          isTouched={emailField.isTouched}
          hasError={emailField.hasError}
          errorMessage="please provide a valid email"
          onBlur={emailField.onBlur}
          onChange={emailField.onChange}
        />

        <Button
          className="update-profile__btn"
          type="submit"
          disabled={formIsNotValid}
        >
          Update
        </Button>
      </form>
    </>
  );
}
