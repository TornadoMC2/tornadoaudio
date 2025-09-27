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
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);
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
    <section id="contact" className="contact-section">
      <div className="container">
        <h2>Get Your Project Started</h2>
        <p className="section-subtitle">Ready to take your music to the next level? Let's discuss your project.</p>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <h4>📧 Email</h4>
              <p>hunterjohanson04@gmail.com</p>
            </div>
            <div className="contact-item">
              <h4>⏱️ Response Time</h4>
              <p>Within 24 hours</p>
            </div>
            <div className="contact-item">
              <h4>🎵 File Delivery</h4>
              <p>Dropbox, or Google Drive</p>
            </div>
            <div className="contact-item">
              <h4>💳 Payment</h4>
              <p>Zelle, Venmo, or Bank Transfer</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('Thank you') ? 'success' : 'error'}`}>
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
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
