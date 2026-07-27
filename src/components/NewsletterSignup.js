import React, { useState } from 'react';
import './NewsletterSignup.css';

// Blog traffic had no path to becoming a lead. One field, one endpoint, no
// third-party service — signups arrive as mail via /api/subscribe.
const NewsletterSignup = ({ source = 'blog' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const result = await response.json();

      setStatus({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });

      if (result.success) setEmail('');
    } catch (error) {
      console.error('Subscribe error:', error);
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="newsletter">
      <h3>New posts, occasionally</h3>
      <p>
        Mixing techniques, gear I actually use, and the odd hard-won lesson. No
        spam, and you can unsubscribe by replying to any email.
      </p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <label htmlFor={`newsletter-email-${source}`} className="visually-hidden">
          Email address
        </label>
        <input
          type="email"
          id={`newsletter-email-${source}`}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {status && (
        <p className={`newsletter-status ${status.type}`} role="status">
          {status.message}
        </p>
      )}
    </aside>
  );
};

export default NewsletterSignup;
