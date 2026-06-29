import React from 'react';
import { FaStar } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const ReviewCard = ({ review }) => {
  const avatarUrl = review.user?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${review.user?.name}`;

  return (
    <div className="review-list-card">
      <div className="review-list-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={avatarUrl}
            alt={review.user?.name || 'Reviewer'}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>{review.user?.name || 'Anonymous User'}</h5>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.1rem' }}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className="star-icon"
              style={{ color: i < review.rating ? 'var(--warning-color)' : 'var(--border-color)' }}
            />
          ))}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
