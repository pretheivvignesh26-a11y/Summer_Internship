import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import BookingCard from '../../components/BookingCard/BookingCard';
import bookingService from '../../services/bookingService';
import useAuth from '../../hooks/useAuth';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings('renter');
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      toast.error('Failed to load your rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(book => 
      book._id === bookingId ? { ...book, status: newStatus } : book
    ));
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1>My Rentals / Bookings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and view your rental history, approved slots, and cancel pending requests.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
          <FaCalendarAlt style={{ fontSize: '3.5rem', color: 'var(--text-light)', marginBottom: '1.25rem' }} />
          <h3>No Rentals Booked</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            Looking for something to rent? Head over to the browse page to find cameras, electronics, vehicles, and tools near you.
          </p>
          <Link to="/browse" className="btn btn-primary btn-sm">
            Browse Rental Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              role="renter"
              onStatusUpdate={handleBookingStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
