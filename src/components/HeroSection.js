import React from 'react';
import './HeroSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

const HeroSection = () => {
  const { businessInfo, locationInfo } = useSiteConfig();

  // TODO (Hunter): these figures are now load-bearing — they sit next to a
  // $250 price rather than a $40 one. Confirm each is accurate before launch.
  const stats = [
    { label: 'Tracks Mixed', value: '50+' },
    { label: 'Live Events', value: '100+' },
    { label: 'Years Experience', value: businessInfo.yearsExperience },
  ];

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
          <h1 itemProp="name">Mixing &amp; Mastering for Records That Have to Compete</h1>
          <p className="hero-byline" itemProp="provider" itemScope itemType="https://schema.org/Person">
            by <span itemProp="name">Hunter Johanson</span> &middot;{' '}
            <span className="hero-location">{locationInfo.short}</span>
          </p>
          <p className="hero-lede" itemProp="description">
            I mix and master rock and country records for independent artists and
            bands — remotely, for artists anywhere. I also run live sound across{' '}
            {locationInfo.serviceAreaLabel}.
          </p>
          <nav className="hero-buttons" aria-label="Primary calls to action">
            <a href="#portfolio" className="btn-primary" aria-label="Listen to before and after mixing samples">Hear My Work</a>
            <a href="#pricing" className="btn-secondary" aria-label="View mixing and mastering pricing">See Pricing</a>
          </nav>
        </div>

        <dl className="hero-stats" aria-label="Experience at a glance">
          {stats.map((stat) => (
            <div key={stat.label} className="stat">
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default HeroSection;
