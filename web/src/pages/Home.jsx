import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ParallaxHero from '../components/ParallaxHero';
import { RevealSection } from '../hooks/useReveal';
import { useAnimeReveal } from '../hooks/useAnimeReveal';

const Home = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'SOE: Rhythm Quest — Designed for the Developing Brain';
  }, []);

  /* ── All 14 characters ── */
  const allChars = [
    { name: 'Kenji',   file: 'KENJI_crop.png',   color: '#FF6F00', note: '♪' },
    { name: 'Amara',   file: 'AMARA_crop.png',   color: '#4CAF50', note: '♫' },
    { name: 'Silas',   file: 'SILAS_crop.png',   color: '#7B1FA2', note: '♩' },
    { name: 'Athena',  file: 'ATHENA_crop.png',  color: '#1E88E5', note: '♬' },
    { name: 'Aiko',    file: 'AIKO_crop.png',    color: '#E91E8C', note: '♪' },
    { name: 'Elias',   file: 'ELIAS_crop.png',   color: '#00ACC1', note: '♫' },
    { name: 'Ezra',    file: 'EZRA_crop.png',    color: '#F4511E', note: '♩' },
    { name: 'Felix',   file: 'FELIX_crop.png',   color: '#8BC34A', note: '♬' },
    { name: 'Kwame',   file: 'KWAME_crop.png',   color: '#FFB300', note: '♪' },
    { name: 'Nerissa', file: 'NERISSA_crop.png', color: '#26C6DA', note: '♫' },
    { name: 'Octavia', file: 'OCTAVIA_crop.png', color: '#AB47BC', note: '♩' },
    { name: 'Ronan',   file: 'RONAN_crop.png',   color: '#5C6BC0', note: '♬' },
    { name: 'Selene',  file: 'SELENE_crop.png',  color: '#EC407A', note: '♪' },
    { name: 'Vesta',   file: 'VESTA_crop.png',   color: '#26A69A', note: '♫' },
  ];

  /* Double the array so the infinite scroll looks seamless */
  const marqueeChars = [...allChars, ...allChars];

  const stats = [
    { value: t('home.stat_1_val'), label: t('home.stat_1_lab'), color: 'var(--color-orange)' },
    { value: t('home.stat_2_val'), label: t('home.stat_2_lab'), color: 'var(--color-green)' },
    { value: t('home.stat_3_val'), label: t('home.stat_3_lab'), color: 'var(--color-purple)' },
  ];

  const features = [
    { icon: '🎯', title: t('home.features.active.title'),   subtitle: t('home.features.active.subtitle'),   desc: t('home.features.active.desc') },
    { icon: '🧠', title: t('home.features.neuro.title'),    subtitle: t('home.features.neuro.subtitle'),    desc: t('home.features.neuro.desc') },
    { icon: '🌍', title: t('home.features.scalable.title'), subtitle: t('home.features.scalable.subtitle'), desc: t('home.features.scalable.desc') },
  ];

  const domains = [
    { icon: '🗣️', title: t('home.domains.language.title'),        desc: t('home.domains.language.desc'),        color: '#4CAF50' },
    { icon: '🧠', title: t('home.domains.cognitive.title'),        desc: t('home.domains.cognitive.desc'),        color: '#1E88E5' },
    { icon: '🤸', title: t('home.domains.physical.title'),         desc: t('home.domains.physical.desc'),         color: '#FF6F00' },
    { icon: '🔬', title: t('home.domains.science.title'),          desc: t('home.domains.science.desc'),          color: '#7B1FA2' },
    { icon: '💛', title: t('home.domains.social_emotional.title'), desc: t('home.domains.social_emotional.desc'), color: '#FFB300' },
  ];

  const BASE = import.meta.env.BASE_URL;

  return (
    <div className="home-page">

      {/* ═══ HERO ═══ */}
      <header className="hero">
        <ParallaxHero variant="home" />

        {/* Text copy sits above the marquee */}
        <div className="hero__copy-wrap">
          <div className="container">
            <div className="hero__content animate-fade-up">
              <div className="hero__eyebrow">
                <span className="hero__badge">✨ {t('home.hero_note')}</span>
              </div>
              <h1 className="hero__title">
                {t('home.hero_title_1')}{' '}
                <span className="hero__title-accent">{t('home.hero_title_2')}</span>
              </h1>
              <p className="hero__subtitle">{t('home.hero_subtitle')}</p>
              <div className="hero__actions">
                <Link to="/join"     className="btn btn-gold hero__btn-primary">{t('hero.join_button')}</Link>
                <Link to="/universe" className="btn btn-outline">{t('navbar.universe')} →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width character marquee */}
        <div className="hero__marquee-wrap" aria-hidden="true">
          <div className="hero__marquee-track">
            {marqueeChars.map((char, i) => (
              <div
                key={`${char.name}-${i}`}
                className="hero__char"
                style={{ '--char-color': char.color }}
              >
                <div className="hero__char-note">{char.note}</div>
                <img
                  src={`${BASE}assets/characters/${char.file}`}
                  alt={char.name}
                  className="hero__char-img"
                  loading={i < 7 ? 'eager' : 'lazy'}
                  draggable="false"
                />
                <div className="hero__char-label">{char.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info strip */}
        <div className="hero__info-strip">
          <span>🎵 14 Characters</span>
          <span className="hero__info-sep">·</span>
          <span>🗺️ 7 Musical Lands</span>
          <span className="hero__info-sep">·</span>
          <span>📚 Ages 2–8</span>
        </div>

        <div className="hero__scroll-hint" aria-hidden="true"><span>↓</span></div>
      </header>

      {/* ═══ WHY SOE — Stats ═══ */}
      <section className="section why-section glow-plum">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.why_label')}</div>
            <h2 className="section-title">
              {t('home.why_title_1')}<br />
              <span className="accent-text">{t('home.why_title_2')}</span>
            </h2>
            <div className="divider divider-center" />
            <p className="section-subtitle">{t('home.why_subtitle')}</p>
          </RevealSection>
          <RevealSection delay={0.1}>
            <div className="why-stats">
              {stats.map((s) => (
                <div key={s.label} className="why-stat glass-card glass-card--static">
                  <span className="why-stat__number" style={{ color: s.color }}>{s.value}</span>
                  <span className="why-stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ SCENE STRIP 1 — World Break ═══ */}
      <div className="scene-strip" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}assets/backgrounds/soe-bg-1.webp`}
          alt=""
          className="scene-strip__img"
          loading="lazy"
        />
        <div className="scene-strip__overlay" />
      </div>

      {/* ═══ APPROACH ═══ */}
      <section className="section features-section glow-sage">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.approach_label')}</div>
            <h2 className="section-title">
              {t('home.approach_title_1')}{' '}
              <span className="text-sage">{t('home.approach_title_2')}</span>
            </h2>
            <p className="section-subtitle">{t('home.approach_subtitle')}</p>
          </RevealSection>
          <div className="features-grid">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.15}>
                <div className="glass-card feature-card">
                  <span className="feature-card__icon">{f.icon}</span>
                  <h3 className="feature-card__title">{f.title}</h3>
                  <span className="feature-card__subtitle">{f.subtitle}</span>
                  <p className="feature-card__desc">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCENE STRIP 2 — World Break ═══ */}
      <div className="scene-strip" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}assets/backgrounds/soe-bg-2.webp`}
          alt=""
          className="scene-strip__img"
          style={{ animationDirection: 'reverse' }}
          loading="lazy"
        />
        <div className="scene-strip__overlay" />
      </div>

      {/* ═══ 5 DOMAINS ═══ */}
      <section className="section domains-section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('home.curriculum_label')}</div>
            <h2 className="section-title">
              {t('home.curriculum_title_1')}{' '}
              <span className="text-gold">{t('home.curriculum_title_2')}</span>
            </h2>
            <p className="section-subtitle">{t('home.curriculum_subtitle')}</p>
          </RevealSection>
          <div className="domains-grid">
            {domains.map((d, i) => (
              <RevealSection key={d.title} delay={i * 0.1}>
                <div className="glass-card domain-card" style={{ '--domain-color': d.color }}>
                  <div className="domain-card__icon-wrap">
                    <span className="domain-card__icon">{d.icon}</span>
                  </div>
                  <h4 className="domain-card__title">{d.title}</h4>
                  <p className="domain-card__desc">{d.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOOK FEATURE — Cover Reveal ═══ */}
      <section className="section book-feature-section text-center">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">📚 The Picture Dictionary</div>
            <h2 className="section-title">
              Every Word Has a <span className="text-gold">World Behind It</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
              4,000+ words. 157 scenes. 7 lands. The SOE Rhythm Quest Picture Dictionary is the most immersive
              vocabulary journey ever designed for young learners.
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="book-feature-layout">
              <div className="cover-tilt">
                <div className="cover-tilt__inner">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/cover/cover.webp`}
                    alt="SOE Rhythm Quest Picture Dictionary cover"
                    style={{ maxWidth: '320px' }}
                  />
                </div>
              </div>

              <div className="book-feature-copy">
                <ul className="book-feature-list">
                  <li>🎵 <strong>14 characters</strong>, each with a unique rhythm and learning style</li>
                  <li>🌏 <strong>7 magical lands</strong> — from Harmonia to Celestia</li>
                  <li>📝 <strong>157 immersive scenes</strong> with full vocabulary context</li>
                  <li>🎯 <strong>5 core domains:</strong> Language, Numbers, Science, Music, Life Skills</li>
                </ul>
                <Link to="/join" className="btn btn-gold" style={{ marginTop: '1.5rem' }}>
                  Reserve My Copy
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ SCENE STRIP 3 — World Break ═══ */}
      <div className="scene-strip" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}assets/backgrounds/soe-bg-3.webp`}
          alt=""
          className="scene-strip__img"
          loading="lazy"
        />
        <div className="scene-strip__overlay" />
      </div>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section cta-section text-center">
        <div className="container">
          <RevealSection>
            <div className="cta-card">
              <div className="cta-icon" aria-hidden="true">🔔</div>
              <h2>{t('home.cta_title')}</h2>
              <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                {t('home.cta_subtitle')}{' '}
                <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>Be part of the solution.</span>
              </p>
              <div className="cta-actions">
                <Link to="/media" className="btn btn-gold">{t('home.explore_media')}</Link>
                <Link to="/join"  className="btn btn-sage">{t('hero.join_button')}</Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <style>{`
        /* ══════════════════════════════════════════
           Home Page — Styles
        ══════════════════════════════════════════ */

        /* ── Hero layout ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 80px;
          position: relative;
          overflow: hidden;
          gap: 0;
        }

        /* Text block */
        .hero__copy-wrap {
          position: relative;
          z-index: 1;
          padding: 2.5rem 0 1.5rem;
        }

        .hero__content {
          max-width: 680px;
        }

        .hero__eyebrow { margin-bottom: 1.25rem; }

        .hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--color-green-soft);
          color: var(--color-green);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-xl);
          border: 1px solid rgba(76,175,80,0.2);
        }

        .hero__title {
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          line-height: 1.1;
          margin-bottom: 1.25rem;
          font-weight: 700;
        }

        .hero__title-accent {
          color: var(--color-orange);
        }

        .hero__subtitle {
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
          max-width: 520px;
          line-height: 1.8;
        }

        .hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero__btn-primary {
          box-shadow: 0 6px 24px rgba(255,111,0,0.25);
        }

        /* ── Character Marquee ── */
        .hero__marquee-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          overflow: hidden;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(0px);
          /* Fade edges */
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          padding: 1rem 0 0;
        }

        .hero__marquee-track {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          width: max-content;
          animation: marqueeScroll 50s linear infinite;
          padding-bottom: 0.5rem;
        }

        .hero__marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Individual character item */
        .hero__char {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
          width: 160px;
          cursor: default;
          transition: transform 0.3s ease;
        }

        .hero__char:hover {
          transform: scale(1.05) translateY(-8px);
        }

        .hero__char-note {
          font-size: 1.2rem;
          color: var(--char-color);
          height: 1.5rem;
          line-height: 1;
          animation: noteFloat 3s ease-in-out infinite;
        }

        @keyframes noteFloat {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }

        .hero__char-img {
          width: 160px;
          height: 260px;
          object-fit: contain;
          object-position: center bottom;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.12));
          transition: filter 0.3s ease, transform 0.3s ease;
          display: block;
        }

        .hero__char:hover .hero__char-img {
          filter: drop-shadow(0 14px 32px rgba(0,0,0,0.20));
        }

        .hero__char-label {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.78rem;
          color: var(--char-color);
          letter-spacing: 0.04em;
          padding: 0.2rem 0.7rem;
          background: color-mix(in srgb, var(--char-color) 10%, transparent);
          border-radius: var(--radius-xl);
          border: 1px solid color-mix(in srgb, var(--char-color) 25%, transparent);
        }

        /* Info strip below marquee */
        .hero__info-strip {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1rem 0 2rem;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .hero__info-sep {
          opacity: 0.35;
        }

        .hero__scroll-hint {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1.2rem;
          color: var(--color-text-muted);
          animation: gentleFloat 3s ease-in-out infinite;
          z-index: 2;
        }

        /* ── Stats ── */
        .why-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .why-stat {
          text-align: center;
          padding: 2rem 1.5rem;
        }

        .why-stat__number {
          display: block;
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .why-stat__label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* ── Feature Cards ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .feature-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .feature-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .feature-card__title {
          font-size: 1.25rem;
          margin-bottom: 0.3rem;
          color: var(--color-text-primary);
        }

        .feature-card__subtitle {
          display: block;
          font-size: 0.78rem;
          color: var(--color-green);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.85rem;
        }

        .feature-card__desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
        }

        /* ── 5 Domains ── */
        .domains-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }

        .domain-card {
          text-align: center;
          padding: 1.75rem 1rem;
          border-top: 3px solid var(--domain-color, var(--color-green));
        }

        .domain-card__icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          background: color-mix(in srgb, var(--domain-color, var(--color-green)) 12%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
        }

        .domain-card__icon { font-size: 1.6rem; display: block; }

        .domain-card__title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }

        .domain-card__desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* ── CTA ── */
        .cta-section { padding-bottom: 4rem; }

        .cta-card {
          background: linear-gradient(135deg,
            rgba(76,175,80,0.05) 0%,
            rgba(123,31,162,0.05) 50%,
            rgba(30,136,229,0.04) 100%);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: 5rem 3rem;
        }

        .cta-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: block;
          animation: gentleFloat 4s ease-in-out infinite;
        }

        .cta-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2.5rem;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hero__char { width: 120px; }
          .hero__char-img { width: 120px; height: 180px; }
          .hero__marquee-track { gap: 0.5rem; }
          .why-stats    { grid-template-columns: 1fr; }
          .features-grid  { grid-template-columns: 1fr; }
          .domains-grid   { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .hero__content  { text-align: center; }
          .hero__actions  { justify-content: center; }
          .hero__char { width: 90px; }
          .hero__char-img { width: 90px; height: 135px; }
          .domains-grid   { grid-template-columns: 1fr; }
          .cta-card       { padding: 3rem 1.5rem; }
          .book-feature-layout { flex-direction: column; align-items: center; }
        }

        /* ── Book Feature Section ── */
        .book-feature-layout {
          display: flex;
          align-items: center;
          gap: 4rem;
          justify-content: center;
          text-align: left;
        }

        .book-feature-copy {
          max-width: 480px;
        }

        .book-feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .book-feature-list li {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          padding-left: 0.25rem;
        }

        .book-feature-list strong {
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  );
};

export default Home;
