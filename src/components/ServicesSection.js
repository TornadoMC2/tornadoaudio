import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: '🎚️',
      title: 'Multi-Track Mixing',
      description: 'Professional mixing of individual tracks with attention to balance, EQ, compression, and spatial placement.'
    },
    {
      icon: '🎧',
      title: 'Audio Enhancement',
      description: 'Enhancement of recordings with noise reduction, pitch correction, and creative effects processing.'
    },
    {
      icon: '🔊',
      title: 'Mastering Services',
      description: 'Final polish for your mixes with mastering for streaming platforms and physical media.'
    },
    {
      icon: '⚡',
      title: 'Rush Orders',
      description: '24-hour turnaround available for urgent projects and last-minute deadlines.'
    },
    {
      icon: '🎵',
      title: 'Genre Specialization',
      description: 'Specializing primarily in Rock music with deep expertise in heavy guitar tones, drum processing, and dynamic mix arrangements that capture the energy and power of rock performances.'
    },
    {
      icon: '💾',
      title: 'Stem Delivery',
      description: 'Receive individual stems and multitracks for maximum flexibility in your final production.'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2>Services & Expertise</h2>
        <p className="section-subtitle">Comprehensive audio mixing services to elevate your music</p>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
