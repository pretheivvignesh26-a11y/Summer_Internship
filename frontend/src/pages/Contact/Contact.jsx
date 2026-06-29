import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.warn('Please fill in name, email, and message');
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been received! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 4rem' }}>
        Have questions about rental policies, verification, or disputes? Send us a message and our support team will help you.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }} className="details-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3>Get In Touch</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              We're here to help make your renting experience seamless and trustworthy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                  <FaEnvelope />
                </div>
                <div>
                  <h5 style={{ margin: 0 }}>Email Us</h5>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>support@rentit.com</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-color)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <h5 style={{ margin: 0 }}>Call Support</h5>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 98765 43210</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--info-light)', color: 'var(--info-color)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h5 style={{ margin: 0 }}>Campus Address</h5>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>CSE Block, Engineering College, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Send a Message</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name-input">Your Name</label>
                <input
                  type="text"
                  name="name"
                  id="name-input"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Steve Rogers"
                />
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
                  placeholder="steve@avengers.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="subject-input">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject-input"
                value={formData.subject}
                onChange={handleChange}
                className="form-control"
                placeholder="How does shipping/pickup work?"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message-input">Message</label>
              <textarea
                name="message"
                id="message-input"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                placeholder="Type your query here..."
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
