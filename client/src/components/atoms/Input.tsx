/* eslint-disable jsx-a11y/label-has-associated-control */

/* React */
import React from 'react';

/* Styles */
import './Input.scss';

/* //////////////////////////////////////////////////////////////// */
interface Props {
  className?: string;
  textarea?: boolean;
  type?: 'text' | 'password' | 'number';
  label: string;
  placeholder?: string;
  value: string;
  isTouched: boolean;
  hasError: boolean;
  errorMessage: string;
  onBlur: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

Input.defaultProps = {
  className: '',
  textarea: false,
  type: 'text',
  placeholder: '',
};

export default function Input({
  className,
  textarea,
  type,
  label,
  placeholder = label,
  value,
  isTouched,
  hasError,
  errorMessage,
  onBlur,
  onChange,
}: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <div className={`input__container ${className}`}>
      <label className="input__label">{label}</label>

      {!textarea ? (
        <input
          className={`input__input ${
            hasError && isTouched ? 'input__input--error' : ''
          } ${hasError ? 'input__input--invalid' : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          spellCheck="false"
        />
      ) : (
        <textarea
          className={`input__input ${
            hasError && isTouched ? 'input__input--error' : ''
          } ${hasError ? 'input__input--invalid' : ''}`}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          rows={12}
          spellCheck="false"
        />
      )}

      <p
        className={`input__error-message ${
          hasError && isTouched ? 'input__error-message--show' : ''
        }`}
      >
        {errorMessage}
      </p>
    </div>
  );
}
