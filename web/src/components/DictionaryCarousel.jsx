/**
 * ═══════════════════════════════════════════════════════════════
 * SOE STACKED PANELS CAROUSEL
 * ═══════════════════════════════════════════════════════════════
 *
 * An interactive 3D stacked-panel carousel showcasing the
 * SOE Picture Dictionary pages. Cursor-driven spring physics
 * create a wave effect across the panels.
 *
 * Dependencies: motion/react (spring animations)
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'motion/react';
import './DictionaryCarousel.css';

const PANEL_COUNT = 22;
const VISIBLE_COUNT = 8;
const WAVE_SPRING = { stiffness: 160, damping: 22, mass: 0.6 };
const SCENE_SPRING = { stiffness: 80, damping: 22, mass: 1 };
const SCROLL_SPRING = { stiffness: 120, damping: 26, mass: 0.8 };
const Z_SPREAD = 42;
const SIGMA = 2.8;

const BASE = import.meta.env.BASE_URL;

const PANEL_IMAGES = [
  `${BASE}assets/dictionary/land7-school-schedules-timetables.png`,
  `${BASE}assets/dictionary/land7-holidays-celebrations-calendar.png`,
  `${BASE}assets/dictionary/back_asl_alphabet-asl-alphabet-am.png`,
  `${BASE}assets/dictionary/back_parent_teacher-parent-engagement-vocabulary.png`,
  `${BASE}assets/dictionary/land2-shapes-geometry.png`,
  `${BASE}assets/dictionary/land2-time-clocks.png`,
  `${BASE}assets/dictionary/land3-wild-animals.png`,
  `${BASE}assets/dictionary/land3-the-garden.png`,
  `${BASE}assets/dictionary/land3-camping-hiking.png`,
  `${BASE}assets/dictionary/land4-directions-navigation.png`,
  `${BASE}assets/dictionary/land4-transportation.png`,
  `${BASE}assets/dictionary/land4-seasons-nature-cycles.png`,
  `${BASE}assets/dictionary/land5-exercise-movement.png`,
  `${BASE}assets/dictionary/back_parent_teacher-classroom-language-commands.png`,
  `${BASE}assets/dictionary/land5-the-produce-market.png`,
  `${BASE}assets/dictionary/land6-community-helpers-services.png`,
  `${BASE}assets/dictionary/land6-occupations-careers.png`,
  `${BASE}assets/dictionary/land6-government-civics.png`,
  `${BASE}assets/dictionary/land7-planet-earth.png`,
  `${BASE}assets/dictionary/land7-the-solar-system.png`,
  `${BASE}assets/dictionary/land7-holidays-celebrations-calendar.png`,
  `${BASE}assets/dictionary/land7-seasons-time-in-nature.png`,
];

const PANEL_LABELS = [
  'School Schedules & Timetables',
  'Holidays & Celebrations Calendar',
  'ASL Alphabet A–M',
  'Parent Engagement Vocabulary',
  'Shapes & Geometry',
  'Time & Clocks',
  'Wild Animals',
  'The Garden',
  'Camping & Hiking',
  'Directions & Navigation',
  'Transportation',
  'Seasons & Nature Cycles',
  'Exercise & Movement',
  'Classroom Language & Commands',
  'The Produce Market',
  'Community Helpers',
  'Occupations & Careers',
  'Government & Civics',
  'Planet Earth',
  'The Solar System',
  'Holidays & Celebrations',
  'Seasons in Nature',
];

/* ── Arrow SVGs ── */
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ── Single Panel ── */
function Panel({ index, displayIndex, total, waveY, scaleY, onPanelClick }) {
  const t = displayIndex / (total - 1);
  const baseZ = (displayIndex - (total - 1)) * Z_SPREAD;
  const w = 267 + t * 107;
  const h = 280 + t * 120;
  const opacity = 0.25 + t * 0.75;
  const imageUrl = PANEL_IMAGES[index % PANEL_IMAGES.length];

  return (
    <motion.div
      className="dp-panel"
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        translateZ: baseZ,
        y: waveY,
        scaleY,
        transformOrigin: 'bottom center',
        opacity,
      }}
      onClick={(e) => { e.stopPropagation(); onPanelClick(index); }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="dp-panel__img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div
        className="dp-panel__border"
        style={{ border: `1px solid rgba(255,255,255,${0.08 + t * 0.22})` }}
      />
    </motion.div>
  );
}

/* ── Lightbox ── */
function Lightbox({ index, onClose, onPrev, onNext }) {
  const imageUrl = PANEL_IMAGES[index % PANEL_IMAGES.length];
  const label = PANEL_LABELS[index % PANEL_LABELS.length];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="dp-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="dp-lightbox__backdrop" />

      <button className="dp-lightbox__arrow dp-lightbox__arrow--left" onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
        <ChevronLeft />
      </button>
      <button className="dp-lightbox__arrow dp-lightbox__arrow--right" onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next">
        <ChevronRight />
      </button>

      <motion.div
        key={index}
        className="dp-lightbox__content"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt={label} className="dp-lightbox__img" />
        <div className="dp-lightbox__info">
          <span className="dp-lightbox__label">{label}</span>
          <span className="dp-lightbox__counter">{index + 1} / {PANEL_COUNT}</span>
        </div>
        <button className="dp-lightbox__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════ */
export default function DictionaryCarousel() {
  const containerRef = useRef(null);
  const isHovering = useRef(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxOffset = PANEL_COUNT - VISIBLE_COUNT;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const waveYSprings = Array.from({ length: VISIBLE_COUNT }, () => useSpring(0, WAVE_SPRING));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const scaleYSprings = Array.from({ length: VISIBLE_COUNT }, () => useSpring(1, WAVE_SPRING));

  const rotY = useSpring(-42, SCENE_SPRING);
  const rotX = useSpring(18, SCENE_SPRING);
  const scrollX = useSpring(0, SCROLL_SPRING);

  const scrollPrev = useCallback(() => {
    setScrollOffset((prev) => {
      const next = Math.max(0, prev - 1);
      scrollX.set(-next * 18);
      return next;
    });
  }, [scrollX]);

  const scrollNext = useCallback(() => {
    setScrollOffset((prev) => {
      const next = Math.min(maxOffset, prev + 1);
      scrollX.set(-next * 18);
      return next;
    });
  }, [scrollX, maxOffset]);

  useEffect(() => {
    if (lightboxIndex !== null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'ArrowRight') scrollNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [scrollPrev, scrollNext, lightboxIndex]);

  const handleMouseMove = useCallback((e) => {
    if (lightboxIndex !== null) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    isHovering.current = true;
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    rotY.set(-42 + (cx - 0.5) * 14);
    rotX.set(18 + (cy - 0.5) * -10);
    const cursorCardPos = cx * (VISIBLE_COUNT - 1);
    waveYSprings.forEach((spring, i) => {
      const dist = Math.abs(i - cursorCardPos);
      const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
      spring.set(-influence * 70);
    });
    scaleYSprings.forEach((spring, i) => {
      const dist = Math.abs(i - cursorCardPos);
      const influence = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));
      spring.set(0.35 + influence * 0.65);
    });
  }, [rotY, rotX, waveYSprings, scaleYSprings, lightboxIndex]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    rotY.set(-42);
    rotX.set(18);
    waveYSprings.forEach((s) => s.set(0));
    scaleYSprings.forEach((s) => s.set(1));
  }, [rotY, rotX, waveYSprings, scaleYSprings]);

  const handlePanelClick = useCallback((index) => setLightboxIndex(index), []);
  const handleCloseLightbox = useCallback(() => setLightboxIndex(null), []);
  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + PANEL_COUNT) % PANEL_COUNT : null));
  }, []);
  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % PANEL_COUNT : null));
  }, []);

  const visibleIndices = Array.from({ length: VISIBLE_COUNT }, (_, i) => scrollOffset + i);

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="dp-carousel"
        style={{ perspective: '900px' }}
      >
        {/* Left arrow */}
        <button
          onClick={scrollPrev}
          disabled={scrollOffset === 0}
          className="dp-arrow dp-arrow--left"
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </button>

        {/* Right arrow */}
        <button
          onClick={scrollNext}
          disabled={scrollOffset >= maxOffset}
          className="dp-arrow dp-arrow--right"
          aria-label="Scroll right"
        >
          <ChevronRight />
        </button>

        {/* Dot indicator */}
        <div className="dp-dots">
          {Array.from({ length: PANEL_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`dp-dot ${i >= scrollOffset && i < scrollOffset + VISIBLE_COUNT ? 'dp-dot--active' : ''}`}
            />
          ))}
        </div>

        <motion.div
          style={{
            rotateY: rotY,
            rotateX: rotX,
            x: scrollX,
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: 0,
            height: 0,
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleIndices.map((panelIndex, displayIdx) => (
              <Panel
                key={panelIndex}
                index={panelIndex}
                displayIndex={displayIdx}
                total={VISIBLE_COUNT}
                waveY={waveYSprings[displayIdx]}
                scaleY={scaleYSprings[displayIdx]}
                onPanelClick={handlePanelClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            onClose={handleCloseLightbox}
            onPrev={handleLightboxPrev}
            onNext={handleLightboxNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}
