import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitSoeInterest } from '../services/soeSubmissions';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import { trackLead } from '../utils/analytics';
import { SoeIcon } from './ui/SoeIcon';

/**
 * Streamlined horizontal inline capture bar wired to SOE's Brevo + Neon CRM.
 * Keeps vertical footprint lean and calm while unlocking the $0 19-Track Album
 * and Seriphia's weekly Sound Notes.
 */
const ResourceAlbumCapture = ({ sourceSlug = 'resources-hub', heading, subheading }) => {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('soe_user_email') || '';
    } catch {
      return '';
    }
  });
  const [role, setRole] = useState('parent');
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText('');

    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) {
      setStatus('error');
      setErrorText('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    const sourcePath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}#resource-capture:${sourceSlug}`
        : `/resources/${sourceSlug}`;

    try {
      await submitSoeInterest({
        kind: 'newsletter',
        name: role === 'educator' ? 'Early Educator' : 'Rhythm Explorer Parent',
        email: normalized,
        organizationName: role === 'educator' ? 'Early Childhood Program' : null,
        message: `Resources Hub Opt-In (${role}) from ${sourceSlug} — Unlock 19-Track Album + Weekly Sound Notes`,
        sourcePath,
      });

      setGateUnlocked(normalized, role === 'educator' ? 'Early Educator' : 'Rhythm Explorer', role);

      trackLead({
        formName: 'resources_inline_capture',
        email: normalized,
        persona: role,
        source: sourceSlug,
      });

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorText(err?.message || 'Could not submit right now. Please try again.');
    }
  };

  return (
    <section
      className="res-capture-bar"
      aria-labelledby={`res-capture-heading-${sourceSlug}`}
    >
      <div className="res-capture-bar__copy">
        <span className="res-pill-badge res-pill-badge--orange">
          <SoeIcon name="senses-ear" type="fill" size={13} />
          <span>FOUNDING LISTENING INVITATION</span>
        </span>
        <h2 id={`res-capture-heading-${sourceSlug}`} className="res-capture-bar__title">
          {heading || 'Receive the 19-Track Album & weekly Sound Notes.'}
        </h2>
        <p className="res-capture-bar__sub">
          {subheading ||
            '19 studio-recorded acoustic tracks (60–80 BPM) · Printable First 10 Minutes card · Weekly 5-minute rhythm notes for ages 2–7.'}
        </p>
      </div>

      <div className="res-capture-bar__action">
        {status === 'success' ? (
          <div className="res-capture__success" role="status">
            <div className="res-capture__success-top">
              <SoeIcon name="indicators-circle-check" type="fill" size={22} style={{ color: '#4CAF50' }} />
              <div>
                <strong>Unlocked for {email}</strong>
                <p>Your Explorer Pass is saved and Seriphia’s weekly Sound Notes are on the way.</p>
              </div>
            </div>
            <div className="res-capture__success-actions">
              <Link to="/listen?unlocked=true" className="res-btn res-btn--primary">
                <span>Open 19-Track Player →</span>
              </Link>
              <Link to="/rhythm-ready" className="res-btn res-btn--outline">
                <span>8-Week Workbook</span>
              </Link>
            </div>
          </div>
        ) : (
          <form className="res-capture-bar__form" onSubmit={handleSubmit} noValidate>
            <div className="res-capture__role-row res-capture__role-row--left" role="radiogroup" aria-label="I am a">
              <button
                type="button"
                role="radio"
                aria-checked={role === 'parent'}
                className={`res-role-pill ${role === 'parent' ? 'res-role-pill--active' : ''}`}
                onClick={() => setRole('parent')}
              >
                Parent / Caregiver
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === 'educator'}
                className={`res-role-pill ${role === 'educator' ? 'res-role-pill--active' : ''}`}
                onClick={() => setRole('educator')}
              >
                Pre-K Teacher / Director
              </button>
            </div>

            <div className="res-capture__input-row">
              <label htmlFor={`res-email-${sourceSlug}`} className="res-sr-only">
                Your email address (adult 18+)
              </label>
              <input
                id={`res-email-${sourceSlug}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Email address (adults 18+)"
                autoComplete="email"
                required
                className="res-capture__input"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="res-btn res-btn--primary res-capture__submit"
              >
                {status === 'loading' ? 'Sending…' : 'Receive Your Pass →'}
              </button>
            </div>

            {status === 'error' && errorText && (
              <p className="res-capture__error res-capture__error--left" role="alert">
                {errorText}
              </p>
            )}

            <p className="res-capture__disclaimer res-capture__disclaimer--left">
              Adults 18+ only (COPPA compliant) · Zero spam · Unsubscribe any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ResourceAlbumCapture;
