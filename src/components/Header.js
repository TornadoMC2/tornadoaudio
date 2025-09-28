import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src="/logo192.png" alt="Tornado Audio Logo" className="logo-image" />
            <div className="logo-text">
              <h1>Tornado Audio</h1>
              <span>Audio mixing by Hunter Johanson</span>
            </div>
          </div>
          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#home" onClick={handleNavClick}>Home</a>
            <a href="#services" onClick={handleNavClick}>Services</a>
            <a href="#portfolio" onClick={handleNavClick}>Portfolio</a>
            <a href="#pricing" onClick={handleNavClick}>Pricing</a>
            <a href="#contact" onClick={handleNavClick}>Contact</a>
          </nav>
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
