import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAnimeReveal } from '../hooks/useAnimeReveal';

/* ── Reveal Hook ── */
const useReveal = () => {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
};

const RevealSection = ({ children, className = '', delay = 0 }) => {
    const ref = useReveal();
    return (
        <div ref={ref} className={`reveal-block ${className}`} style={{ animationDelay: `${delay}s` }}>
            {children}
        </div>
    );
};

/* ── Animated Counter ── */
const AnimatedStat = ({ value, suffix = '', label, color }) => {
    const ref = useRef(null);
    const numRef = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animateCount();
                    observer.unobserve(el);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const animateCount = () => {
        const target = parseInt(value);
        const dur = 2000;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / dur, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (numRef.current) {
                numRef.current.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            }
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    return (
        <div ref={ref} className="mission-stat glass-card">
            <span ref={numRef} className="mission-stat__number" style={{ color }}>0{suffix}</span>
            <span className="mission-stat__label">{label}</span>
        </div>
    );
};

/* ── Ambient Scene Gallery ── */
const SCENES = [
  { src: 'b-roll-boats.webp',          caption: 'On the Water',            land: 'Lexiconia' },
  { src: 'b-roll-flowers.webp',        caption: 'Through the Fields',      land: 'Natura' },
  { src: 'climb-numeria.webp',         caption: 'Climbing Numeria',        land: 'Numeria' },
  { src: 'donkey.webp',                caption: 'A Trusty Companion',      land: 'Animalia' },
  { src: 'drums.webp',                 caption: 'The Beat Goes On',        land: 'Harmonia' },
  { src: 'seriphia-in-celestia.webp',  caption: 'Seriphia at the Gate',    land: 'Celestia' },
  { src: 'touch-your-toes.webp',       caption: 'Body in Motion',          land: 'Kinesthia' },
  { src: 'wave.webp',                  caption: 'Riding the Wave',         land: 'Aquaria' },
  // ── New scenes ──
  { src: 'excited-to-learn.webp',      caption: 'Excited to Learn',        land: 'All Lands' },
  { src: 'floating-letters.webp',      caption: 'Floating Letters',        land: 'Lexiconia' },
  { src: 'counting-claps.webp',        caption: 'Counting Claps',          land: 'Numeria' },
  { src: 'path-to-terrasol.webp',      caption: 'Path to TerraSol',        land: 'TerraSol' },
  { src: 'living-food.webp',           caption: 'Living Food',             land: 'Vitalis' },
  { src: 'kwame-counting.webp',        caption: 'Kwame at Work',           land: 'Numeria' },
  { src: 'march-luminosity.webp',      caption: 'March of Luminosity',     land: 'Luminosity' },
  { src: 'sundial-weather.webp',       caption: 'Reading the Sundial',     land: 'Chronia' },
];

const MissionSceneGallery = () => {
  const gridRef = useAnimeReveal({ selector: '.mission-scene', staggerMs: 85, translateY: [24, 0], scale: [0.96, 1] });

  return (
    <section className="section mission-scene-section">
      <div className="container">
        <RevealSection className="text-center">
          <div className="section-label">🌍 The Seven Lands</div>
          <h2 className="section-title">
            A World Built for <span className="text-gold">Every Child</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
            Each land in the Rhythm Quest universe mirrors a real domain of learning —
            bringing vocabulary, music, and movement to life through immersive scenes.
          </p>
        </RevealSection>

        <div className="mission-scene-mosaic" ref={gridRef}>
          {SCENES.map((s) => (
            <div key={s.src} className="mission-scene anime-item">
              <img
                src={`${import.meta.env.BASE_URL}assets/scenes/${s.src}`}
                alt={s.caption}
                loading="lazy"
              />
              <div className="mission-scene__label">
                <span className="mission-scene__land">{s.land}</span>
                <span className="mission-scene__caption">{s.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Mission = () => {
    const { t } = useTranslation();
    React.useEffect(() => { document.title = 'Our Mission — SOE Rhythm Quest'; }, []);
    return (
        <div className="mission-page">
            {/* ── Hero ── */}
            <header className="mission-hero">
                <div className="container text-center">
                    <div className="animate-fade-up">
                        <div className="section-label">Our Mission</div>
                        <h1>
                            A <span className="accent-text">State of Emergency</span>
                        </h1>
                        <p className="section-subtitle" style={{ margin: '1rem auto' }}>
                            The world's most vulnerable children are running out of time.
                            SOE exists to change that equation through the universal language of music.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── The Manifesto ── */}
            <section className="section glow-plum">
                <div className="container">
                    <RevealSection>
                        <div className="manifesto-block text-center">
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', maxWidth: '800px', margin: '0 auto 2rem' }}>
                                "Right now, 300 million children on this planet cannot read at a basic level.
                                44 million teachers are absent from classrooms that need them most."
                            </h2>
                            <div className="divider divider-center"></div>
                            <p className="section-subtitle" style={{ margin: '0 auto' }}>
                                These are not just statistics. Behind every number is a child whose neurological
                                window of opportunity is closing. The systems designed to help them are
                                overwhelmed, underfunded, and too slow.
                            </p>
                        </div>
                    </RevealSection>

                    <RevealSection>
                        <div className="manifesto-stats">
                            <AnimatedStat value="300" suffix="M" label="Children lack basic literacy worldwide" color="var(--color-gold)" />
                            <AnimatedStat value="44" suffix="M" label="Global teacher deficit — classrooms without educators" color="var(--color-sage)" />
                            <AnimatedStat value="1000" suffix="" label="Critical days of brain development — the biological window" color="var(--color-plum-light)" />
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── The Biological Window ── */}
            <section className="section glow-sage">
                <div className="container">
                    <RevealSection>
                        <div className="bio-window">
                            <div className="bio-window__content">
                                <div className="section-label">The Biological Imperative</div>
                                <h2>
                                    <span className="text-gold">1 million</span> neural connections.{' '}
                                    <span className="text-sage">Every second.</span>
                                </h2>
                                <p style={{ maxWidth: '600px', margin: '1.5rem 0' }}>
                                    In the first 1,000 days of life, a child's brain forms over one million
                                    new neural connections every single second. This is the most explosive
                                    period of cognitive development a human being will ever experience.
                                </p>
                                <p style={{ maxWidth: '600px' }}>
                                    This window does not wait for policy reforms. It does not wait for
                                    funding cycles. It does not wait for teacher training programs to
                                    graduate their next cohort. Biology operates on its own timeline—and
                                    right now, we are losing the race.
                                </p>
                            </div>
                            <div className="bio-window__visual">
                                <div className="neural-viz" aria-hidden="true">
                                    <img
                                        src={`${import.meta.env.BASE_URL}assets/marketing/busy-brain.webp`}
                                        alt="Busy brain illustration"
                                        className="neural-brain-img"
                                    />
                                    <div className="neural-overlay">
                                        <span className="neural-number">1M</span>
                                        <span className="neural-label">connections / second</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>



            {/* ── Scene Strip: Into the World ── */}
            <div className="scene-strip" aria-hidden="true">
              <img
                src={`${import.meta.env.BASE_URL}assets/scenes/wildflower-path.webp`}
                alt=""
                className="scene-strip__img"
                loading="lazy"
              />
              <div className="scene-strip__overlay" />
            </div>

            {/* ── Ambient Scene Gallery ── */}
            <MissionSceneGallery />

            <style>{`
        .mission-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .mission-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .mission-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Stats ── */
        .manifesto-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .mission-stat {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .mission-stat__number {
          display: block;
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }

        .mission-stat__label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* ── Biological Window ── */
        .bio-window {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .bio-window__content h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          line-height: 1.3;
        }

        .bio-window__content p {
          color: var(--color-text-secondary);
          line-height: 1.8;
        }

        .neural-viz {
          position: relative;
          width: 320px;
          height: 320px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          overflow: hidden;
        }

        .neural-brain-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          animation: softPulse 4s ease-in-out infinite;
          box-shadow: 0 20px 60px rgba(123, 31, 162, 0.15);
        }

        .neural-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, rgba(0,0,0,0.35) 0%, transparent 70%);
          border-radius: 50%;
        }

        .neural-number {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        .neural-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.85);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 1;
          text-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }

        /* ── Solution Grid ── */
        .solution-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin: 3rem 0;
        }

        .solution-card {
          padding: 2.5rem;
        }

        .solution-card__icon {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .solution-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .solution-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        .manifesto-cta {
          margin-top: 3rem;
          padding: 3rem;
          background: var(--color-bg-card);
          --color-text-primary: var(--color-text-dark);
          --color-text-secondary: var(--color-text-dark-secondary);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        @media (max-width: 968px) {
          .manifesto-stats {
            grid-template-columns: 1fr;
          }
          .bio-window {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          .bio-window__content p {
            margin-left: auto;
            margin-right: auto;
          }
          .solution-grid {
            grid-template-columns: 1fr;
          }
          .mission-hero {
            padding: 7rem 0 2.5rem;
          }
          .neural-viz {
            width: 240px;
            height: 240px;
          }
          .neural-number {
            font-size: 2.2rem;
          }
          .mission-stat__number {
            font-size: 2.5rem;
          }
          .mission-stat {
            padding: 1.5rem 1rem;
          }
          .manifesto-cta {
            padding: 2rem 1.5rem;
          }
        }

        /* ── Mission Scene Mosaic ── */
        .mission-scene-mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 220px;
          gap: 0.75rem;
        }

        /* Make first scene span 2 cols for visual interest */
        .mission-scene:first-child {
          grid-column: span 2;
        }

        .mission-scene {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: default;
          opacity: 0;
          will-change: transform, opacity;
        }

        .mission-scene img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s var(--ease-gentle);
        }

        .mission-scene:hover img {
          transform: scale(1.07);
          animation: kenBurns 10s ease-in-out infinite alternate;
        }

        .mission-scene__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .mission-scene:hover .mission-scene__label {
          opacity: 1;
        }

        .mission-scene__land {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        .mission-scene__caption {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .mission-scene-mosaic { grid-template-columns: repeat(2, 1fr); }
          .mission-scene:first-child { grid-column: span 2; }
        }

        @media (max-width: 540px) {
          .mission-scene-mosaic { grid-template-columns: 1fr; grid-auto-rows: 180px; }
          .mission-scene:first-child { grid-column: span 1; }
          .mission-scene__label { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Mission;
