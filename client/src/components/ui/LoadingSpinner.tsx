/* React */
import React from 'react';

/* Styles */
import './LoadingSpinner.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  isLoading: boolean;
  isOverlay?: boolean;
};

LoadingSpinner.defaultProps = {
  isOverlay: false,
};

export default function LoadingSpinner({ isLoading, isOverlay }: Props) {
  /* JSX ---------------------------------------------------------- */
  return isLoading ? (
    <div className={`${isOverlay ? 'loading-spinner__overlay' : ''}`}>
      <div className="lds-dual-ring" />
    </div>
  ) : null;
}
