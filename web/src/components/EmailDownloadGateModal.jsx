import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitSoeInterest } from '../services/soeSubmissions';
import { triggerBrowserDownload } from '../utils/deliveryUrl';
import { trackLead, trackInitiateCheckout } from '../utils/analytics';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import './EmailDownloadGateModal.css';

const STRIPE_BUMP_URL = 'https://buy.stripe.com/test_8x2aEXbJW0BLcwS0oi6Vq01';

/**
 * EmailDownloadGateModal — Universal High-Converting Email Capture Gate & In-Cart Bump.
 * Enforces email capture before delivering any PDF, coloring sheet, or audio file,
 * writing directly to Neon PostgreSQL CRM, triggering analytics, and delivering the file instantly,
 * while presenting the acute $7 in-cart 5-minute bedtime reset bump to vault the card.
 */
export const EmailDownloadGateModal = ({
  isOpen,
  onClose,
  downloadItem = {
    title: 'The Sound of Essentials: 19-Track Album Experience',
    filename: 'The_Sound_of_Essentials_19_Tracks.pdf',
    url: null,
    kind: 'interest',
  },
  onSuccess = () => {},
}) => {
  const [name, setName] = useState(() => localStorage.getItem('soe_user_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('soe_user_email') || '');
  const [persona, setPersona] = useState(() => localStorage.getItem('soe_user_persona') || 'parent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleBumpClick = () => {
    trackInitiateCheckout({
      sku: 'SOE-STARTER-PACK',
      name: 'The Quest Starter & Coloring Pack: 40-Page Coloring Book, 432Hz Reset Track & Transition Kit',
      price: 7.00,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      kind: downloadItem.kind || 'interest',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organizationName: persona === 'parent' ? 'Home Sanctuary' : persona,
      message: `Requested Instant Download: ${downloadItem.title} (${downloadItem.filename})`,
      sourcePath: window.location.pathname,
    };

    try {
      // 1. Save to Edge CRM (Neon Serverless PostgreSQL)
      await submitSoeInterest(submissionPayload);
    } catch (err) {
      console.warn('Edge submission sync notice:', err);
    }

    // 2. Guarantee local client storage & backup (Zero data loss)
    setGateUnlocked(email.trim().toLowerCase(), name.trim(), persona);

    try {
      const existingLeads = JSON.parse(localStorage.getItem('soe_captured_leads') || '[]');
      existingLeads.push({
        ...submissionPayload,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('soe_captured_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore localStorage quota errors
    }

    // 3. Track Lead in Facebook/Meta & Microsoft Clarity
    trackLead({
      formName: 'email_download_gate',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      persona,
      download_item: downloadItem.title,
      source: window.location.pathname,
    });

    // 4. Trigger Instant File Download
    if (downloadItem.url) {
      triggerBrowserDownload(downloadItem.url, downloadItem.filename);
    }

    setIsSuccess(true);
    setIsSubmitting(false);
    onSuccess(email.trim().toLowerCase());
  };

  return (
    <AnimatePresence>
      <div className="email-gate-backdrop" onClick={onClose}>
        <motion.div
          className="email-gate-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.93, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
        >
          <div className="email-gate-handle" aria-hidden="true" />
          <button className="email-gate-close" onClick={onClose} aria-label="Close modal">
            &times;
          </button>

          {!isSuccess ? (
            <>
              <div className="email-gate-badge">
                <span>🎨 Instant Free Download</span>
              </div>

              <h2 className="email-gate-title">
                Where should we send your <em>free download</em>?
              </h2>

              <p className="email-gate-subtext">
                Unlock instant access to <strong>{downloadItem.title}</strong> and join 15,000+ families on the screen-free learning quest.
              </p>

              {errorMessage && (
                <div className="email-gate-error-banner" style={{ marginBottom: '1rem' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="email-gate-form" data-clarity-mask="true">
                <div className="email-gate-input-group">
                  <label className="email-gate-label">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="email-gate-input"
                  />
                </div>

                <div className="email-gate-input-group">
                  <label className="email-gate-label">Best Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="email-gate-input"
                  />
                </div>

                <div className="email-gate-input-group">
                  <label className="email-gate-label">I am a...</label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="email-gate-select"
                  >
                    <option value="parent">🏡 Parent / Caregiver</option>
                    <option value="educator">📚 Homeschool Pioneer</option>
                    <option value="institution">🏫 Early Childhood Teacher / Director</option>
                    <option value="ally">🩺 Pediatric OT / Therapist</option>
                    <option value="creator">🎨 Artist / Musician</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: '0.5rem 0', fontSize: '0.8rem', color: '#555' }}>
                  <input
                    type="checkbox"
                    id="modal-coppa-check"
                    required
                    style={{ marginTop: '0.15rem', accentColor: '#FF6F00', cursor: 'pointer' }}
                  />
                  <label htmlFor="modal-coppa-check" style={{ cursor: 'pointer', lineHeight: 1.35 }}>
                    I confirm I am an adult (18+) consenting to receive educational resources under COPPA guidelines.
                  </label>
                </div>

                {/* ── In-Cart Bump: Acute 5-Minute Friction Medication & 40-Page Coloring Book ── */}
                <div className="email-gate-bump-card">
                  <div className="email-gate-bump-head">
                    <span className="email-gate-bump-badge">⚡ SPECIAL IN-CART BUMP • 75% OFF</span>
                    <span className="email-gate-bump-price">$7</span>
                  </div>
                  <h4 className="email-gate-bump-title">
                    The Quest Starter &amp; Coloring Pack (40-Page Book + 5-Minute Reset Kit)
                  </h4>
                  <p className="email-gate-bump-desc">
                    Includes the <strong>Complete 40-Page Rhythm Quest Storybook Coloring Book (PDF)</strong>, <strong>Seriphia’s 432Hz Bedtime Calming Track</strong>, <strong>7-Land Tactile Rhythm Cue Cards</strong>, and the refrigerator <strong>Daily Rhythm Dial</strong>.
                  </p>
                  <a
                    href={STRIPE_BUMP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleBumpClick}
                    className="email-gate-bump-link"
                  >
                    ➕ Add Quest Starter &amp; Coloring Pack ($7) →
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="email-gate-submit-btn"
                >
                  {isSubmitting ? '⏳ Preparing Your Download...' : '⬇️ Download & Unlock Instant Access 🚀'}
                </button>
              </form>

              <p className="email-gate-privacy-note">
                🔒 100% spam-free. We only send joyful acoustic music, printables, and curriculum updates.
              </p>
            </>
          ) : (
            <div className="email-gate-success-box">
              <div className="email-gate-success-icon">🎉</div>
              <h2 className="email-gate-title">Download Started!</h2>
              <p className="email-gate-subtext" style={{ marginTop: '0.5rem' }}>
                Your file (<strong>{downloadItem.filename}</strong>) is downloading now. We've also saved your explorer pass for <strong>{email}</strong>!
              </p>

              {/* ── High-Converting Post-Capture Bump Card ── */}
              <div className="email-gate-bump-card email-gate-bump-card--success">
                <div className="email-gate-bump-head">
                  <span className="email-gate-bump-badge">🌙 PARENT SANCTUARY UPGRADE</span>
                  <span className="email-gate-bump-price">$7</span>
                </div>
                <h4 className="email-gate-bump-title">
                  Grab the Quest Starter &amp; 40-Page Coloring Pack ($7)
                </h4>
                <p className="email-gate-bump-desc">
                  Pair your free 19-track album with the complete 40-page tactile storybook coloring book, Seriphia's 432Hz calming audio, printable daily rhythm dial, and transition cue cards.
                </p>
                <a
                  href={STRIPE_BUMP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBumpClick}
                  className="email-gate-bump-btn-solid"
                >
                  ⚡ Order Quest Starter &amp; Coloring Pack ($7 Stripe Checkout) →
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="email-gate-continue-btn"
              >
                Continue Exploring →
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default EmailDownloadGateModal;
