import React from 'react';
import SearchBar from '../SearchBar/SearchBar';

const Hero = ({ onSearch }) => {
  return (
    <header className="hero">
      <div className="container hero-content">
        <h1 className="hero-title">
          Don't Buy it, Just <span>Rent It</span>
        </h1>
        <p className="hero-subtitle">
          Rent cameras, bikes, camping gear, laptops, and tools directly from verified people in your local neighborhood. Save money, live sustainably.
        </p>
        <div className="search-container">
          <SearchBar onSearch={onSearch} placeholder="Search for cameras, laptops, bicycles, drills..." />
        </div>
      </div>
    </header>
  );
};

export default Hero;
