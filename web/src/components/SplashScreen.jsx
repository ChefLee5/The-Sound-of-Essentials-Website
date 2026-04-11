import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SplashScreen = ({ onFinished }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('enter'); // enter → show → exit → done

  useEffect(() => {
    // Phase 1: entrance animation plays via CSS (0–800ms)
    const showTimer = setTimeout(() => setPhase('show'), 800);
    // Phase 2: hold for reading (800–3000ms)
    const exitTimer = setTimeout(() => setPhase('exit'), 3000);
    // Phase 3: fade out (3000–3700ms), then remove
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onFinished?.();
    }, 3700);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  if (phase === 'done') return null;

  const titleLine2   = t('splash.line2');
  const subtitleText = t('splash.subtitle');

  return (
    <div className={`splash-screen splash-screen--${phase}`} aria-hidden="true">

      {/* Animated colour orbs */}
      <div className="splash-screen__orbs">
        <div className="splash-orb splash-orb--1" />
        <div className="splash-orb splash-orb--2" />
        <div className="splash-orb splash-orb--3" />
      </div>

      {/* Animated rings */}
      <div className="splash-screen__rings">
        <div className="splash-screen__ring splash-screen__ring--1" />
        <div className="splash-screen__ring splash-screen__ring--2" />
        <div className="splash-screen__ring splash-screen__ring--3" />
      </div>

      {/* Floating music notes */}
      <div className="splash-screen__notes" aria-hidden="true">
        {['♪', '♫', '♩', '♬', '♪', '♫'].map((note, i) => (
          <span key={i} className={`splash-note splash-note--${i + 1}`}>{note}</span>
        ))}
      </div>

      {/* Main content */}
      <div className="splash-screen__content">
        <div className="splash-screen__icon">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.2)" />
            <text x="26" y="36" textAnchor="middle" fontSize="28" fill="white">♪</text>
          </svg>
        </div>

        <h1 className="splash-screen__title">
          <span className="splash-screen__title-line1">{t('splash.line1')}</span>
          <span className="splash-screen__title-line2">
            {titleLine2.split('').map((char, i) => (
              <span
                key={i}
                className="splash-letter"
                style={{ animationDelay: `${0.45 + i * 0.045}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        <div className="splash-screen__subtitle">
          {subtitleText.split('').map((char, i) => (
            <span
              key={i}
              className="splash-subtitle-letter"
              style={{ animationDelay: `${0.7 + i * 0.03}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        <div className="splash-screen__tagline">{t('splash.tagline')}</div>
      </div>

      {/* Loading bar */}
      <div className="splash-screen__loader">
        <div className="splash-screen__loader-bar" />
      </div>

      <style>{`
        /* ──────────────────────────────────────────
           SplashScreen — Bright & Playful
           Warm white base with vibrant colour orbs
           matching the bright direction.
        ────────────────────────────────────────── */

        .splash-screen {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          /* Bright warm white base, NOT dark */
          background: #ffffff;
          overflow: hidden;
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .splash-screen--exit {
          opacity: 0;
          transform: scale(1.03);
          pointer-events: none;
        }

        /* ── Colour Orbs ── */
        .splash-screen__orbs {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .splash-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: splashOrbDrift 8s ease-in-out infinite;
        }

        .splash-orb--1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(76,175,80,0.18), transparent 70%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .splash-orb--2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(123,31,162,0.12), transparent 70%);
          bottom: -150px;
          right: -150px;
          animation-delay: 2s;
        }

        .splash-orb--3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255,111,0,0.1), transparent 70%);
          top: 40%;
          left: 60%;
          animation-delay: 4s;
        }

        @keyframes splashOrbDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.04); }
          66%       { transform: translate(-20px, 30px) scale(0.97); }
        }

        /* ── Rings ── */
        .splash-screen__rings {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .splash-screen__ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(76, 175, 80, 0.12);
          animation: splash-ring-pulse 3.5s ease-in-out infinite;
        }

        .splash-screen__ring--1 { width: 280px; height: 280px; animation-delay: 0s; }
        .splash-screen__ring--2 { width: 480px; height: 480px; animation-delay: 0.7s; border-color: rgba(123,31,162,0.08); }
        .splash-screen__ring--3 { width: 680px; height: 680px; animation-delay: 1.4s; border-color: rgba(30,136,229,0.07); }

        @keyframes splash-ring-pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.3; }
          50%       { transform: scale(1.04); opacity: 0.7; }
        }

        /* ── Floating Notes ── */
        .splash-screen__notes {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .splash-note {
          position: absolute;
          font-size: 1.4rem;
          animation: splashNoteFloat 6s ease-in-out infinite;
        }

        .splash-note--1 { top: 15%; left: 10%;  color: rgba(76,175,80,0.35);   animation-delay: 0s; }
        .splash-note--2 { top: 20%; left: 85%;  color: rgba(123,31,162,0.25);  animation-delay: 0.8s; font-size: 1.1rem; }
        .splash-note--3 { top: 70%; left: 8%;   color: rgba(255,111,0,0.3);    animation-delay: 1.4s; font-size: 1.6rem; }
        .splash-note--4 { top: 65%; left: 88%;  color: rgba(30,136,229,0.3);   animation-delay: 0.3s; font-size: 1.2rem; }
        .splash-note--5 { top: 40%; left: 92%;  color: rgba(76,175,80,0.25);   animation-delay: 1.8s; }
        .splash-note--6 { top: 80%; left: 40%;  color: rgba(255,179,0,0.3);    animation-delay: 0.6s; font-size: 1.0rem; }

        @keyframes splashNoteFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(8deg); }
        }

        /* ── Content ── */
        .splash-screen__content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .splash-screen__icon {
          width: 96px;
          height: 96px;
          border-radius: 26px;
          background: linear-gradient(135deg, var(--color-green), var(--color-blue));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          box-shadow: 0 8px 32px rgba(76,175,80,0.3), 0 2px 8px rgba(0,0,0,0.1);
          animation: splash-icon-enter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes splash-icon-enter {
          from { transform: scale(0.3) rotate(-180deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .splash-screen__title { margin: 0; line-height: 1.1; }

        .splash-screen__title-line1 {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--color-text-muted);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          animation: splash-text-up 0.6s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          margin-bottom: 0.5rem;
        }

        .splash-screen__title-line2 {
          display: block;
          font-family: 'Fredoka', sans-serif;
          font-size: 3.8rem;
          font-weight: 700;
          /* Gradient text on bright background */
          background: linear-gradient(135deg, var(--color-green), var(--color-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
        }

        .splash-letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px) scale(0.85);
          animation: splash-letter-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes splash-letter-pop {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .splash-subtitle-letter {
          display: inline-block;
          opacity: 0;
          animation: splash-letter-fade 0.4s ease forwards;
        }

        @keyframes splash-letter-fade {
          to { opacity: 1; }
        }

        .splash-screen__subtitle {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-top: 0.3rem;
        }

        .splash-screen__tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--color-text-muted);
          margin-top: 1.2rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          animation: splash-text-up 0.6s 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes splash-text-up {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* ── Loader Bar ── */
        .splash-screen__loader {
          position: absolute;
          bottom: 56px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 3px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          overflow: hidden;
          animation: splash-text-up 0.6s 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .splash-screen__loader-bar {
          height: 100%;
          background: linear-gradient(90deg,
            var(--color-green),
            var(--color-blue),
            var(--color-purple),
            var(--color-orange)
          );
          background-size: 200% 100%;
          border-radius: 999px;
          animation:
            splash-loader-fill 3.0s 0.6s ease-out both,
            splash-loader-shimmer 1.5s 0.6s linear infinite;
        }

        @keyframes splash-loader-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        @keyframes splash-loader-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .splash-screen__title-line2 { font-size: 2.6rem; }
          .splash-screen__subtitle    { font-size: 1.2rem; }
          .splash-screen__icon        { width: 76px; height: 76px; border-radius: 20px; }
          .splash-screen__ring--3     { display: none; }
          .splash-orb--3              { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
