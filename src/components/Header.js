import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`} role="banner" itemScope itemType="https://schema.org/WPHeader">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" itemScope itemType="https://schema.org/Organization">
            <img
              src="/logo192.png"
              alt="Tornado Audio Logo - Professional Audio Mixing Services"
              className="logo-image"
              itemProp="logo"
              width="192"
              height="192"
            />
            <div className="logo-text">
              <h1 itemProp="name">Tornado Audio</h1>
              <span itemProp="description">Studio & Live Sound by Hunter Johanson</span>
              <meta itemProp="url" content="https://tornadoaudio.net" />
              <meta itemProp="founder" content="Hunter Johanson" />
            </div>
          </Link>
          <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`} role="navigation" aria-label="Main navigation" itemScope itemType="https://schema.org/SiteNavigationElement">
            {isHomePage ? (
              <>
                <a href="#home" onClick={handleNavClick} itemProp="url" aria-label="Navigate to home section">
                  <span itemProp="name">Home</span>
                </a>
                <a href="#services" onClick={handleNavClick} itemProp="url" aria-label="Navigate to services section">
                  <span itemProp="name">Services</span>
                </a>
                <a href="#live-sound" onClick={handleNavClick} itemProp="url" aria-label="Navigate to live sound section">
                  <span itemProp="name">Live Sound</span>
                </a>
                <a href="#portfolio" onClick={handleNavClick} itemProp="url" aria-label="Navigate to portfolio section">
                  <span itemProp="name">Portfolio</span>
                </a>
                <a href="#pricing" onClick={handleNavClick} itemProp="url" aria-label="Navigate to pricing section">
                  <span itemProp="name">Pricing</span>
                </a>
                <a href="#contact" onClick={handleNavClick} itemProp="url" aria-label="Navigate to contact section">
                  <span itemProp="name">Contact</span>
                </a>
              </>
            ) : (
              <>
                <Link to="/" onClick={handleNavClick} itemProp="url" aria-label="Return to home page">
                  <span itemProp="name">Home</span>
                </Link>
                <Link to="/#services" onClick={handleNavClick} itemProp="url" aria-label="Navigate to services section">
                  <span itemProp="name">Services</span>
                </Link>
                <Link to="/#live-sound" onClick={handleNavClick} itemProp="url" aria-label="Navigate to live sound section">
                  <span itemProp="name">Live Sound</span>
                </Link>
                <Link to="/#portfolio" onClick={handleNavClick} itemProp="url" aria-label="Navigate to portfolio section">
                  <span itemProp="name">Portfolio</span>
                </Link>
                <Link to="/#pricing" onClick={handleNavClick} itemProp="url" aria-label="Navigate to pricing section">
                  <span itemProp="name">Pricing</span>
                </Link>
                <Link to="/#contact" onClick={handleNavClick} itemProp="url" aria-label="Navigate to contact section">
                  <span itemProp="name">Contact</span>
                </Link>
              </>
            )}
          </nav>
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
