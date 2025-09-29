import React from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import Portfolio from './components/Portfolio';
import PricingSection from './components/PricingSection';
import ContactSection from './components/ContactSection';

function App() {
  return (
    <div className="App" itemScope itemType="https://schema.org/WebSite">
      <meta itemProp="url" content="https://tornadoaudio.net" />
      <meta itemProp="name" content="Tornado Audio - Professional Audio Mixing" />

      {/* Breadcrumb Navigation for SEO */}
      <nav aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
        <ol style={{ display: 'none' }}>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href="https://tornadoaudio.net">
              <span itemProp="name">Home</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
        </ol>
      </nav>

      <Header />

      <main role="main" itemScope itemType="https://schema.org/WebPage">
        <meta itemProp="mainEntity" content="https://tornadoaudio.net#services" />
        <meta itemProp="primaryImageOfPage" content="https://tornadoaudio.net/logo512.png" />

        <HeroSection />
        <ServicesSection />
        <Portfolio />
        <PricingSection />
        <ContactSection />
      </main>

      <footer className="footer" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
        <div className="container">
          <p itemProp="copyrightNotice">
            &copy; 2025 <span itemScope itemType="https://schema.org/Organization">
              <span itemProp="name">Tornado Audio</span> - <span itemProp="founder">Hunter Johanson</span>
            </span>. All rights reserved.
          </p>
          <meta itemProp="copyrightYear" content="2025" />
        </div>
      </footer>
    </div>
  );
}

export default App;
