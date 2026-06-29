import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import { formatDate, formatCurrency, getBookingStatusClass } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

const BookingCard = ({ booking, role = 'renter', onStatusUpdate }) => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this booking request?')) {
      setActionLoading(true);
      try {
        const data = await bookingService.approveBooking(booking._id);
        if (data.success) {
          toast.success('Booking request approved!');
          if (onStatusUpdate) onStatusUpdate(booking._id, 'Approved');
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to approve booking');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to decline this booking request?')) {
      setActionLoading(true);
      try {
        const data = await bookingService.rejectBooking(booking._id);
        if (data.success) {
          toast.success('Booking request declined.');
          if (onStatusUpdate) onStatusUpdate(booking._id, 'Rejected');
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to reject booking');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setActionLoading(true);
      try {
        const data = await bookingService.cancelBooking(booking._id);
        if (data.success) {
          toast.success('Booking cancelled successfully.');
          if (onStatusUpdate) onStatusUpdate(booking._id, 'Cancelled');
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to cancel booking');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const itemImage = booking.item?.images && booking.item.images.length > 0
    ? booking.item.images[0]
    : 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=300&auto=format&fit=crop&q=60';

  const otherUser = role === 'renter' ? booking.owner : booking.renter;

  return (
    <div className="card booking-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <img
          src={itemImage}
          alt={booking.item?.title || 'Item image'}
          style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--border-radius-md)' }}
        />
        
        <div style={{ flexGrow: 1, minWidth: '200px' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
            <Link to={`/items/${booking.item?._id}`}>{booking.item?.title || 'Deleted Item'}</Link>
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            <FaCalendarAlt />
            <span>{formatDate(booking.bookingDate)} - {formatDate(booking.returnDate)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            <FaUser />
            <span>{role === 'renter' ? 'Owner: ' : 'Renter: '} {otherUser?.name || 'User'} ({otherUser?.phone || 'No phone'})</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span className={`badge ${getBookingStatusClass(booking.status)}`}>
            {booking.status}
          </span>
          <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            {formatCurrency(booking.totalPrice)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <FaTag /> Payment: <span style={{ fontWeight: '700', color: booking.paymentStatus === 'Paid' ? 'var(--success-color)' : 'var(--text-secondary)' }}>{booking.paymentStatus}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {}
          {role === 'owner' && booking.status === 'Pending' && (
            <>
              <button className="btn btn-outline btn-sm" onClick={handleReject} disabled={actionLoading}>
                <FaTimes /> Decline
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleApprove} disabled={actionLoading}>
                <FaCheck /> Approve
              </button>
            </>
          )}

          {}
          {booking.status === 'Pending' && (
            <button className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={actionLoading} style={{ color: 'var(--danger-color)' }}>
              <FaBan /> Cancel
            </button>
          )}
          {booking.status === 'Approved' && role === 'renter' && (
            <button className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={actionLoading} style={{ color: 'var(--danger-color)' }}>
              <FaBan /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
