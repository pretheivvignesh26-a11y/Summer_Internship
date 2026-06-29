import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleValidation = () => {
    const tempErrors = {};
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) tempErrors.email = 'Enter a valid email address';
    if (!formData.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    setSubmitting(true);
    try {
      await login(formData);
      toast.success('Logged in successfully!');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials. Please try again.');
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
        style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Log in to rent items and manage listings</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <input
              type="email"
              name="email"
              id="email-input"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="name@email.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
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

          <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="form-check">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Remember Me</span>
            </label>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '700' }}>Register Here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
