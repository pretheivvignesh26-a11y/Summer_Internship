import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTag, FaStar, FaUser, FaPhoneAlt, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import Loader from '../../components/Loader/Loader';
import itemService from '../../services/itemService';
import bookingService from '../../services/bookingService';
import reviewService from '../../services/reviewService';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate, getConditionColor } from '../../utils/helpers';

const ItemDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchItemData = async () => {
    try {
      const [itemRes, reviewRes] = await Promise.all([
        itemService.getItemDetails(id),
        reviewService.getReviews(id)
      ]);
      if (itemRes.success) setItem(itemRes.item);
      if (reviewRes.success) setReviews(reviewRes.reviews);
    } catch (err) {
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  const getBookingCost = () => {
    if (!bookingDate || !returnDate || !item) return 0;
    const start = new Date(bookingDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * item.dailyPrice;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !returnDate) {
      return toast.warn('Please select both booking start and return dates');
    }
    if (new Date(returnDate) <= new Date(bookingDate)) {
      return toast.warn('Return date must be after booking start date');
    }

    setBookingLoading(true);
    try {
      const data = await bookingService.bookItem({
        itemId: item._id,
        bookingDate,
        returnDate,
      });
      if (data.success) {
        toast.success('Rental request sent to owner!');
        navigate('/bookings/my');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      return toast.warn('Please write a comment for your review');
    }

    setReviewLoading(true);
    try {
      const data = await reviewService.addReview({
        itemId: item._id,
        rating,
        comment,
      });
      if (data.success) {
        toast.success('Review posted successfully!');
        setComment('');
        
        const reviewRes = await reviewService.getReviews(item._id);
        if (reviewRes.success) setReviews(reviewRes.reviews);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!item) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <FaExclamationCircle style={{ fontSize: '4rem', color: 'var(--danger-color)', marginBottom: '1rem' }} />
        <h2>Listing Not Found</h2>
        <Link to="/browse" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Back to Listings</Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && item.owner?._id === user.id;
  const conditionColor = getConditionColor(item.condition);
  const alreadyReviewed = isAuthenticated && user && reviews.some(r => r.user?._id === user.id);

  return (
    <div className="container details-layout">
      {}
      <div>
        <ImageSlider images={item.images} />

        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span className="badge badge-info">{item.category?.name || 'Category'}</span>
            <span
              className="badge"
              style={{ backgroundColor: `${conditionColor}20`, color: conditionColor, border: `1px solid ${conditionColor}` }}
            >
              {item.condition}
            </span>
            <span className={`badge ${item.availability ? 'badge-success' : 'badge-danger'}`}>
              {item.availability ? 'Available Now' : 'Rented Out'}
            </span>
          </div>

          <h1 style={{ marginBottom: '1rem' }}>{item.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            <FaMapMarkerAlt />
            <span>{item.location}</span>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <h3>Item Description</h3>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginTop: '0.75rem', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>

          {}
          <div className="details-owner-card">
            <img
              src={item.owner?.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.owner?.name}`}
              alt={item.owner?.name}
              className="owner-avatar"
            />
            <div>
              <h4 style={{ margin: 0 }}>Lister: {item.owner?.name || 'Anonymous Owner'}</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaEnvelope /> {item.owner?.email}</span>
                {item.owner?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaPhoneAlt /> {item.owner?.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {}
        <section className="reviews-section">
          <h3>Customer Reviews ({reviews.length})</h3>
          
          {}
          {isAuthenticated && !isOwner && !alreadyReviewed && (
            <div className="card" style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
              <h4>Write a Review</h4>
              <form onSubmit={handleReviewSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="rating-select">Rating Star</label>
                  <select
                    id="rating-select"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="form-control"
                    style={{ maxWidth: '150px' }}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="comment-input">Review Comment</label>
                  <textarea
                    id="comment-input"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-control"
                    placeholder="Describe your rental experience with this item..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm" disabled={reviewLoading}>
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {}
          <div style={{ marginTop: '1.5rem' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No reviews posted yet for this listing. Be the first to rent it!</p>
            ) : (
              reviews.map((rev) => (
                <ReviewCard key={rev._id} review={rev} />
              ))
            )}
          </div>
        </section>
      </div>

      {}
      <div>
        <aside className="card booking-widget">
          <div className="booking-widget-header">
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{formatCurrency(item.dailyPrice)}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}> / day</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
              <FaStar className="star-icon" />
              <span>{item.averageRating ? `${item.averageRating} (${reviews.length})` : 'New'}</span>
            </div>
          </div>

          {isOwner ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>This is your rental listing.</p>
              <Link to={`/items/edit/${item._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Edit Listing
              </Link>
            </div>
          ) : !item.availability ? (
            <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--danger-color)', fontWeight: '600' }}>
              This item is currently rented out or unavailable.
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="booking-date-input">Rent From</label>
                <input
                  type="date"
                  id="booking-date-input"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="return-date-input">Rent Until</label>
                <input
                  type="date"
                  id="return-date-input"
                  min={bookingDate || new Date().toISOString().split('T')[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="form-control"
                />
              </div>

              {bookingDate && returnDate && new Date(returnDate) > new Date(bookingDate) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--secondary-light)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem' }}>
                  <span style={{ fontWeight: '600' }}>Total Cost:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-color)' }}>{formatCurrency(getBookingCost())}</span>
                </div>
              )}

              {isAuthenticated ? (
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={bookingLoading}>
                  {bookingLoading ? 'Requesting...' : 'Request Booking'}
                </button>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                    Log In to Book
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Secure transactions via verified accounts</span>
                </div>
              )}
            </form>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ItemDetails;
