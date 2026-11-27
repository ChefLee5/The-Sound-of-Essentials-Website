import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { enableConsentedAnalytics, disableConsentedAnalytics } from '../lib/analytics';
import { trackPageView } from '../utils/analytics';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('soe_privacy_consent');
      if (!consent) {
        setIsVisible(true);
        document.body.classList.add('has-cookie-consent');
      } else if (consent === 'granted') {
        enableConsentedAnalytics();
      }
    } catch {
      setIsVisible(false);
    }

    return () => {
      document.body.classList.remove('has-cookie-consent');
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'granted');
      enableConsentedAnalytics();
      trackPageView(window.location.pathname + window.location.search, document.title);
    } catch {
      // ignore storage errors
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'declined');
      disableConsentedAnalytics();
    } catch {
      // ignore storage errors
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Privacy and Cookie Consent" className="cookie-consent-bar">
      <div className="cookie-consent-card">
        <div className="cookie-consent-copy">
          <span className="cookie-consent-icon" aria-hidden="true">
            🛡️
          </span>
          <div className="cookie-consent-body">
            <p className="cookie-consent-text">
              <strong style={{ color: '#C2410C' }}>Privacy &amp; Data Safeguards:</strong>{' '}
              {t('legal.cookie_banner_text')}
            </p>
            <Link to="/privacy" className="cookie-consent-link">
              {t('legal.cookie_learn_more')}
            </Link>
          </div>
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn--secondary"
            onClick={handleDecline}
          >
            {t('legal.cookie_decline')}
          </button>
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn--primary"
            onClick={handleAccept}
          >
            {t('legal.cookie_accept')}
          </button>
        </div>
      </div>

      <style>{`
        .cookie-consent-bar {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          max-width: 720px;
          margin: 0 auto;
          z-index: 9999;
        }

        .cookie-consent-card {
          background: rgba(255, 255, 255, 0.98);
          border: 1.5px solid rgba(255, 111, 0, 0.24);
          border-radius: 24px;
          padding: 1.15rem 1.35rem;
          box-shadow: 0 18px 42px rgba(43, 32, 22, 0.16), 0 2px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .cookie-consent-copy {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .cookie-consent-icon {
          font-size: 1.3rem;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .cookie-consent-body {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .cookie-consent-text {
          margin: 0;
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.88rem;
          line-height: 1.55;
          color: #2B2016;
          max-width: none;
        }

        .cookie-consent-link {
          color: #C2410C;
          text-decoration: underline;
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.86rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          min-width: 44px;
          padding: 0 0.25rem;
          margin-left: -0.25rem;
        }

        .cookie-consent-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .cookie-consent-btn {
          min-height: 44px;
          padding: 0.55rem 1.25rem;
          border-radius: 50px;
          font-family: var(--font-heading, 'Fredoka', sans-serif);
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .cookie-consent-btn--secondary {
          background: #F4EDE2;
          color: #2B2016;
          border: 1px solid rgba(43, 32, 22, 0.14);
        }

        .cookie-consent-btn--secondary:hover {
          background: #EBE0D0;
        }

        .cookie-consent-btn--primary {
          background: #C2410C;
          color: #FFFFFF;
          border: 1px solid #9A3412;
          box-shadow: 0 4px 12px rgba(194, 65, 12, 0.28);
        }

        .cookie-consent-btn--primary:hover {
          background: #9A3412;
          transform: translateY(-1px);
        }
      `}</style>
    </aside>
  );
};

export default CookieConsent;
