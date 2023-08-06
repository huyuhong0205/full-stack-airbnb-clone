/* React */
import React from 'react';
import ReactDOM from 'react-dom';

/* Styles */
import './Backdrop.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  onClick: () => void;
};

export default function Backdrop({ onClick }: Props) {
  /* JSX ---------------------------------------------------------- */
  return ReactDOM.createPortal(
    <div onClick={onClick} className="backdrop" role="presentation" />,
    document.getElementById('portal-backdrop') as HTMLDivElement
  );
}
