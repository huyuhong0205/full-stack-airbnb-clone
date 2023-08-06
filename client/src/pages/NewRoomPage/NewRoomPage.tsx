/* React */
import React, { useState } from 'react';
/* Router */
import { useNavigate } from 'react-router-dom';

/* Components */
import { Button, Input } from '../../components/atoms';
import { LoadingSpinner } from '../../components/ui';
import ImagesUploader from './ImagesUploader';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useInputValidate from '../../hooks/useInputValidate';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import {
  valNotEmpty,
  valMaxLength,
  valMinValue,
  valMaxValue,
} from '../../utils/input-validators';
/* Styles */
import './NewRoomPage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function NewRoomPage() {
  const navigate = useNavigate();

  const [selectedImages, setSelectImages] = useState<File[]>([]);

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(httpError);
  const { showToast } = useToast();
  // prettier-ignore
  const { ...titleField } = useInputValidate([valNotEmpty, valMaxLength(100)]);
  // prettier-ignore
  const { ...priceField } = useInputValidate([valNotEmpty, valMinValue(1), valMaxValue(999999)]);
  // prettier-ignore
  const { ...addressField } = useInputValidate([valNotEmpty]);
  // prettier-ignore
  const { ...descriptionField } = useInputValidate([valNotEmpty, valMaxLength(3000)]);

  const formIsNotValid =
    selectedImages.length < 3 ||
    selectedImages.length > 10 ||
    titleField.hasError ||
    priceField.hasError ||
    addressField.hasError ||
    descriptionField.hasError;

  /* Event handler ------------------------------------------------ */
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsNotValid || isLoading) return;

    const formData = new FormData();
    formData.append('title', titleField.value);
    formData.append('price', priceField.value);
    formData.append('address', addressField.value);
    formData.append('description', descriptionField.value);
    selectedImages.forEach((image) => formData.append('images', image));

    try {
      // (1) send request
      await sendHttpRequest('/rooms', {
        method: 'POST',
        headers: {},
        body: formData,
      });

      // (2) show success toast and navigate to my-rooms page
      showToast({ message: 'Successful room creation' });
      navigate('/my-rooms');
    } catch (_) {
      // unused
    }
  };

  const handleAddImages = (newImages: File[]) => {
    setSelectImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (removeImageIndex: number) => {
    setSelectImages((prevImages) =>
      prevImages.filter((_, i) => i !== removeImageIndex)
    );
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <main className="new-room__container">
        <form onSubmit={handleCreateRoom} className="new-room">
          <ImagesUploader
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
          />

          <Input
            label="Title"
            value={titleField.value}
            isTouched={titleField.isTouched}
            hasError={titleField.hasError}
            errorMessage={
              titleField.value.trim().length === 0
                ? 'title cannot be empty'
                : 'title up to 100 characters'
            }
            onBlur={titleField.onBlur}
            onChange={titleField.onChange}
          />
          <Input
            type="number"
            label="Price / night"
            placeholder="Price"
            value={priceField.value}
            isTouched={priceField.isTouched}
            hasError={priceField.hasError}
            errorMessage={
              priceField.value.trim().length === 0
                ? 'price cannot be empty'
                : 'price must between 1 to 999999'
            }
            onBlur={priceField.onBlur}
            onChange={priceField.onChange}
          />
          <Input
            className="new-room__input"
            label="Address"
            value={addressField.value}
            isTouched={addressField.isTouched}
            hasError={addressField.hasError}
            errorMessage="address cannot be empty"
            onBlur={addressField.onBlur}
            onChange={addressField.onChange}
          />
          <Input
            className="new-room__input"
            textarea
            label="Description"
            placeholder="Description (support markdown)"
            value={descriptionField.value}
            isTouched={descriptionField.isTouched}
            hasError={descriptionField.hasError}
            errorMessage={
              descriptionField.value.trim().length === 0
                ? 'description cannot be empty'
                : 'description up to 3000 characters'
            }
            onBlur={descriptionField.onBlur}
            onChange={descriptionField.onChange}
          />

          <Button
            className="new-room__btn"
            type="submit"
            disabled={formIsNotValid}
          >
            Create
          </Button>
        </form>
      </main>
    </>
  );
}
