import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaEdit, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import BookingCard from '../../components/BookingCard/BookingCard';
import itemService from '../../services/itemService';
import bookingService from '../../services/bookingService';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchMyData = async () => {
    try {
      const [listRes, bookRes] = await Promise.all([
        itemService.getItems(),
        bookingService.getBookings('owner')
      ]);

      if (listRes.success) {
        
        const mine = listRes.items.filter((item) => item.owner?._id === user?.id);
        setListings(mine);
      }

      if (bookRes.success) {
        setBookings(bookRes.bookings);
      }
    } catch (err) {
      toast.error('Failed to load listings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyData();
  }, [user]);

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing permanently?')) {
      try {
        const data = await itemService.deleteItem(id);
        if (data.success) {
          toast.success('Listing deleted successfully');
          setListings(prev => prev.filter(item => item._id !== id));
        }
      } catch (err) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(prev => prev.map(book => 
      book._id === bookingId ? { ...book, status: newStatus, paymentStatus: newStatus === 'Approved' ? 'Paid' : book.paymentStatus } : book
    ));
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1>My Listings</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your posted rental items and approve booking requests.</p>
        </div>
        <Link to="/items/create" className="btn btn-primary">
          <FaPlus /> Add New Listing
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }} className="details-layout">
        {}
        <div>
          <h3 style={{ marginBottom: '1.25rem' }}>Active Gear ({listings.length})</h3>
          
          {listings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', borderStyle: 'dashed' }}>
              <FaBoxOpen style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }} />
              <h4>No Items Listed Yet</h4>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem auto 1.5rem', maxWidth: '300px' }}>
                Start listing your cameras, gadgets, tools, or bikes to earn daily cash.
              </p>
              <Link to="/items/create" className="btn btn-primary btn-sm">
                Rent Your First Item
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {listings.map((item) => (
                <div key={item._id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=200&auto=format&fit=crop&q=60'}
                      alt={item.title}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}><Link to={`/items/${item._id}`}>{item.title}</Link></h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {formatCurrency(item.dailyPrice)}/day &bull; {item.location}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/items/edit/${item._id}`} className="btn btn-secondary btn-sm" aria-label="Edit listing">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDeleteListing(item._id)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger-color)' }} aria-label="Delete listing">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div>
          <h3 style={{ marginBottom: '1.25rem' }}>Rental Requests Received ({bookings.filter(b => b.status === 'Pending').length})</h3>
          
          {bookings.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No requests received yet from renters.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map((book) => (
                <BookingCard
                  key={book._id}
                  booking={book}
                  role="owner"
                  onStatusUpdate={handleBookingStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;
