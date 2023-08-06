/* React */
import React, { useEffect, useRef, useState } from 'react';
/* Icon */
import { HiOutlineUpload } from 'react-icons/hi';

/* Styles */
import './Avatar.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  file: File | undefined;
  onSelectFile: (selectedFile: File) => void;
  currentPhotoUrl: string | undefined;
};

export default function Avatar({ file, onSelectFile, currentPhotoUrl }: Props) {
  const filePickerEl = useRef<HTMLInputElement>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();

  // Create preview url
  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader(); // browser provide API
    fileReader.onload = () => {
      setImagePreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  /* Event handler ------------------------------------------------ */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length !== 1) return;

    onSelectFile(e.target.files[0]);
  };

  const handleShowImagePicker = () => {
    filePickerEl.current?.click();
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <>
      <input
        ref={filePickerEl}
        id="photo"
        name="photo"
        type="file"
        accept="image/*"
        onChange={handleSelectImage}
        style={{ display: 'none' }}
      />

      <figure
        onClick={handleShowImagePicker}
        className="avatar__figure"
        role="presentation"
      >
        {!imagePreviewUrl && currentPhotoUrl && (
          <img
            src={`${import.meta.env.VITE_SERVER_USER_IMG}${currentPhotoUrl}`}
            alt="Profile preview"
          />
        )}
        {imagePreviewUrl && <img src={imagePreviewUrl} alt="Profile preview" />}

        <figcaption className="avatar__caption">
          <HiOutlineUpload className="avatar__caption-icon" />
        </figcaption>
      </figure>
    </>
  );
}
