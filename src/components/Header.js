import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

// `hash` items scroll within the home page; `path` items are real routes.
const NAV_ITEMS = [
  { hash: '#about', label: 'About' },
  { hash: '#services', label: 'Services' },
  { hash: '#live-sound', label: 'Live Sound' },
  { hash: '#portfolio', label: 'Portfolio' },
  { hash: '#pricing', label: 'Pricing' },
  { path: '/blog', label: 'Blog' },
  { hash: '#contact', label: 'Contact' }
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // Held in a ref so the scroll listener is registered once, rather than torn
  // down and re-added on every scroll event.
  const lastScrollY = useRef(0);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop the page scrolling behind the open mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <header
      className={`header ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}
      role="banner"
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" itemScope itemType="https://schema.org/Organization">
            <img
              src="/logo192.png"
              alt=""
              className="logo-image"
              itemProp="logo"
              width="192"
              height="192"
            />
            <span className="logo-text">
              <span className="logo-name" itemProp="name">Tornado Audio</span>
              <span className="logo-tagline" itemProp="description">Mixing &amp; Mastering &middot; Bloomington-Normal, IL</span>
              <meta itemProp="url" content="https://tornadoaudio.net" />
              <meta itemProp="founder" content="Hunter Johanson" />
            </span>
          </Link>

          <nav
            id="main-navigation"
            className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
            role="navigation"
            aria-label="Main navigation"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            {NAV_ITEMS.map(({ hash, path, label }) => {
              if (path) {
                return (
                  <Link key={path} to={path} onClick={handleNavClick} itemProp="url">
                    <span itemProp="name">{label}</span>
                  </Link>
                );
              }

              return isHomePage ? (
                <a key={hash} href={hash} onClick={handleNavClick} itemProp="url">
                  <span itemProp="name">{label}</span>
                </a>
              ) : (
                <Link key={hash} to={`/${hash}`} onClick={handleNavClick} itemProp="url">
                  <span itemProp="name">{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-navigation"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
              {mobileMenuOpen ? (
                <path d="M4 4 L18 18 M18 4 L4 18" stroke="currentColor" strokeWidth="1.75" fill="none" />
              ) : (
                <path d="M3 6h16 M3 11h16 M3 16h16" stroke="currentColor" strokeWidth="1.75" fill="none" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
