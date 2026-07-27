import React from 'react';
import './AboutSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

// TODO (Hunter): the copy below is assembled from claims already on the site.
// Replace the second and third paragraphs with your own words — how you got
// into this, what you actually reach for, what a client gets working with you.
// Specific beats polished. This section is the main reason someone decides you
// are worth $250 rather than $40, so it is worth writing yourself.
const AboutSection = () => {
  const { businessInfo, locationInfo, config } = useSiteConfig();
  const photo = config.about.photo;

  return (
    <section id="about" className="about-section" itemScope itemType="https://schema.org/Person">
      <div className="container">
        <div className="about-grid">
          {photo && (
            <figure className="about-portrait">
              <img
                src={photo}
                alt="Hunter Johanson mixing front of house on a digital console in a theatre"
                width="1600"
                height="1200"
                loading="lazy"
                decoding="async"
                itemProp="image"
              />
              {config.about.photoCaption && (
                <figcaption>{config.about.photoCaption}</figcaption>
              )}
            </figure>
          )}

          <div className={`about-body ${photo ? '' : 'about-body--full'}`}>
            <h2>
              I'm <span itemProp="name">Hunter Johanson</span>
            </h2>
            <p className="about-role" itemProp="jobTitle">
              Mixing, mastering and live sound engineer
            </p>

            <p className="about-lede" itemProp="description">
              I've spent {businessInfo.yearsExperience} years behind consoles and in
              sessions — {businessInfo.yearsExperience} years of live events and a
              growing list of records. I work out of {locationInfo.short}, and I mix
              remotely for artists anywhere.
            </p>

            <p>
              Most of what I do is rock and country: loud guitars, drums that need to
              hit, and vocals that have to stay intelligible through all of it. That's
              where I'm strongest, and it's the work I most want to be doing. If your
              record lives somewhere else stylistically, I'll tell you honestly whether
              I'm the right person for it.
            </p>

            <p>
              Working with me is deliberately low-drama. You get a fixed price before
              we start, a set number of revision rounds so nobody is guessing, and a
              real answer when I think something in the arrangement or the tracking is
              working against the song. I'd rather have that conversation early than
              hand back a mix that papers over it.
            </p>

            <dl className="about-facts">
              <div className="about-fact">
                <dt>Based in</dt>
                <dd itemProp="homeLocation">{locationInfo.short}</dd>
              </div>
              <div className="about-fact">
                <dt>Studio work</dt>
                <dd>Remote, worldwide</dd>
              </div>
              <div className="about-fact">
                <dt>Live sound</dt>
                <dd>{locationInfo.serviceAreaLabel}</dd>
              </div>
              <div className="about-fact">
                <dt>Focus</dt>
                <dd>Rock and country</dd>
              </div>
            </dl>

            <div className="about-actions">
              <a href="#portfolio" className="btn-primary">Hear My Work</a>
              <a href="#contact" className="btn-secondary">Start a Project</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
