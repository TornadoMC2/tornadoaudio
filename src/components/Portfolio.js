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
      beforeAudio: "/audio/mp3/rock-before.mp3",
      afterAudio: "/audio/mp3/rock-after.mp3",
      genre: "Rock",
      artist: "Take32",
      songName: "Rotten Eyes"
    },
    {
      id: 2,
      title: "Bryce Allin - 'Shark Infested Waters'",
      description: "Modern rock mix focused on bringing out vocal detail and dynamic range. Bringing out clarity in the Drums. Tight low end and wide stereo image.",
      beforeAudio: "/audio/mp3/rock2-before.mp3",
      afterAudio: "/audio/mp3/rock2-after.mp3",
      genre: "Rock",
      artist: "Bryce Allin",
      songName: "Shark Infested Waters"
    },
    {
      id: 3,
      title: "Chad Hollister Band - 'Eyes'",
      description: "Energy filled mix with non-conventional instrumentation. Emphasizing warmth and presence for an intimate yet powerful sound. Drums are punchy and upfront, vocals are clear and present, and the acoustic instruments have a natural warmth.",
      beforeAudio: "/audio/mp3/eyes-before.mp3",
      afterAudio: "/audio/mp3/eyes-after.mp3",
      genre: "Country Rock",
      artist: "Chad Hollister Band",
      songName: "Eyes"
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
    <section id="portfolio" className="portfolio-section" itemScope itemType="https://schema.org/CreativeWork">
      <div className="container">
        <header>
          <h2 itemProp="name">Portfolio & Audio Samples</h2>
          <p className="section-subtitle" itemProp="description">
            Listen to the difference professional mixing makes. Toggle between before and after versions of real client projects.
          </p>
        </header>

        <div className="portfolio-grid" itemScope itemType="https://schema.org/ItemList">
          {portfolioSamples.map((sample) => (
            <article
              key={sample.id}
              className={`portfolio-item ${sample.isPromo ? 'promo-item' : ''}`}
              itemScope
              itemType={sample.isPromo ? "https://schema.org/Offer" : "https://schema.org/AudioObject"}
              itemProp="itemListElement"
            >
              <div className={`genre-tag ${sample.isPromo ? 'promo-tag' : ''}`}>
                <span itemProp={sample.isPromo ? "category" : "genre"}>{sample.genre}</span>
              </div>
              {sample.isPromo ? (
                <div className="promo-content">
                  <h3 itemProp="name">{sample.title}</h3>
                  <p itemProp="description">{sample.description}</p>
                  <div className="promo-actions">
                    <a href="#contact" className="btn-primary" aria-label="Get your audio mixing quote">Get Your Quote</a>
                    <a href="#pricing" className="btn-secondary" aria-label="View audio mixing pricing">View Pricing</a>
                  </div>
                  <meta itemProp="seller" content="Hunter Johanson" />
                  <meta itemProp="itemOffered" content="Professional Audio Mixing Services" />
                </div>
              ) : (
                <div itemScope itemType="https://schema.org/MusicComposition">
                  <h3 itemProp="name">{sample.title}</h3>
                  <meta itemProp="byArtist" content={sample.artist} />
                  <meta itemProp="name" content={sample.songName} />
                  <meta itemProp="genre" content={sample.genre} />
                  <meta itemProp="producer" content="Hunter Johanson" />
                  <AudioComparison
                    title={sample.title}
                    description={sample.description}
                    beforeAudio={sample.beforeAudio}
                    afterAudio={sample.afterAudio}
                  />
                </div>
              )}
            </article>
          ))}
        </div>

        <aside className="portfolio-note" role="note">
          <p><strong>Note:</strong> All samples are used with permission from artists. Your project will receive the same professional treatment with complete confidentiality.</p>
        </aside>
      </div>
    </section>
  );
};

export default Portfolio;
