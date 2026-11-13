import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Stack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import SoeAstryxTheme from './SoeAstryxTheme';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('soe_privacy_consent');
      if (!consent) {
        setIsVisible(true);
        document.body.classList.add('has-cookie-consent');
      } else if (consent === 'granted' && typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', true);
      }
    } catch {
      // Fallback if localStorage is inaccessible
      setIsVisible(false);
    }

    return () => {
      document.body.classList.remove('has-cookie-consent');
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'granted');
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', true);
      }
    } catch {
      // ignore
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('soe_privacy_consent', 'declined');
      if (typeof window !== 'undefined' && window.clarity) {
        window.clarity('consent', false);
      }
    } catch {
      // ignore
    }
    document.body.classList.remove('has-cookie-consent');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Consent"
      className="cookie-consent-bar"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '720px',
        margin: '0 auto',
        zIndex: 9999,
      }}
    >
      <SoeAstryxTheme>
        <Card elevation="high" padding={4}>
          <Stack direction="vertical" gap={3}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.35rem', lineHeight: 1 }} aria-hidden="true">
                🛡️
              </span>
              <Text size="sm" style={{ flex: 1, lineHeight: 1.55 }}>
                <strong style={{ color: 'var(--color-orange, #FF6F00)' }}>
                  Privacy &amp; Data Safeguards:
                </strong>{' '}
                {t('legal.cookie_banner_text')}{' '}
                <Link
                  to="/privacy"
                  style={{
                    color: '#C65100',
                    textDecoration: 'underline',
                    fontWeight: 600,
                  }}
                >
                  {t('legal.cookie_learn_more')}
                </Link>
              </Text>
            </div>

            <Stack direction="horizontal" justify="end" gap={2} wrap>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDecline}
                label={t('legal.cookie_decline')}
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAccept}
                label={t('legal.cookie_accept')}
              />
            </Stack>
          </Stack>
        </Card>
      </SoeAstryxTheme>
    </aside>
  );
};

export default CookieConsent;
