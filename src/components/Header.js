import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 50);

      // Handle visibility based on scroll direction
      if (currentScrollY < 50) {
        // Always show header at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsVisible(false);
        setMobileMenuOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
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
