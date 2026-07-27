import React from 'react';
import './Testimonials.css';
import useSiteConfig from '../hooks/useSiteConfig';
import testimonials from '../config/testimonials';

// Renders nothing until there are real testimonials to show. An empty or
// invented testimonials section costs more trust than it buys.
const Testimonials = () => {
  const { features } = useSiteConfig();

  if (!features.showTestimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <header>
          <h2>What Clients Say</h2>
          <p className="section-subtitle">
            Unedited feedback from artists I've worked with.
          </p>
        </header>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              className="testimonial"
              itemScope
              itemType="https://schema.org/Review"
            >
              <blockquote itemProp="reviewBody">
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption
                itemProp="author"
                itemScope
                itemType="https://schema.org/Person"
              >
                <span className="testimonial-author" itemProp="name">
                  {testimonial.author}
                </span>
                {testimonial.role && (
                  <span className="testimonial-role">{testimonial.role}</span>
                )}
                {testimonial.project && (
                  <span className="testimonial-project">
                    {testimonial.url ? (
                      <a href={testimonial.url} target="_blank" rel="noopener noreferrer">
                        {testimonial.project}
                      </a>
                    ) : (
                      testimonial.project
                    )}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
