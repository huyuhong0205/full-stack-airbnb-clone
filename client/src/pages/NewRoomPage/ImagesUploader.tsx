/* React */
import React, { useState } from 'react';
/* Icon */
import { FiTrash2 } from 'react-icons/fi';

/* Styles */
import './ImagesUploader.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  onAddImages: (newImages: File[]) => void;
  onRemoveImage: (removeImageIndex: number) => void;
};

export default function ImagesUploader({ onAddImages, onRemoveImage }: Props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  /* Event handler ------------------------------------------------ */
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles) return;
    // turn FileList to array
    const selectedFilesArray = Array.from(selectedFiles);
    // create preview url
    const imagesArray = selectedFilesArray.map((file) =>
      URL.createObjectURL(file)
    );

    onAddImages(selectedFilesArray);
    setPreviewImages((prevImages) => [...prevImages, ...imagesArray]);
  };

  const handleRemoveImage = (removeImageIndex: number) => {
    onRemoveImage(removeImageIndex);
    setPreviewImages((prevImages) =>
      prevImages.filter((_, i) => i !== removeImageIndex)
    );
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <div className="images-uploader">
      <label htmlFor="images" className="images-uploader__label">
        <p className="images-uploader__label-title">+ Add images</p>
        <p>Your currently upload {previewImages.length} images</p>
        <div
          className={`images-uploader__error ${
            previewImages.length < 3 || previewImages.length > 10
              ? 'images-uploader__error--active'
              : ''
          }`}
        >
          <p>at least 3 images</p>
          <p>up to 10 images</p>
        </div>

        <input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImages}
          style={{ display: 'none' }}
        />
      </label>

      <div className="images-uploader__images">
        {previewImages &&
          previewImages.map((image, index) => (
            <figure key={image} className="images-uploader__figure">
              <button
                onClick={handleRemoveImage.bind(null, index)}
                className="images-uploader__btn"
                type="button"
              >
                <FiTrash2 className="images-uploader__btn-icon" />
              </button>

              <img src={image} alt={`Upload images preview ${index + 1}`} />
            </figure>
          ))}
      </div>
    </div>
  );
}
