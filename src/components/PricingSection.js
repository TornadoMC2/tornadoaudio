import React from 'react';
import './PricingSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

// Prices live here and are mirrored by the Project Type select in
// ContactSection.js and the offer catalog in public/index.html. Change one,
// change all three.
const PRICING_TIERS = [
  {
    id: 'master',
    name: 'Master Only',
    price: 120,
    introPrice: 75,
    description: 'For a finished mix that needs final polish and release-ready loudness.',
    features: [
      'Tonal balance and loudness for streaming',
      'Sequencing and spacing for EPs and albums',
      'WAV and MP3 delivery',
      '2 revision rounds',
      '3 business day turnaround',
    ],
    popular: false,
  },
  {
    id: 'mix',
    name: 'Mix',
    price: 250,
    introPrice: 125,
    description: 'Full mix from your raw tracks, built to sit alongside commercial releases.',
    features: [
      'Up to 48 tracks',
      'Full EQ, dynamics, automation and effects',
      'Stereo mix plus instrumental and vocal-up alternates',
      'Stem delivery on request',
      '2 revision rounds',
      '5 business day turnaround',
    ],
    popular: false,
  },
  {
    id: 'mix-master',
    name: 'Mix + Master',
    price: 350,
    introPrice: 175,
    description: 'Raw tracks in, distribution-ready master out. The complete package.',
    features: [
      'Everything in Mix, plus mastering',
      'No track count limit',
      'Stems and multitracks included',
      'Distribution-ready master',
      '3 revision rounds',
      '7 business day turnaround',
    ],
    popular: true,
  },
];

const PricingSection = () => {
  const {
    getTierPricing,
    formatPrice,
    getOrderCapacityStatus,
    adjustTurnaroundTime,
    isAcceptingOrders,
    isIntroOfferActive,
    introOffer,
    config,
  } = useSiteConfig();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // The contact form reads this back out of sessionStorage to preselect the
  // matching Project Type.
  const selectService = (service) => {
    sessionStorage.setItem('selectedService', JSON.stringify(service));
    scrollToContact();
  };

  const handleGetStarted = (tier) => {
    if (!isAcceptingOrders) {
      alert(getOrderCapacityStatus().statusMessage);
      return;
    }

    const pricing = getTierPricing(tier);
    selectService({
      id: tier.id,
      name: tier.name,
      price: `${formatPrice(pricing.price)} / song`,
      standardPrice: pricing.onIntro ? `${formatPrice(pricing.standardPrice)} / song` : null,
      description: tier.description,
      onIntro: pricing.onIntro,
    });
  };

  const handleContactUs = (e) => {
    e.preventDefault();
    selectService({
      id: 'custom',
      name: 'Custom Quote',
      price: 'Contact for pricing',
      description: 'Custom audio mixing and mastering tailored to your project.',
    });
  };

  const handleFreeSample = () => {
    selectService({
      id: 'free-sample',
      name: 'Free Sample Mix',
      price: 'Free',
      description: 'A 60-second mixed excerpt of your track before you commit.',
      isSample: true,
    });
  };

  const orderCapacityStatus = getOrderCapacityStatus();
  const { depositPercentage, albumDiscountPercentage, albumDiscountMinSongs } = config.payment;

  return (
    <section id="pricing" className="pricing-section" itemScope itemType="https://schema.org/Service">
      <div className="container">
        <header>
          <h2 itemProp="name">Pricing</h2>
          <p className="section-subtitle" itemProp="description">
            Flat per-song rates. No hourly billing, no surprises.
          </p>

          {/* The intro rate needs its reason stated next to it — an unexplained
              discount reads as a statement about the quality of the work. */}
          {isIntroOfferActive && (
            <div className="intro-offer-banner">
              <p className="intro-offer-headline">
                Introductory rates while I build out my portfolio
              </p>
              <p className="intro-offer-terms">
                Reduced pricing on my next{' '}
                {introOffer.showRemainingCount && (
                  <strong>{introOffer.projectsRemaining}</strong>
                )}{' '}
                {introOffer.projectsRemaining === 1 ? 'project' : 'projects'},{' '}
                {introOffer.reason}. Standard rates apply after that.
              </p>
            </div>
          )}

          {config.features.showCapacityIndicator && (
            <div className={`capacity-indicator ${orderCapacityStatus.isAtCapacity ? 'at-capacity' : orderCapacityStatus.isNearCapacity ? 'near-capacity' : 'available'}`}>
              {orderCapacityStatus.isAtCapacity ? (
                <span className="status-closed">Not Currently Accepting Orders</span>
              ) : orderCapacityStatus.isNearCapacity ? (
                <span className="status-warning">High Demand - Limited Availability ({orderCapacityStatus.current}/{orderCapacityStatus.max} orders)</span>
              ) : (
                <span className="status-available">Currently Accepting Orders ({orderCapacityStatus.current}/{orderCapacityStatus.max})</span>
              )}
            </div>
          )}

          {orderCapacityStatus.statusMessage && (
            <div className="capacity-message">{orderCapacityStatus.statusMessage}</div>
          )}
        </header>

        <div className="pricing-grid" itemScope itemType="https://schema.org/ItemList">
          {PRICING_TIERS.map((tier) => {
            const pricing = getTierPricing(tier);

            return (
              <article
                key={tier.id}
                className={`pricing-card ${tier.popular ? 'popular' : ''} ${pricing.onIntro ? 'on-intro' : ''} ${!isAcceptingOrders ? 'disabled' : ''}`}
                itemScope
                itemType="https://schema.org/Offer"
                itemProp="itemListElement"
              >
                {tier.popular && <div className="popular-badge">Most Popular</div>}

                <h3 itemProp="name">{tier.name}</h3>

                <div className="price" itemScope itemType="https://schema.org/PriceSpecification">
                  {pricing.onIntro && (
                    <span className="original-price">
                      Standard rate <s>{formatPrice(pricing.standardPrice)} / song</s>
                    </span>
                  )}
                  <span itemProp="price" content={pricing.price}>
                    {formatPrice(pricing.price)} <span className="price-unit">/ song</span>
                  </span>
                  {pricing.onIntro && <span className="savings">Introductory rate</span>}
                  <meta itemProp="priceCurrency" content="USD" />
                  <meta itemProp="valueAddedTaxIncluded" content="false" />
                </div>

                <p className="description" itemProp="description">{tier.description}</p>

                <ul className="features">
                  {tier.features.map((feature, idx) => {
                    const adjustedFeature = feature.includes('turnaround')
                      ? feature.replace(/\d+(-\d+)?\s*(business day|hour|day)s?/, (match) => adjustTurnaroundTime(match))
                      : feature;

                    return <li key={idx}>{adjustedFeature}</li>;
                  })}
                </ul>

                <meta itemProp="seller" content="Hunter Johanson" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <meta itemProp="category" content="Audio Mixing Services" />

                <div className="card-actions">
                  <button
                    className={`cta-button ${!isAcceptingOrders ? 'disabled' : ''}`}
                    onClick={() => handleGetStarted(tier)}
                    disabled={!isAcceptingOrders}
                    aria-label={`Get started with ${tier.name}`}
                  >
                    {!isAcceptingOrders ? 'Currently Unavailable' : 'Get Started'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Below the tiers on purpose: leading with "free" undercuts the prices
            before anyone has read them. */}
        {config.features.showFreeSample && (
          <div className="free-sample-banner">
            <div className="sample-banner-content">
              <div className="sample-text">
                <h3>Not sure yet? Hear your own track first.</h3>
                <p>
                  I'll mix a 60-second excerpt of your song at no cost, so you can judge
                  the work on your own material rather than someone else's.
                </p>
              </div>
              <div className="sample-cta-container">
                <button
                  className="sample-cta-button"
                  onClick={handleFreeSample}
                  aria-label="Request a free sample mix"
                >
                  Get a Free Sample
                </button>
                <p className="sample-disclaimer">
                  One per customer &bull; Preview quality, for evaluation
                </p>
              </div>
            </div>
          </div>
        )}

        <footer className="pricing-footer">
          <dl className="pricing-terms">
            <div className="pricing-term">
              <dt>Albums and EPs</dt>
              <dd>{albumDiscountPercentage}% off when you book {albumDiscountMinSongs} or more songs together.</dd>
            </div>
            <div className="pricing-term">
              <dt>Booking</dt>
              <dd>{depositPercentage}% deposit to reserve your slot, balance due before final files are delivered.</dd>
            </div>
            <div className="pricing-term">
              <dt>Revisions</dt>
              <dd>{config.payment.revisionPolicy}</dd>
            </div>
            {config.payment.rushOrdersAvailable && (
              <div className="pricing-term">
                <dt>Rush work</dt>
                <dd>Need it sooner than the standard turnaround? Rush slots are available at {config.payment.rushOrderMultiplier}x.</dd>
              </div>
            )}
            <div className="pricing-term">
              <dt>Payment</dt>
              <dd>{config.payment.methods.join(', ')}.</dd>
            </div>
          </dl>

          <p className="service-agreement-note">
            <a href="/service-agreement" className="agreement-link" target="_blank" rel="noopener noreferrer">Review the Service Agreement</a> before booking for full terms and project workflow.
          </p>
          <p className="custom-pricing">
            Something outside these packages? <a href="#contact" className="contact-link" onClick={handleContactUs}>Get in touch</a> for a quote.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default PricingSection;
