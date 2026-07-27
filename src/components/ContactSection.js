import React, { useState, useEffect } from 'react';
import './ContactSection.css';
import useSiteConfig from '../hooks/useSiteConfig';

// Mirrors the tiers in PricingSection.js. The `value` is what lands in the
// notification email, so keep the labels priced.
const PROJECT_OPTIONS = [
  { value: 'master', label: 'Master Only' },
  { value: 'mix', label: 'Mix' },
  { value: 'mix-master', label: 'Mix + Master' },
  { value: 'live-sound', label: 'Live Sound / Event' },
  { value: 'free-sample', label: 'Free Sample Mix' },
  { value: 'custom', label: 'Custom Quote' },
  { value: 'information', label: 'General Inquiry' },
];

const ContactSection = () => {
  const { contactInfo, locationInfo, paymentInfo, config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // The pricing cards hand off the chosen service through sessionStorage.
  useEffect(() => {
    const selectedService = sessionStorage.getItem('selectedService');
    if (!selectedService) return;

    try {
      const service = JSON.parse(selectedService);
      const isKnownOption = PROJECT_OPTIONS.some((opt) => opt.value === service.id);

      setFormData((prev) => ({
        ...prev,
        project: isKnownOption ? service.id : 'custom',
      }));
    } catch (error) {
      console.error('Error parsing selected service:', error);
    } finally {
      sessionStorage.removeItem('selectedService');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') setEmailError('');

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setEmailError('');

    if (!isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);
        setFormData({ name: '', email: '', project: '', message: '' });
      } else {
        setSubmitMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" itemScope itemType="https://schema.org/ContactPage">
      <div className="container">
        <header>
          <h2 itemProp="name">Start a Project</h2>
          <p className="section-subtitle" itemProp="description">
            Tell me what you're working on. I'll come back with a straight answer on
            fit, timing and cost.
          </p>
        </header>

        <div className="contact-content">
          <div className="contact-info" itemScope itemType="https://schema.org/ContactPoint">
            <h3>Contact Information</h3>

            {/* Some people will never fill in a form. */}
            <div className="contact-item">
              <h4>Email</h4>
              <p>
                <a href={`mailto:${contactInfo.email}`} itemProp="email">
                  {contactInfo.email}
                </a>
              </p>
            </div>
            <div className="contact-item">
              <h4>Based In</h4>
              <p>
                {locationInfo.short}
                <br />
                <span className="contact-note">{locationInfo.remoteNote}</span>
              </p>
            </div>
            <div className="contact-item">
              <h4>Response Time</h4>
              <p itemProp="hoursAvailable">{contactInfo.responseTime}</p>
            </div>
            <div className="contact-item">
              <h4>File Delivery</h4>
              <p>Dropbox, WeTransfer or Google Drive</p>
            </div>
            <div className="contact-item">
              <h4>Payment</h4>
              <p>
                {paymentInfo.methods.join(', ')}
                <br />
                <span className="contact-note">
                  {paymentInfo.depositPercentage}% deposit to book, balance before final delivery.
                </span>
              </p>
            </div>
            <meta itemProp="contactType" content="Customer Service" />
            <meta itemProp="areaServed" content="Worldwide" />
            <meta itemProp="availableLanguage" content="English" />
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`} role="alert">
                {submitMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={emailError ? 'error' : ''}
              />
              {emailError && (
                <span className="error-message" role="alert">{emailError}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="project">Project Type</label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a service</option>
                {PROJECT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Project Details</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Genre, how many songs, roughly how many tracks per song, and when you need it back."
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {/* Reducing uncertainty at the point of contact is the cheapest
                conversion win on the page. */}
            <p className="form-expectations">
              You'll hear back {contactInfo.responseTime}. Nothing is booked and no
              payment is due until we've agreed on scope
              {config.features.showFreeSample && ' — and you can ask for a free sample mix first'}.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
