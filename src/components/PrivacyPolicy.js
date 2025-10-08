import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.css';
import Header from './Header';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <Helmet>
        <title>Privacy Policy | Tornado Audio - Professional Audio Mixing Services</title>
        <meta name="description" content="Tornado Audio's privacy policy. Learn how we collect, use, and protect your personal information when you use our professional audio mixing services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tornadoaudio.net/privacy-policy" />

        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | Tornado Audio" />
        <meta property="og:description" content="Learn about Tornado Audio's privacy practices and how we protect your personal information." />
        <meta property="og:url" content="https://tornadoaudio.net/privacy-policy" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content="Privacy Policy | Tornado Audio" />
        <meta name="twitter:description" content="Learn about Tornado Audio's privacy practices and data protection policies." />
      </Helmet>

      <Header />
      <div className="container">
        <div className="privacy-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: October 8, 2025</p>

          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Tornado Audio ("we," "our," or "us"). We are committed to protecting your privacy and the information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website tornadoaudio.net (the "Site") or use our audio mixing services.</p>
            <p>Please read this Privacy Policy carefully. By accessing or using our Site and services, you acknowledge that you have read, understood, and agree to be bound by all terms of this Privacy Policy.</p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Complete forms or create accounts on our Site</li>
              <li>Submit audio files for mixing services</li>
              <li>Contact us via our contact form, email, or phone</li>
              <li>Subscribe to our newsletter</li>
              <li>Participate in surveys, promotions, or contests</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name, email address, phone number, and mailing address</li>
              <li>Payment information (handled through secure third-party payment processors)</li>
              <li>Audio files and project details</li>
              <li>Communication preferences and marketing opt-ins</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our Site, we may automatically collect certain information about your device and usage patterns, including:</p>
            <ul>
              <li>IP address, browser type, operating system</li>
              <li>Pages visited, time spent on pages, links clicked</li>
              <li>Referring website or source</li>
              <li>Geographic location (country/region level)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including:</p>
            <ul>
              <li>Providing, maintaining, and improving our services</li>
              <li>Processing and fulfilling orders and service requests</li>
              <li>Communicating with you about your projects, orders, and account</li>
              <li>Sending you marketing and promotional materials (with opt-out options)</li>
              <li>Analyzing website usage to enhance user experience</li>
              <li>Protecting our rights and preventing fraud</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, hosting services, email delivery services)</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes without your explicit consent.</p>
          </section>

          <section className="policy-section">
            <h2>5. Cookies and Tracking Technologies</h2>
            <p>We use cookies, pixels, and similar technologies to collect information about your browsing activities. These technologies help us analyze website traffic, customize content, and deliver targeted advertisements.</p>
            <p>You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our Site.</p>
          </section>

          <section className="policy-section">
            <h2>6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul>
              <li>Access and review the information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information (subject to certain exceptions)</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to certain processing of your information</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@tornadoaudio.net.</p>
          </section>

          <section className="policy-section">
            <h2>7. Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
          </section>

          <section className="policy-section">
            <h2>8. Children's Privacy</h2>
            <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us to have it removed.</p>
          </section>

          <section className="policy-section">
            <h2>9. Third-Party Links</h2>
            <p>Our Site may contain links to third-party websites and services. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the updated Privacy Policy on this page and update the "Last updated" date.</p>
          </section>

          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <p>
              Tornado Audio<br />
              Email: privacy@tornadoaudio.net<br />
            </p>
          </section>
        </div>
      </div>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-social">
              <h4>Follow Tornado Audio</h4>
              <div className="social-links">
                <a
                  href="https://instagram.com/tornadoaudio_mixing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Tornado Audio on Instagram"
                >
                  <span className="social-icon" role="img" aria-label="Instagram">📸</span>
                  <span>@tornadoaudio_mixing</span>
                </a>
              </div>
            </div>
            <div className="footer-copyright">
              <p>&copy; 2025 Tornado Audio - Professional Audio Mixing by Hunter Johanson. All rights reserved.</p>
              <p>
                <small>Professional audio mixing services for musicians, bands, and independent artists worldwide.</small>
              </p>
              <div className="footer-links">
                <Link to="/">Home</Link> |
                <Link to="/privacy-policy">Privacy Policy</Link> |
                <Link to="/terms-of-service">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
