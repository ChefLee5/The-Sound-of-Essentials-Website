import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackReferralShare } from '../utils/analytics';
import { assetPath } from '../utils/assetPath';
import EmailDownloadGateModal from './EmailDownloadGateModal';
import './GiftALandModal.css';

/**
 * GiftALandModal — Viral milestone & referral flywheel component.
 * Gamified reward loop that turns engaged families and teachers into organic ambassadors.
 */
export const GiftALandModal = ({ isOpen, onClose, triggerLand = 'Harmonia' }) => {
  const [copied, setCopied] = useState(false);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [isGateOpen, setIsGateOpen] = useState(false);


  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://thesoundofessentials.com';
  const shareUrl = `${origin}/listen?utm_source=referral&utm_medium=gift_a_land&utm_campaign=explorer_share`;
  const shareMessage = `Hey! We've been listening to The Sound of Essentials: Rhythm Quest with our kids — it's a completely free 19-track musical learning experience & coloring book. Thought your family would love it: ${shareUrl}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setBonusUnlocked(true);
      trackReferralShare({ channel: 'clipboard_copy', target: 'gift_a_land' });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setBonusUnlocked(true);
      trackReferralShare({ channel: 'clipboard_copy_fallback', target: 'gift_a_land' });
    }
  };

  const handleWhatsAppShare = () => {
    setBonusUnlocked(true);
    trackReferralShare({ channel: 'whatsapp', target: 'gift_a_land' });
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'The Sound of Essentials: Free 19-Track Musical Quest',
          text: "Free 19-track album & coloring book for early learners!",
          url: shareUrl,
        });
        setBonusUnlocked(true);
        trackReferralShare({ channel: 'native_share', target: 'gift_a_land' });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="gift-modal-backdrop" onClick={onClose}>
        <motion.div
          className="gift-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
        >
          <div className="gift-modal-handle" aria-hidden="true" />
          <button className="gift-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>

          <div className="gift-modal-badge-wrap">
            <span className="gift-modal-badge-icon">🌟</span>
            <span className="gift-modal-badge-pill">Milestone Reached!</span>
          </div>

          <h2 className="gift-modal-title">Harmonic Pioneer Badge Unlocked</h2>
          <p className="gift-modal-subtitle">
            You've explored the rhythm of <strong>{triggerLand}</strong>! Gift this free 19-track album &amp; coloring pack to 2 fellow parents or teachers to unlock the <strong>Secret Gabriel Bonus Activity Sheet</strong>.
          </p>

          <div className="gift-modal-share-box">
            <div className="gift-modal-actions">
              <button
                className="btn btn-gold btn-shimmer gift-modal-btn"
                onClick={handleCopyLink}
              >
                {copied ? '✅ Link Copied!' : '🔗 Copy 1-Click Gift Link'}
              </button>

              <button
                className="btn btn-outline gift-modal-btn"
                onClick={handleWhatsAppShare}
              >
                💬 Share on WhatsApp
              </button>

              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  className="btn btn-outline gift-modal-btn"
                  onClick={handleNativeShare}
                >
                  📱 More Share Options
                </button>
              )}
            </div>
          </div>

          {bonusUnlocked ? (
            <motion.div
              className="gift-modal-bonus-unlocked"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="gift-modal-bonus-content">
                <span className="gift-modal-bonus-icon">🎁</span>
                <div>
                  <strong>Secret Bonus Unlocked!</strong>
                  <button
                    type="button"
                    onClick={() => {
                      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('soe_user_email') : null;
                      if (storedEmail && storedEmail.includes('@')) {
                        const link = document.createElement('a');
                        link.href = assetPath('/assets/marketing/gabriel-coloring-sheet.webp');
                        link.download = 'Gabriel-Secret-Bonus-Coloring-Sheet.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        setIsGateOpen(true);
                      }
                    }}
                    className="gift-modal-download-link"
                    style={{ border: 'none', cursor: 'pointer', display: 'inline-block' }}
                  >
                    ⬇️ Download Bonus Coloring Sheet
                  </button>
                </div>
              </div>
            </motion.div>

          ) : (
            <p className="gift-modal-footer-note">
              🔒 <em>Bonus unlocks automatically when you share with your friends.</em>
            </p>
          )}
        </motion.div>
      </div>

      <EmailDownloadGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        downloadItem={{
          title: 'Gabriel Secret Bonus Activity Sheet',
          filename: 'Gabriel-Secret-Bonus-Coloring-Sheet.png',
          url: assetPath('/assets/marketing/gabriel-coloring-sheet.webp'),
          kind: 'interest',
        }}
      />
    </AnimatePresence>
  );
};

export default GiftALandModal;

