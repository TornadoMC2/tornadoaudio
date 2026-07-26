import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section id="home" className="hero-section" itemScope itemType="https://schema.org/ProfessionalService">
      <div className="container">
        <div className="hero-content">
          <img
            src="/logo192.png"
            alt="Tornado Audio"
            className="hero-logo-image"
            itemProp="logo"
            width="192"
            height="192"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <h1 itemProp="name">Professional Audio Engineering</h1>
          <p className="hero-byline" itemProp="provider" itemScope itemType="https://schema.org/Person">
            by <span itemProp="name">Hunter Johanson</span>
          </p>
          <p className="hero-lede" itemProp="description">
            Studio mixing, mastering, and live sound engineering. From recording
            sessions to live performances, I deliver professional audio solutions
            tailored to your needs.
          </p>
          <nav className="hero-buttons" aria-label="Primary calls to action">
            <a href="#portfolio" className="btn-primary" aria-label="Listen to professional audio mixing samples and before/after comparisons">Hear My Work</a>
            <a href="#live-sound" className="btn-secondary" aria-label="View live sound engineering services">Live Sound</a>
          </nav>
        </div>

        <dl className="hero-stats" aria-label="Professional audio engineering service statistics">
          <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
            <dt itemProp="name">Tracks Mixed</dt>
            <dd itemProp="value">50+</dd>
          </div>
          <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
            <dt itemProp="name">Live Events</dt>
            <dd itemProp="value">100+</dd>
          </div>
          <div className="stat" itemScope itemType="https://schema.org/QuantitativeValue">
            <dt itemProp="name">Years Experience</dt>
            <dd itemProp="value">5+</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default HeroSection;
