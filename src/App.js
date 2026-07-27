import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import LiveSoundSection from './components/LiveSoundSection';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';
import MaintenanceMode from './components/MaintenanceMode';
import useSiteConfig from './hooks/useSiteConfig';
import useBlogPosts from './hooks/useBlogPosts';

function App() {
  const { isMaintenanceMode, contactInfo, locationInfo } = useSiteConfig();
  const { posts } = useBlogPosts(2); // Get 2 most recent posts

  // Handle initial page load with hash in URL
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show maintenance mode if enabled
  if (isMaintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <div className="App">
      <Header />

      <main role="main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <LiveSoundSection />
        <Portfolio />
        <Testimonials />
        <PricingSection />
        <ContactSection />
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            {posts.length > 0 && (
              <div className="footer-blog">
                <h4>Latest from the Blog</h4>
                <div className="footer-blog-posts">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="footer-blog-link"
                    >
                      <div className="footer-blog-post">
                        <h5>{post.title}</h5>
                        <time dateTime={post.date}>
                          {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/blog" className="footer-blog-view-all">
                  View All Articles →
                </Link>
              </div>
            )}

            <div className="footer-social">
              <h4>Follow Tornado Audio</h4>
              <div className="social-links">
                {contactInfo.socialMedia.instagram && (
                  <a
                    href={contactInfo.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Tornado Audio on Instagram"
                  >
                    <span>Instagram — @tornadoaudio_mixing</span>
                  </a>
                )}
                <a href={`mailto:${contactInfo.email}`}>
                  <span>{contactInfo.email}</span>
                </a>
              </div>
            </div>

            <div className="footer-copyright">
              <p>
                &copy; {new Date().getFullYear()} Tornado Audio — Mixing, mastering and
                live sound by Hunter Johanson. All rights reserved.
              </p>
              <p>
                <small>
                  Based in {locationInfo.short}. Mixing and mastering handled remotely
                  for artists anywhere; live sound throughout {locationInfo.serviceAreaLabel}.
                </small>
              </p>
              <div className="footer-links">
                <Link to="/blog">Blog</Link> | <Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
