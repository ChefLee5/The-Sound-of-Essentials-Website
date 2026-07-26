import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';
import heroesData from '../data/heroes.json';
import landsData from '../data/lands.json';
import { assetPath } from '../utils/assetPath';
import './RhythmQuestSale.css';

const features = [
  { icon: '📖', title: '66 Illustrated Pages', desc: 'A full storybook journey through the Seven Lands, painted scene by scene.', color: '#FF6F00' },
  { icon: '🎵', title: 'Companion to the Free Album', desc: 'Every Land your child already hears in the music, they can now read, page by page.', color: '#4CAF50' },
  { icon: '✨', title: 'Guided by Seriphia', desc: 'The Eternal Learning Mother leads Kenji, Aiko, and the rest of the heroes through the quest.', color: '#7B1FA2' },
  { icon: '📚', title: '"My Word Quest Glossary"', desc: 'A vocabulary backmatter built from the story itself — words from the realms, words for growing.', color: '#1E88E5' },
  { icon: '🧠', title: 'Neuro-Affirming', desc: 'Designed for the developing brain, not the algorithm. Calm, character-driven, no overstimulation.', color: '#FFB300' },
  { icon: '⚡', title: 'Instant EPUB Download', desc: 'Read tonight, on any device. Nothing to wait for, nothing to ship.', color: '#c4785a' },
];

/* ── Real spreads from the Rhythm Quest storybook (web/public/assets/book/) ── */
const bookPreviews = [
  { file: '1.png',  label: "Seriphia's Call From the Heavens" },
  { file: '3.png',  label: 'Kenji & Aiko — Singing Their Way Through the Alphabet' },
  { file: '5.png',  label: 'The Word Warriors Lead the Way' },
  { file: '7.png',  label: 'The Whole Quest, Together in the Sunflower Fields' },
  { file: '9.png',  label: 'Riding the Waves of Aquaria' },
  { file: '12.png', label: 'Through the Music Gate, the Quest Begins' },
];

const landStats = {
  harmonia:   { words: 620, scenes: 20 },
  numeria:    { words: 510, scenes: 19 },
  vitalis:    { words: 395, scenes: 12 },
  celestia:   { words: 265, scenes: 13 },
  luminosity: { words: 360, scenes: 14 },
  aquaria:    { words: 460, scenes: 15 },
  terrasol:   { words: 300, scenes: 14 },
};

const RhythmQuestSale = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    document.title = 'The Sound of Essentials: Rhythm Quest — The Storybook Companion to the Free Album';
  }, []);

  const carouselOrder = [
    'Seriphia', 'Kenji', 'Elias', 'Ezra', 'Ronan', 'Kwame', 'Silas', 'Aiko',
    'Felix', 'Selene', 'Nerissa', 'Octavia', 'Amara', 'Vesta', 'Athena'
  ];

  const allChars = carouselOrder.map(name => {
    const h = heroesData.find(char => char.name === name);
    return { id: h.id, name: h.name, img: h.img, color: h.carouselColor };
  });
  const paradeChars = [...allChars, ...allChars];

  return (
    <div className="rq-sale" style={{ '--rq-hero-bg': `url('${assetPath('/assets/scenes/aquaria-shore.webp')}')` }}>

      {/* ═══ HERO ═══ */}
      <header className="rq-hero">
        <div className="rq-hero__bg" aria-hidden="true" />
        <div className="rq-hero__overlay" aria-hidden="true" />

        <div className="rq-hero__inner">
          <div className="rq-hero__copy">
            <span className="rq-hero__badge">🎶 The Lead Quest Offering — Digital EPUB</span>
            <h1 className="rq-hero__title">
              Every Song Has
              <span className="rq-hero__title-accent">a Story Behind It</span>
            </h1>
            <p className="section-subtitle rq-hero__subtitle">
              Your child already knows the tunes. The Rhythm Quest storybook is where the songs
              become a universe — 66 illustrated pages following Seriphia and the heroes through
              all Seven Lands.
            </p>
            <div className="rq-hero__price-tag">
              <span className="rq-hero__price">$19</span>
              <span className="rq-hero__price-note">one time, yours to keep</span>
            </div>
            <div className="rq-hero__actions">
              <Link to="/join" className="btn btn-gold">Start the Quest</Link>
              <a href="#preview" className="btn btn-outline">Preview Pages ↓</a>
            </div>
          </div>

          <div className="rq-hero__book">
            <div className="rq-book-3d">
              <div className="rq-book-3d__inner">
                <img
                  src={assetPath('/assets/book/soe-rhythm-quest-cover.webp')}
                  alt="The Sound of Essentials: Rhythm Quest Storybook — Official Cover, Seriphia guiding the world of the Seven Lands"
                  className="rq-book-3d__cover"
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
      <div className="rq-proof-strip">
        <div className="rq-proof-strip__inner">
          <div className="rq-proof-item">
            <span className="rq-proof-item__value">66</span>
            <span className="rq-proof-item__label">Illustrated Pages</span>
          </div>
          <div className="rq-proof-item">
            <span className="rq-proof-item__value">7</span>
            <span className="rq-proof-item__label">Magical Lands</span>
          </div>
          <div className="rq-proof-item">
            <span className="rq-proof-item__value">15</span>
            <span className="rq-proof-item__label">Hero Characters</span>
          </div>
          <div className="rq-proof-item">
            <span className="rq-proof-item__value">19</span>
            <span className="rq-proof-item__label">Companion Tracks</span>
          </div>
        </div>
      </div>

      {/* ═══ SIGNATURE: SONG-STAVE BRIDGE ═══ */}
      <section className="rq-bridge">
        <div className="rq-bridge__inner">
          <RevealSection>
            <p className="rq-bridge__line">"The songs become a universe."</p>
            <div className="rq-staff" aria-hidden="true">
              <div className="rq-staff__lines">
                <span /><span /><span /><span /><span />
              </div>
              <div className="rq-staff__glyphs">
                <span className="rq-staff__note">♪</span>
                <span className="rq-staff__note">♫</span>
                <span className="rq-staff__note">♪</span>
                <span className="rq-staff__letter">A</span>
                <span className="rq-staff__letter">B</span>
                <span className="rq-staff__letter">C</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="rq-features section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">What's Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Not Just a Storybook. <span className="text-gold">The Next Chapter.</span>
            </h2>
            <p className="section-subtitle">
              Designed for the developing brain — not the algorithm.
            </p>
          </RevealSection>

          <div className="rq-features__grid">
            {features.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.1}>
                <div className="rq-feature-card" style={{ '--feat-color': f.color }}>
                  <div className="rq-feature-card__icon">{f.icon}</div>
                  <h3 className="rq-feature-card__title">{f.title}</h3>
                  <p className="rq-feature-card__desc">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAGE PREVIEW CAROUSEL ═══ */}
      <section className="rq-preview section" id="preview">
        <div className="container text-center">
          <RevealSection>
            <div className="section-label">Look Inside</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              Preview <span className="text-sage">the Storybook</span>
            </h2>
            <p className="section-subtitle">
              Real spreads from the Rhythm Quest journey
            </p>
          </RevealSection>
        </div>

        <div className="rq-preview__scroll" ref={scrollRef}>
          {bookPreviews.map((pg) => (
            <div key={pg.file} className="rq-preview__card">
              <img
                src={assetPath(`/assets/book/${pg.file}`)}
                alt={pg.label}
                loading="lazy"
              />
              <div className="rq-preview__card-label">{pg.label}</div>
            </div>
          ))}
        </div>
        <p className="rq-preview__hint">← Scroll to explore more pages →</p>
      </section>

      {/* ═══ 7 LANDS EXPLORER ═══ */}
      <section className="rq-lands section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">7 Lands of Learning</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              The Same 7 Lands, <span className="text-plum">One Step Deeper</span>
            </h2>
            <p className="section-subtitle">
              Every land your child heard in the free album, now with a story to match
            </p>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="rq-lands__grid">
              {landsData.map(land => {
                const stats = landStats[land.id] || { words: '—', scenes: '—' };
                const heroes = heroesData.filter(h => land.heroes.includes(h.id));
                return (
                  <div
                    key={land.id}
                    className="rq-land-card"
                    style={{ '--land-color': land.color }}
                  >
                    <span className="rq-land-card__icon">{land.icon}</span>
                    <h4 className="rq-land-card__name">{land.name}</h4>
                    <p className="rq-land-card__focus">{land.focus}</p>
                    <span className="rq-land-card__stats">
                      {stats.words} words · {stats.scenes} scenes
                    </span>
                    <div className="rq-land-card__heroes">
                      {heroes.map(h => (
                        <img
                          key={h.id}
                          src={assetPath(`/assets/characters/${h.name.toUpperCase()}.webp`)}
                          alt={h.name}
                          className="rq-land-card__hero-img"
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
      <section className="rq-characters">
        <div className="rq-char-parade" aria-label="Character parade">
          {paradeChars.map((c, i) => (
            <div key={`${c.id}-${i}`} className="rq-char-item">
              <img
                src={assetPath(`/assets/characters/${c.name.toUpperCase()}.webp`)}
                alt={c.name}
                className="rq-char-item__img"
                loading="lazy"
              />
              <span className="rq-char-item__name">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOUNDER STORY (no fabricated proof pre-launch — see brand-voice rules) ═══ */}
      <section className="rq-testimonials section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">Why It Exists</div>
            <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
              The Songs Came First. <span className="text-gold">This Is What Came Next.</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0 auto' }}>
              A father wrote these songs for his own kids first. Then he drew this world around
              them, page by page, so the story could keep going after the last track ends.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="rq-final-cta section">
        <div className="container">
          <RevealSection>
            <div className="rq-cta-card">
              <div className="scene-backdrop" aria-hidden="true">
                <img
                  src={assetPath('/assets/marketing/quest-collage.webp')}
                  alt=""
                  className="scene-backdrop__img"
                />
                <div className="scene-backdrop__scrim" />
              </div>
              <div className="rq-cta-card__icon" aria-hidden="true">🎶</div>
              <h2 className="section-title" style={{ color: 'var(--color-text-dark)' }}>
                Continue the Quest Today
              </h2>
              <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                66 pages. 7 Lands. 15 heroes. One incredible journey.
                <br />
                <span style={{ color: 'var(--color-green)', fontWeight: 600 }}>
                  Crafted by a father's heart and mother's love.
                </span>
              </p>
              <div className="rq-cta-actions">
                <Link to="/join" className="btn btn-gold">Start the Quest — $19</Link>
                <Link to="/listen" className="btn btn-sage">Get the Free Album First</Link>
              </div>
              <div className="rq-guarantee">
                <span>🔒</span> Instant digital delivery · EPUB format · Read on any device
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
};

export default RhythmQuestSale;
