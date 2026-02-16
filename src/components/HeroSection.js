import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section id="home" className="hero-section" itemScope itemType="https://schema.org/ProfessionalService">
      <div className="hero-content">
        <header className="hero-text">
          <div className="hero-logo">
            <img
              src="/logo192.png"
              alt="Tornado Audio Logo - Professional Audio Mixing and Live Sound Services by Hunter Johanson"
              className="hero-logo-image"
              itemProp="logo"
              width="192"
              height="192"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <h1 itemProp="name">Professional Audio Engineering</h1>
          <h2 itemProp="provider" itemScope itemType="https://schema.org/Person">
            by <span itemProp="name">Hunter Johanson</span>
          </h2>
          <p itemProp="description">Studio mixing, mastering, and live sound engineering. From recording sessions to live performances, I deliver professional audio solutions tailored to your needs.</p>
          <nav className="hero-buttons" aria-label="Main navigation">
            <a href="#portfolio" className="btn-primary" aria-label="Listen to professional audio mixing samples and before/after comparisons">Hear My Work</a>
            <a href="#live-sound" className="btn-secondary" aria-label="View live sound engineering services">Live Sound</a>
          </nav>
        </header>
        <div className="hero-visual" role="img" aria-label="Professional audio mixing console visualization representing expert audio production services">
          <div className="mixing-console"></div>
        </div>
      </div>
      <aside className="hero-stats" aria-label="Professional audio engineering service statistics">
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">50+</h3>
          <p itemProp="name">Tracks Mixed</p>
        </div>
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">100+</h3>
          <p itemProp="name">Live Events</p>
        </div>
        <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
          <h3 itemProp="value">5+</h3>
          <p itemProp="name">Years Experience</p>
        </div>
      </aside>
    </section>
  );
};

export default HeroSection;
