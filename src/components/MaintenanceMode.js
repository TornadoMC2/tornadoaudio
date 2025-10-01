import React from 'react';
import './MaintenanceMode.css';
import useSiteConfig from '../hooks/useSiteConfig';

const MaintenanceMode = () => {
  const { contactInfo } = useSiteConfig();

  return (
    <div className="maintenance-mode">
      <div className="maintenance-container">
        <div className="maintenance-content">
          <div className="maintenance-icon">
            🔧
          </div>
          <h1 className="maintenance-title">We'll Be Right Back</h1>
          <h2 className="maintenance-subtitle">Tornado Audio is Currently Under Maintenance</h2>

          <div className="maintenance-message">
            <p>
              I'm currently making some improvements to provide you with an even better experience.
              The site will be back online shortly.
            </p>
            <p>
              Need immediate assistance? Feel free to reach out directly:
            </p>
          </div>

          <div className="maintenance-contact">
            <a href={`mailto:${contactInfo.email}`} className="maintenance-email">
              📧 {contactInfo.email}
            </a>
            <p className="maintenance-response">
              I typically respond {contactInfo.responseTime}
            </p>
          </div>

          <div className="maintenance-footer">
            <p>Thank you for your patience!</p>
            <p className="maintenance-signature">- Hunter Johanson, Audio Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
