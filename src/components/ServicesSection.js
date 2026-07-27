import React from 'react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      icon: 'MIX',
      title: 'Multi-Track Mixing',
      description: 'Professional mixing of individual tracks with attention to balance, EQ, compression, and spatial placement.',
      serviceType: 'Multi-Track Audio Mixing'
    },
    {
      icon: 'ENH',
      title: 'Audio Enhancement',
      description: 'Enhancement of recordings with noise reduction, pitch correction, and creative effects processing.',
      serviceType: 'Audio Enhancement Services'
    },
    {
      icon: 'MST',
      title: 'Mastering Services',
      description: 'Final polish for your mixes with mastering for streaming platforms and physical media.',
      serviceType: 'Audio Mastering'
    },
    {
      icon: 'RSH',
      title: 'Rush Slots',
      description: 'Got a deadline inside the standard turnaround? Rush slots are available at 1.5x when my schedule allows.',
      serviceType: 'Rush Audio Mixing'
    },
    {
      icon: 'RCK',
      title: 'Genre Specialization',
      description: 'Specializing primarily in Rock music with deep expertise in heavy guitar tones, drum processing, and dynamic mix arrangements that capture the energy and power of rock performances.',
      serviceType: 'Rock Music Mixing'
    },
    {
      icon: 'STM',
      title: 'Stem Delivery',
      description: 'Receive individual stems and multitracks for maximum flexibility in your final production.',
      serviceType: 'Audio Stem Services'
    }
  ];

  return (
    <section id="services" className="services-section" itemScope itemType="https://schema.org/Service">
      <div className="container">
        <header>
          <h2 itemProp="name">What I Do</h2>
          <p className="section-subtitle" itemProp="description">Studio services for artists and bands, handled remotely from start to finish</p>
        </header>

        <div className="services-grid" itemScope itemType="https://schema.org/ItemList">
          {services.map((service, index) => (
            <article
              key={index}
              className="service-card"
              itemScope
              itemType="https://schema.org/Service"
              itemProp="itemListElement"
            >
              <div className="service-icon" role="img" aria-label={`${service.title} service icon`}>
                {service.icon}
              </div>
              <h3 itemProp="name">{service.title}</h3>
              <p itemProp="description">{service.description}</p>
              <meta itemProp="serviceType" content={service.serviceType} />
              <meta itemProp="provider" content="Hunter Johanson" />
              <meta itemProp="areaServed" content="Worldwide" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
