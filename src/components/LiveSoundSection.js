import React from 'react';
import './LiveSoundSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

const LiveSoundSection = () => {
  const { locationInfo, config } = useSiteConfig();
  const { venues } = config.liveSound;

  const experiences = [
    {
      category: 'Venue Types',
      icon: 'VNU',
      items: [
        'Concert Halls & Theaters',
        'Outdoor Festivals & Amphitheaters',
        'Clubs & Bar Venues',
        'Corporate Events & Conferences',
        'Houses of Worship',
        'Private Events & Weddings'
      ]
    },
    {
      category: 'Technical Expertise',
      icon: 'TEC',
      items: [
        'Front of House (FOH) Mixing',
        'Monitor Engineering',
        'System Design & Optimization',
        'RF Coordination & Management',
        'Digital & Analog Console Operation',
        'Stage Management & Patching'
      ]
    },
    {
      category: 'Equipment Experience',
      icon: 'EQP',
      items: [
        'Line Array Systems (L-Acoustics, d&b, JBL)',
        'Digital Consoles (Yamaha, Allen & Heath, DiGiCo)',
        'In-Ear Monitor Systems',
        'Wireless Microphone Systems',
        'Processing & Effects',
        'Recording & Virtual Soundcheck'
      ]
    }
  ];

  const highlights = [
    {
      stat: '100+',
      label: 'Live Events'
    },
    {
      stat: '50+',
      label: 'Venues'
    },
    {
      stat: '5+',
      label: 'Years Live Sound'
    },
    {
      stat: 'All',
      label: 'Event Sizes'
    }
  ];

  return (
    <section id="live-sound" className="live-sound-section" itemScope itemType="https://schema.org/Service">
      <div className="container">
        <header>
          <h2 itemProp="name">Live Sound Engineering</h2>
          <p className="section-subtitle" itemProp="description">
            FOH and monitors for events across {locationInfo.serviceAreaLabel}. From
            club shows to festival stages, based in {locationInfo.short}.
          </p>
        </header>

        {venues.length > 0 && (
          <div className="live-sound-venues">
            <h3 className="live-sound-venues-label">Venues worked</h3>
            <ul className="live-sound-venue-list">
              {venues.map((venue) => (
                <li key={venue.name} className="live-sound-venue">
                  <span className="venue-name">{venue.name}</span>
                  <span className="venue-location">{venue.location}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="live-sound-stats">
          {highlights.map((highlight, index) => (
            <div key={index} className="live-sound-stat">
              <span className="stat-number">{highlight.stat}</span>
              <span className="stat-label">{highlight.label}</span>
            </div>
          ))}
        </div>

        <div className="experience-grid">
          {experiences.map((exp, index) => (
            <article key={index} className="experience-card" itemScope itemType="https://schema.org/Service">
              <div className="experience-icon">{exp.icon}</div>
              <h3 itemProp="name">{exp.category}</h3>
              <ul className="experience-list">
                {exp.items.map((item, idx) => (
                  <li key={idx} itemProp="description">{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="live-sound-cta">
          <h3>Need Live Sound for Your Event?</h3>
          <p>
            Concert, corporate event, wedding or church service — tell me the date,
            the room and roughly how many inputs, and I'll come back with a quote.
            Available throughout {locationInfo.serviceAreaLabel}.
          </p>
          <a href="#contact" className="btn-primary">Check My Availability</a>
        </div>
      </div>
    </section>
  );
};

export default LiveSoundSection;

