import React, { useState } from 'react';
import './PricingSection.css';

const PricingSection = () => {
  const [expandedBulkPricing, setExpandedBulkPricing] = useState({});

  const toggleBulkPricing = (tierId) => {
    setExpandedBulkPricing(prev => ({
      ...prev,
      [tierId]: !prev[tierId]
    }));
  };

  const pricingTiers = [
    {
      id: 'basic-mix',
      name: "Basic Mix",
      price: "$40 / song",
      description: "Perfect for demos and independent artists",
      features: [
        "Up to 24 tracks",
        "EQ and compression",
        "Basic effects processing",
        "Stereo mix delivery",
        "1 revision included",
        "72-hour turnaround"
      ],
      popular: false
    },
    {
      id: 'professional-mix',
      name: "Professional Mix",
      price: "$75 / song",
      bulkPricing: [
        { quantity: "3-5 songs", price: "$65 / song", savings: "Save $30", turnaround: "5-7 days" },
        { quantity: "6+ songs", price: "$55 / song", savings: "Save $120+", turnaround: "7-10 days" }
      ],
      description: "Industry-standard mixing for serious projects",
      features: [
        "Up to 48 tracks",
        "Advanced EQ and dynamics",
        "Creative effects processing",
        "Stereo mix delivery",
        "3 revisions included",
        "48-hour turnaround",
        "Stem delivery available (Drums, Bass, Guitars, Vocals, etc.)"
      ],
      popular: true
    },
    {
      id: 'premium-mix-master',
      name: "Premium Mix & Master",
      price: "$200 / song",
      bulkPricing: [
        { quantity: "3-5 songs", price: "$175 / song", savings: "Save $75", turnaround: "7-10 days" },
        { quantity: "6+ songs", price: "$150 / song", savings: "Save $300+", turnaround: "10-14 days" }
      ],
      description: "Complete production package",
      features: [
        "Unlimited tracks",
        "Full mixing treatment",
        "Professional mastering",
        "Multiple format delivery",
        "Unlimited revisions",
        "24-hour turnaround",
        "Stems + multitracks included",
        "Distribution-ready master"
      ],
      popular: false
    }
  ];

  const handleGetStarted = (tier) => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Optional: Store selected service in sessionStorage for the contact form
      sessionStorage.setItem('selectedService', JSON.stringify({
        name: tier.name,
        price: tier.price,
        description: tier.description
      }));
    }
  };

  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <h2>Pricing & Services</h2>
        <p className="section-subtitle">Professional audio mixing services tailored to your needs</p>

        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => (
            <div key={index} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{tier.name}</h3>
              <div className="price">{tier.price}</div>
              <p className="description">{tier.description}</p>
              <ul className="features">
                {tier.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              {tier.bulkPricing && (
                <div className="bulk-pricing">
                  <button
                    className="bulk-pricing-toggle"
                    onClick={() => toggleBulkPricing(tier.id)}
                  >
                    💰 Bulk Pricing Available
                    <span className={`arrow ${expandedBulkPricing[tier.id] ? 'expanded' : ''}`}>▼</span>
                  </button>

                  {expandedBulkPricing[tier.id] && (
                    <div className="bulk-pricing-content">
                      <ul>
                        {tier.bulkPricing.map((bulkOption, idx) => (
                          <li key={idx}>
                            <div className="bulk-option">
                              <span className="quantity">{bulkOption.quantity}</span>
                              <span className="bulk-price">{bulkOption.price}</span>
                              <span className="savings">{bulkOption.savings}</span>
                              <span className="turnaround">({bulkOption.turnaround})</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p className="bulk-disclaimer">
                        * Turnaround times increase with song count to ensure quality
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="card-actions">
                <button
                  className="cta-button"
                  onClick={() => handleGetStarted(tier)}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p className="pricing-note">
            * All services include professional communication throughout the process and satisfaction guarantee
          </p>
          <p className="custom-pricing">
            Need something custom? <strong>Contact us</strong> for personalized pricing and services.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
