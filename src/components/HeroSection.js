import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-logo">
            <img src="/logo192.png" alt="Tornado Audio Logo" className="hero-logo-image" />
          </div>
          <h1>Professional Audio Mixing</h1>
          <h2>by Hunter Johanson</h2>
          <p>Transform your recordings into professional, radio-ready tracks. Specializing in all genres with over 3 years of mixing experience by Hunter Johanson.</p>
          <div className="hero-buttons">
            <a href="#portfolio" className="btn-primary">Listen to Samples</a>
            <a href="#pricing" className="btn-secondary">View Pricing</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mixing-console"></div>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <h3>50+</h3>
          <p>Tracks Mixed</p>
        </div>
        <div className="stat">
          <h3>3+</h3>
          <p>Years Experience</p>
        </div>
        <div className="stat">
          <h3>48hr</h3>
          <p>Average Turnaround</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
