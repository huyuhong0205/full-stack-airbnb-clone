/* React */
import React, { useState } from 'react';
/* Router */
import { createSearchParams, useNavigate } from 'react-router-dom';
/* Icons */
import { FiSearch } from 'react-icons/fi';

/* Styles */
import './SearchBar.scss';

/* //////////////////////////////////////////////////////////////// */
export default function SearchBar() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState<string>('');

  /* Event handler ------------------------------------------------ */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // (1) check if searchInput not empty
    if (searchInput.trim().length === 0) return;

    // (2) convert to query parameters
    const queryParams = createSearchParams({
      location: searchInput.trim(),
      page: '1',
    }).toString();

    // (3) navigate to search page
    navigate({ pathname: '/search', search: queryParams });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  /* JSX ---------------------------------------------------------- */
  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        onChange={handleSearchInputChange}
        value={searchInput}
        placeholder="Search Location"
        className="search-bar__input"
        type="text"
      />

      <button className="search-bar__btn" type="submit">
        <FiSearch className="search-bar__btn-icon" />
      </button>
    </form>
  );
}
