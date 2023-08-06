/* React */
import React, { useState, memo } from 'react';
/* Icon */
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

/* Types */
import type { TRoom } from '../../types/type-http-res-body';
/* Styles */
import './Gallery.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  title: TRoom['title'];
  images: TRoom['images'];
};

function Gallery({ title, images }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  /* Event handler ------------------------------------------------ */
  const handleGoLeft = () => {
    setCurrentImageIndex((cur) => (cur === 0 ? images.length - 1 : cur - 1));
  };

  const handleGoRight = () => {
    setCurrentImageIndex((cur) => (cur === images.length - 1 ? 0 : cur + 1));
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <section className="gallery">
      <div className="gallery__display">
        {images.map((image, index) => (
          <figure
            key={`${image}-container`}
            className={`gallery__figure ${
              index === currentImageIndex ? 'gallery__figure--active' : ''
            }`}
          >
            {index === currentImageIndex && (
              <img
                src={`${import.meta.env.VITE_SERVER_ROOM_IMG}${image}`}
                alt={`${title} ${currentImageIndex + 1}`}
              />
            )}
          </figure>
        ))}

        <button
          onClick={handleGoLeft}
          className="gallery__btn gallery__btn--left"
          type="button"
        >
          <FaArrowLeft className="gallery__btn-icon" />
        </button>

        <button
          onClick={handleGoRight}
          className="gallery__btn gallery__btn--right"
          type="button"
        >
          <FaArrowRight className="gallery__btn-icon" />
        </button>
      </div>

      <div className="gallery__slider">
        {images.map((image, index) => (
          <img
            key={image}
            src={`${import.meta.env.VITE_SERVER_ROOM_IMG}${image}`}
            alt={`${title} preview ${index + 1}`}
            onClick={() => setCurrentImageIndex(index)}
            className={`gallery__slider-img ${
              currentImageIndex === index ? 'gallery__slider-img--active' : ''
            }`}
            role="presentation"
          />
        ))}
      </div>
    </section>
  );
}

const MemoedGallery = memo(Gallery);

export default MemoedGallery;
