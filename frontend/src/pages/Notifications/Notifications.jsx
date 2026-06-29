import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckDouble, FaRegCheckCircle, FaInbox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      if (data.success) {
        setNotifications(prev => prev.map(n => 
          n._id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { data } = await api.patch('/notifications/read-all');
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '750px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Alerts & Notifications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay updated with booking requests, responses, and rental terms status.</p>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <FaCheckDouble /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
          <FaInbox style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1.25rem' }} />
          <h3>Inbox is Empty</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You have no notification alerts at the moment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="card"
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                padding: '1.25rem 1.5rem',
                borderLeft: notif.isRead ? '1px solid var(--border-color)' : '4px solid var(--primary-color)',
                backgroundColor: notif.isRead ? 'var(--surface-color)' : 'var(--primary-light)08',
              }}
            >
              <div style={{ color: notif.isRead ? 'var(--text-light)' : 'var(--primary-color)', fontSize: '1.25rem', marginTop: '0.2rem' }}>
                <FaBell />
              </div>

              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: 0, fontSize: '0.975rem', fontWeight: notif.isRead ? '600' : '750' }}>{notif.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{notif.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginTop: '0.5rem' }}>{formatDate(notif.createdAt)}</span>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  style={{ border: 'none', background: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', padding: '0.25rem' }}
                  title="Mark as read"
                  aria-label="Mark notification as read"
                >
                  <FaRegCheckCircle />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
