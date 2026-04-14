import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ParallaxHero from '../components/ParallaxHero';
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

const Universe = () => {
  const { t } = useTranslation();
  React.useEffect(() => { document.title = 'The Universe — SOE Rhythm Quest'; }, []);

  /* ── Character Data ── */
  const heroDuos = [
    {
      land: 'Harmonia',
      landIcon: '🎵',
      landColor: '#d4a843',
      duo: ['Kenji', 'Aiko'],
      chars: ['KENJI', 'AIKO'],
      focus: t('universe.lands.Harmonia.focus'),
      desc: t('universe.lands.Harmonia.desc'),
    },
    {
      land: 'Numeria',
      landIcon: '🔢',
      landColor: '#7fb685',
      duo: ['Kwame', 'Octavia'],
      chars: ['KWAME', 'OCTAVIA'],
      focus: t('universe.lands.Numeria.focus'),
      desc: t('universe.lands.Numeria.desc'),
    },
    {
      land: 'Vitalis',
      landIcon: '🤸',
      landColor: '#c4785a',
      duo: ['Felix', 'Amara'],
      chars: ['FELIX', 'AMARA'],
      focus: t('universe.lands.Vitalis.focus'),
      desc: t('universe.lands.Vitalis.desc'),
    },
    {
      land: 'Chronia',
      landIcon: '⏰',
      landColor: '#9678c4',
      duo: ['Elias', 'Selene'],
      chars: ['ELIAS', 'SELENE'],
      groupShot: `${import.meta.env.BASE_URL}assets/duos/Celestia_Elias_Selene.webp`,
      sceneBg: `${import.meta.env.BASE_URL}assets/scenes/seriphia-in-celestia.webp`,
      focus: t('universe.lands.Chronia.focus'),
      desc: t('universe.lands.Chronia.desc'),
    },
    {
      land: 'Lexiconia',
      landIcon: '📖',
      landColor: '#d4a843',
      duo: ['Ronan', 'Nerissa'],
      chars: ['RONAN', 'NERISSA'],
      groupShot: `${import.meta.env.BASE_URL}assets/duos/Aquaria_Ronan_Nerissa.webp`,
      sceneBg: `${import.meta.env.BASE_URL}assets/scenes/b-roll-boats.webp`,
      focus: t('universe.lands.Lexiconia.focus'),
      desc: t('universe.lands.Lexiconia.desc'),
    },
    {
      land: 'Geometria',
      landIcon: '📐',
      landColor: '#7fb685',
      duo: ['Silas', 'Vesta'],
      chars: ['SILAS', 'VESTA'],
      sceneBg: `${import.meta.env.BASE_URL}assets/scenes/wildflower-path.webp`,
      focus: t('universe.lands.Geometria.focus'),
      desc: t('universe.lands.Geometria.desc'),
    },
    {
      land: 'Natura',
      landIcon: '🌊',
      landColor: '#5ba4c9',
      duo: ['Ezra', 'Athena'],
      chars: ['EZRA', 'ATHENA'],
      groupShot: `${import.meta.env.BASE_URL}assets/duos/Luminosity_Athena_Ezra.webp`,
      sceneBg: `${import.meta.env.BASE_URL}assets/scenes/b-roll-flowers.webp`,
      focus: t('universe.lands.Natura.focus'),
      desc: t('universe.lands.Natura.desc'),
    },
  ];

  const pedagogyMethods = [
    {
      name: t('universe.pedagogy.Dalcroze.name'),
      desc: t('universe.pedagogy.Dalcroze.desc'),
      icon: '💃',
    },
    {
      name: t('universe.pedagogy.Orff.name'),
      desc: t('universe.pedagogy.Orff.desc'),
      icon: '🥁',
    },
    {
      name: t('universe.pedagogy.Kodaly.name'),
      desc: t('universe.pedagogy.Kodaly.desc'),
      icon: '🎶',
    },
  ];

  const [activeDuo, setActiveDuo] = useState(null);
  const duosGridRef = useRef(null);
  const landTilesRef = useAnimeReveal({ selector: '.land-tile', staggerMs: 70 });
  const duoCardsRef = useAnimeReveal({ selector: '.duo-card', staggerMs: 90, translateY: [30, 0] });


  const scrollToLand = (landName) => {
    const index = heroDuos.findIndex(d => d.land === landName);
    if (index !== -1) {
      setActiveDuo(index);
      setTimeout(() => {
        duosGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <div className="universe-page">
      {/* ── Hero ── */}
      <header className="universe-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxHero variant="universe" />
        <div className="container">
          <div className="universe-hero__content animate-fade-up text-center" style={{ position: 'relative', zIndex: 2 }}>
            {/* Local text scrim */}
            <div style={{
              position: 'absolute',
              inset: '-2rem -3rem',
              background: 'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(250,248,243,0.72) 0%, transparent 100%)',
              borderRadius: '2rem',
              zIndex: -1,
              pointerEvents: 'none',
            }} aria-hidden="true" />
            <div className="section-label">{t('universe.hero_label')}</div>
            <h1>
              {t('universe.hero_title_1')}{' '}
              <span className="text-gold">{t('universe.hero_title_2')}</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '1rem auto', position: 'relative', zIndex: 2 }}>
              {t('universe.hero_subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* ── Seriphia ── */}
      <section className="section glow-plum">
        <div className="container">
          <RevealSection>
            <div className="seriphia-block">
              <div className="seriphia-block__image">
                <img
                  src={`${import.meta.env.BASE_URL}assets/characters/SERIPHIA_celestia.png`}
                  alt="Seriphia — the guardian of the Seven Lands"
                  className="seriphia-portrait"
                />
              </div>
              <div className="seriphia-block__text">
                <span className="section-label">{t('universe.seriphia_label')}</span>
                <h2>{t('universe.seriphia_title')}</h2>
                <p className="accent-text" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                  {t('universe.seriphia_subtitle')}
                </p>
                <p>
                  {t('universe.seriphia_desc_1')}
                </p>
                <p style={{ marginTop: '1rem' }}>
                  {t('universe.seriphia_desc_2')}
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Global Sound Map ── */}
      <section className="section">
        <div className="container text-center">
          <RevealSection>
            <div className="section-label">{t('universe.map_label')}</div>
            <h2 className="section-title">{t('universe.map_title')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
              {t('universe.map_subtitle')}
            </p>
            <div className="lands-map-grid" ref={landTilesRef}>
              {[
                { land: 'Harmonia',  icon: '🎵', color: '#d4a843', duo: 'Kenji & Aiko',      focus: 'Music & Rhythm' },
                { land: 'Numeria',   icon: '🔢', color: '#7fb685', duo: 'Kwame & Octavia',   focus: 'Numbers & Counting' },
                { land: 'Vitalis',   icon: '🤸', color: '#c4785a', duo: 'Felix & Amara',     focus: 'Movement & Wellness' },
                { land: 'Chronia',   icon: '⏰', color: '#9678c4', duo: 'Elias & Selene',    focus: 'Time & Seasons' },
                { land: 'Lexiconia', icon: '📖', color: '#d4897a', duo: 'Ronan & Nerissa',   focus: 'Language & Stories' },
                { land: 'Geometria', icon: '📐', color: '#5fb685', duo: 'Silas & Vesta',     focus: 'Shapes & Space' },
                { land: 'Natura',    icon: '🌊', color: '#5ba4c9', duo: 'Ezra & Athena',     focus: 'Nature & Science' },
              ].map((land) => (
                <div
                  key={land.land}
                  className="land-tile"
                  style={{ '--land-color': land.color }}
                  onClick={() => scrollToLand(land.land)}
                  role="button"
                  tabIndex={0}
                  title={`Explore ${land.land}`}
                >
                  <span className="land-tile__icon">{land.icon}</span>
                  <h3 className="land-tile__name" style={{ color: land.color }}>{land.land}</h3>
                  <p className="land-tile__duo">{land.duo}</p>
                  <p className="land-tile__focus">{land.focus}</p>
                  <div className="land-tile__glow" aria-hidden="true" />
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>


      {/* ── 7 Lands & Hero Duos ── */}
      <section className="section glow-sage">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('universe.lands_label')}</div>
            <h2 className="section-title">
              {t('universe.lands_title_1')} <span className="text-sage">{t('universe.lands_title_2')}</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 3rem auto' }}>
              {t('universe.lands_subtitle')}
            </p>
          </RevealSection>

          <div className="duos-grid" ref={(el) => { duosGridRef.current = el; duoCardsRef.current = el; }}>
            {heroDuos.map((duo, i) => (
              <div
                key={duo.land}
                className={`duo-card glass-card anime-item ${activeDuo === i ? 'duo-card--active' : ''}`}
                onClick={() => setActiveDuo(activeDuo === i ? null : i)}
                role="button"
                tabIndex={0}
                aria-expanded={activeDuo === i}
                onKeyDown={(e) => e.key === 'Enter' && setActiveDuo(activeDuo === i ? null : i)}
                style={duo.sceneBg ? { '--scene-bg': `url(${duo.sceneBg})` } : {}}
              >
                {duo.sceneBg && (
                  <div className="duo-card__scene-bg" aria-hidden="true" />
                )}
                <div className="duo-card__header">
                  <span className="duo-card__land-icon">{duo.landIcon}</span>
                  <div>
                    <h3 style={{ color: duo.landColor }}>{duo.land}</h3>
                    <span className="duo-card__focus">{duo.focus}</span>
                  </div>
                </div>

                <div className="duo-card__image-wrap">
                  <div className="duo-card__char-pair">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/characters/${duo.chars[0]}_crop.png`}
                      alt={duo.duo[0]}
                      className="duo-card__char-img"
                    />
                    <img
                      src={`${import.meta.env.BASE_URL}assets/characters/${duo.chars[1]}_crop.png`}
                      alt={duo.duo[1]}
                      className="duo-card__char-img"
                    />
                  </div>
                </div>
                <p className="duo-card__names">{duo.duo.join(' & ')}</p>

                {activeDuo === i && (
                  <p className="duo-card__desc animate-fade-in">{duo.desc}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pedagogy ── */}
      <section className="section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">{t('universe.science_label')}</div>
            <h2 className="section-title">
              {t('universe.science_title_1')} <span className="text-plum">{t('universe.science_title_2')}</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 3rem auto' }}>
              {t('universe.science_subtitle')}
            </p>
          </RevealSection>

          <div className="pedagogy-grid">
            {pedagogyMethods.map((m, i) => (
              <RevealSection key={m.name} delay={i * 0.15}>
                <div className="glass-card pedagogy-card">
                  <span className="pedagogy-card__icon">{m.icon}</span>
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection className="text-center" delay={0.4}>
            <div style={{ marginTop: '3rem' }}>
              <Link to="/media" className="page-bottom-link">
                {t('home.explore_media')}
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <style>{`
        .universe-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .universe-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .universe-hero {
          padding: 10rem 0 4rem;
          position: relative;
        }

        /* ── Seriphia ── */
        .seriphia-block {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 4rem;
          align-items: center;
        }

        .seriphia-block__image img {
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border: 2px solid var(--color-border);
          max-height: 500px;
          object-fit: cover;
          width: 100%;
        }

        .seriphia-portrait {
          width: 100%;
          max-height: 520px;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          border: 2px solid var(--color-border);
          display: block;
        }

        .seriphia-block__text h2 {
          font-size: 2.2rem;
          margin-bottom: 0.3rem;
        }

        .seriphia-block__text p {
          color: var(--color-text-secondary);
          line-height: 1.8;
        }

        /* ── Lands Map Grid ── */
        .lands-map-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .land-tile {
          position: relative;
          background: #fff;
          border: 2px solid var(--land-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s var(--ease-gentle), box-shadow 0.3s var(--ease-gentle);
          overflow: hidden;
        }

        .land-tile:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10), 0 0 0 1px var(--land-color);
        }

        .land-tile__glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--land-color);
          opacity: 0.06;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .land-tile:hover .land-tile__glow {
          opacity: 0.12;
        }

        .land-tile__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 0.3rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__duo {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 600;
          margin: 0 0 0.15rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__focus {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .lands-map-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .lands-map-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }



        /* ── Duos Grid ── */
        .duos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .duo-card {
          cursor: pointer;
          text-align: center;
          padding: 2rem;
          transition: all var(--transition-med);
        }

        @media (max-width: 480px) {
          .duo-card {
            padding: 1.5rem 1rem;
          }
        }

        .duo-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }

        .duo-card__land-icon {
          font-size: 2rem;
        }

        .duo-card__header h3 {
          font-size: 1.2rem;
          margin-bottom: 0.1rem;
        }

        .duo-card__focus {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .duo-card__image-wrap {
          margin-bottom: 1rem;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        /* ── Scene backdrop on duo cards ── */
        .duo-card {
          position: relative;
          overflow: hidden;
        }

        .duo-card__scene-bg {
          position: absolute;
          inset: 0;
          background-image: var(--scene-bg);
          background-size: cover;
          background-position: center;
          opacity: 0.08;
          transition: opacity 0.5s ease;
          animation: kenBurns 14s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 0;
        }

        .duo-card:hover .duo-card__scene-bg {
          opacity: 0.15;
        }

        .duo-card__header,
        .duo-card__image-wrap,
        .duo-card__names,
        .duo-card__desc {
          position: relative;
          z-index: 1;
        }

        /* ── Character pair inside duo card ── */
        .duo-card__char-pair {
          display: flex;
          gap: 4px;
          height: 200px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: transparent;
        }

        .duo-card__char-img {
          flex: 1;
          width: 50%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.45s var(--ease-gentle);
        }

        .duo-card:hover .duo-card__char-img {
          transform: scale(1.06);
        }

        .duo-card__names {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 1rem;
        }

        .duo-card__desc {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        /* ── Pedagogy ── */
        .pedagogy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .pedagogy-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .pedagogy-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .pedagogy-card h3 {
          font-size: 1.15rem;
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .pedagogy-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        @media (max-width: 968px) {
          .seriphia-block {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .seriphia-block__image img {
            max-height: 350px;
            margin: 0 auto;
          }
          .pedagogy-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Universe;
