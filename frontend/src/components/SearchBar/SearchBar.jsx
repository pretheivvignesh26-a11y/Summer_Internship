import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = 'Search items...' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          aria-label="Search items query input"
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--border-radius-xl)', padding: '0.6rem 1.5rem' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
