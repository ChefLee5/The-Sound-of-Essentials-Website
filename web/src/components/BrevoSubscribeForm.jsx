import React, { useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Stack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { submitSoeInterest } from '../services/soeSubmissions';
import { trackLead } from '../utils/analytics';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import SoeAstryxTheme from './SoeAstryxTheme';
import './BrevoSubscribeForm.css';

/**
 * BrevoSubscribeForm — Native, accessible email capture component powered by Astryx primitives.
 * Replaces external Beehiiv iframe widgets with zero layout shifts and instant callbacks.
 */
const BrevoSubscribeForm = ({
  className = '',
  buttonText = '🎧 Unlock 19 Tracks Free →',
  placeholder = 'Enter your best email...',
  sourcePath = '/listen',
  showNameInput = false,
  kind = 'interest',
  onSuccess = null,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Submit through the resilient Edge / Supabase pipeline (which syncs to Brevo & Neon)
      await submitSoeInterest({
        kind,
        name: name.trim() || 'Rhythm Explorer',
        email: cleanEmail,
        sourcePath: sourcePath || window.location.pathname,
      });

      // 2. Local persistence for instant gate unlock
      setGateUnlocked(cleanEmail, name.trim());

      // 3. Analytics event
      trackLead({
        formName: 'brevo_subscribe_form',
        email: cleanEmail,
        source: sourcePath || window.location.pathname,
      });

      setIsSuccess(true);

      // 4. Fire page unlock / callback
      if (typeof onSuccess === 'function') {
        onSuccess({ email: cleanEmail, name: name.trim() });
      }
    } catch (err) {
      console.warn('Subscription notice (unlocking locally):', err);
      // Graceful degradation: unlock locally even if network hiccups
      setGateUnlocked(cleanEmail, name.trim());

      trackLead({
        formName: 'brevo_subscribe_form_fallback',
        email: cleanEmail,
        source: sourcePath || window.location.pathname,
      });

      setIsSuccess(true);
      if (typeof onSuccess === 'function') {
        onSuccess({ email: cleanEmail, name: name.trim() });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && !onSuccess) {
    return (
      <SoeAstryxTheme className={`brevo-subscribe-wrapper ${className}`.trim()}>
        <Banner
          status="success"
          title="✨ Welcome to the Quest!"
          description="Check your inbox for your 19-track album access links."
        />
      </SoeAstryxTheme>
    );
  }

  return (
    <SoeAstryxTheme className={`brevo-subscribe-wrapper ${className}`.trim()}>
      <form onSubmit={handleSubmit} className="brevo-form" noValidate>
        <div className="brevo-input-group">
          {showNameInput && (
            <div className="brevo-field-slot brevo-field-name">
              <TextInput
                type="text"
                label="First name"
                isLabelHidden
                placeholder="First name..."
                value={name}
                onChange={(val) => setName(val)}
                isDisabled={isSubmitting}
                size="lg"
                width="100%"
                autoComplete="given-name"
                maxLength={60}
              />
            </div>
          )}

          <div className="brevo-field-slot brevo-field-email">
            <TextInput
              type="email"
              label="Email address"
              isLabelHidden
              isRequired
              placeholder={placeholder}
              value={email}
              onChange={(val) => {
                setEmail(val);
                if (errorMsg) setErrorMsg('');
              }}
              isDisabled={isSubmitting}
              size="lg"
              width="100%"
              autoComplete="email"
              status={errorMsg ? { type: 'error' } : undefined}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            label={buttonText}
            className="brevo-submit-btn"
          />
        </div>

        {errorMsg && (
          <Stack direction="vertical" gap={1}>
            <Banner status="error" title={errorMsg} role="alert" />
          </Stack>
        )}

        <Text size="xs" color="secondary" className="brevo-disclaimer">
          🔒 No spam, ever. Unsubscribe anytime. We respect your family's inbox.
        </Text>
      </form>
    </SoeAstryxTheme>
  );
};

export default BrevoSubscribeForm;
