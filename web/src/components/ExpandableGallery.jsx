/**
 * ═══════════════════════════════════════════════════════════════
 * SOE EXPANDABLE GALLERY
 * ═══════════════════════════════════════════════════════════════
 *
 * A stacked photo pile of dictionary pages that expands into a
 * full grid with shared-layout spring animations. Replaces the
 * 3D stacked-panel carousel in the Home book-feature section.
 *
 * Dependencies: motion/react (LayoutGroup / AnimatePresence)
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useId, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { assetPath } from '../utils/assetPath';
import './ExpandableGallery.css';

const PHOTOS = [
  {
    id: 'occupations',
    src: assetPath('/assets/dictionary/land6-occupations-careers.png'),
    alt: 'Luminosity — Occupations & Careers',
    rotation: -15,
    x: -90,
    y: 10,
    zIndex: 10,
  },
  {
    id: 'wild-animals',
    src: assetPath('/assets/dictionary/land3-wild-animals.png'),
    alt: 'Terrasol — Wild Animals',
    rotation: -3,
    x: -10,
    y: -15,
    zIndex: 20,
  },
  {
    id: 'solar-system',
    src: assetPath('/assets/dictionary/land7-the-solar-system.png'),
    alt: 'Celestia — The Solar System',
    rotation: 12,
    x: 75,
    y: 5,
    zIndex: 30,
  },
  {
    id: 'shapes',
    src: assetPath('/assets/dictionary/land2-shapes-geometry.png'),
    alt: 'Numeria — Shapes & Geometry',
  },
  {
    id: 'garden',
    src: assetPath('/assets/dictionary/land3-the-garden.png'),
    alt: 'Terrasol — The Garden',
  },
  {
    id: 'transportation',
    src: assetPath('/assets/dictionary/land4-transportation.png'),
    alt: 'Aquaria — Transportation',
  },
  {
    id: 'community-helpers',
    src: assetPath('/assets/dictionary/land6-community-helpers-services.png'),
    alt: 'Luminosity — Community Helpers',
  },
  {
    id: 'planet-earth',
    src: assetPath('/assets/dictionary/land7-planet-earth.png'),
    alt: 'Celestia — Planet Earth',
  },
  {
    id: 'produce-market',
    src: assetPath('/assets/dictionary/land5-the-produce-market.png'),
    alt: 'Vitalis — The Produce Market',
  },
];

const transition = {
  type: 'spring',
  stiffness: 160,
  damping: 18,
  mass: 1,
};

/* ── Arrow SVGs (matches DictionaryCarousel chevrons) ── */
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function useOutsideClick(ref, callback) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
}

export default function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const layoutGroupId = useId();
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) setIsExpanded(false);
  });

  return (
    <div className="xg">
      <LayoutGroup id={layoutGroupId}>
        <div className="xg__inner">
          <div className="xg__topbar">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsExpanded(false)}
                  className="xg__back"
                >
                  <span className="xg__back-icon"><ArrowLeft /></span>
                  <span>Go back</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            ref={containerRef}
            layout
            className={`xg__container ${isExpanded ? 'xg__container--grid' : 'xg__container--stack'}`}
            transition={transition}
          >
            <div className={isExpanded ? 'xg__cards--grid' : 'xg__cards--stack'}>
              {PHOTOS.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    key={`card-${photo.id}`}
                    layoutId={`card-container-${photo.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation || 0 : 0,
                      x: !isExpanded ? photo.x || 0 : 0,
                      y: !isExpanded ? photo.y || 0 : 0,
                      zIndex: !isExpanded ? photo.zIndex || index : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: (photo.y || 0) - 15,
                            rotate: (photo.rotation || 0) * 0.8,
                            zIndex: 50,
                            transition: { type: 'spring', stiffness: 400, damping: 25 },
                          }
                        : { scale: 1.02 }
                    }
                    className={`xg__card ${isExpanded ? 'xg__card--grid' : 'xg__card--stack'}`}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id}`}
                      layout="position"
                      className="xg__card-img-wrap"
                      transition={transition}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="xg__card-img"
                        loading={isPrimary ? 'eager' : 'lazy'}
                        draggable="false"
                      />
                    </motion.div>
                    {isExpanded && <div className="xg__card-label">{photo.alt}</div>}
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="xg__copy"
                >
                  <ul className="book-feature-list xg__features">
                    <li>🎵 <strong>15 heroes</strong>, each with a unique rhythm and learning style</li>
                    <li>🌏 <strong>7 magical lands</strong> — from Harmonia to Celestia</li>
                    <li>📝 <strong>125 immersive scenes</strong> with full vocabulary context</li>
                    <li>🎯 <strong>5 core domains:</strong> Language, Numbers, Science, Music, Life Skills</li>
                  </ul>

                  <div className="xg__actions">
                    <Link to="/join" className="btn btn-gold">Reserve My Copy</Link>
                    <button type="button" className="btn btn-outline xg__explore" onClick={() => setIsExpanded(true)}>
                      Explore the pages
                      <span className="xg__explore-icon"><ArrowRight /></span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </div>
  );
}
