import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { getPillarById, getArticlesByPillar } from '../data/resourcesData';
import { assetPath } from '../utils/assetPath';
import { SoeIcon } from '../components/ui/SoeIcon';
import ResourceAlbumCapture from '../components/ResourceAlbumCapture';
import ResourcePillarStrip from '../components/ResourcePillarStrip';
import './Resources.css';

/**
 * Dedicated Series / Pillar Hub page for:
 *   /resources/foundations
 *   /resources/play
 *   /resources/readiness
 *   /resources/classrooms
 *   /resources/notes
 */
const ResourcePillarPage = ({ pillarId }) => {
  const pillar = getPillarById(pillarId);
  const articles = pillar ? getArticlesByPillar(pillar.id) : [];

  usePageMeta({
    title: pillar
      ? `${pillar.partLabel} — SOE Resources (Ages 2–7)`
      : 'SOE Resources | The Sound of Essentials',
    description: pillar?.description || '',
    canonicalPath: pillar?.path || '/resources',
  });

  if (!pillar) {
    return <Navigate to="/resources" replace />;
  }

  return (
    <div className="res-page">
      <div className="res-container">
        <nav className="res-breadcrumb" aria-label="Breadcrumb">
          <Link to="/resources">Learning Library</Link>
          <span aria-hidden="true">/</span>
          <span>{pillar.shortTitle}</span>
        </nav>

        <header className="res-pillar-hero">
          <div>
            <span className="res-pill-badge res-pill-badge--orange">
              <SoeIcon name="documents-book-bookmark" type="fill" size={14} />
              <span>
                {pillar.cardKicker} · {articles.length} {articles.length === 1 ? 'GUIDE' : 'GUIDES'}
              </span>
            </span>
            <h1 className="res-pillar-hero__title">{pillar.partLabel}</h1>
            <p className="res-pillar-hero__desc">{pillar.description}</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to={pillar.offerBridge.ctaUrl} className="res-btn res-btn--primary">
                <span>{pillar.offerBridge.ctaLabel}</span>
              </Link>
              <Link to="/resources" className="res-btn res-btn--outline">
                <span>All 4 Parts</span>
              </Link>
            </div>
          </div>

          <img
            src={assetPath(pillar.coverImg)}
            alt={pillar.coverAlt}
            width="480"
            height="260"
            className="res-pillar-hero__img"
          />
        </header>

        <section className="res-card-grid" aria-label={`${pillar.partLabel} Guides`}>
          {articles.map((article, idx) => (
            <Link
              key={article.slug}
              to={`/resources/${article.slug}`}
              className="res-guide-card"
            >
              <div>
                <div className="res-guide-card__meta">
                  <span>
                    {pillar.id === 'notes' ? `ISSUE #${String(idx + 1).padStart(2, '0')}` : `STEP ${idx + 1} OF ${articles.length}`}
                  </span>
                  <span>·</span>
                  <span>{article.readTimeMinutes} min read</span>
                </div>
                <h2 className="res-guide-card__title">{article.title}</h2>
                <p className="res-guide-card__desc">{article.description}</p>
              </div>
              <span className="res-guide-card__cta">Read guide →</span>
            </Link>
          ))}
        </section>

        <ResourceAlbumCapture
          sourceSlug={`pillar-${pillar.id}`}
          heading={pillar.offerBridge.title}
          subheading={pillar.offerBridge.body}
        />

        <ResourcePillarStrip activePillarId={pillar.id} />
      </div>
    </div>
  );
};

export default ResourcePillarPage;
