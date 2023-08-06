/* React */
import React from 'react';
/* Markdown */
import ReactMarkdown from 'react-markdown';

/* Components */
import SectionTitle from './SectionTitle';
/* Types */
import type { TRoom } from '../../types/type-http-res-body';
/* Styles */
import './Description.scss';

// prettier-ignore
const allowedElements: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em'];

/* //////////////////////////////////////////////////////////////// */
type Props = {
  title: TRoom['title'];
  description: TRoom['description'];
};

export default function Description({ title, description }: Props) {
  /* JSX ---------------------------------------------------------- */
  return (
    <section className="room-detail__description">
      <SectionTitle>{title}</SectionTitle>

      <ReactMarkdown
        className="room-detail__markdown"
        allowedElements={allowedElements}
      >
        {description}
      </ReactMarkdown>
    </section>
  );
}
