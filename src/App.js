import React, { useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import Portfolio from './components/Portfolio';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';
import MaintenanceMode from './components/MaintenanceMode';
import useSiteConfig from './hooks/useSiteConfig';

function App() {
  const { isMaintenanceMode } = useSiteConfig();

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

  // Handle smooth scrolling for breadcrumb links
  const handleBreadcrumbClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="App" itemScope itemType="https://schema.org/WebSite">
      <meta itemProp="url" content="https://tornadoaudio.net" />
      <meta itemProp="name" content="Tornado Audio - Professional Audio Mixing Services" />

      {/* Enhanced Breadcrumb Navigation for SEO */}
      <nav aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
        <ol style={{ display: 'none' }}>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="#home" onClick={handleBreadcrumbClick}>
              <span itemProp="name">Professional Audio Mixing Services</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="#services" onClick={handleBreadcrumbClick}>
              <span itemProp="name">Hunter Johanson Audio Engineer</span>
            </a>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <Header />

      <main role="main" itemScope itemType="https://schema.org/WebPage">
        <meta itemProp="mainEntity" content="https://tornadoaudio.net#services" />
        <meta itemProp="primaryImageOfPage" content="https://tornadoaudio.net/logo512.png" />
        <meta itemProp="description" content="Professional audio mixing services by Hunter Johanson. Transform your recordings into radio-ready tracks with expert mixing for rock, country, and all genres." />
        <meta itemProp="name" content="Tornado Audio - Professional Audio Mixing Services" />

        <HeroSection />
        <ServicesSection />
        <Portfolio />
        <PricingSection />
        <ContactSection />
      </main>

      <footer className="footer" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="container">
          <div className="footer-content">
            <div className="footer-social">
              <h4>Follow Tornado Audio</h4>
              <div className="social-links">
                <a
                  href="https://instagram.com/tornadoaudio_mixing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Tornado Audio on Instagram for behind-the-scenes mixing content and updates"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <span className="social-icon" role="img" aria-label="Instagram">📸</span>
                  <span>@tornadoaudio_mixing</span>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              <p itemProp="copyrightNotice">
                &copy; 2025 <span itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Tornado Audio</span> - Professional Audio Mixing by <span itemProp="founder" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">Hunter Johanson</span>
                  </span>
                </span>. All rights reserved.
              </p>
              <meta itemProp="copyrightYear" content="2025" />
              <p>
                <small>Professional audio mixing services for musicians, bands, and independent artists worldwide.
                Transform your recordings into radio-ready tracks with expert mixing by Hunter Johanson.</small>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
