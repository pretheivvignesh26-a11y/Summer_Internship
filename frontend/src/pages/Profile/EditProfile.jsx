import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaSave, FaCamera, FaTrashAlt, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Loader from '../../components/Loader/Loader';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || '');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return toast.warn('Name is required');

    setSubmitting(true);
    try {
      
      const profileData = await authService.updateProfile(formData);
      
      if (avatarFile) {
        const uploadForm = new FormData();
        uploadForm.append('image', avatarFile);
        const imageRes = await authService.uploadProfileImage(uploadForm);
        if (imageRes.success) {
          profileData.user.profileImage = imageRes.profileImage;
        }
      }

      toast.success('Profile updated successfully!');
      
      setUser(profileData.user);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? This action is permanent and will delete all your listings and booking history.')) {
      setDeleting(true);
      try {
        await authService.deleteAccount();
        toast.success('Your account has been deleted.');
        setUser(null);
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete account');
        setDeleting(false);
      }
    }
  };

  if (deleting) return <Loader fullPage />;

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '650px' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>
        <FaChevronLeft /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card"
      >
        <h2>Edit Profile</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update your personal particulars, contact mobile number, or profile photo.</p>

        <form onSubmit={handleSubmit}>
          {}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <img
                src={avatarPreview || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                alt="Avatar Preview"
                style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }}
              />
              <label style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.45rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', boxShadow: 'var(--shadow-md)' }} htmlFor="avatar-file-input">
                <FaCamera style={{ fontSize: '0.9rem' }} />
                <input
                  type="file"
                  id="avatar-file-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Change Profile Photo</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">Full Name *</label>
            <input
              type="text"
              name="name"
              id="edit-name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-email">Email Address (Non-editable)</label>
            <input
              type="email"
              id="edit-email"
              value={user?.email || ''}
              className="form-control"
              disabled
              style={{ backgroundColor: 'var(--secondary-light)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-phone">Contact Mobile Number</label>
            <input
              type="text"
              name="phone"
              id="edit-phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. 9876543210"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ width: '50%' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '50%' }} disabled={submitting}>
              <FaSave /> {submitting ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--danger-color)' }}>Delete Account</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Permanently remove account and active listings.</p>
          </div>
          <button type="button" onClick={handleDeleteAccount} className="btn btn-danger btn-sm">
            <FaTrashAlt /> Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
