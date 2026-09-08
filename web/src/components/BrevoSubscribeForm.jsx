import React, { useState } from 'react';
import { submitSoeInterest } from '../services/soeSubmissions';
import { trackLead } from '../utils/analytics';
import './BrevoSubscribeForm.css';

/**
 * BrevoSubscribeForm — Native, accessible, claymorphic email capture component.
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
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
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
      try {
        localStorage.setItem('soe_user_email', cleanEmail);
        localStorage.setItem('soe_listen_unlocked', '1');
      } catch (storageErr) {
        console.warn('LocalStorage unavailable:', storageErr);
      }

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
      try {
        localStorage.setItem('soe_user_email', cleanEmail);
        localStorage.setItem('soe_listen_unlocked', '1');
      } catch {}

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
      <div className={`brevo-success-message ${className}`.trim()}>
        <span className="brevo-success-icon">✨</span>
        <h4>Welcome to the Quest!</h4>
        <p>Check your inbox for your 19-track album access links.</p>
      </div>
    );
  }

  return (
    <div className={`brevo-subscribe-wrapper ${className}`.trim()}>
      <form onSubmit={handleSubmit} className="brevo-form" noValidate>
        <div className="brevo-input-group">
          {showNameInput && (
            <input
              type="text"
              placeholder="First name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="brevo-input brevo-input-name"
              maxLength={60}
            />
          )}

          <input
            type="email"
            required
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="brevo-input brevo-input-email"
            aria-label="Email address"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-gold btn-shimmer brevo-submit-btn"
          >
            {isSubmitting ? (
              <span className="brevo-loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            ) : (
              buttonText
            )}
          </button>
        </div>

        {errorMsg && <p className="brevo-error-text">{errorMsg}</p>}

        <p className="brevo-disclaimer">
          🔒 No spam, ever. Unsubscribe anytime. We respect your family's inbox.
        </p>
      </form>
    </div>
  );
};

export default BrevoSubscribeForm;
