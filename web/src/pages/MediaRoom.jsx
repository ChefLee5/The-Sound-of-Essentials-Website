import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AudioVisualizer from '../components/AudioVisualizer';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';
import { useAnimeReveal } from '../hooks/useAnimeReveal';
import tracksData from '../data/tracks.json';
import { audioUrl } from '../utils/audioUrl';
import { triggerNoteBurst } from '../components/ui/DesignSpells';
import JsonLd from '../components/JsonLd';
import { mediaRoomSchema } from '../utils/schema';
import { trackAudioPlay } from '../utils/analytics';
import EmailDownloadGateModal from '../components/EmailDownloadGateModal';
import { triggerBrowserDownload } from '../utils/deliveryUrl';
import './MediaRoom.css';


/* ── Book Pages (Coloring) ── */
export const bookPages = [
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
export const soeBookPages = Array.from({ length: 14 }, (_, i) =>
  assetPath(`/assets/pages/page-${String(i + 1).padStart(2, '0')}.webp`)
);

/* ── Behind the Quest Photo Gallery ── */
export const galleryShots = Array.from({ length: 11 }, (_, i) =>
  assetPath(`/assets/media/shot-${String(i + 1).padStart(2, '0')}.webp`)
);

/* ── Gallery Grid Component ── */
export const GalleryGrid = ({ shots }) => {
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
export const AlbumCarousel = ({ tracks, currentTrack, onSelect }) => {
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
export const AudioPlayer = ({ tracks }) => {
  const { t } = useTranslation();
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [analyser, setAnalyser] = useState(null);
  const audioRef = useRef(null);

  const initAudio = () => {
    // Native audio playback without Web Audio interception
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
      recordTrackEngagement(tracks[currentTrack]);
    }
  }, [currentTrack]);

  const recordTrackEngagement = (t) => {
    if (!t) return;
    trackAudioPlay({ trackId: t.id, trackTitle: t.title, domain: t.domain });
    try {
      const stored = JSON.parse(localStorage.getItem('soe_played_tracks') || '[]');
      if (!stored.includes(t.id)) {
        const next = [...stored, t.id];
        localStorage.setItem('soe_played_tracks', JSON.stringify(next));
        if (next.length >= 3 && !localStorage.getItem('soe_milestone_3tracks_shown')) {
          localStorage.setItem('soe_milestone_3tracks_shown', '1');
          window.dispatchEvent(new CustomEvent('soe:milestone:3tracks', { detail: { land: t.domain || 'Harmonia' } }));
        }
      }
    } catch { /* ignore */ }
  };

  const togglePlay = (e) => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => { });
      recordTrackEngagement(track);
      if (e?.clientX && e?.clientY) {
        triggerNoteBurst(e.clientX, e.clientY, track.color);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const updateSeekFromPointer = (e, targetEl) => {
    const rect = (targetEl || e.currentTarget).getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = pct * duration;
      setProgress(pct * duration);
    }
  };

  const handlePointerDownSeek = (e) => {
    const el = e.currentTarget;
    if (el.setPointerCapture) {
      try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    updateSeekFromPointer(e, el);
  };

  const handlePointerMoveSeek = (e) => {
    if (e.buttons === 1) {
      updateSeekFromPointer(e, e.currentTarget);
    }
  };

  const selectTrack = (i, e) => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (i === currentTrack && isPlaying) {
      togglePlay(e);
      return;
    }
    if (e?.clientX && e?.clientY) {
      triggerNoteBurst(e.clientX, e.clientY, tracks[i]?.color || '#FF6F00');
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
        <button className="audio-player__play-btn" onClick={(e) => togglePlay(e)} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          )}
        </button>

        <div
          className="audio-player__progress-wrap"
          onPointerDown={handlePointerDownSeek}
          onPointerMove={handlePointerMoveSeek}
          role="slider"
          aria-label="Track progress"
          aria-valuenow={progress}
          aria-valuemax={duration}
          style={{ touchAction: 'none', cursor: 'pointer' }}
        >
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
            onClick={(e) => selectTrack(i, e)}
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
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateItem, setGateItem] = useState(null);

  const handleDownloadColoringPage = (index) => {
    const item = {
      title: `SOE Coloring Page #${index + 1}`,
      filename: `SOE-Coloring-Page-${index + 1}.png`,
      url: bookPages[index],
      kind: 'interest',
    };
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('soe_user_email') : null;
    if (storedEmail && storedEmail.includes('@')) {
      triggerBrowserDownload(item.url, item.filename);
    } else {
      setGateItem(item);
      setIsGateOpen(true);
    }
  };


  /* ── Track Data (from canonical data layer) ── */
  const tracks = tracksData.map(track => ({
    id: track.id,
    title: t(`media.tracks.${track.id}.title`),
    domain: t(`media.tracks.${track.id}.domain`),
    domainIcon: track.domainIcon,
    desc: t(`media.tracks.${track.id}.desc`),
    src: audioUrl(track.audioFile),
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
                  movement, and cross-cultural storytelling from the land of Luminosity.
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
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => handleDownloadColoringPage(bookIndex)}
                  aria-label="Download this page"
                  style={{ cursor: 'pointer' }}
                >
                  ⬇️ Download
                </button>

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
                <Link to="/workbook" className="btn btn-gold">📚 Get the 8-Week Workbook &amp; Curriculum ($21) →</Link>
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
              { src: 'tent-ezra-athena.webp',        caption: 'Ezra & Athena\'s Camp',           land: 'Terrasol' },
              { src: 'blanket-amara-octavia.webp',   caption: 'Amara & Octavia Resting',         land: 'Vitalis' },
              { src: 'cubes-ronan-nerissa.webp',     caption: 'Ronan & Nerissa Build',           land: 'Luminosity' },
              { src: 'dance-harmonia-vitalis.webp',  caption: 'Dance of Two Lands',              land: 'Harmonia' },
              { src: 'tulip-river-path.webp',        caption: 'The Tulip River Path',            land: 'Terrasol' },
              { src: 'seriphia-valley.webp',         caption: 'Seriphia\'s Valley',               land: 'Celestia' },
              { src: 'aquaria-shore.webp',           caption: 'Shores of Aquaria',               land: 'Aquaria' },
              { src: 'path-to-terrasol.webp',        caption: 'Path to Terrasol',                land: 'Terrasol' },
              { src: 'sundial-weather.webp',         caption: 'Reading the Sundial',             land: 'Celestia' },
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
              Artistic visual shapes from the land of Terrasol.
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

      {/* ── Universal Email Download Gate Modal ── */}

      <EmailDownloadGateModal
        isOpen={isGateOpen}
        onClose={() => setIsGateOpen(false)}
        downloadItem={gateItem || {
          title: 'SOE Coloring Page',
          filename: 'SOE-Coloring-Page.png',
          url: bookPages[bookIndex],
          kind: 'interest',
        }}
      />
    </div>
  );

};

export default MediaRoom;
