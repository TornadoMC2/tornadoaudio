import React, { useState, useEffect } from 'react';
import './ContactSection.css';

// GA4 and Google Ads Configuration
const TRACKING_CONFIG = {
  ga4MeasurementId: 'G-0VXXHRNEQK',
  googleAdsId: 'AW-719494667',
  currency: 'USD'
};

// Service tier conversion values
const SERVICE_VALUES = {
  basic: { value: 40.0, tier: 'Basic Mix' },
  professional: { value: 75.0, tier: 'Professional Mix' },
  premium: { value: 200.0, tier: 'Premium Mix & Master' },
  'free-sample': { value: 15.0, tier: 'Free Sample Mix' }, // Higher value for lead quality
  custom: { value: 50.0, tier: 'Custom Quote' },
  information: { value: 5.0, tier: 'General Inquiry' },
  default: { value: 10.0, tier: 'Unknown' }
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Generate unique transaction ID
  const generateTransactionId = () => {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Get conversion details based on selected service
  const getConversionDetails = () => {
    const projectType = formData.project || 'default';
    return SERVICE_VALUES[projectType] || SERVICE_VALUES.default;
  };

  // Modern GA4 event-based conversion tracking
  const trackConversion = (transactionId) => {
    const conversionDetails = getConversionDetails();

    // Check if gtag is available
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics gtag not available. Conversion tracking skipped.');
      return;
    }

    try {
      // GA4 custom event for contact form submission
      // This is the primary event that Google Ads will import as a conversion
      window.gtag('event', 'contact_form_submission', {
        // Event parameters
        'value': conversionDetails.value,
        'currency': TRACKING_CONFIG.currency,
        'transaction_id': transactionId,
        'service_tier': conversionDetails.tier,
        'service_type': formData.project,

        // User information for enhanced conversions
        'user_data': {
          'email_address': formData.email,
          'address': {
            'first_name': formData.name.split(' ')[0] || '',
            'last_name': formData.name.split(' ').slice(1).join(' ') || ''
          }
        }
      });

      // Also track as standard GA4 'generate_lead' event for Analytics
      window.gtag('event', 'generate_lead', {
        'value': conversionDetails.value,
        'currency': TRACKING_CONFIG.currency,
        'transaction_id': transactionId
      });

      console.log('Conversion tracked successfully:', {
        event: 'contact_form_submission',
        transactionId,
        service: conversionDetails.tier,
        value: conversionDetails.value
      });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  };

  // Check for selected service from pricing section
  useEffect(() => {
    const checkSelectedService = () => {
      const selectedService = sessionStorage.getItem('selectedService');
      if (selectedService) {
        try {
          const service = JSON.parse(selectedService);
          let projectType = 'custom';

          // Handle different service types including free sample
          if (service.isSample || service.name.toLowerCase().includes('sample')) {
            projectType = 'free-sample';
          } else if (service.name.toLowerCase().includes('basic')) {
            projectType = 'basic';
          } else if (service.name.toLowerCase().includes('professional')) {
            projectType = 'professional';
          } else if (service.name.toLowerCase().includes('premium')) {
            projectType = 'premium';
          }

          // Only update the project dropdown, not the message field
          setFormData(prev => ({
            ...prev,
            project: projectType
          }));

          // Clear the session storage after using it
          sessionStorage.removeItem('selectedService');
        } catch (error) {
          console.error('Error parsing selected service:', error);
        }
      }
    };

    // Check initially
    checkSelectedService();

    // Add event listener for when the contact section comes into focus
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const handleFocus = () => {
        // Small delay to ensure sessionStorage is set before checking
        setTimeout(checkSelectedService, 100);
      };

      // Listen for scroll events to the contact section
      const handleScroll = () => {
        const rect = contactSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;
        if (isVisible) {
          setTimeout(checkSelectedService, 100);
        }
      };

      contactSection.addEventListener('focus', handleFocus);
      window.addEventListener('scroll', handleScroll);

      // Also check when the section becomes visible via intersection observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(checkSelectedService, 100);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(contactSection);

      return () => {
        contactSection.removeEventListener('focus', handleFocus);
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear email error when user starts typing in email field
    if (name === 'email') {
      setEmailError('');
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setEmailError('');

    // Validate email before submission
    if (!isValidEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Generate transaction ID before submission
    const transactionId = generateTransactionId();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          transactionId // Include transaction ID in submission
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);

        // Track conversion only on successful form submission
        trackConversion(transactionId);

        setFormData({
          name: '',
          email: '',
          project: '',
          message: ''
        });
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
          <h2 itemProp="name">Get Your Project Started</h2>
          <p className="section-subtitle" itemProp="description">Ready to take your music to the next level? Let's discuss your project.</p>
        </header>

        <div className="contact-content">
          <div className="contact-info" itemScope itemType="https://schema.org/ContactPoint">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <h4>📧 Email</h4>
              <p itemProp="email">contact@tornadoaudio.net</p>
            </div>
            <div className="contact-item">
              <h4>⏱ Response Time</h4>
              <p itemProp="hoursAvailable">Within 24 hours</p>
            </div>
            <div className="contact-item">
              <h4>🎵 File Delivery</h4>
              <p>Dropbox, or Google Drive</p>
            </div>
            <div className="contact-item">
              <h4>💳 Payment</h4>
              <p>Zelle, Venmo, or Bank Transfer</p>
            </div>
            <meta itemProp="contactType" content="Customer Service" />
            <meta itemProp="areaServed" content="Worldwide" />
            <meta itemProp="availableLanguage" content="English" />
          </div>

          <form className="contact-form" onSubmit={handleSubmit} itemScope itemType="https://schema.org/ContactForm">
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
                aria-describedby="name-help"
                itemProp="name"
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
                aria-describedby="email-help"
                itemProp="email"
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
                aria-describedby="project-help"
                itemProp="serviceType"
              >
                <option value="">Select a service</option>
                <option value="basic">Basic Mix ($40 / song)</option>
                <option value="professional">Professional Mix ($75 / song)</option>
                <option value="premium">Premium Mix & Master ($200 / song)</option>
                <option value="free-sample">Free Sample Mix</option>
                <option value="custom">Custom Quote</option>
                <option value="information">General Inquiry / Learn More</option>
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
                placeholder="Tell me about your project - genre, number of tracks, timeline, and any specific requirements..."
                required
                disabled={isSubmitting}
                aria-describedby="message-help"
                itemProp="text"
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              aria-describedby="submit-help"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
