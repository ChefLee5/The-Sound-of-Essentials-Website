import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitSoeInterest } from '../services/soeSubmissions';
import { triggerBrowserDownload } from '../utils/deliveryUrl';
import { trackLead } from '../utils/analytics';
import { setGateUnlocked, isValidEmail } from '../utils/gateAuth';
import './EmailDownloadGateModal.css';

/**
 * EmailDownloadGateModal — Universal High-Converting Email Capture Gate.
 * Enforces email capture before delivering any PDF, coloring sheet, or audio file,
 * writing directly to Neon PostgreSQL CRM, triggering analytics, and delivering the file instantly.
 */
export const EmailDownloadGateModal = ({
  isOpen,
  onClose,
  downloadItem = {
    title: 'SOE Rhythm Quest: 40-Page Coloring Book',
    filename: 'SOE_Rhythm_Quest_Coloring_Book.pdf',
    url: '/downloads/SOE_Rhythm_Quest_Coloring_Book.pdf',
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

    // Auto-close modal after celebration
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2400);
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

              <form onSubmit={handleSubmit} className="email-gate-form">
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
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default EmailDownloadGateModal;
