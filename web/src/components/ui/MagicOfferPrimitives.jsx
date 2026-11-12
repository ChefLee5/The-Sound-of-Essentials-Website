import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './MagicOfferPrimitives.css';

/**
 * MagicOfferCard — combines Magic UI's MagicCard (cursor radial spotlight)
 * and BorderBeam (traveling luminous perimeter ring) using zero-re-render
 * CSS custom properties for smooth 60fps+ pointer tracking.
 */
export const MagicOfferCard = ({ children, className = '', ...props }) => {
  const cardRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const handlePointerMove = (e) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--magic-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--magic-y', `${e.clientY - rect.top}px`);
    cardRef.current.style.setProperty('--magic-opacity', '1');
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--magic-opacity', '0');
  };

  return (
    <div
      ref={cardRef}
      className={`magic-offer-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <div className="magic-offer-card__spotlight" aria-hidden="true" />
      <div className="magic-border-beam" aria-hidden="true" />
      <div className="magic-offer-card__inner">{children}</div>
    </div>
  );
};

/**
 * AnimatedShinyPill — Magic UI AnimatedShinyText badge with live emerald indicator.
 */
export const AnimatedShinyPill = ({ children, className = '', showDot = true }) => (
  <span className={`magic-shiny-pill ${className}`.trim()}>
    {showDot && <span className="magic-shiny-pill__dot" aria-hidden="true" />}
    <span className="magic-shiny-pill__text">{children}</span>
  </span>
);

const SPARKLE_POSITIONS = [
  { top: '-6px', left: '6%', size: 12, color: '#FFB300', delay: 0, duration: 2.4 },
  { top: '-8px', left: '48%', size: 10, color: '#4CAF50', delay: 0.7, duration: 2.8 },
  { top: '-4px', right: '4%', size: 13, color: '#FF6F00', delay: 1.2, duration: 2.3 },
  { bottom: '-5px', left: '22%', size: 10, color: '#FF6F00', delay: 0.4, duration: 2.6 },
  { bottom: '-6px', right: '18%', size: 11, color: '#FFB300', delay: 1.5, duration: 2.5 },
];

/**
 * SparklesText — Magic UI SparklesText adapted with deterministic 4-point stars
 * in canonical SOE palette colors and full reduced-motion support.
 */
export const SparklesText = ({ children, className = '' }) => {
  const prefersReduced = useReducedMotion();

  return (
    <span className={`magic-sparkles-text ${className}`.trim()}>
      <span className="magic-sparkles-text__content">{children}</span>
      {SPARKLE_POSITIONS.map((spark, idx) => (
        <motion.svg
          key={idx}
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={spark.size}
          height={spark.size}
          className="magic-sparkles-text__star"
          style={{
            top: spark.top,
            bottom: spark.bottom,
            left: spark.left,
            right: spark.right,
          }}
          initial={prefersReduced ? { opacity: 0.85, scale: 1 } : { opacity: 0.25, scale: 0.65, rotate: 0 }}
          animate={
            prefersReduced
              ? { opacity: 0.85, scale: 1 }
              : {
                  opacity: [0.25, 1, 0.25],
                  scale: [0.65, 1.15, 0.65],
                  rotate: [0, 35, 0],
                }
          }
          transition={
            prefersReduced
              ? undefined
              : {
                  duration: spark.duration,
                  delay: spark.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        >
          <path
            d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"
            fill={spark.color}
          />
        </motion.svg>
      ))}
    </span>
  );
};

/**
 * ShimmerButton — Magic UI ShimmerButton adapted for React Router Link or button,
 * pairing a traveling border spark & glass sweep with accessible dark-ink contrast.
 */
export const ShimmerButton = ({ to, onClick, children, className = '', type = 'button', ...props }) => {
  const prefersReduced = useReducedMotion();

  const inner = (
    <>
      <span className="magic-shimmer-btn__spark" aria-hidden="true" />
      <span className="magic-shimmer-btn__glare" aria-hidden="true" />
      <span className="magic-shimmer-btn__label">{children}</span>
    </>
  );

  return (
    <motion.div
      className="magic-shimmer-btn-wrap"
      whileHover={prefersReduced ? undefined : { y: -2, scale: 1.015 }}
      whileTap={prefersReduced ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      {to ? (
        <Link to={to} className={`magic-shimmer-btn ${className}`.trim()} {...props}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={`magic-shimmer-btn ${className}`.trim()} {...props}>
          {inner}
        </button>
      )}
    </motion.div>
  );
};

