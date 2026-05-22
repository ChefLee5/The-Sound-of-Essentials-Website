import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';
import tracksData from '../data/tracks.json';
import JsonLd from '../components/JsonLd';
import { mediaRoomSchema } from '../utils/schema';
import {
  AudioPlayer,
  GalleryGrid,
  bookPages,
  soeBookPages,
  galleryShots,
} from './MediaRoom';
import './Listen.css';

// ── Kit.com v3 API Config ──────────────────────────────────────
const KIT_API_KEY = 'P-utcloLVPjLE6oDuz3-sA';
const KIT_TAG_ID = 19643125; // "listen-optin" tag

const STORAGE_KEY = 'soe_listen_unlocked';

const Listen = () => {
  const { t } = useTranslation();

  // ── Gate State (persisted) ──────────────────────────────────
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  // ── Form State ──────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [formStatus, setFormStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [justUnlocked, setJustUnlocked] = useState(false);

  // ── Book viewer state ───────────────────────────────────────
  const [bookIndex, setBookIndex] = useState(0);
  const [soeBookIndex, setSoeBookIndex] = useState(0);

  // ── Track data (for AudioPlayer + JSON-LD) ──────────────────
  const tracks = tracksData.map(track => ({
    id: track.id,
    title: t(`media.tracks.${track.id}.title`),
    domain: t(`media.tracks.${track.id}.domain`),
    domainIcon: track.domainIcon,
    desc: t(`media.tracks.${track.id}.desc`),
    src: assetPath(`/audio/${track.audioFile}`),
    color: track.color,
    lyrics: track.lyrics,
    cover: assetPath(`/assets/track-art/${track.cover}`),
  }));

  useEffect(() => {
    document.title = 'Listen — SOE Rhythm Quest';
  }, []);

  // ── Unlock handler ──────────────────────────────────────────
  const unlock = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setIsUnlocked(true);
    setJustUnlocked(true);
  };

  // ── Kit.com Form Submission ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setFormStatus('error');
      return;
    }
    setFormStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch(
        `https://api.convertkit.com/v3/tags/${KIT_TAG_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            api_key: KIT_API_KEY,
            email: email.trim(),
            first_name: firstName.trim() || undefined,
          }),
        }
      );

      if (response.ok) {
        setFormStatus('success');
        // Fire conversion events
        if (typeof window !== 'undefined') {
          if (window.gtag) {
            window.gtag('event', 'generate_lead', {
              event_category: 'funnel',
              event_label: 'listen_optin',
              value: 1,
            });
          }
          if (window.fbq) {
            window.fbq('track', 'Lead', {
              content_name: 'listen_optin',
              content_category: 'email_funnel',
            });
          }
        }
        // Unlock the content
        unlock();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || 'Subscription failed');
      }
    } catch (err) {
      console.error('Kit.com subscription error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setFormStatus('error');
    }
  };

  // ── Print coloring page ─────────────────────────────────────
  const printColoringPage = () => {
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>SOE Coloring Page ${bookIndex + 1}</title>
      <style>*{margin:0;padding:0}body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff}img{max-width:100%;max-height:100vh;object-fit:contain}@media print{@page{margin:.5cm;size:auto}}</style>
      </head><body><img src="${bookPages[bookIndex]}" onload="window.print();window.close();" /></body></html>`);
    w.document.close();
  };

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="listen-page">
      <JsonLd data={mediaRoomSchema(tracks)} />

      {/* ── Hero ── */}
      <section className="listen-hero">
        <div className="container">
          <span className="listen-hero__eyebrow">🎵 Free Preview • 19 Tracks</span>
          <h1 className="listen-hero__title">
            Hear What <em>Learning</em> Sounds Like
          </h1>
          <p className="section-subtitle listen-hero__subtitle">
            Designed for the developing brain — not the algorithm.
          </p>
          <div className="listen-cover">
            <div className="listen-cover__img-wrap">
              <img
                className="listen-cover__img"
                src={assetPath('/assets/marketing/quest-collage.webp')}
                alt="The Sound of Essentials: Rhythm Quest album cover"
                loading="eager"
              />
              <span className="listen-cover__badge">19 Tracks • Ages 2–8</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="listen-proof">
        <div className="container">
          <div className="listen-proof__grid">
            <div className="listen-proof__stat">
              <div className="listen-proof__number">19</div>
              <div className="listen-proof__label">Original Tracks</div>
            </div>
            <div className="listen-proof__stat">
              <div className="listen-proof__number">7</div>
              <div className="listen-proof__label">Learning Domains</div>
            </div>
            <div className="listen-proof__stat">
              <div className="listen-proof__number">3,400+</div>
              <div className="listen-proof__label">Words in the Dictionary</div>
            </div>
          </div>
        </div>
      </section>
      {/* ── Track Preview Grid ── */}
      <section className="listen-preview">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">🎶 The Full Tracklist</div>
            <h2 className="section-title">
              19 Tracks. 7 Lands. <span className="text-gold">One Quest.</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto', maxWidth: '560px' }}>
              Every track is a structured lesson in disguise — spanning language, math, science,
              movement, and social-emotional growth.
            </p>
          </RevealSection>

          <div className="listen-preview__grid">
            {tracks.map((track, i) => (
              <div
                key={track.id}
                className="listen-preview__card"
                style={{ '--card-accent': track.color }}
              >
                <div className="listen-preview__art-wrap">
                  <img
                    className="listen-preview__art"
                    src={track.cover}
                    alt={track.title}
                    loading="lazy"
                  />
                  <span className="listen-preview__number">{String(i + 1).padStart(2, '0')}</span>
                  {!isUnlocked && (
                    <span className="listen-preview__lock">🔒</span>
                  )}
                </div>
                <div className="listen-preview__info">
                  <h3 className="listen-preview__title">{track.title}</h3>
                  <span
                    className="listen-preview__domain"
                    style={{ color: track.color }}
                  >
                    {track.domainIcon} {track.domain}
                  </span>
                  <p className="listen-preview__desc">{track.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {!isUnlocked && (
            <div className="listen-preview__cta text-center" style={{ marginTop: '2.5rem' }}>
              <a href="#optin" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}>
                🎧 Unlock All 19 Tracks Free →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── EMAIL GATE ── */}
      {!isUnlocked && (
        <section className="listen-optin" id="optin">
          <div className="container">
            <div className="listen-optin__card">
              <span className="listen-optin__icon">🎧</span>
              <h2 className="listen-optin__heading">Unlock the Full Quest</h2>
              <p className="listen-optin__subtext">
                Enter your email to unlock all 19 tracks, music videos,
                coloring pages, and start a free 5-day learning journey.
              </p>

              {formStatus === 'error' && errorMsg && (
                <div className="listen-optin__error">{errorMsg}</div>
              )}

              <form className="listen-optin__form" onSubmit={handleSubmit}>
                <div className="listen-optin__row">
                  <input
                    type="text"
                    className="listen-optin__input"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-label="First name"
                    id="listen-first-name"
                  />
                  <input
                    type="email"
                    className="listen-optin__input"
                    placeholder="Your best email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address"
                    id="listen-email"
                  />
                </div>
                <button
                  type="submit"
                  className={`listen-optin__submit ${formStatus === 'loading' ? 'listen-optin__submit--loading' : ''}`}
                  disabled={formStatus === 'loading'}
                  id="listen-submit-btn"
                >
                  {formStatus === 'loading' && <span className="listen-optin__spinner" />}
                  Unlock & Start Listening →
                </button>
              </form>
              <p className="listen-optin__disclaimer">
                No spam, ever. Unsubscribe anytime. We respect your family's inbox.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          GATED CONTENT — everything below requires email
          ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={justUnlocked ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Success Banner (only on fresh unlock) ── */}
            {justUnlocked && (
              <section className="listen-unlocked-banner">
                <div className="container text-center">
                  <span className="listen-unlocked-banner__icon">🎉</span>
                  <h2>You're In, Explorer!</h2>
                  <p>All 19 tracks, videos, and coloring pages are now unlocked below.</p>
                </div>
              </section>
            )}

            {/* ── Full Audio Player (from MediaRoom) ── */}
            <section className="section glow-sage">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">{t('media.audio_label')}</div>
                  <h2 className="section-title">
                    {t('media.audio_title_1')} <span className="text-sage">{t('media.audio_title_2')}</span>
                  </h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                    {t('media.audio_subtitle')}
                  </p>
                </RevealSection>
                <RevealSection>
                  <AudioPlayer tracks={tracks} />
                </RevealSection>
              </div>
            </section>

            {/* ── Le Cheval Music Video ── */}
            <section className="section">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">🎬 Music Video</div>
                  <h2 className="section-title">Le <span className="text-gold">Cheval</span></h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                    A bilingual musical journey celebrating the majesty of the horse — sung in French and English.
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="video-feature glass-card">
                    <video
                      className="video-feature__player"
                      src={assetPath('/videos/Le Cheval Video.mp4')}
                      poster={assetPath('/assets/characters/RONAN.png')}
                      controls preload="metadata" playsInline
                      aria-label="Le Cheval music video"
                    />
                    <div className="video-feature__meta">
                      <span className="video-feature__badge" style={{ background: '#1E88E5' }}>🇫🇷 Bilingual</span>
                      <h3 className="video-feature__title">Le Cheval — Track 5</h3>
                      <p className="video-feature__desc">
                        Ronan &amp; Nerissa guide learners through the world of horses with rich French vocabulary,
                        movement, and cross-cultural storytelling from the land of Luminosity.
                      </p>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── Coloring Book ── */}
            <section className="section glow-plum">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">{t('media.coloring_label')}</div>
                  <h2 className="section-title">
                    {t('media.coloring_title_1')} <span className="text-plum">{t('media.coloring_title_2')}</span>
                  </h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                    {t('media.coloring_subtitle')}
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="book-viewer glass-card">
                    <div className="book-viewer__display">
                      <img src={bookPages[bookIndex]} alt={`Coloring book page ${bookIndex + 1}`}
                        className="book-viewer__page" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }} />
                    </div>
                    <div className="book-viewer__controls">
                      <button className="btn btn-outline" onClick={() => setBookIndex(Math.max(0, bookIndex - 1))}
                        disabled={bookIndex === 0} aria-label="Previous page">{t('media.prev')}</button>
                      <span className="book-viewer__counter">{bookIndex + 1} / {bookPages.length}</span>
                      <button className="btn btn-outline" onClick={() => setBookIndex(Math.min(bookPages.length - 1, bookIndex + 1))}
                        disabled={bookIndex === bookPages.length - 1} aria-label="Next page">{t('media.next')}</button>
                    </div>
                    <div className="book-viewer__actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-outline" onClick={printColoringPage} aria-label="Print this page">
                        🖨️ Print This Page
                      </button>
                      <a className="btn btn-outline" href={bookPages[bookIndex]}
                        download={`SOE-Coloring-Page-${bookIndex + 1}.png`} aria-label="Download this page">
                        ⬇️ Download
                      </a>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── SOE Storybook ── */}
            <section className="section">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">{t('media.read_label')}</div>
                  <h2 className="section-title">
                    {t('media.read_title_1')} <span className="text-gold">{t('media.read_title_2')}</span>
                  </h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                    {t('media.read_subtitle')}
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="book-viewer glass-card">
                    <div className="book-viewer__display">
                      <img src={soeBookPages[soeBookIndex]} alt={`SOE Storybook page ${soeBookIndex + 1}`}
                        className="book-viewer__page" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }} />
                    </div>
                    <div className="book-viewer__controls">
                      <button className="btn btn-outline" onClick={() => setSoeBookIndex(Math.max(0, soeBookIndex - 1))}
                        disabled={soeBookIndex === 0} aria-label="Previous page">{t('media.prev')}</button>
                      <span className="book-viewer__counter">{soeBookIndex + 1} / {soeBookPages.length}</span>
                      <button className="btn btn-outline" onClick={() => setSoeBookIndex(Math.min(soeBookPages.length - 1, soeBookIndex + 1))}
                        disabled={soeBookIndex === soeBookPages.length - 1} aria-label="Next page">{t('media.next')}</button>
                    </div>
                    <div className="text-center" style={{ marginTop: '1.5rem' }}>
                      <Link to="/join" className="btn btn-gold">{t('media.pre_order_book')}</Link>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── SOE Globe Video ── */}
            <section className="section">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">🌍 The SOE Globe</div>
                  <h2 className="section-title">A World <span className="text-gold">in Motion</span></h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                    Watch the Seven Lands come alive — an animated panorama of the entire Rhythm Quest universe.
                  </p>
                </RevealSection>
                <RevealSection>
                  <div className="video-feature glass-card">
                    <video className="video-feature__player"
                      src={assetPath('/videos/SOE Globe.mp4')}
                      poster={assetPath('/assets/marketing/quest-collage.webp')}
                      controls preload="metadata" playsInline loop
                      aria-label="SOE Globe panoramic animation" />
                    <div className="video-feature__meta">
                      <span className="video-feature__badge" style={{ background: '#4CAF50' }}>🌍 Animated</span>
                      <h3 className="video-feature__title">The SOE Globe</h3>
                      <p className="video-feature__desc">
                        A rotating panorama showcasing all seven lands, their heroes, and the vibrant world of SOE.
                      </p>
                    </div>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── World Art Gallery ── */}
            <section className="section">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">🎨 World Art Gallery</div>
                  <h2 className="section-title">Scenes from <span className="text-gold">the Seven Lands</span></h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
                    Explore the vibrant illustrations that bring the Rhythm Quest universe to life.
                  </p>
                </RevealSection>
                <div className="masonry-gallery">
                  {[
                    { src: 'pond-aiko-kenji.webp', caption: 'Aiko & Kenji at the Pond', land: 'Harmonia' },
                    { src: 'honeycomb-kwame-selene.webp', caption: "Kwame & Selene's Honeycomb", land: 'Numeria' },
                    { src: 'creek-felix-elias.webp', caption: 'Felix & Elias at the Creek', land: 'Vitalis' },
                    { src: 'tent-ezra-athena.webp', caption: "Ezra & Athena's Camp", land: 'Terrasol' },
                    { src: 'blanket-amara-octavia.webp', caption: 'Amara & Octavia Resting', land: 'Vitalis' },
                    { src: 'cubes-ronan-nerissa.webp', caption: 'Ronan & Nerissa Build', land: 'Luminosity' },
                    { src: 'dance-harmonia-vitalis.webp', caption: 'Dance of Two Lands', land: 'Harmonia' },
                    { src: 'tulip-river-path.webp', caption: 'The Tulip River Path', land: 'Terrasol' },
                    { src: 'seriphia-valley.webp', caption: "Seriphia's Valley", land: 'Celestia' },
                    { src: 'aquaria-shore.webp', caption: 'Shores of Aquaria', land: 'Aquaria' },
                    { src: 'path-to-terrasol.webp', caption: 'Path to Terrasol', land: 'Terrasol' },
                    { src: 'sundial-weather.webp', caption: 'Reading the Sundial', land: 'Celestia' },
                  ].map((s) => (
                    <div key={s.src} className="masonry-gallery__item">
                      <img src={assetPath(`/assets/scenes/${s.src}`)} alt={s.caption} loading="lazy" />
                      <div className="masonry-gallery__label">
                        <span className="masonry-gallery__land">{s.land}</span>
                        <span className="masonry-gallery__caption">{s.caption}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Behind the Quest Gallery ── */}
            <section className="section glow-sage">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">📸 Behind the Quest</div>
                  <h2 className="section-title">A World <span className="text-sage">Brought to Life</span></h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
                    Glimpses from the world of SOE — characters, scenes, and moments from the Seven Lands.
                  </p>
                </RevealSection>
                <GalleryGrid shots={galleryShots} />
              </div>
            </section>

            {/* ── Shape Gallery ── */}
            <section className="section glow-plum">
              <div className="container">
                <RevealSection className="text-center">
                  <div className="section-label">📐 Shape Art</div>
                  <h2 className="section-title">Interactive <span className="text-plum">Shape Gallery</span></h2>
                  <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
                    Beautiful hand-drawn shapes from the land of Geometria.
                  </p>
                </RevealSection>
                <div className="shape-gallery">
                  {[
                    { name: 'Circle', file: 'circle.webp', fact: '360° of infinite symmetry' },
                    { name: 'Triangle', file: 'triangle.webp', fact: '3 sides — the strongest shape' },
                    { name: 'Rectangle', file: 'rectangle.webp', fact: '4 right angles, 2 pairs' },
                    { name: 'Star', file: 'star.webp', fact: '5 points of light' },
                    { name: 'Hexagon', file: 'hexagon.webp', fact: "6 sides — nature's favorite" },
                    { name: 'Heptagon', file: 'heptagon.webp', fact: '7 sides — one for each land' },
                  ].map((s) => (
                    <div key={s.name} className="shape-card">
                      <img src={assetPath(`/assets/shapes/${s.file}`)} alt={s.name}
                        className="shape-card__img" loading="lazy" />
                      <div className="shape-card__name">{s.name}</div>
                      <div className="shape-card__fact">{s.fact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Listen;
