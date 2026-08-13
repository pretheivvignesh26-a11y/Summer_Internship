import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3><FaBoxOpen style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--primary-color)' }} /> RentIt</h3>
            <p>A secure, student-built Peer-to-Peer Rental Marketplace enabling community sharing, sustainability, and easy item renting.</p>
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Developed as a Computer Science & Engineering Final Year Project.
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Marketplace</h4>
            <ul>
              <li><Link to="/browse">Browse Listings</Link></li>
              <li><Link to="/browse?category=1">Electronics</Link></li>
              <li><Link to="/browse?category=2">Vehicles</Link></li>
              <li><Link to="/browse?category=3">Tools</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about#privacy">Privacy Policy</Link></li>
              <li><Link to="/about#terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Student Team</h4>
            <ul>
              <li>Project Synopsis</li>
              <li>CSE Division A</li>
              <li>Batch 2022 - 2026</li>
              <li>Guide: vignesh </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentIt. All rights reserved.</p>
          <p>Handcrafted with React, Node, Express & MongoDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
