import React from 'react';

/**
 * CubeLoader — 3D spinning cube loading animation
 * Adapted from a shadcn/Tailwind component into vanilla CSS + JSX
 * for the SOE Rhythm Quest design system.
 *
 * Usage:
 *   <CubeLoader />                           — default full viewport loader
 *   <CubeLoader compact />                   — compact inline variant (400px height)
 *   <CubeLoader message="Loading tracks…" /> — custom loading message
 */
const CubeLoader = ({ compact = false, message }) => {
  return (
    <div
      className={`cube-loader ${compact ? 'cube-loader--compact' : ''}`}
      role="status"
      aria-label="Loading"
    >
      {/* 3D Scene Wrapper */}
      <div className="cube-loader__scene">
        {/* THE SPINNING CUBE CONTAINER */}
        <div className="cube-loader__cube">
          {/* Internal Core (The energy source) */}
          <div className="cube-loader__core" />

          {/* CUBE FACES */}
          {/* Front */}
          <div className="cube-side cube-side--front">
            <div className="cube-face cube-face--green" />
          </div>
          {/* Back */}
          <div className="cube-side cube-side--back">
            <div className="cube-face cube-face--green" />
          </div>
          {/* Right */}
          <div className="cube-side cube-side--right">
            <div className="cube-face cube-face--purple" />
          </div>
          {/* Left */}
          <div className="cube-side cube-side--left">
            <div className="cube-face cube-face--purple" />
          </div>
          {/* Top */}
          <div className="cube-side cube-side--top">
            <div className="cube-face cube-face--orange" />
          </div>
          {/* Bottom */}
          <div className="cube-side cube-side--bottom">
            <div className="cube-face cube-face--orange" />
          </div>
        </div>

        {/* Floor Shadow */}
        <div className="cube-loader__shadow" />
      </div>

      {/* Loading Text */}
      <div className="cube-loader__text">
        <h3 className="cube-loader__title">Loading</h3>
        <p className="cube-loader__subtitle">
          {message || 'Preparing your experience, please wait…'}
        </p>
      </div>

      <style>{`
        /* ──────────────────────────────────────────
           CubeLoader — 3D Spinning Cube
           SOE Rhythm Quest — Bright & Playful
        ────────────────────────────────────────── */

        .cube-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          padding: 3rem;
          min-height: 100vh;
          perspective: 1200px;
        }

        .cube-loader--compact {
          min-height: 400px;
        }

        /* ── 3D Scene ── */
        .cube-loader__scene {
          position: relative;
          width: 96px;
          height: 96px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        /* ── Cube Assembly ── */
        .cube-loader__cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: cubeSpin 8s linear infinite;
        }

        /* ── Internal Core ── */
        .cube-loader__core {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 32px;
          height: 32px;
          background: var(--color-orange, #FF6F00);
          border-radius: 50%;
          filter: blur(12px);
          box-shadow:
            0 0 30px rgba(255, 111, 0, 0.6),
            0 0 60px rgba(255, 111, 0, 0.3);
          animation: cubeCorePulse 2s ease-in-out infinite;
        }

        /* ── Side Wrappers ── */
        .cube-side {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .cube-side--front  { transform: rotateY(0deg); }
        .cube-side--back   { transform: rotateY(180deg); }
        .cube-side--right  { transform: rotateY(90deg); }
        .cube-side--left   { transform: rotateY(-90deg); }
        .cube-side--top    { transform: rotateX(90deg); }
        .cube-side--bottom { transform: rotateX(-90deg); }

        /* ── Faces ── */
        .cube-face {
          width: 100%;
          height: 100%;
          position: absolute;
          animation: cubeBreathe 3s ease-in-out infinite;
          backdrop-filter: blur(2px);
          border-radius: 4px;
        }

        /* SOE brand color mapping */
        .cube-face--green {
          background: rgba(76, 175, 80, 0.10);
          border: 2px solid var(--color-green, #4CAF50);
          box-shadow: 0 0 15px rgba(76, 175, 80, 0.35);
        }

        .cube-face--purple {
          background: rgba(123, 31, 162, 0.10);
          border: 2px solid var(--color-purple, #7B1FA2);
          box-shadow: 0 0 15px rgba(123, 31, 162, 0.35);
        }

        .cube-face--orange {
          background: rgba(255, 111, 0, 0.10);
          border: 2px solid var(--color-orange, #FF6F00);
          box-shadow: 0 0 15px rgba(255, 111, 0, 0.35);
        }

        /* ── Floor Shadow ── */
        .cube-loader__shadow {
          position: absolute;
          bottom: -80px;
          width: 96px;
          height: 32px;
          background: rgba(0, 0, 0, 0.15);
          filter: blur(20px);
          border-radius: 100%;
          animation: cubeShadowBreathe 3s ease-in-out infinite;
        }

        /* ── Loading Text ── */
        .cube-loader__text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .cube-loader__title {
          font-family: var(--font-heading, 'Fredoka', sans-serif);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--color-green, #4CAF50), var(--color-blue, #1E88E5));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1;
        }

        .cube-loader__subtitle {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.78rem;
          color: var(--color-text-dark-secondary, #555568);
          margin: 0;
          max-width: none;
        }

        /* ──────────────────────────────────
           Keyframes
        ────────────────────────────────── */

        /* 1. Cube Spin — full rotation on X and Y */
        @keyframes cubeSpin {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        /* 2. Face Breathing — expand outward and back */
        @keyframes cubeBreathe {
          0%, 100% { transform: translateZ(48px); opacity: 0.8; }
          50%      { transform: translateZ(80px); opacity: 0.4; border-color: rgba(255, 255, 255, 0.6); }
        }

        /* 3. Core Pulse */
        @keyframes cubeCorePulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50%      { transform: scale(1.2); opacity: 1; }
        }

        /* 4. Shadow Breathing */
        @keyframes cubeShadowBreathe {
          0%, 100% { transform: scale(1);   opacity: 0.3; }
          50%      { transform: scale(1.5); opacity: 0.12; }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .cube-loader__scene {
            width: 72px;
            height: 72px;
          }

          .cube-loader__core {
            width: 24px;
            height: 24px;
          }

          .cube-loader__shadow {
            width: 72px;
            bottom: -60px;
          }

          @keyframes cubeBreathe {
            0%, 100% { transform: translateZ(36px); opacity: 0.8; }
            50%      { transform: translateZ(60px); opacity: 0.4; border-color: rgba(255, 255, 255, 0.6); }
          }
        }
      `}</style>
    </div>
  );
};

export default CubeLoader;
