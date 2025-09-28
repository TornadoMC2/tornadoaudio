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
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <Portfolio />
        <PricingSection />
        <ContactSection />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Tornado Audio - Hunter Johanson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
