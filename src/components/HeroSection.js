import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section" itemScope itemType="https://schema.org/ProfessionalService">
      <div className="hero-content">
        <header className="hero-text">
          <div className="hero-logo">
            <img
              src="/logo192.png"
              alt="Tornado Audio Logo - Professional Audio Mixing Services by Hunter Johanson"
              className="hero-logo-image"
              itemProp="logo"
              width="192"
              height="192"
            />
          </div>
          <h1 itemProp="name">Professional Audio Mixing</h1>
          <h2 itemProp="provider" itemScope itemType="https://schema.org/Person">
            by <span itemProp="name">Hunter Johanson</span>
          </h2>
          <p itemProp="description">Transform your recordings into professional, radio-ready tracks. Specializing in all genres with over 3 years of mixing experience by Hunter Johanson.</p>
          <nav className="hero-buttons" aria-label="Main navigation">
            <a href="#portfolio" className="btn-primary" aria-label="Listen to audio mixing samples">Listen to Samples</a>
            <a href="#pricing" className="btn-secondary" aria-label="View audio mixing pricing packages">View Pricing</a>
          </nav>
        </header>
        <div className="hero-visual" role="img" aria-label="Audio mixing console visualization">
          <div className="mixing-console"></div>
        </div>
      </div>
      <aside className="hero-stats" aria-label="Service statistics">
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">50+</h3>
          <p itemProp="name">Tracks Mixed</p>
        </div>
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">3+</h3>
          <p itemProp="name">Years Experience</p>
        </div>
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">48hr</h3>
          <p itemProp="name">Average Turnaround</p>
        </div>
      </aside>
    </section>
  );
};

export default HeroSection;
