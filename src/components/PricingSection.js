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
      priceValue: "40",
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
      priceValue: "75",
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
      priceValue: "200",
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

  const handleContactUs = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="pricing" className="pricing-section" itemScope itemType="https://schema.org/Service">
      <div className="container">
        <header>
          <h2 itemProp="name">Pricing & Services</h2>
          <p className="section-subtitle" itemProp="description">Professional audio mixing services tailored to your needs</p>
        </header>

        <div className="pricing-grid" itemScope itemType="https://schema.org/ItemList">
          {pricingTiers.map((tier, index) => (
            <article
              key={index}
              className={`pricing-card ${tier.popular ? 'popular' : ''}`}
              itemScope
              itemType="https://schema.org/Offer"
              itemProp="itemListElement"
            >
              {tier.popular && <div className="popular-badge">Most Popular</div>}
              <h3 itemProp="name">{tier.name}</h3>
              <div className="price" itemScope itemType="https://schema.org/PriceSpecification">
                <span itemProp="price" content={tier.priceValue}>{tier.price}</span>
                <meta itemProp="priceCurrency" content="USD" />
                <meta itemProp="valueAddedTaxIncluded" content="false" />
              </div>
              <p className="description" itemProp="description">{tier.description}</p>

              <ul className="features" itemProp="includesObject" itemScope itemType="https://schema.org/TypeAndQuantityNode">
                {tier.features.map((feature, idx) => (
                  <li key={idx} itemProp="description">{feature}</li>
                ))}
              </ul>

              <meta itemProp="seller" content="Hunter Johanson" />
              <meta itemProp="availability" content="https://schema.org/InStock" />
              <meta itemProp="category" content="Audio Mixing Services" />

              {tier.bulkPricing && (
                <div className="bulk-pricing">
                  <button
                    className="bulk-pricing-toggle"
                    onClick={() => toggleBulkPricing(tier.id)}
                    aria-expanded={expandedBulkPricing[tier.id]}
                    aria-controls={`bulk-pricing-${tier.id}`}
                  >
                    💡 Bulk Pricing Available
                    <span className={`arrow ${expandedBulkPricing[tier.id] ? 'expanded' : ''}`}>▼</span>
                  </button>

                  {expandedBulkPricing[tier.id] && (
                    <div className="bulk-pricing-content" id={`bulk-pricing-${tier.id}`}>
                      <ul>
                        {tier.bulkPricing.map((bulkOption, idx) => (
                          <li key={idx} itemScope itemType="https://schema.org/Offer">
                            <div className="bulk-option">
                              <span className="quantity" itemProp="eligibleQuantity">{bulkOption.quantity}</span>
                              <span className="bulk-price" itemProp="price">{bulkOption.price}</span>
                              <span className="savings">{bulkOption.savings}</span>
                              <span className="turnaround">({bulkOption.turnaround})</span>
                              <meta itemProp="priceCurrency" content="USD" />
                              <meta itemProp="seller" content="Hunter Johanson" />
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
                  aria-label={`Get started with ${tier.name} service`}
                >
                  Get Started
                </button>
              </div>
            </article>
          ))}
        </div>

        <footer className="pricing-footer">
          <p className="pricing-note">
            * All services include professional communication throughout the process and satisfaction guarantee
          </p>
          <p className="custom-pricing">
            Need something custom? <a href="#contact" className="contact-link" onClick={handleContactUs} aria-label="Contact us for custom pricing">Contact us</a> for personalized pricing and services.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default PricingSection;
