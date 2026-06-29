import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' }}>
      <FaExclamationTriangle style={{ fontSize: '5rem', color: 'var(--warning-color)', marginBottom: '1.5rem' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        <FaHome /> Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
