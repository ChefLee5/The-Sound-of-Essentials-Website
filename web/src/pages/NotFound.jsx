import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { assetPath } from '../utils/assetPath';
import { SoeIcon } from '../components/ui/SoeIcon';

const NotFound = () => {
  usePageMeta({
    title: 'Page Not Found — The Sound of Essentials: Rhythm Quest',
    description:
      'Return to the Rhythm Quest sanctuary: stream the free 19-track acoustic album, open the Learning Library, or explore the 8-week Rhythm Ready Workbook for ages 2–7.',
    canonicalPath: null,
    noindex: true,
  });

  return (
    <section
      className="section not-found-page"
      style={{
        minHeight: 'calc(100vh - 180px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7rem 1.5rem 5rem',
        background: '#FFF8F0',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          padding: '2.75rem 2rem',
          borderRadius: '28px',
          textAlign: 'center',
          background: '#FFFFFF',
          border: '1.5px solid rgba(255, 111, 0, 0.22)',
          boxShadow: '0 20px 48px rgba(43, 32, 22, 0.08)',
        }}
      >
        <img
          src={assetPath('/assets/soe-official-logo-96.webp')}
          alt="The Sound of Essentials Crest"
          width="64"
          height="64"
          style={{ margin: '0 auto 1rem', borderRadius: '16px' }}
        />

        <span
          style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: '50px',
            background: 'rgba(255, 111, 0, 0.1)',
            color: '#C2410C',
            fontWeight: 700,
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.85rem',
          }}
        >
          404 · Off the Beaten Path
        </span>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.45rem)',
            color: '#2B2016',
            marginBottom: '0.85rem',
          }}
        >
          Let&apos;s Guide You Back to the Sound
        </h1>

        <p
          style={{
            color: '#5D4037',
            fontSize: '1.02rem',
            lineHeight: 1.65,
            margin: '0 auto 2rem',
            maxWidth: '540px',
          }}
        >
          That link or QR code path does not match an active page. Choose a destination below to
          stream the free 19-track album or open classroom and home resources for ages 2–7.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.85rem',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/listen"
            className="btn btn-gold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '50px',
              minHeight: '48px',
            }}
          >
            <SoeIcon name="playback-play" type="fill" size={16} />
            <span>Stream Free 19-Track Album</span>
          </Link>

          <Link
            to="/resources"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '50px',
              minHeight: '48px',
            }}
          >
            <SoeIcon name="documents-library" size={16} />
            <span>Open Learning Library</span>
          </Link>

          <Link
            to="/rhythm-ready"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '50px',
              minHeight: '48px',
            }}
          >
            <SoeIcon name="documents-book-bookmark" size={16} />
            <span>8-Week Workbook</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
