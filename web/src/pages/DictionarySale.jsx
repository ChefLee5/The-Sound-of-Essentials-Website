import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';
import heroesData from '../data/heroes.json';
import landsData from '../data/lands.json';
import { assetPath } from '../utils/assetPath';
import './DictionarySale.css';

/* ── Land-specific stats from the pipeline knowledge base ── */
const landStats = {
  harmonia:  { words: 620, scenes: 20 },
  numeria:   { words: 510, scenes: 19 },
  vitalis:   { words: 395, scenes: 12 },
  celestia:   { words: 265, scenes: 13 },
  luminosity: { words: 360, scenes: 14 },
  aquaria:    { words: 460, scenes: 15 },
  terrasol:    { words: 300, scenes: 14 },
};

/* ── OPD-aligned land names for the dictionary ── */
const dictLandNames = {
  harmonia:  'Harmonia',
  numeria:   'Numeria',
  vitalis:   'Vitalis',
  celestia:   'Celestia',
  luminosity: 'Luminosity',
  aquaria:    'Aquaria',
  terrasol:    'Terrasol',
};

const features = [
  { icon: '📖', title: '4,000+ Words', desc: 'Organized across 125 illustrated scenes spanning the full Oxford Picture Dictionary scope.', color: '#FF6F00' },
  { icon: '🔤', title: 'Phonetic Guides', desc: 'Every word includes pronunciation support — Sound Before Symbol, always.', color: '#4CAF50' },
  { icon: '🌍', title: 'Bilingual EN/ES', desc: 'Built-in bilingual framework with space for home language equity.', color: '#1E88E5' },
  { icon: '🗺️', title: '7 Lands', desc: 'From Harmonia to Celestia — vocabulary embedded in a living, character-driven world.', color: '#7B1FA2' },
  { icon: '👨‍👩‍👧', title: 'Parent/Teacher Guide', desc: 'Includes pedagogical tips, activity ideas, and a complete A-Z visual glossary.', color: '#c4785a' },
  { icon: '🧠', title: 'Neuro-Affirming', desc: 'Designed for developing brains — not algorithms. Calm, rich, no overstimulation.', color: '#FFB300' },
];

/* ── Dictionary scene preview data (2 per land, from EPUB source) ── */
const dictPreviews = [
  { file: 'land1_the-classroom.jpg',              label: 'Harmonia — The Classroom' },
  { file: 'land1_family-relationships.jpg',        label: 'Harmonia — Family & Relationships' },
  { file: 'land2_numbers-counting.jpg',            label: 'Numeria — Numbers & Counting' },
  { file: 'land2_money-currency.jpg',              label: 'Numeria — Money & Currency' },
  { file: 'land3_the-garden.jpg',                  label: 'Terrasol — The Garden' },
  { file: 'land3_wild-animals.jpg',                label: 'Terrasol — Wild Animals' },
  { file: 'land4_transportation.jpg',              label: 'Aquaria — Transportation' },
  { file: 'land4_the-airport-travel.jpg',          label: 'Aquaria — The Airport & Travel' },
  { file: 'land5_the-human-body.jpg',              label: 'Vitalis — The Human Body' },
  { file: 'land5_sports-fitness.jpg',              label: 'Vitalis — Sports & Fitness' },
  { file: 'land6_occupations-careers.jpg',         label: 'Luminosity — Occupations & Careers' },
  { file: 'land6_community-helpers-services.jpg',  label: 'Luminosity — Community Helpers' },
  { file: 'land7_the-solar-system.jpg',            label: 'Celestia — The Solar System' },
  { file: 'land7_planet-earth.jpg',                label: 'Celestia — Planet Earth' },
];

const DictionarySale = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    document.title = 'SOE Rhythm Quest: Essential Picture Dictionary — 4,000+ Words Across 7 Lands';
  }, []);

  /* Build the character parade — double the array for seamless loop */
  const carouselOrder = [
    'Seriphia', 'Kenji', 'Elias', 'Ezra', 'Ronan', 'Kwame', 'Silas', 'Aiko', 
    'Felix', 'Selene', 'Nerissa', 'Octavia', 'Amara', 'Vesta', 'Athena'
  ];

  const allChars = carouselOrder.map(name => {
    const h = heroesData.find(char => char.name === name);
    return {
      id: h.id,
      name: h.name,
      img: h.img,
      color: h.carouselColor,
    };
  });
  const paradeChars = [...allChars, ...allChars];

  return (
    <div className="dict-sale" style={{ '--dict-hero-bg': `url('${assetPath('/assets/scenes/tulip-river-path.webp')}')` }}>

      {/* ═══ HERO ═══ */}
      <header className="dict-hero">
        <div className="dict-hero__bg" aria-hidden="true" />
        <div className="dict-hero__overlay" aria-hidden="true" />

        <div className="dict-hero__inner">
          <div className="dict-hero__copy">
            <span className="dict-hero__badge">📖 Pre-Sale — Digital EPUB</span>
            <h1 className="dict-hero__title">
              Every Word Has a
              <span className="dict-hero__title-accent">World Behind It</span>
            </h1>
            <p className="section-subtitle dict-hero__subtitle">
              The most immersive picture dictionary ever designed for young learners.
              4,000+ words. 125 illustrated scenes. 7 magical lands.
              Powered by music, guided by 15 hero characters.
            </p>
            <div className="dict-hero__price-tag">
              <span className="dict-hero__price-retail">$79</span>
              <span className="dict-hero__price-listed">$55</span>
              <span className="dict-hero__price-note">pre-sale price</span>
            </div>
            <div className="dict-hero__actions">
              <Link to="/join" className="btn btn-gold">Reserve Your Copy</Link>
              <a href="#preview" className="btn btn-outline">Preview Pages ↓</a>
            </div>
          </div>

          <div className="dict-hero__book">
            <div className="dict-book-3d">
              <div className="dict-book-3d__inner">
                <img
                  src={assetPath('/assets/book/SOE_RQ_COVER.webp')}
                  alt="SOE Rhythm Quest: Essential Picture Dictionary — Front Cover"
                  className="dict-book-3d__cover"
                />
              </div>
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
              <span className="sparkle" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <div className="dict-proof-strip">
        <div className="dict-proof-strip__inner">
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">4,000+</span>
            <span className="dict-proof-item__label">Vocabulary Words</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">125</span>
            <span className="dict-proof-item__label">Illustrated Scenes</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">7</span>
            <span className="dict-proof-item__label">Magical Lands</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">15</span>
            <span className="dict-proof-item__label">Hero Characters</span>
          </div>
          <div className="dict-proof-item">
            <span className="dict-proof-item__value">EN / ES</span>
            <span className="dict-proof-item__label">Bilingual Support</span>
          </div>
        </div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <section className="dict-features section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">What's Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Not Just a Dictionary. <span className="text-gold">A Learning Universe.</span>
            </h2>
            <p className="section-subtitle">
              Designed for the developing brain — not the algorithm.
            </p>
          </RevealSection>

          <div className="dict-features__grid">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.1}>
                <div className="dict-feature-card" style={{ '--feat-color': f.color }}>
                  <div className="dict-feature-card__icon">{f.icon}</div>
                  <h3 className="dict-feature-card__title">{f.title}</h3>
                  <p className="dict-feature-card__desc">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAGE PREVIEW CAROUSEL ═══ */}
      <section className="dict-preview section" id="preview">
        <div className="container text-center">
          <RevealSection>
            <div className="section-label">Look Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Preview <span className="text-sage">Sample Pages</span>
            </h2>
            <p className="section-subtitle">
              Swipe through actual pages from the dictionary
            </p>
          </RevealSection>
        </div>

        <div className="dict-preview__scroll" ref={scrollRef}>
          {dictPreviews.map((pg) => (
            <div key={pg.file} className="dict-preview__card">
              <img
                src={assetPath(`/assets/dictionary/${pg.file}`)}
                alt={pg.label}
                loading="lazy"
              />
              <div className="dict-preview__card-label">{pg.label}</div>
            </div>
          ))}
        </div>
        <p className="dict-preview__hint">← Scroll to explore more pages →</p>
      </section>

      {/* ═══ 7 LANDS EXPLORER ═══ */}
      <section className="dict-lands section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">7 Lands of Learning</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Vocabulary Organized by <span className="text-plum">World</span>
            </h2>
            <p className="section-subtitle">
              Each land covers a distinct developmental domain
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="dict-lands__grid">
              {landsData.map(land => {
                const stats = landStats[land.id] || { words: '—', scenes: '—' };
                const displayName = dictLandNames[land.id] || land.name;
                const heroes = heroesData.filter(h => land.heroes.includes(h.id));
                return (
                  <div
                    key={land.id}
                    className="dict-land-card"
                    style={{ '--land-color': land.color }}
                  >
                    <span className="dict-land-card__icon">{land.icon}</span>
                    <h4 className="dict-land-card__name">{displayName}</h4>
                    <p className="dict-land-card__focus">{land.focus}</p>
                    <span className="dict-land-card__stats">
                      {stats.words} words · {stats.scenes} scenes
                    </span>
                    <div className="dict-land-card__heroes">
                      {heroes.map(h => (
                        <img
                          key={h.id}
                          src={assetPath(`/assets/characters/${h.name.toUpperCase()}.webp`)}
                          alt={h.name}
                          className="dict-land-card__hero-img"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ CHARACTER PARADE ═══ */}
      <section className="dict-characters">
        <div className="dict-char-parade" aria-label="Character parade">
          {paradeChars.map((c, i) => (
            <div key={`${c.id}-${i}`} className="dict-char-item">
              <img
                src={assetPath(`/assets/characters/${c.name.toUpperCase()}.webp`)}
                alt={c.name}
                className="dict-char-item__img"
                loading="lazy"
              />
              <span className="dict-char-item__name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOUNDER STORY (no fabricated proof pre-launch — see brand-voice rules) ═══ */}
      <section className="dict-testimonials section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">Why It Exists</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Built by <span className="text-gold">a Father, Not a Company</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Not a corporation chasing a market. A father, drawing characters and writing this
              world by hand, for his own child first. Now for yours.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="dict-final-cta section">
        <div className="container">
          <RevealSection>
            <div className="dict-cta-card">
              <div className="scene-backdrop" aria-hidden="true">
                <img
                  src={assetPath('/assets/marketing/quest-collage.webp')}
                  alt=""
                  className="scene-backdrop__img"
                />
                <div className="scene-backdrop__scrim" />
              </div>
              <div className="dict-cta-card__icon" aria-hidden="true">📚</div>
              <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
                Start the Quest Today
              </h2>
              <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                4,000+ words. 7 Lands. 15 heroes. One incredible journey.
                <br />
                <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>
                  Crafted by a father's heart and mother's love.
                </span>
              </p>
              <div className="dict-cta-actions">
                <Link to="/join" className="btn btn-gold">Reserve the Dictionary — $55</Link>
                <Link to="/join" className="btn btn-sage">Full Quest Bundle — $89</Link>
              </div>
              <div className="dict-guarantee">
                <span>🔒</span> Instant digital delivery · EPUB format · Read on any device
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-dark-secondary)' }}>
                Looking for the $19 storybook instead?{' '}
                <Link to="/rhythm-quest" style={{ color: 'var(--color-orange)', fontWeight: 600 }}>
                  Explore the Rhythm Quest ebook →
                </Link>
              </p>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

export default DictionarySale;
