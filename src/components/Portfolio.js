import React from 'react';
import AudioComparison from './AudioComparison';
import './Portfolio.css';

const Portfolio = () => {
  // Sample audio data - replace with actual audio files
  const portfolioSamples = [
    {
      id: 1,
      title: "Take32 - 'Rotten Eyes'",
      description: "Full band mix with emphasis on punch and clarity. Enhanced drum presence and guitar separation.",
      beforeAudio: "/audio/rock-before.wav",
      afterAudio: "/audio/rock-after.wav",
      genre: "Rock"
    },
    {
      id: 2,
      title: "Bryce Allin - 'Shark Infested Waters'",
      description: "Modern rock mix focused on bringing out vocal detail and dynamic range. Bringing out clarity in the Drums. Tight low end and wide stereo image.",
      beforeAudio: "/audio/rock2-before.mp3",
      afterAudio: "/audio/rock2-after.wav",
      genre: "Rock"
    },
    {
      id: 3,
      title: "Chad Hollister Band - 'Eyes'",
      description: "Energy filled mix with non-conventional instrumentation. Emphasizing warmth and presence for an intimate yet powerful sound. Drums are punchy and upfront, vocals are clear and present, and the acoustic instruments have a natural warmth.",
      beforeAudio: "/audio/eyes-before.wav",
      afterAudio: "/audio/eyes-after.wav",
      genre: "Country Rock"
    },
    {
      id: 4,
      title: "Your Song Here!",
      description: "Ready to hear your music transformed? Upload your tracks and experience the same professional mixing treatment. Get your quote today!",
      beforeAudio: null,
      afterAudio: null,
      genre: "Get Started",
      isPromo: true
    }
  ];

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <h2>Portfolio & Audio Samples</h2>
        <p className="section-subtitle">
          Listen to the difference professional mixing makes. Toggle between before and after versions of real client projects.
        </p>

        <div className="portfolio-grid">
          {portfolioSamples.map((sample) => (
            <div key={sample.id} className={`portfolio-item ${sample.isPromo ? 'promo-item' : ''}`}>
              <div className={`genre-tag ${sample.isPromo ? 'promo-tag' : ''}`}>{sample.genre}</div>
              {sample.isPromo ? (
                <div className="promo-content">
                  <h3>{sample.title}</h3>
                  <p>{sample.description}</p>
                  <div className="promo-actions">
                    <a href="#contact" className="btn-primary">Get Your Quote</a>
                    <a href="#pricing" className="btn-secondary">View Pricing</a>
                  </div>
                </div>
              ) : (
                <AudioComparison
                  title={sample.title}
                  description={sample.description}
                  beforeAudio={sample.beforeAudio}
                  afterAudio={sample.afterAudio}
                />
              )}
            </div>
          ))}
        </div>

        <div className="portfolio-note">
          <p><strong>Note:</strong> All samples are used with permission from artists. Your project will receive the same professional treatment with complete confidentiality.</p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
