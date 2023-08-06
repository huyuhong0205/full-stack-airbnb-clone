/* React */
import React, { useCallback, useEffect, useState } from 'react';
/* Router */
import { useNavigate, useParams } from 'react-router-dom';

/* Components */
import { Button, Input } from '../../components/atoms';
import { ConfirmModal, LoadingSpinner } from '../../components/ui';
/* Hooks */
import useHttpRequest from '../../hooks/useHttpRequest';
import useInputValidate from '../../hooks/useInputValidate';
import useShowErrorModal from '../../hooks/useShowErrorModal';
import useToast from '../../hooks/useToast';
/* Utils */
import {
  valNotEmpty,
  valMaxLength,
  valMaxValue,
  valMinValue,
} from '../../utils/input-validators';
/* Types */
import type { TGetRoomResponse } from '../../types/type-http-res-body';
/* Styles */
import './EditRoomPage.scss';

/* //////////////////////////////////////////////////////////////// */
export default function EditRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams() as { roomId: string };

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);

  const { isLoading, httpError, sendHttpRequest } = useHttpRequest();
  useShowErrorModal(
    httpError,
    useCallback(() => setShowConfirmDeleteModal(false), [])
  );
  const { showToast } = useToast();
  // prettier-ignore
  const { setInputValue: setTitleValue, ...titleField } = useInputValidate([
    valNotEmpty, valMaxLength(100)
  ]);
  // prettier-ignore
  const { setInputValue: setPriceValue, ...priceField } = useInputValidate([
    valNotEmpty, valMinValue(1), valMaxValue(999999)
  ]);
  // prettier-ignore
  const { setInputValue: setDescriptionValue, ...descriptionField } = useInputValidate([
    valNotEmpty, valMaxLength(3000)
  ]);

  const formIsNotValid =
    titleField.hasError || priceField.hasError || descriptionField.hasError;

  useEffect(() => {
    (async function fetchRoomData() {
      try {
        const body = (await sendHttpRequest(
          `/rooms/${roomId}`
        )) as TGetRoomResponse;

        // prefill input field
        setTitleValue(body.data.room.title);
        setPriceValue(String(body.data.room.price));
        setDescriptionValue(body.data.room.description);
      } catch (_) {
        // unused
      }
    })();
  }, [
    sendHttpRequest,
    setTitleValue,
    setPriceValue,
    setDescriptionValue,
    roomId,
  ]);

  /* Event handler ------------------------------------------------ */
  const handleShowConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(true);
  };

  const handleCloseConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formIsNotValid || isLoading) return;

    try {
      await sendHttpRequest(`/rooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleField.value,
          price: priceField.value,
          description: descriptionField.value,
        }),
      });

      showToast({ message: 'Update room successfully.' });
    } catch (_) {
      // unused
    }
  };

  const handleDeleteRoom = async () => {
    if (isLoading) return;

    try {
      await sendHttpRequest(`/rooms/${roomId}`, { method: 'DELETE' });

      showToast({ message: 'Delete room successfully.' });
      navigate('/my-rooms');
    } catch (_) {
      // unused
    }
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <LoadingSpinner isLoading={isLoading} isOverlay />

      <ConfirmModal
        show={showConfirmDeleteModal}
        onClose={handleCloseConfirmDeleteModal}
        onConfirm={handleDeleteRoom}
        title="Delete room"
        message="Are you want to delete this room?"
        confirmActionText="Delete"
      />

      <main className="edit-room__container">
        <form onSubmit={handleUpdateRoom} className="edit-room">
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
            className="edit-room__input"
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

          <div className="edit-room__btns">
            <Button
              onClick={handleShowConfirmDeleteModal}
              color="red"
              type="button"
            >
              Delete
            </Button>

            <Button type="submit" disabled={formIsNotValid}>
              Update
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
