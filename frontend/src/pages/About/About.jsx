import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>About RentIt</h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '3rem', lineHeight: '1.7' }}>
        RentIt is a community-driven, peer-to-peer rental marketplace application that empowers individuals to share resources, reduce environmental waste, and save money by renting out unused assets.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Our Core Vision</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          In modern society, we buy many items that we only use occasionally—such as cameras, drills, lawnmowers, tents, or camping equipment. These items sit idle in storage for 95% of their lives. RentIt addresses this resource underutilization by creating a secure, verified portal where neighbors can rent these items from each other.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Key Platform Features</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          <li><strong>Secure JWT Authentication:</strong> Verified user profiles with role-based routing protecting private pages.</li>
          <li><strong>Booking Lifecycle:</strong> Integrated request pipelines allowing owners to approve or reject rentals.</li>
          <li><strong>Review System:</strong> Cumulative rating averages computed dynamically to ensure peer trust and accountability.</li>
          <li><strong>Interactive Search & Filters:</strong> Real-time indexing supporting location, price range, and condition querying.</li>
          <li><strong>Dark Mode Aesthetics:</strong> State-of-the-art UI theme toggles using HSL coordinated elements.</li>
        </ul>
      </section>

      <section id="terms" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '2rem' }}>
        <h2>Academic Project Details</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          This marketplace application was developed as a Final Year Major Project for the Bachelor of Technology in Computer Science & Engineering. The system integrates standard MVC backend structures using ExpressJS and Mongoose with React context state management for client reactivity.
        </p>
      </section>
    </div>
  );
};

export default About;
