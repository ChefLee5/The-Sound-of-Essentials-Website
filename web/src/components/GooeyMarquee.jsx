import React from 'react';

/**
 * GooeyMarquee — Scrolling text with a gooey blur dissolve effect at edges.
 *
 * Adapted for SOE's vanilla CSS design system (no Tailwind, no TypeScript).
 * Uses SOE design tokens for colors and typography.
 *
 * Props:
 *   text      — The string to scroll
 *   className — Extra classes on the wrapper
 *   speed     — Animation duration in seconds (higher = slower)
 *   color     — Text color (defaults to --color-text-primary)
 *   fontSize  — CSS font-size value (defaults to responsive clamp)
 */
const GooeyMarquee = ({
  text,
  className = '',
  speed = 16,
  color,
  fontSize,
}) => {
  const textColor = color || 'var(--color-text-primary)';
  const size = fontSize || 'clamp(2.5rem, 8vw, 5.5rem)';

  return (
    <div
      className={`gooey-marquee ${className}`}
      style={{ '--marquee-speed': `${speed}s` }}
      aria-label={text}
    >
      {/* Blur layer — gooey dissolve effect */}
      <div className="gooey-marquee__blur" aria-hidden="true">
        <p className="gooey-marquee__text gooey-marquee__text--blurred" style={{ color: textColor, fontSize: size }}>
          {text}
        </p>
      </div>

      {/* Clear text layer on top for readability */}
      <div className="gooey-marquee__clear">
        <p className="gooey-marquee__text" style={{ color: textColor, fontSize: size }}>
          {text}
        </p>
      </div>

      <style>{`
        .gooey-marquee {
          position: relative;
          width: 100%;
          height: clamp(5rem, 12vw, 9rem);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ── Blur layer: semi-transparent BG + high contrast filter + edge gradients ── */
        .gooey-marquee__blur {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(220, 245, 250, 0.65);
          background-image:
            linear-gradient(to right, rgba(220, 245, 250, 0.85) 1rem, transparent 50%),
            linear-gradient(to left, rgba(220, 245, 250, 0.85) 1rem, transparent 50%);
          filter: contrast(15);
        }

        .gooey-marquee__text--blurred {
          filter: blur(0.07em);
        }

        /* ── Clear text layer ── */
        .gooey-marquee__clear {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Shared text styling ── */
        .gooey-marquee__text {
          position: absolute;
          min-width: 100%;
          white-space: nowrap;
          font-family: var(--font-heading, 'Fredoka', sans-serif);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
          animation: gooeyMarqueeScroll var(--marquee-speed) infinite linear;
        }

        @keyframes gooeyMarqueeScroll {
          from { transform: translateX(70%); }
          to { transform: translateX(-70%); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .gooey-marquee {
            height: 4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GooeyMarquee;
