import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';

const Reviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const { data } = await api.get('/items');
        if (data.success) {
          
          const allReviews = [];
          for (const item of data.items) {
            const revRes = await api.get(`/reviews/item/${item._id}`);
            if (revRes.data.success) {
              const mine = revRes.data.reviews.filter(r => r.user?._id === user.id);
              mine.forEach(r => allReviews.push({ ...r, itemTitle: item.title, itemId: item._id }));
            }
          }
          setReviews(allReviews);
        }
      } catch (err) {
        toast.error('Failed to load reviews list');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyReviews();
  }, [user]);

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '750px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1>My Written Reviews</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View ratings and feedback you posted on items you rented.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
          <FaStar style={{ fontSize: '3.5rem', color: 'var(--text-light)', marginBottom: '1.25rem' }} />
          <h3>No Reviews Written Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            You can write reviews for listings after booking them. Go to your bookings history to get started.
          </p>
          <Link to="/bookings/my" className="btn btn-primary btn-sm">
            Go to My Bookings
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map((rev) => (
            <div key={rev._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem' }}>
                    Item: <Link to={`/items/${rev.itemId}`}>{rev.itemTitle}</Link>
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Posted on {formatDate(rev.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{ color: i < rev.rating ? 'var(--warning-color)' : 'var(--border-color)', fontSize: '0.9rem' }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
