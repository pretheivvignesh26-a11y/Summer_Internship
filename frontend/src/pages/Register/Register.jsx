import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidation = () => {
    const tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) tempErrors.email = 'Enter a valid email address';
    
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) {
      tempErrors.password = 'Password must be at least 6 characters and contain 1 letter and 1 number';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      tempErrors.phone = 'Enter a valid Indian mobile number (10 digits starting with 6-9)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setSubmitting(true);
    try {
      await register(formData);
      toast.success('Registration successful! Welcome to RentIt.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Email might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="card glass-card"
        style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Register now to start listing or renting out gear</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Full Name</label>
            <input
              type="text"
              name="name"
              id="name-input"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Eren Yeager"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              type="email"
              name="email"
              id="email-input"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="eren@yeager.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone-input">Mobile Number</label>
            <input
              type="text"
              name="phone"
              id="phone-input"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="9876543210"
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <input
              type="password"
              name="password"
              id="password-input"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="••••••••"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '700' }}>Login Here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
