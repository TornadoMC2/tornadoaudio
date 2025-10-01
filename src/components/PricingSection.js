import React, { useState } from 'react';
import './PricingSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

const PricingSection = () => {
  const [expandedBulkPricing, setExpandedBulkPricing] = useState({});
  const {
    calculateSalePrice,
    formatPrice,
    getOrderCapacityStatus,
    adjustTurnaroundTime,
    isSaleActive,
    salesInfo,
    isAcceptingOrders,
    config,
    saleMessage
  } = useSiteConfig();

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
      priceValue: 40,
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
      priceValue: 75,
      bulkPricing: [
        { quantity: "3-5 songs", price: 65, savings: "Save $30", turnaround: "5-7 days" },
        { quantity: "6+ songs", price: 55, savings: "Save $120+", turnaround: "7-10 days" }
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
      priceValue: 200,
      bulkPricing: [
        { quantity: "3-5 songs", price: 175, savings: "Save $75", turnaround: "7-10 days" },
        { quantity: "6+ songs", price: 150, savings: "Save $300+", turnaround: "10-14 days" }
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
    if (!isAcceptingOrders) {
      alert(getOrderCapacityStatus().statusMessage);
      return;
    }

    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Store selected service in sessionStorage for the contact form
      const priceInfo = calculateSalePrice(tier.priceValue, tier.id);
      sessionStorage.setItem('selectedService', JSON.stringify({
        name: tier.name,
        price: formatPrice(priceInfo.price) + " / song",
        originalPrice: priceInfo.onSale ? formatPrice(priceInfo.originalPrice) + " / song" : null,
        description: tier.description,
        onSale: priceInfo.onSale
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

  const orderCapacityStatus = getOrderCapacityStatus();

  return (
    <section id="pricing" className="pricing-section" itemScope itemType="https://schema.org/Service">
      <div className="container">
        <header>
          <h2 itemProp="name">Pricing & Services</h2>
          <p className="section-subtitle" itemProp="description">Professional audio mixing services tailored to your needs</p>

          {/* Sale Banner */}
          {isSaleActive && saleMessage && (
            <div className="sale-banner">
              {saleMessage}
              {salesInfo.endDate && (
                <span className="sale-end-date">
                  Ends {new Date(salesInfo.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}

          {/* Order Capacity Status */}
          {config.features.showCapacityIndicator && (
            <div className={`capacity-indicator ${orderCapacityStatus.isAtCapacity ? 'at-capacity' : orderCapacityStatus.isNearCapacity ? 'near-capacity' : 'available'}`}>
              {orderCapacityStatus.isAtCapacity ? (
                <span className="status-closed">❌ Not Currently Accepting Orders</span>
              ) : orderCapacityStatus.isNearCapacity ? (
                <span className="status-warning">⚠️ High Demand - Limited Availability ({orderCapacityStatus.current}/{orderCapacityStatus.max} orders)</span>
              ) : (
                <span className="status-available">✅ Currently Accepting Orders ({orderCapacityStatus.current}/{orderCapacityStatus.max})</span>
              )}
            </div>
          )}

          {/* Capacity Message */}
          {orderCapacityStatus.statusMessage && (
            <div className="capacity-message">
              {orderCapacityStatus.statusMessage}
            </div>
          )}
        </header>

        <div className="pricing-grid" itemScope itemType="https://schema.org/ItemList">
          {pricingTiers.map((tier, index) => {
            const priceInfo = calculateSalePrice(tier.priceValue, tier.id);

            return (
              <article
                key={index}
                className={`pricing-card ${tier.popular ? 'popular' : ''} ${priceInfo.onSale ? 'on-sale' : ''} ${!isAcceptingOrders ? 'disabled' : ''}`}
                itemScope
                itemType="https://schema.org/Offer"
                itemProp="itemListElement"
              >
                {tier.popular && <div className="popular-badge">Most Popular</div>}
                {priceInfo.onSale && <div className="sale-badge">SALE</div>}

                <h3 itemProp="name">{tier.name}</h3>

                <div className="price" itemScope itemType="https://schema.org/PriceSpecification">
                  {priceInfo.onSale && (
                    <span className="original-price">{formatPrice(priceInfo.originalPrice)} / song</span>
                  )}
                  <span itemProp="price" content={priceInfo.price}>{formatPrice(priceInfo.price)} / song</span>
                  {priceInfo.onSale && (
                    <span className="savings">Save {formatPrice(priceInfo.savings)}</span>
                  )}
                  <meta itemProp="priceCurrency" content="USD" />
                  <meta itemProp="valueAddedTaxIncluded" content="false" />
                </div>

                <p className="description" itemProp="description">{tier.description}</p>

                <ul className="features" itemProp="includesObject" itemScope itemType="https://schema.org/TypeAndQuantityNode">
                  {tier.features.map((feature, idx) => {
                    // Adjust turnaround times in features
                    const adjustedFeature = feature.includes('turnaround')
                      ? feature.replace(/\d+(-\d+)?\s*(hour|day)s?/, (match) => adjustTurnaroundTime(match))
                      : feature;

                    return (
                      <li key={idx} itemProp="description">{adjustedFeature}</li>
                    );
                  })}
                </ul>

                <meta itemProp="seller" content="Hunter Johanson" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <meta itemProp="category" content="Audio Mixing Services" />

                {tier.bulkPricing && config.features.showBulkPricing && (
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
                          {tier.bulkPricing.map((bulkOption, idx) => {
                            const bulkPriceInfo = calculateSalePrice(bulkOption.price, tier.id);

                            return (
                              <li key={idx} itemScope itemType="https://schema.org/Offer">
                                <div className="bulk-option">
                                  <span className="quantity" itemProp="eligibleQuantity">{bulkOption.quantity}</span>
                                  <div className="bulk-price-container">
                                    {bulkPriceInfo.onSale && (
                                      <span className="bulk-original-price">{formatPrice(bulkPriceInfo.originalPrice)}</span>
                                    )}
                                    <span className="bulk-price" itemProp="price">{formatPrice(bulkPriceInfo.price)} / song</span>
                                  </div>
                                  <span className="savings">{bulkPriceInfo.onSale ? `Save ${formatPrice(bulkPriceInfo.savings * 3)}+` : bulkOption.savings}</span>
                                  <span className="turnaround">({adjustTurnaroundTime(bulkOption.turnaround)})</span>
                                  <meta itemProp="priceCurrency" content="USD" />
                                  <meta itemProp="seller" content="Hunter Johanson" />
                                </div>
                              </li>
                            );
                          })}
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
                    className={`cta-button ${!isAcceptingOrders ? 'disabled' : ''}`}
                    onClick={() => handleGetStarted(tier)}
                    disabled={!isAcceptingOrders}
                    aria-label={`Get started with ${tier.name} service`}
                  >
                    {!isAcceptingOrders ? 'Currently Unavailable' : 'Get Started'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="pricing-footer">
          <p className="pricing-note">
            * All services include professional communication throughout the process
            {config.business.satisfactionGuarantee && ` and ${config.business.satisfactionGuarantee.toLowerCase()}`}
          </p>
          <p className="custom-pricing">
            Need something custom? <a href="#contact" className="contact-link" onClick={handleContactUs} aria-label="Contact us for custom pricing">Contact us</a> for personalized pricing and services.
          </p>

          {config.payment.rushOrdersAvailable && (
            <p className="rush-orders">
              🚀 Rush orders available at {config.payment.rushOrderMultiplier}x pricing
            </p>
          )}
        </footer>
      </div>
    </section>
  );
};

export default PricingSection;
