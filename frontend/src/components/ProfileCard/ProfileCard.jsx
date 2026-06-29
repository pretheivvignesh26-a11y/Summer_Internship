import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserEdit, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import { formatDate } from '../../utils/helpers';

const ProfileCard = ({ user }) => {
  const avatarUrl = user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`;

  return (
    <div className="card profile-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
      <img
        src={avatarUrl}
        alt={user.name}
        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-md)' }}
      />
      
      <h3 style={{ marginBottom: '0.25rem' }}>{user.name}</h3>
      <span className="badge badge-info" style={{ marginBottom: '1.5rem' }}>
        <FaShieldAlt style={{ marginRight: '0.25rem' }} /> {user.role}
      </span>

      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <FaEnvelope />
          <span>{user.email}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <FaPhoneAlt />
          <span>{user.phone || 'No phone number added'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <FaCalendarAlt />
          <span>Joined: {formatDate(user.createdAt)}</span>
        </div>
      </div>

      <Link to="/profile/edit" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
        <FaUserEdit /> Edit Profile
      </Link>
    </div>
  );
};

export default ProfileCard;
