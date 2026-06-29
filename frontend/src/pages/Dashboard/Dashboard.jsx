import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaCalendarCheck, FaHeart, FaBell, FaUser, FaHistory } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ listingsCount: 0, bookingsCount: 0, wishlistCount: 0, unreadNotifications: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [listRes, bookRes, wishRes, notifRes] = await Promise.all([
          api.get('/items'),
          api.get('/bookings'),
          api.get('/wishlist'),
          api.get('/notifications')
        ]);

        const myListings = listRes.data.items?.filter(item => item.owner?._id === user.id) || [];
        const myBookings = bookRes.data.bookings || [];
        const myWishlist = wishRes.data.wishlist || [];
        const myNotifications = notifRes.data.notifications || [];

        setStats({
          listingsCount: myListings.length,
          bookingsCount: myBookings.length,
          wishlistCount: myWishlist.length,
          unreadNotifications: myNotifications.filter(n => !n.isRead).length
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardStats();
  }, [user]);

  if (loading) return <Loader fullPage />;

  return (
    <div className="container dashboard-layout">
      {}
      <aside>
        <div className="dashboard-sidebar-menu">
          <Link to="/dashboard" className="dashboard-menu-item active">
            <FaUser /> Profile Overview
          </Link>
          <Link to="/listings/my" className="dashboard-menu-item">
            <FaBox /> My Listings
          </Link>
          <Link to="/bookings/my" className="dashboard-menu-item">
            <FaCalendarCheck /> My Bookings
          </Link>
          <Link to="/wishlist" className="dashboard-menu-item">
            <FaHeart /> Wishlist
          </Link>
          <Link to="/notifications" className="dashboard-menu-item">
            <FaBell /> Notifications ({stats.unreadNotifications})
          </Link>
        </div>
      </aside>

      {}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>User Dashboard</h2>
          <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Welcome back, {user?.name}!</span>
        </div>

        {}
        <div className="dashboard-stats-grid">
          <div className="card stat-card card-hover" onClick={() => navigate('/listings/my')} style={{ cursor: 'pointer' }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}><FaBox /></span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Active Listings</div>
            <div className="stat-value">{stats.listingsCount}</div>
          </div>

          <div className="card stat-card card-hover" onClick={() => navigate('/bookings/my')} style={{ cursor: 'pointer' }}>
            <span style={{ color: 'var(--success-color)', fontSize: '1.5rem' }}><FaCalendarCheck /></span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Total Rentals</div>
            <div className="stat-value">{stats.bookingsCount}</div>
          </div>

          <div className="card stat-card card-hover" onClick={() => navigate('/wishlist')} style={{ cursor: 'pointer' }}>
            <span style={{ color: 'var(--danger-color)', fontSize: '1.5rem' }}><FaHeart /></span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Wishlist Items</div>
            <div className="stat-value">{stats.wishlistCount}</div>
          </div>

          <div className="card stat-card card-hover" onClick={() => navigate('/notifications')} style={{ cursor: 'pointer' }}>
            <span style={{ color: 'var(--warning-color)', fontSize: '1.5rem' }}><FaBell /></span>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>New Alerts</div>
            <div className="stat-value">{stats.unreadNotifications}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="grid-cols-2">
          {}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>My Account</h3>
            {user && <ProfileCard user={user} />}
          </div>

          {}
          <div className="card">
            <h3>Quick Activities</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0 1.5rem' }}>Monitor and update listings or rent tools.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/items/create" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>
                <FaBox style={{ marginRight: '0.5rem' }} /> List a New Item
              </Link>
              <Link to="/browse" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center' }}>
                <FaCalendarCheck style={{ marginRight: '0.5rem' }} /> Rent items in Browse
              </Link>
              
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <FaHistory /> <span>Account Access Details</span>
                </div>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Role clearances: {user?.role}</li>
                  <li>Account ID: {user?.id}</li>
                  <li>Status: Verified Account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
