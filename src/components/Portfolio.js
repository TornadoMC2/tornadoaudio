import React from 'react';
import AudioComparison from './AudioComparison';
import './Portfolio.css';

const Portfolio = () => {
  // TODO (Hunter): fill in `releaseUrl` with the Spotify/Apple/Bandcamp link for
  // each released track. A verifiable credit someone can go and listen to is the
  // strongest trust signal in this market, and it costs nothing to add.
  const portfolioSamples = [
    {
      id: 1,
      description: "Full band mix with emphasis on punch and clarity. Enhanced drum presence and guitar separation.",
      beforeAudio: "/audio/mp3/rock-before.mp3",
      afterAudio: "/audio/mp3/rock-after.mp3",
      genre: "Rock",
      artist: "Take32",
      songName: "Rotten Eyes",
      releaseUrl: null
    },
    {
      id: 2,
      description: "Modern rock mix focused on bringing out vocal detail and dynamic range. Bringing out clarity in the Drums. Tight low end and wide stereo image.",
      beforeAudio: "/audio/mp3/rock2-before.mp3",
      afterAudio: "/audio/mp3/rock2-after.mp3",
      genre: "Rock",
      artist: "Bryce Allin",
      songName: "Shark Infested Waters",
      releaseUrl: null
    },
    {
      id: 3,
      description: "Energy filled mix with non-conventional instrumentation. Emphasizing warmth and presence for an intimate yet powerful sound. Drums are punchy and upfront, vocals are clear and present, and the acoustic instruments have a natural warmth.",
      beforeAudio: "/audio/mp3/all-it-was-before.mp3",
      afterAudio: "/audio/mp3/all-it-was-after.mp3",
      genre: "Pop Rock",
      artist: "Eric Corriveau",
      songName: "That's All it Was",
      releaseUrl: null
    },
    {
      id: 4,
      title: "Your Song Here",
      description: "Send me a track and I'll mix a 60-second excerpt at no cost, so you can hear the treatment on your own material rather than someone else's.",
      beforeAudio: null,
      afterAudio: null,
      genre: "Get Started",
      isPromo: true
    }
  ];

  // Helper function to generate display title for audio samples.
  // Artist is optional — some clients would rather not be named, and a blank
  // one must not leave a dangling "- 'Song'".
  const getDisplayTitle = (sample) => {
    if (sample.isPromo) {
      return sample.title;
    }
    return sample.artist
      ? `${sample.artist} - '${sample.songName}'`
      : `'${sample.songName}'`;
  };

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
                  <h3 itemProp="name">{getDisplayTitle(sample)}</h3>
                  {sample.artist && <meta itemProp="byArtist" content={sample.artist} />}
                  <meta itemProp="name" content={sample.songName} />
                  <meta itemProp="genre" content={sample.genre} />
                  <meta itemProp="producer" content="Hunter Johanson" />
                  <AudioComparison
                    title={getDisplayTitle(sample)}
                    description={sample.description}
                    beforeAudio={sample.beforeAudio}
                    afterAudio={sample.afterAudio}
                    showTitle={false}
                  />
                  {sample.releaseUrl && (
                    <p className="portfolio-release">
                      <a
                        href={sample.releaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="url"
                      >
                        Listen to the release →
                      </a>
                    </p>
                  )}
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
