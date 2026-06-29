import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartBar, FaUsers, FaBox, FaDollarSign, FaTrashAlt, FaTrash, FaCheck, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, listRes] = await Promise.all([
        api.get('/admin/statistics'),
        api.get('/admin/users'),
        api.get('/admin/listings')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.statistics);
      if (usersRes.data.success) setUsersList(usersRes.data.users);
      if (listRes.data.success) setListingsList(listRes.data.items);
    } catch (err) {
      toast.error('Failed to load admin metrics');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to FORCE delete user "${name}" and all their postings?`)) {
      try {
        const { data } = await api.delete(`/admin/users/${id}`);
        if (data.success) {
          toast.success(data.message);
          setUsersList(prev => prev.filter(u => u._id !== id));
          
          const statsRes = await api.get('/admin/statistics');
          if (statsRes.data.success) setStats(statsRes.data.statistics);
        }
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing from the platform?')) {
      try {
        const { data } = await api.delete(`/items/${id}`);
        if (data.success) {
          toast.success('Listing removed by admin');
          setListingsList(prev => prev.filter(item => item._id !== id));
          
          const statsRes = await api.get('/admin/statistics');
          if (statsRes.data.success) setStats(statsRes.data.statistics);
        }
      } catch (err) {
        toast.error('Failed to delete listing');
      }
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1>Admin Command Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Oversee platform stats, moderate user listings, and manage system accounts.</p>
        </div>
      </div>

      {}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartBar /> Platform Overview
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Manage Users ({usersList.length})
        </button>
        <button
          className={`btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('listings')}
        >
          <FaBox /> Moderate Listings ({listingsList.length})
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {activeTab === 'overview' && stats && (
          <div>
            {}
            <div className="dashboard-stats-grid">
              <div className="card stat-card">
                <span style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }}><FaUsers /></span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Total Members</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>

              <div className="card stat-card">
                <span style={{ color: 'var(--info-color)', fontSize: '1.5rem' }}><FaBox /></span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Total Listings</div>
                <div className="stat-value">{stats.totalListings}</div>
              </div>

              <div className="card stat-card">
                <span style={{ color: 'var(--warning-color)', fontSize: '1.5rem' }}><FaCalendarCheck /></span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Total Bookings</div>
                <div className="stat-value">{stats.totalBookings}</div>
              </div>

              <div className="card stat-card">
                <span style={{ color: 'var(--success-color)', fontSize: '1.5rem' }}><FaDollarSign /></span>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>Platform Revenue</div>
                <div className="stat-value">{formatCurrency(stats.revenue)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }} className="details-layout">
              {}
              <div className="card">
                <h3>Latest Platform Bookings</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Renter</th>
                        <th>Item</th>
                        <th>Book Date</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.latestBookings.map((book) => (
                        <tr key={book._id}>
                          <td>{book.renter?.name}</td>
                          <td>{book.item?.title || 'Deleted Item'}</td>
                          <td>{formatDate(book.bookingDate)}</td>
                          <td>{formatCurrency(book.totalPrice)}</td>
                          <td>
                            <span className={`badge ${
                              book.status === 'Approved' ? 'badge-success' :
                              book.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                            }`}>
                              {book.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {}
              <div className="card">
                <h3>Bookings Status Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  {stats.statusBreakdown.map((item) => {
                    const pct = Math.round((item.count / stats.totalBookings) * 100) || 0;
                    return (
                      <div key={item._id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                          <span>{item._id} ({item.count})</span>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h3>Registered Members</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((usr) => (
                    <tr key={usr._id}>
                      <td>
                        <img
                          src={usr.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${usr.name}`}
                          alt={usr.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </td>
                      <td style={{ fontWeight: '700' }}>{usr.name}</td>
                      <td>{usr.email}</td>
                      <td>{usr.phone || 'No phone'}</td>
                      <td>
                        <span className={`badge ${usr.role === 'Admin' ? 'badge-danger' : 'badge-info'}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td>{formatDate(usr.createdAt)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteUser(usr._id, usr.name)}
                          disabled={usr.role === 'Admin'}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger-color)', padding: '0.45rem' }}
                          title="Force delete user account"
                          aria-label="Force delete user"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="card">
            <h3>Rental Items Listed</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Category</th>
                    <th>Daily Cost</th>
                    <th>Location</th>
                    <th>Condition</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listingsList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=100&auto=format&fit=crop&q=60'}
                          alt={item.title}
                          style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                      </td>
                      <td style={{ fontWeight: '600' }}>{item.title}</td>
                      <td>{item.owner?.name}</td>
                      <td>{item.category?.name || 'Unknown'}</td>
                      <td>{formatCurrency(item.dailyPrice)}</td>
                      <td>{item.location}</td>
                      <td>{item.condition}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteListing(item._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger-color)', padding: '0.45rem' }}
                          title="Delete listing from platform"
                          aria-label="Delete listing"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
