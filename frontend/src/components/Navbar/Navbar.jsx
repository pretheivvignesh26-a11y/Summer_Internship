import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBell, FaUser, FaSignOutAlt, FaPlus, FaBars, FaTimes, FaHeart, FaListUl, FaBriefcase, FaChartBar, FaBoxOpen } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../services/api';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get('/notifications');
          if (data.success) {
            const unread = data.notifications.filter((n) => !n.isRead).length;
            setUnreadCount(unread);
          }
        } catch (error) {
          console.error('Failed to load notifications count:', error);
        }
      };
      fetchNotifications();
      
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <FaBoxOpen style={{ color: 'var(--primary-color)' }} /> <span>RentIt</span>
        </Link>

        {}
        <div className={`nav-links ${mobileMenuOpen ? 'active-mobile' : ''}`}>
          <NavLink to="/" className={({ active }) => `nav-link ${active ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/browse" className={({ active }) => `nav-link ${active ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Browse Items</NavLink>
          <NavLink to="/about" className={({ active }) => `nav-link ${active ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" className={({ active }) => `nav-link ${active ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
        </div>

        {}
        <div className="nav-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="theme-toggle-btn" style={{ position: 'relative' }} aria-label="Notifications">
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </Link>
              
              <Link to="/items/create" className="btn btn-primary btn-sm hide-mobile">
                <FaPlus /> Rent Your Item
              </Link>

              <div className="user-menu" ref={dropdownRef}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`}
                    alt={user.name}
                    className="user-avatar"
                  />
                </div>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-info" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      <p style={{ fontWeight: '700' }}>{user.name}</p>
                      <p style={{ color: 'var(--text-light)', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</p>
                    </div>
                    {user.role === 'Admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FaChartBar /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaUser /> Dashboard
                    </Link>
                    <Link to="/listings/my" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaListUl /> My Listings
                    </Link>
                    <Link to="/bookings/my" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaBriefcase /> My Bookings
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FaHeart /> Wishlist
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item btn-logout" style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons hide-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}

          <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <style>{`
        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--danger-color);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          border-radius: 50%;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }
        
        /* Mobile menu overlays styles */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background-color: var(--surface-color);
            border-bottom: 1px solid var(--border-color);
            flex-direction: column;
            padding: 1.5rem;
            gap: 1rem;
            box-shadow: var(--shadow-md);
          }
          .nav-links.active-mobile {
            display: flex;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
