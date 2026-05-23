import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function TrackStack({ tracks, currentIndex: controlledIndex, onSelect }) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = controlledIndex ?? internalIndex;
  const lastNavTime = useRef(0);
  const cooldown = 400;

  const navigate = useCallback((dir) => {
    const now = Date.now();
    if (now - lastNavTime.current < cooldown) return;
    lastNavTime.current = now;
    const next = dir > 0
      ? (currentIndex === tracks.length - 1 ? 0 : currentIndex + 1)
      : (currentIndex === 0 ? tracks.length - 1 : currentIndex - 1);
    if (onSelect) onSelect(next);
    else setInternalIndex(next);
  }, [currentIndex, tracks.length, onSelect]);

  const handleDragEnd = (_, info) => {
    const threshold = 50;
    if (info.offset.y < -threshold) navigate(1);
    else if (info.offset.y > threshold) navigate(-1);
  };

  const handleWheel = useCallback((e) => {
    if (Math.abs(e.deltaY) > 30) navigate(e.deltaY > 0 ? 1 : -1);
  }, [navigate]);

  useEffect(() => {
    const el = document.querySelector('.ts-viewport');
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const getStyle = (index) => {
    const total = tracks.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0)       return { y: 0,    scale: 1,    opacity: 1,   zIndex: 5, rotateX: 0 };
    if (diff === -1)      return { y: -140, scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: 8 };
    if (diff === -2)      return { y: -240, scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: 15 };
    if (diff === 1)       return { y: 140,  scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: -8 };
    if (diff === 2)       return { y: 240,  scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: -15 };
    return { y: diff > 0 ? 360 : -360, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
  };

  const isVisible = (index) => {
    const total = tracks.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div className="ts-viewport">
      {/* Card stack */}
      <div className="ts-stack" style={{ perspective: '1200px' }}>
        {tracks.map((track, index) => {
          if (!isVisible(index)) return null;
          const s = getStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={track.id ?? index}
              className="ts-card-wrap"
              animate={{
                y: s.y, scale: s.scale, opacity: s.opacity,
                rotateX: s.rotateX, zIndex: s.zIndex,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => { if (onSelect) onSelect(index); else setInternalIndex(index); }}
              style={{ transformStyle: 'preserve-3d', zIndex: s.zIndex }}
            >
              <div
                className={`ts-card ${isCurrent ? 'ts-card--active' : ''}`}
                style={{
                  boxShadow: isCurrent
                    ? '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 10px 30px -10px rgba(0,0,0,0.2)',
                }}
              >
                <div className="ts-card__glow" />
                <img src={track.cover} alt={track.title} className="ts-card__img" draggable={false} />
                <div className="ts-card__overlay">
                  <span className="ts-card__number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="ts-card__meta">
                    <span className="ts-card__title">{track.title}</span>
                    <span className="ts-card__artist">{track.artist}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="ts-dots">
        {tracks.map((_, index) => (
          <button
            key={index}
            onClick={() => { if (onSelect) onSelect(index); else setInternalIndex(index); }}
            className={`ts-dot ${index === currentIndex ? 'ts-dot--active' : ''}`}
            aria-label={`Go to track ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="ts-counter">
        <span className="ts-counter__current">{String(currentIndex + 1).padStart(2, '0')}</span>
        <div className="ts-counter__divider" />
        <span className="ts-counter__total">{String(tracks.length).padStart(2, '0')}</span>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="ts-hint"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </motion.div>
        <span className="ts-hint__text">Scroll or drag</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      <style>{`
        /* ═══════════════════════════════════════
           TrackStack — Vertical Image Stack
           ═══════════════════════════════════════ */

        .ts-viewport {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 560px;
          overflow: hidden;
          user-select: none;
        }

        /* ── Card Stack ── */
        .ts-stack {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 280px;
          height: 440px;
        }

        .ts-card-wrap {
          position: absolute;
          cursor: grab;
        }
        .ts-card-wrap:active { cursor: grabbing; }

        .ts-card {
          position: relative;
          width: 260px;
          height: 380px;
          overflow: hidden;
          border-radius: var(--radius-lg, 24px);
          border: 2px solid rgba(255,255,255,0.12);
          transition: box-shadow 0.3s ease;
        }

        .ts-card__glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%);
          z-index: 1;
          pointer-events: none;
        }

        .ts-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ts-card__overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 40%, transparent 70%);
          z-index: 2;
        }

        .ts-card__number {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-family: var(--font-heading, sans-serif);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.5);
          background: rgba(0,0,0,0.3);
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          backdrop-filter: blur(8px);
        }

        .ts-card__meta { display: flex; flex-direction: column; gap: 0.15rem; }

        .ts-card__title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        .ts-card__artist {
          font-family: var(--font-body, sans-serif);
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
        }

        /* ── Navigation Dots ── */
        .ts-dots {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ts-dot {
          width: 8px;
          height: 8px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          background: var(--color-text-muted, rgba(255,111,0,0.3));
          transition: all 0.3s ease;
          padding: 0;
        }

        .ts-dot:hover { background: var(--color-orange-light, #FF9800); }

        .ts-dot--active {
          height: 22px;
          background: var(--color-orange, #FF6F00);
        }

        /* ── Counter ── */
        .ts-counter {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ts-counter__current {
          font-family: var(--font-display, sans-serif);
          font-size: 2rem;
          font-weight: 300;
          color: var(--color-text-primary, #E65100);
          font-variant-numeric: tabular-nums;
        }

        .ts-counter__divider {
          width: 28px;
          height: 1px;
          background: var(--color-border-light, rgba(0,0,0,0.1));
          margin: 0.4rem 0;
        }

        .ts-counter__total {
          font-family: var(--font-body, sans-serif);
          font-size: 0.85rem;
          color: var(--color-text-muted, rgba(0,0,0,0.4));
          font-variant-numeric: tabular-nums;
        }

        /* ── Scroll Hint ── */
        .ts-hint {
          position: absolute;
          bottom: 0.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-text-muted, rgba(0,0,0,0.35));
        }

        .ts-hint__text {
          font-family: var(--font-body, sans-serif);
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .ts-viewport { min-height: 480px; }
          .ts-stack { width: 240px; height: 380px; }
          .ts-card { width: 220px; height: 320px; }
          .ts-dots { right: 0.5rem; }
          .ts-counter { left: 0.5rem; }
          .ts-counter__current { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}

export default TrackStack;
