import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './PrivacyPolicy.css'; // We'll reuse the same styling
import Header from './Header';

function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <Helmet>
        <title>Terms of Service | Tornado Audio - Professional Audio Mixing</title>
        <meta name="description" content="Terms of Service for Tornado Audio's professional audio mixing services. Learn about our service terms, pricing, intellectual property rights, and policies." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tornadoaudio.net/terms-of-service" />

        {/* Open Graph */}
        <meta property="og:title" content="Terms of Service | Tornado Audio" />
        <meta property="og:description" content="Terms of Service for Tornado Audio's professional audio mixing services." />
        <meta property="og:url" content="https://tornadoaudio.net/terms-of-service" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content="Terms of Service | Tornado Audio" />
        <meta name="twitter:description" content="Terms of Service for Tornado Audio's professional audio mixing services." />
      </Helmet>

      <Header />
      <div className="container">
        <div className="privacy-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last updated: October 8, 2025</p>

          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Tornado Audio. By accessing or using our website tornadoaudio.net (the "Site") and our professional audio mixing services, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.</p>
            <p>These Terms govern your access to and use of the Site and services offered by Tornado Audio ("we," "our," or "us"). If you do not agree to these Terms, you should not use the Site or our services.</p>
          </section>

          <section className="policy-section">
            <h2>2. Services</h2>
            <p>Tornado Audio provides professional audio mixing services for musicians, bands, and independent artists worldwide. Our services include but are not limited to:</p>
            <ul>
              <li>Professional audio mixing</li>
              <li>Mastering</li>
              <li>Audio editing</li>
              <li>Consultation services</li>
            </ul>
            <p>Service details, pricing, and deliverables are as specified on our Site or as agreed upon in writing between you and Tornado Audio.</p>
          </section>

          <section className="policy-section">
            <h2>3. User Accounts</h2>
            <p>Some features of our Site may require you to create an account. When you register, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these Terms or contain inaccurate information.</p>
          </section>

          <section className="policy-section">
            <h2>4. Payment Terms</h2>
            <p>Our service fees are as listed on our Site or as quoted to you directly. Payment terms include:</p>
            <ul>
              <li>Full payment required upon completion of work before final file delivery</li>
              <li>All payments are processed through secure third-party payment processors</li>
              <li>Prices are subject to change, but not for already booked and confirmed projects</li>
            </ul>
            <p>All payments are non-refundable except as required by law or as specifically stated in our refund policy.</p>
          </section>

          <section className="policy-section">
            <h2>5. Intellectual Property Rights</h2>

            <h3>5.1 Your Content</h3>
            <p>When you submit audio files or other content to us, you retain all ownership rights to your content. You grant us a limited license to use, modify, and process your content solely for the purpose of providing our services.</p>

            <h3>5.2 Our Content</h3>
            <p>All content on the Site, including text, graphics, logos, images, audio clips, and software, is the property of Tornado Audio or our content suppliers and is protected by copyright and other intellectual property laws.</p>

            <h3>5.3 Portfolio Rights</h3>
            <p>Unless explicitly stated otherwise in writing, you grant us the right to use excerpts (up to 60 seconds) of completed projects in our portfolio, website, social media, and promotional materials.</p>
          </section>

          <section className="policy-section">
            <h2>6. Revision Policy</h2>
            <p>Our mixing services include:</p>
            <ul>
              <li>Two rounds of revisions included in the base price</li>
              <li>Additional revisions available at additional cost</li>
              <li>Revision requests must be submitted within 14 days of receiving the mix</li>
              <li>Clear and specific feedback required for all revisions</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Project Delivery and Timeline</h2>
            <p>Standard delivery timelines are 7-14 business days from receiving all necessary project files, depending on project complexity and current workload. Rush services are available for an additional fee, subject to availability.</p>
          </section>

          <section className="policy-section">
            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Tornado Audio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Site or services.</p>
            <p>Our total liability for any claim arising out of these Terms shall not exceed the amount you paid us for the services giving rise to such claim.</p>
          </section>

          <section className="policy-section">
            <h2>9. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Tornado Audio and our affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:</p>
            <ul>
              <li>Your use of the Site or services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content violating copyright, trademark, or other intellectual property laws</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>10. Modifications to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes through the Site or by email. Your continued use of the Site or services after such modifications constitutes your acceptance of the updated Terms.</p>
          </section>

          <section className="policy-section">
            <h2>11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </section>

          <section className="policy-section">
            <h2>12. Contact Information</h2>
            <p>If you have questions about these Terms, please contact us at:</p>
            <p>
              Tornado Audio<br />
              Email: terms@tornadoaudio.net
            </p>
          </section>

          <div className="agreement-navigation">
            <Link to="/service-agreement" className="related-link">View Service Agreement</Link>
            <Link to="/privacy-policy" className="related-link">View Privacy Policy</Link>
            <Link to="/#contact" className="related-link">Contact Us</Link>
          </div>
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

export default TermsOfService;
