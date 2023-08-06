/* eslint-disable react/button-has-type -- as props */

/* React */
import React from 'react';

/* Styles */
import './Button.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'red' | 'green' | 'gray';
  type?: 'button' | 'submit';
  disabled?: boolean;
};

Button.defaultProps = {
  onClick: undefined,
  className: '',
  color: 'primary',
  type: 'button',
  disabled: false,
};

export default function Button({
  children,
  onClick,
  className,
  color,
  type,
  disabled,
}: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <button
      onClick={onClick}
      className={`button__btn button__btn--${color} ${className}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
