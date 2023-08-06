/* React */
import React, { useMemo } from 'react';
/* Router */
import { useNavigate } from 'react-router-dom';
/* ICon */
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

/* Styles */
import './Pagination.scss';

/* //////////////////////////////////////////////////////////////// */
type Props = {
  totalPages: number;
  curQuery: string;
  curPage: number;
};

export default function Pagination({ totalPages, curQuery, curPage }: Props) {
  const navigate = useNavigate();

  const paginateArr = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  /* Event handler ------------------------------------------------ */
  const handleGoUpOnePage = () => {
    if (curPage === paginateArr[0]) return;
    navigate(`${curQuery}page=${curPage - 1}`);
  };

  const handleGoDownOnePage = () => {
    if (curPage === paginateArr.at(-1)) return;
    navigate(`${curQuery}page=${curPage + 1}`);
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <div className="pagination">
      <button
        onClick={handleGoUpOnePage}
        className={`pagination__btn ${
          curPage === paginateArr.at(0) ? 'pagination__btn--disable' : ''
        }`}
        type="button"
      >
        <HiOutlineChevronLeft className="pagination__btn-icon" />
      </button>

      {paginateArr.map((page) => (
        <button
          key={`page-${page}`}
          onClick={() => {
            if (curPage !== page) navigate(`${curQuery}page=${page}`);
          }}
          className={`pagination__btn ${
            curPage === page ? 'pagination__btn--active' : ''
          }`}
          type="button"
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleGoDownOnePage}
        className={`pagination__btn ${
          curPage === paginateArr.at(-1) ? 'pagination__btn--disable' : ''
        }`}
        type="button"
      >
        <HiOutlineChevronRight className="pagination__btn-icon" />
      </button>
    </div>
  );
}
