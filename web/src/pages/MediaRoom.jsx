import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AudioVisualizer from '../components/AudioVisualizer';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';
import { useAnimeReveal } from '../hooks/useAnimeReveal';
import tracksData from '../data/tracks.json';
import JsonLd from '../components/JsonLd';
import { mediaRoomSchema } from '../utils/schema';

/* ── Book Pages (Coloring) ── */
const bookPages = [
  'CB_ABCjum.png',
  'CB_Aquaria.png',
  'CB_AquariaDuo.png',
  'CB_Boats.png',
  'CB_Breath.png',
  'CB_Brushhorse.png',
  'CB_CelestiaDuo.png',
  'CB_Congrats.png',
  'CB_Flowercrown.png',
  'CB_HarmoniaDuo.png',
  'CB_Hear2.png',
  'CB_Hearthecall.png',
  'CB_Hill.png',
  'CB_Horse.png',
  'CB_Keeponlearning.png',
  'CB_LeCheval.png',
  'CB_lookhowfar.png',
  'CB_Luminosity Duo.png',
  'CB_lunch.png',
  'CB_Numeria.png',
  'CB_Oink.png',
  'CB_Orchard.png',
  'CB_Pasture.png',
  'CB_Path.png',
  'CB_Pethorse.png',
  'CB_Ponyapple.png',
  'CB_Ponysleep.png',
  'CB_Seriphiacall.png',
  'CB_Shapes.png',
  'CB_Stones.png',
  'CB_Tag.png',
  'CB_Terrasol.png',
  'CB_TerrasolDuo.png',
  'CB_Tulips.png',
  'CB_VitalisDuo.png',
  'CB_water.png',
  'CB_WaveSunset.png',
  'CB_WordPath.png',
].map(f => assetPath(`/assets/coloring-book/${f}`));

/* ── SOE Book Pages (real assets) ── */
const soeBookPages = Array.from({ length: 14 }, (_, i) =>
  assetPath(`/assets/pages/page-${String(i + 1).padStart(2, '0')}.webp`)
);

/* ── Behind the Quest Photo Gallery ── */
const galleryShots = Array.from({ length: 11 }, (_, i) =>
  assetPath(`/assets/media/shot-${String(i + 1).padStart(2, '0')}.webp`)
);

/* ── Gallery Grid Component ── */
const GalleryGrid = ({ shots }) => {
  const [lightbox, setLightbox] = useState(null);
  const gridRef = useAnimeReveal({ selector: '.gallery-shot', staggerMs: 60, translateY: [20, 0], scale: [0.95, 1] });

  return (
    <>
      <div className="gallery-grid" ref={gridRef}>
        {shots.map((src, i) => (
          <button
            key={i}
            className="gallery-shot"
            onClick={() => setLightbox(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <img src={src} alt={`SOE scene ${i + 1}`} loading="lazy" />
            <div className="gallery-shot__overlay">
              <span className="gallery-shot__zoom">⊕</span>
            </div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="gallery-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <button
            className="gallery-lightbox__nav gallery-lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + shots.length) % shots.length); }}
            aria-label="Previous"
          >‹</button>
          <img
            src={shots[lightbox]}
            alt={`SOE scene ${lightbox + 1}`}
            className="gallery-lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="gallery-lightbox__nav gallery-lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % shots.length); }}
            aria-label="Next"
          >›</button>
          <span className="gallery-lightbox__counter">{lightbox + 1} / {shots.length}</span>
        </div>
      )}
    </>
  );
};

/* ── Album Art Carousel ── */
const AlbumCarousel = ({ tracks, currentTrack, onSelect }) => {
  return (
    <div className="album-carousel">
      <div className="album-carousel__track">
        {tracks.map((t, i) => {
          const offset = i - currentTrack;
          const isActive = i === currentTrack;

          return (
            <motion.div
              key={t.id}
              className={`album-slide ${isActive ? 'active' : ''}`}
              initial={false}
              animate={{
                x: offset * 140,
                scale: isActive ? 1.15 : 0.8,
                opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.4,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
                filter: isActive ? 'none' : 'grayscale(0.6) blur(2px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
              onClick={() => onSelect(i)}
            >
              {t.cover ? (
                <img
                  src={t.cover}
                  alt={t.title}
                  className="album-cover"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="album-cover album-cover--placeholder"
                  style={{ background: `${t.color}22`, borderColor: `${t.color}44` }}
                  aria-hidden="true"
                >
                  <span style={{ fontSize: '2.5rem' }}>{t.domainIcon}</span>
                </div>
              )}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="album-label"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <span className="album-label__title">{t.title}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Audio Player Component ── */
const AudioPlayer = ({ tracks }) => {
  const { t } = useTranslation();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  const initAudio = () => {
    if (audioContextRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 64;
      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      audioContextRef.current = context;
      setAnalyser(analyserNode);
    } catch (err) {
      console.error("AudioPlayer: Failed to init audio graph", err);
    }
  };

  const track = tracks[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    const onLoadedMeta = () => {
      setDuration(audio.duration);
    };
    const onEnded = () => {
      const next = (currentTrack + 1) % tracks.length;
      setCurrentTrack(next);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => { });
    }
  }, [currentTrack]);

  const togglePlay = () => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => { });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const audio = audioRef.current;
    audio.currentTime = pct * duration;
    setProgress(pct * duration);
  };

  const selectTrack = (i) => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (i === currentTrack && isPlaying) {
      togglePlay();
      return;
    }
    setCurrentTrack(i);
    setIsPlaying(true);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-player glass-card">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      {/* Album Carousel */}
      <AlbumCarousel tracks={tracks} currentTrack={currentTrack} onSelect={selectTrack} />

      {/* Now Playing */}
      <div className="audio-player__now">
        <div className="audio-player__icon-wrap" style={{ background: `${track.color}22`, borderColor: `${track.color}44` }}>
          <span className="audio-player__domain-icon">{track.domainIcon}</span>
        </div>
        <div className="audio-player__info">
          <h4 className="audio-player__title" style={{ color: track.color }}>{track.title}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="audio-player__domain">{track.domain}</span>
            <AudioVisualizer analyser={analyser} isPlaying={isPlaying} color={track.color} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="audio-player__controls">
        <button className="audio-player__play-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          )}
        </button>

        <div className="audio-player__progress-wrap" onClick={handleSeek} role="slider" aria-label="Track progress" aria-valuenow={progress} aria-valuemax={duration}>
          <div className="audio-player__progress-bar">
            <div className="audio-player__progress-fill" style={{ width: `${duration ? (progress / duration) * 100 : 0}%`, background: track.color }}></div>
          </div>
        </div>

        <span className="audio-player__time">{formatTime(progress)} / {formatTime(duration)}</span>

        {track.lyrics && (
          <button
            className={`audio-player__lyrics-btn ${showLyrics ? 'active' : ''}`}
            onClick={() => setShowLyrics(!showLyrics)}
            aria-label="Toggle lyrics"
          >
            {t('media.lyrics_btn')}
          </button>
        )}
      </div>

      {/* Lyrics Panel */}
      {showLyrics && track.lyrics && (
        <div className="audio-player__lyrics animate-fade-in">
          <div className="audio-player__lyrics-content">
            {track.lyrics.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('(') ? 'lyrics-label' : ''}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="audio-player__tracks">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            className={`audio-player__track ${i === currentTrack ? 'audio-player__track--active' : ''}`}
            onClick={() => selectTrack(i)}
            aria-label={`Play ${t.title}`}
          >
            {t.cover ? (
              <img
                className="audio-player__track-thumb"
                src={t.cover}
                alt={t.title}
                loading="lazy"
              />
            ) : (
              <span className="audio-player__track-icon" style={{ color: t.color }}>{t.domainIcon}</span>
            )}
            <div className="audio-player__track-info">
              <span className="audio-player__track-title">{t.title}</span>
              <span className="audio-player__track-domain">{t.domain}</span>
            </div>
            {i === currentTrack && isPlaying && (
              <AudioVisualizer analyser={analyser} isPlaying={isPlaying} color={t.color} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Media Room Page ── */
const MediaRoom = () => {
  const { t } = useTranslation();
  useEffect(() => { document.title = 'Media Room — SOE Rhythm Quest'; }, []);
  const [bookIndex, setBookIndex] = useState(0);
  const [soeBookIndex, setSoeBookIndex] = useState(0);

  /* ── Track Data (from canonical data layer) ── */
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

  return (
    <div className="media-page">
      <JsonLd data={mediaRoomSchema(tracks)} />
      {/* ── Hero ── */}
      <header className="media-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="scene-backdrop" aria-hidden="true">
          <img src={assetPath('/assets/marketing/quest-collage.webp')} alt="" className="scene-backdrop__img" />
          <div className="scene-backdrop__scrim" />
        </div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up">
            <div className="section-label">{t('media.hero_label')}</div>
            <h1>{t('media.hero_title_1')} <span className="text-gold">{t('media.hero_title_2')}</span></h1>
            <p className="section-subtitle" style={{ margin: '1rem auto' }}>
              {t('media.hero_subtitle')}
            </p>
          </div>
        </div>
      </header>


      {/* ── Audio Section ── */}
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

      {/* ── Le Cheval Video Section ── */}
      <section className="section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">🎬 Music Video</div>
            <h2 className="section-title">
              Le <span className="text-gold">Cheval</span>
            </h2>
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
                controls
                preload="metadata"
                playsInline
                aria-label="Le Cheval music video"
              />
              <div className="video-feature__meta">
                <span className="video-feature__badge" style={{ background: '#1E88E5' }}>🇫🇷 Bilingual</span>
                <h3 className="video-feature__title">Le Cheval — Track 5</h3>
                <p className="video-feature__desc">
                  Ronan &amp; Nerissa guide learners through the world of horses with rich French vocabulary,
                  movement, and cross-cultural storytelling from the land of Lexiconia.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Coloring Book Section ── */}
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
                <img
                  src={bookPages[bookIndex]}
                  alt={`Coloring book page ${bookIndex + 1}`}
                  className="book-viewer__page"
                  style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div className="book-viewer__controls">
                <button
                  className="btn btn-outline"
                  onClick={() => setBookIndex(Math.max(0, bookIndex - 1))}
                  disabled={bookIndex === 0}
                  aria-label="Previous page"
                >
                  {t('media.prev')}
                </button>
                <span className="book-viewer__counter">
                  {bookIndex + 1} / {bookPages.length}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setBookIndex(Math.min(bookPages.length - 1, bookIndex + 1))}
                  disabled={bookIndex === bookPages.length - 1}
                  aria-label="Next page"
                >
                  {t('media.next')}
                </button>
              </div>
              <div className="book-viewer__actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    const w = window.open('', '_blank');
                    w.document.write(`
                      <html>
                        <head>
                          <title>SOE Coloring Page ${bookIndex + 1}</title>
                          <style>
                            * { margin: 0; padding: 0; }
                            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
                            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                            @media print {
                              @page { margin: 0.5cm; size: auto; }
                              body { background: #fff; }
                              img { max-width: 100%; max-height: 100%; }
                            }
                          </style>
                        </head>
                        <body>
                          <img src="${bookPages[bookIndex]}" onload="window.print(); window.close();" />
                        </body>
                      </html>
                    `);
                    w.document.close();
                  }}
                  aria-label="Print this page"
                >
                  🖨️ Print This Page
                </button>
                <a
                  className="btn btn-outline"
                  href={bookPages[bookIndex]}
                  download={`SOE-Coloring-Page-${bookIndex + 1}.png`}
                  aria-label="Download this page"
                >
                  ⬇️ Download
                </a>
                <Link to="/join" className="btn btn-gold">{t('media.pre_order_coloring')}</Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── SOE Book Section ── */}
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
                <img
                  src={soeBookPages[soeBookIndex]}
                  alt={`SOE Storybook page ${soeBookIndex + 1}`}
                  className="book-viewer__page"
                  style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-md)' }}
                />
              </div>
              <div className="book-viewer__controls">
                <button
                  className="btn btn-outline"
                  onClick={() => setSoeBookIndex(Math.max(0, soeBookIndex - 1))}
                  disabled={soeBookIndex === 0}
                  aria-label="Previous page"
                >
                  {t('media.prev')}
                </button>
                <span className="book-viewer__counter">
                  {soeBookIndex + 1} / {soeBookPages.length}
                </span>
                <button
                  className="btn btn-outline"
                  onClick={() => setSoeBookIndex(Math.min(soeBookPages.length - 1, soeBookIndex + 1))}
                  disabled={soeBookIndex === soeBookPages.length - 1}
                  aria-label="Next page"
                >
                  {t('media.next')}
                </button>
              </div>
              <div className="text-center" style={{ marginTop: '1.5rem' }}>
                <Link to="/join" className="btn btn-gold">{t('media.pre_order_book')}</Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Behind the Quest — Photo Gallery ── */}
      <section className="section glow-sage">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">📸 Behind the Quest</div>
            <h2 className="section-title">
              A World <span className="text-sage">Brought to Life</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
              Glimpses from the world of SOE — characters, scenes, and moments from the Seven Lands.
            </p>
          </RevealSection>

          <GalleryGrid shots={galleryShots} />
        </div>
      </section>

      {/* ── World Art Gallery ── */}
      <section className="section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">🎨 World Art Gallery</div>
            <h2 className="section-title">
              Scenes from <span className="text-gold">the Seven Lands</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
              Explore the vibrant illustrations that bring the Rhythm Quest universe to life.
            </p>
          </RevealSection>

          <div className="masonry-gallery">
            {[
              { src: 'pond-aiko-kenji.webp',       caption: 'Aiko & Kenji at the Pond',       land: 'Harmonia' },
              { src: 'honeycomb-kwame-selene.webp',  caption: 'Kwame & Selene\'s Honeycomb',     land: 'Numeria' },
              { src: 'creek-felix-elias.webp',       caption: 'Felix & Elias at the Creek',      land: 'Vitalis' },
              { src: 'tent-ezra-athena.webp',        caption: 'Ezra & Athena\'s Camp',           land: 'Natura' },
              { src: 'blanket-amara-octavia.webp',   caption: 'Amara & Octavia Resting',         land: 'Vitalis' },
              { src: 'cubes-ronan-nerissa.webp',     caption: 'Ronan & Nerissa Build',           land: 'Lexiconia' },
              { src: 'dance-harmonia-vitalis.webp',  caption: 'Dance of Two Lands',              land: 'Harmonia' },
              { src: 'tulip-river-path.webp',        caption: 'The Tulip River Path',            land: 'Natura' },
              { src: 'seriphia-valley.webp',         caption: 'Seriphia\'s Valley',               land: 'Celestia' },
              { src: 'aquaria-shore.webp',           caption: 'Shores of Aquaria',               land: 'Aquaria' },
              { src: 'path-to-terrasol.webp',        caption: 'Path to TerraSol',                land: 'TerraSol' },
              { src: 'sundial-weather.webp',         caption: 'Reading the Sundial',             land: 'Chronia' },
            ].map((s) => (
              <div key={s.src} className="masonry-gallery__item">
                <img
                  src={assetPath(`/assets/scenes/${s.src}`)}
                  alt={s.caption}
                  loading="lazy"
                />
                <div className="masonry-gallery__label">
                  <span className="masonry-gallery__land">{s.land}</span>
                  <span className="masonry-gallery__caption">{s.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shape Art Gallery ── */}
      <section className="section glow-plum">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">📐 Shape Art</div>
            <h2 className="section-title">
              Interactive <span className="text-plum">Shape Gallery</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2.5rem auto' }}>
              Beautiful hand-drawn shapes from the land of Geometria.
            </p>
          </RevealSection>

          <div className="shape-gallery">
            {[
              { name: 'Circle',    file: 'circle.webp',    fact: '360° of infinite symmetry' },
              { name: 'Triangle',  file: 'triangle.webp',  fact: '3 sides — the strongest shape' },
              { name: 'Rectangle', file: 'rectangle.webp', fact: '4 right angles, 2 pairs' },
              { name: 'Star',      file: 'star.webp',      fact: '5 points of light' },
              { name: 'Hexagon',   file: 'hexagon.webp',   fact: '6 sides — nature\'s favorite' },
              { name: 'Heptagon',  file: 'heptagon.webp',  fact: '7 sides — one for each land' },
            ].map((s) => (
              <div key={s.name} className="shape-card">
                <img
                  src={assetPath(`/assets/shapes/${s.file}`)}
                  alt={s.name}
                  className="shape-card__img"
                  loading="lazy"
                />
                <div className="shape-card__name">{s.name}</div>
                <div className="shape-card__fact">{s.fact}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOE Globe Video ── */}
      <section className="section">
        <div className="container">
          <RevealSection className="text-center">
            <div className="section-label">🌍 The SOE Globe</div>
            <h2 className="section-title">
              A World <span className="text-gold">in Motion</span>
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
              Watch the Seven Lands come alive — an animated panorama of the entire Rhythm Quest universe.
            </p>
          </RevealSection>

          <RevealSection>
            <div className="video-feature glass-card">
              <video
                className="video-feature__player"
                src={assetPath('/videos/SOE Globe.mp4')}
                poster={assetPath('/assets/marketing/quest-collage.webp')}
                controls
                preload="metadata"
                playsInline
                loop
                aria-label="SOE Globe panoramic animation"
              />
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

      <style>{`
        .media-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .media-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .media-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Video ── */
        .video-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .video-embed {
          padding: 0;
          overflow: hidden;
        }

        .video-embed__title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-text-primary);
          padding: 1rem 1.25rem 0.75rem;
          margin: 0;
        }

        .music-videos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .video-embed__badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          margin: 0 1.25rem 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .video-embed__player {
          width: 100%;
          display: block;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .video-overlay-text {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
          z-index: 10;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .music-videos-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Audio Player ── */
        .audio-player {
          max-width: 700px;
          margin: 0 auto;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Album Carousel ── */
        .album-carousel {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.5rem;
          background: rgba(0,0,0,0.03);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .album-carousel__track {
          position: relative;
          width: 180px;
          height: 180px;
        }

        .album-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 2px solid rgba(255,255,255,0.1);
          background: #eee;
        }

        .album-slide.active {
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          border-color: rgba(255,255,255,0.5);
        }

        .album-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .album-cover--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
        }

        .album-label {
          position: absolute;
          bottom: 0.6rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-sm);
          color: rgba(255,255,255,0.95);
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 600;
          white-space: normal;
          text-align: center;
          max-width: 85%;
          line-height: 1.3;
          border: 1px solid rgba(255,255,255,0.15);
          pointer-events: none;
          z-index: 20;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        @media (max-width: 480px) {
          .audio-player {
            padding: 1.25rem;
          }
        }

        .audio-player__now {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .audio-player__icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .audio-player__domain-icon {
          font-size: 1.5rem;
        }

        .audio-player__title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .audio-player__domain {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .audio-player__controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .audio-player__controls {
            gap: 0.75rem;
          }
        }

        .audio-player__play-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: var(--color-sage);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition-med);
        }

        .audio-player__play-btn:hover {
          background: var(--color-sage-light);
          transform: scale(1.05);
        }

        .audio-player__progress-wrap {
          flex: 1;
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .audio-player__progress-bar {
          height: 4px;
          background: var(--color-border-light);
          border-radius: 2px;
          overflow: hidden;
        }

        .audio-player__progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        @media (max-width: 480px) {
          .audio-player__progress-wrap {
             padding: 1rem 0; /* Larger touch area */
          }
        }

        .audio-player__time {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-body);
          white-space: nowrap;
        }

        .audio-player__lyrics-btn {
          font-size: 0.7rem;
          color: var(--color-sage);
          background: var(--color-sage-soft);
          border: 1px solid var(--color-sage);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-med);
          margin-left: auto;
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .audio-player__lyrics-btn:hover {
          background: var(--color-sage);
          color: #fff;
        }

        .audio-player__lyrics-btn.active {
          background: var(--color-sage);
          color: #fff;
          box-shadow: 0 0 10px var(--color-sage-glow);
        }

        .audio-player__lyrics {
          margin-top: 0;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid var(--color-border-light);
          scrollbar-width: thin;
          scrollbar-color: var(--color-sage) transparent;
        }

        .audio-player__lyrics::-webkit-scrollbar {
          width: 6px;
        }

        .audio-player__lyrics::-webkit-scrollbar-thumb {
          background-color: var(--color-sage);
          border-radius: 3px;
        }

        .audio-player__lyrics-content {
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-primary);
          text-align: center;
        }

        .audio-player__lyrics-content p {
          margin-bottom: 0.6rem;
        }

        .audio-player__lyrics-content .lyrics-label {
          font-weight: 600;
          color: var(--color-gold);
          margin-top: 1rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .audio-player__tracks {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }

        .audio-player__track {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 1rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background var(--transition-med);
          text-align: left;
          color: var(--color-text-primary);
        }

        .audio-player__track:hover {
          background: var(--color-bg-card-hover);
        }

        .audio-player__track--active {
          background: var(--color-bg-card-hover);
        }

        .audio-player__track-icon {
          font-size: 1.2rem;
        }

        .audio-player__track-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .audio-player__track-info {
          flex: 1;
          min-width: 0;
          overflow: visible;
        }

        .audio-player__track-title {
          display: block;
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.9rem;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }

        .audio-player__track-domain {
          display: block;
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }



        /* ── Le Cheval Video Feature ── */
        .video-feature {
          max-width: 900px;
          margin: 0 auto;
          padding: 0;
          overflow: hidden;
        }

        .video-feature__player {
          width: 100%;
          display: block;
          max-height: 520px;
          object-fit: cover;
          background: #000;
        }

        .video-feature__meta {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .video-feature__badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          width: fit-content;
        }

        .video-feature__title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .video-feature__desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin: 0;
          max-width: 680px;
        }

        /* ── Book Viewer ── */
        .book-viewer {
          max-width: 750px;
          margin: 0 auto;
          padding: 2rem;
        }

        @media (max-width: 480px) {
          .book-viewer {
            padding: 1rem;
          }
          .book-viewer__controls {
            gap: 1rem;
          }
          .book-viewer__controls button {
            padding: 0.8rem 1.5rem !important;
            font-size: 0.9rem !important;
          }
        }

        .book-viewer__display {
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 1.5rem;
          background: var(--color-bg-navy);
        }

        .book-viewer__page {
          width: 100%;
          display: block;
        }

        .book-viewer__page--placeholder {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.04);
          border-radius: var(--radius-md);
          border: 2px dashed var(--color-border);
          font-family: var(--font-heading);
          font-size: 4rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .book-viewer__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .book-viewer__counter {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .book-viewer__controls button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Photo Gallery Grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .gallery-shot {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: var(--radius-md);
          border: none;
          padding: 0;
          cursor: pointer;
          background: var(--color-surface);
          opacity: 0;
          will-change: transform, opacity;
        }

        .gallery-shot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s var(--ease-gentle);
        }

        .gallery-shot:hover img {
          transform: scale(1.08);
          animation: kenBurns 8s ease-in-out infinite alternate;
        }

        .gallery-shot__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-shot:hover .gallery-shot__overlay {
          opacity: 1;
        }

        .gallery-shot__zoom {
          font-size: 2rem;
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }

        /* ── Lightbox ── */
        .gallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: pointer;
        }

        .gallery-lightbox__img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          cursor: default;
        }

        .gallery-lightbox__close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 1.5rem;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .gallery-lightbox__close:hover { background: rgba(255,255,255,0.2); }

        .gallery-lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 2.5rem;
          width: 3.5rem;
          height: 5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          line-height: 1;
        }

        .gallery-lightbox__nav:hover { background: rgba(255,255,255,0.2); }
        .gallery-lightbox__nav--prev { left: 1.5rem; }
        .gallery-lightbox__nav--next { right: 1.5rem; }

        .gallery-lightbox__counter {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          font-family: var(--font-heading);
        }

        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default MediaRoom;
