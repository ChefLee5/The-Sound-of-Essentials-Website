import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import MusicPlayerWidget from '../components/MusicPlayerWidget';
import TrackStack from '../components/TrackStack';
import { assetPath } from '../utils/assetPath';
import tracksData from '../data/tracks.json';

const Player = () => {
  const { t } = useTranslation();
  const [activeTrack, setActiveTrack] = useState(0);

  useEffect(() => {
    document.title = 'Now Playing — SOE Rhythm Quest';
  }, []);

  // Map track data to MusicPlayerWidget format
  const tracks = tracksData.map(track => ({
    id: track.id,
    title: t(`media.tracks.${track.id}.title`),
    artist: 'The Sound of Essentials',
    cover: assetPath(`/assets/track-art/${track.cover}`),
    src: assetPath(`/audio/${track.audioFile}`),
    color: track.color,
    domainIcon: track.domainIcon,
    lyrics: track.lyrics || null,
  }));

  const handleStackSelect = useCallback((index) => {
    setActiveTrack(index);
  }, []);

  return (
    <div className="player-page">
      {/* Full-bleed background image */}
      <div className="player-page__bg" aria-hidden="true">
        <img src={assetPath('/assets/luminosity-hall.png')} alt="" className="player-page__bg-img" />
      </div>
      <div className="player-page__overlay" aria-hidden="true" />

      <div className="player-page__inner">
        {/* Header */}
        <div className="player-page__header">
          <span className="player-page__label">♫ Now Playing</span>
          <h1 className="player-page__title">
            Rhythm <span className="accent-text">Quest</span>
          </h1>
          <p className="player-page__subtitle">
            19 tracks · 7 Lands · Designed for the developing brain
          </p>
        </div>

        {/* Two-panel layout: Player + Playlist */}
        <div className="player-page__layout">
          {/* Left: Vinyl Player */}
          <div className="player-page__player-col">
            <MusicPlayerWidget tracks={tracks} />
          </div>

          {/* Right: Visual Track Browser */}
          <div className="player-page__stack-col">
            <div className="player-page__stack-label">
              <span className="player-page__stack-icon">🎵</span>
              <span>Browse Tracks</span>
            </div>
            <TrackStack
              tracks={tracks}
              currentIndex={activeTrack}
              onSelect={handleStackSelect}
            />
          </div>
        </div>

        <p className="player-page__hint">
          Space to play/pause · ← → to seek · Shift+← → to skip · S shuffle · L loop
        </p>
      </div>

      <style>{`
        /* ═══════════════════════════════════════
           Player Page — SOE Product Colors
           ═══════════════════════════════════════ */

        .player-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem 2rem;
          background: #0a0604;
          overflow: hidden;
        }

        /* ── Full-Bleed Background Image ── */
        .player-page__bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .player-page__bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          display: block;
          animation: playerBgZoom 30s ease-in-out infinite alternate;
        }

        @keyframes playerBgZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06) translateY(-1%); }
        }

        /* Dark vignette overlay for readability */
        .player-page__overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%),
            linear-gradient(to top, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.15) 40%, rgba(10,6,4,0.05) 70%, rgba(10,6,4,0.25) 100%);
          pointer-events: none;
        }

        /* ── Inner Content ── */
        .player-page__inner {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        /* ── Header ── */
        .player-page__header { text-align: center; }

        .player-page__label {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #FFB74D;
        }

        .player-page__title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          line-height: 1.1;
          margin: 0.4rem 0 0;
          color: #fff;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }

        .player-page__title .accent-text {
          color: #FFD54F;
        }

        .player-page__subtitle {
          font-family: var(--font-cursive);
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: rgba(255,220,160,0.7);
          margin: 0.3rem 0 0;
        }

        /* ── Two-Panel Layout ── */
        .player-page__layout {
          display: flex;
          align-items: center;
          gap: 3rem;
          width: 100%;
        }

        .player-page__player-col {
          flex: 1;
          min-width: 0;
        }

        .player-page__stack-col {
          flex: 0 0 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .player-page__stack-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,200,120,0.6);
        }

        .player-page__stack-icon { font-size: 1rem; }

        /* ── Hint ── */
        .player-page__hint {
          font-family: var(--font-body);
          font-size: 0.7rem;
          color: rgba(255,220,160,0.3);
          text-align: center;
          letter-spacing: 0.04em;
        }

        /* ── Override MusicPlayerWidget for dark/gold theme ── */
        .player-page .mpw-card {
          --mpw-bg: rgba(10,6,4,0.85);
          --mpw-fg: #fff;
          --mpw-accent: #FFB74D;
          --mpw-muted: rgba(255,200,120,0.45);
          border: 1px solid rgba(255,200,120,0.15);
          box-shadow: 0 12px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,200,120,0.06);
          backdrop-filter: blur(20px);
        }

        .player-page .mpw-card.is-playing {
          box-shadow: 0 16px 60px rgba(0,0,0,0.5), 0 0 50px rgba(255,183,77,0.15), 0 0 0 1px rgba(255,200,120,0.1);
        }

        .player-page .mpw-hole {
          background: rgba(10,6,4,0.9);
          border-color: rgba(255,200,120,0.15);
        }

        .player-page .mpw-hole-inner {
          background: rgba(255,200,120,0.08);
        }

        .player-page .mpw-bar {
          background: rgba(255,255,255,0.1);
        }

        .player-page .mpw-ctrl {
          color: rgba(255,200,120,0.45);
        }

        .player-page .mpw-ctrl:hover {
          color: #FFD54F;
          background: rgba(255,200,120,0.1);
        }

        .player-page .mpw-ctrl-play {
          background: linear-gradient(135deg, #FF8F00, #FFB74D);
          color: #1a0f00;
        }

        .player-page .mpw-ctrl-play:hover {
          background: linear-gradient(135deg, #FF8F00, #FFB74D);
          filter: brightness(1.15);
        }

        .player-page .mpw-ctrl-toggle.is-active {
          color: #FFB74D;
        }

        .player-page .mpw-scales {
          fill: #FFB74D;
        }

        .player-page .mpw-lyrics {
          background: rgba(255,200,120,0.06);
        }

        /* ── TrackStack overrides for dark theme ── */
        .player-page .ts-counter__current {
          color: #FFD54F;
        }

        .player-page .ts-counter__divider {
          background: rgba(255,200,120,0.2);
        }

        .player-page .ts-counter__total {
          color: rgba(255,200,120,0.4);
        }

        .player-page .ts-dot {
          background: rgba(255,200,120,0.25);
        }

        .player-page .ts-dot:hover {
          background: #FFB74D;
        }

        .player-page .ts-dot--active {
          background: #FFB74D;
        }

        .player-page .ts-hint {
          color: rgba(255,200,120,0.3);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .player-page__layout {
            flex-direction: column;
            gap: 2rem;
          }

          .player-page__stack-col {
            flex: auto;
            width: 100%;
          }

          .player-page { padding: 5rem 1rem 2rem; }
        }

        @media (max-width: 600px) {
          .player-page .mpw-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Player;
