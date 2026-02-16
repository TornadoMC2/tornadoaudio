import React from 'react';
import './LiveSoundSection.css';

const LiveSoundSection = () => {
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
            Professional live sound services for events of all sizes. From intimate club shows to large-scale productions,
            I bring clarity and power to every performance.
          </p>
        </header>

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
          <p>Whether you're planning a concert, corporate event, or private gathering, I can help deliver professional sound reinforcement tailored to your needs.</p>
          <a href="#contact" className="btn-primary">Get in Touch</a>
        </div>
      </div>
    </section>
  );
};

export default LiveSoundSection;

