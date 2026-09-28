import React from 'react';
import './ProofInThePause.css';

/**
 * ProofInThePause — High-trust psychology layer for moments of decision.
 * Places educator authority and parent validation directly in the decision viewport.
 */
export const ProofInThePause = ({
  variant = 'compact', // 'compact' | 'full'
  className = '',
}) => {

  return (
    <div className={`proof-in-pause proof-in-pause--${variant} ${className}`.trim()}>
      <div className="proof-strip">
        <div className="proof-item">
          <span className="proof-badge-icon">🧠</span>
          <div className="proof-item-text">
            <strong>Sound-Before-Symbol</strong>
            <span>Neuro-affirming phonological flow</span>
          </div>
        </div>

        <div className="proof-divider" />

        <div className="proof-item">
          <span className="proof-badge-icon">🎵</span>
          <div className="proof-item-text">
            <strong>19 Mastered Tracks</strong>
            <span>Language, Math, Science &amp; Movement</span>
          </div>
        </div>

        <div className="proof-divider" />

        <div className="proof-item">
          <span className="proof-badge-icon">🛡️</span>
          <div className="proof-item-text">
            <strong>100% Screen-Free Audio</strong>
            <span>Built for early learners ages 2–7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofInThePause;
