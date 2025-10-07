import React, { useState, useEffect } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Enhanced Google Ads conversion tracking function
  const gtag_report_conversion = (url, conversionValue = 1.0, conversionLabel = 'd9bwCKzws6gbEIu8itcC') => {
    const callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };

    // Check if gtag is available
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': `AW-719494667/${conversionLabel}`,
        'value': conversionValue,
        'currency': 'USD',
        'event_callback': callback
      });

      // Also send a custom event for enhanced tracking
      window.gtag('event', 'form_submit', {
        'event_category': 'Contact',
        'event_label': 'Contact Form Submission',
        'value': conversionValue
      });
    }
    return false;
  };

  // Function to get conversion value based on selected service
  const getConversionValue = () => {
    const projectType = formData.project;
    switch(projectType) {
      case 'basic':
        return 40.0;
      case 'professional':
        return 75.0;
      case 'premium':
        return 200.0;
      default:
        return 1.0; // Default lead value
    }
  };

  // Check for selected service from pricing section
  useEffect(() => {
    const selectedService = sessionStorage.getItem('selectedService');
    if (selectedService) {
      try {
        const service = JSON.parse(selectedService);
        setFormData(prev => ({
          ...prev,
          project: service.name.toLowerCase().includes('basic') ? 'basic' :
                   service.name.toLowerCase().includes('professional') ? 'professional' :
                   service.name.toLowerCase().includes('premium') ? 'premium' : 'custom',
          message: `I'm interested in the ${service.name} (${service.price}) service. ${service.description}\n\n`
        }));
        // Clear the session storage after using it
        sessionStorage.removeItem('selectedService');
      } catch (error) {
        console.error('Error parsing selected service:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);

        // Track conversion for successful form submission
        gtag_report_conversion(undefined, getConversionValue());

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
              />
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
                <option value="custom">Custom Quote</option>
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
