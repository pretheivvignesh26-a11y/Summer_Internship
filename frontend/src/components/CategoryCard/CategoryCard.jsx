import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLaptop, FaCar, FaWrench, FaTv, FaCampground, FaBook } from 'react-icons/fa';

const getCategoryIcon = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes('electronic') || norm.includes('camera')) return <FaLaptop />;
  if (norm.includes('vehicle') || norm.includes('car') || norm.includes('bike')) return <FaCar />;
  if (norm.includes('tool') || norm.includes('equipment')) return <FaWrench />;
  if (norm.includes('appliance') || norm.includes('home')) return <FaTv />;
  if (norm.includes('outdoor') || norm.includes('camp')) return <FaCampground />;
  return <FaBook />;
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/browse?category=${category._id}`);
  };

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <div className="category-icon">
        {getCategoryIcon(category.name)}
      </div>
      <div className="category-name">{category.name}</div>
    </div>
  );
};

export default CategoryCard;
