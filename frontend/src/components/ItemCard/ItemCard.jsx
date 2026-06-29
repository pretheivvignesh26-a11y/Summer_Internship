import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { formatCurrency, getConditionColor } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import itemService from '../../services/itemService';
import { toast } from 'react-toastify';

const ItemCard = ({ item, isWishlistedInitial = false, onWishlistToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsWishlisted(isWishlistedInitial);
  }, [isWishlistedInitial]);

  const handleWishlistClick = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please log in to manage your wishlist');
      return navigate('/login');
    }

    setWishlistLoading(true);
    try {
      const data = await itemService.toggleWishlist(item._id);
      if (data.success) {
        setIsWishlisted(data.added);
        toast.success(data.message);
        if (onWishlistToggle) {
          onWishlistToggle(item._id, data.added);
        }
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const conditionColor = getConditionColor(item.condition);
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0] 
    : 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="card item-card card-hover">
      <Link to={`/items/${item._id}`} style={{ display: 'block', color: 'inherit' }}>
        <div className="item-card-image">
          <img src={imageUrl} alt={item.title} />
          <button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            aria-label="Add to wishlist"
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="item-card-content">
          <div className="item-card-header">
            <span className="item-card-category">{item.category?.name || 'Category'}</span>
            <span
              className="item-card-condition"
              style={{
                backgroundColor: `${conditionColor}20`,
                color: conditionColor,
                border: `1px solid ${conditionColor}`
              }}
            >
              {item.condition}
            </span>
          </div>

          <h3 className="item-card-title">{item.title}</h3>

          <div className="item-card-location">
            <FaMapMarkerAlt />
            <span>{item.location}</span>
          </div>

          <div className="item-card-footer">
            <div className="item-card-price">
              {formatCurrency(item.dailyPrice)}<span>/ day</span>
            </div>
            
            <div className="item-card-rating">
              <FaStar className="star-icon" />
              <span>{item.averageRating ? item.averageRating : 'New'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
