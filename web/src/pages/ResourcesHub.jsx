import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  ALL_RESOURCE_PILLARS,
  getArticlesByPillar,
  getPillarById,
  searchResources,
} from '../data/resourcesData';
import { assetPath } from '../utils/assetPath';
import { SoeIcon } from '../components/ui/SoeIcon';
import ResourceAlbumCapture from '../components/ResourceAlbumCapture';
import './Resources.css';

/**
 * "/resources" — The SOE Learning Library.
 * Designed for calm, uncluttered continuity with the main Rhythm Quest journey:
 * a single horizontal 4-Part (+ Sound Notes) progression rail controls one
 * focused 2-column Stage Deck rather than stacking 20+ cards down the page.
 */
const ResourcesHub = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activePillarId, setActivePillarId] = useState(() => {
    const hashId = (location.hash || '').replace(/^#(?:stage-)?/, '');
    return getPillarById(hashId)?.id || 'foundations';
  });

  usePageMeta({
    title: 'The Learning Library — 4-Part Screen-Free Guides for Ages 2–7 | SOE',
    description:
      'Practical guides, daily sound-play rituals, kindergarten readiness checklists, and classroom blueprints that extend The Sound of Essentials for ages 2–7.',
    canonicalPath: '/resources',
  });

  useEffect(() => {
    const hashId = (location.hash || '').replace(/^#(?:stage-)?/, '');
    if (hashId && getPillarById(hashId)) {
      setActivePillarId(hashId);
    }
  }, [location.hash]);

  const activeIndex = useMemo(
    () => Math.max(0, ALL_RESOURCE_PILLARS.findIndex((p) => p.id === activePillarId)),
    [activePillarId]
  );
  const activePillar = ALL_RESOURCE_PILLARS[activeIndex] || ALL_RESOURCE_PILLARS[0];
  const activeArticles = useMemo(
    () => getArticlesByPillar(activePillar.id),
    [activePillar.id]
  );

  const prevPillar = activeIndex > 0 ? ALL_RESOURCE_PILLARS[activeIndex - 1] : null;
  const nextPillar =
    activeIndex < ALL_RESOURCE_PILLARS.length - 1
      ? ALL_RESOURCE_PILLARS[activeIndex + 1]
      : null;

  const searchResults = useMemo(() => searchResources(query), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="res-page">
      <div className="res-container">
        {/* ── Calm Editorial Header + Compact Instant Search ── */}
        <header className="res-lib-header">
          <div className="res-lib-header__copy">
            <span className="res-pill-badge res-pill-badge--orange">
              <SoeIcon name="documents-library" type="fill" size={13} />
              <span>RHYTHM QUEST LIBRARY · AGES 2–7</span>
            </span>
            <h1 className="res-lib-header__title">The Learning Library</h1>
            <p className="res-lib-header__lead">
              Practical guides, daily rituals, and classroom blueprints to deepen your
              Rhythm Quest journey—organized in four connected stages.
            </p>
          </div>

          <div className="res-search res-search--compact" role="search">
            <div className="res-search__box">
              <SoeIcon name="documents-library" size={17} style={{ color: '#8D6E63' }} />
              <label htmlFor="soe-resources-search" className="res-sr-only">
                Search all Sound of Essentials guides
              </label>
              <input
                id="soe-resources-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setQuery('');
                }}
                placeholder="Search phonics, bedtime, Head Start…"
                autoComplete="off"
                className="res-search__input"
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="res-search__clear"
                >
                  <SoeIcon name="indicators-x" size={14} />
                </button>
              )}
            </div>

            {hasQuery && (
              <div className="res-search__results" role="region" aria-live="polite">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 8).map((item) => {
                    const pillar = getPillarById(item.pillarId);
                    return (
                      <Link
                        key={item.slug}
                        to={`/resources/${item.slug}`}
                        className="res-search__item"
                        onClick={() => setQuery('')}
                      >
                        <div>
                          <span className="res-search__item-title">{item.title}</span>
                          <span className="res-search__item-meta">
                            {pillar?.partLabel} · {item.readTimeMinutes} min read
                          </span>
                        </div>
                        <SoeIcon name="arrows-arrow-right" size={16} style={{ color: '#FF6F00' }} />
                      </Link>
                    );
                  })
                ) : (
                  <div className="res-search__empty">
                    No guides matched &ldquo;{query}&rdquo;. Try &ldquo;phonics&rdquo;, &ldquo;bedtime&rdquo;,
                    &ldquo;workbook&rdquo;, or &ldquo;Head Start&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ── Horizontal 4-Part + Sound Notes Step Rail ── */}
        <div
          className="res-rail"
          role="tablist"
          aria-label="Learning Library Stages"
        >
          {ALL_RESOURCE_PILLARS.map((pillar) => {
            const isActive = pillar.id === activePillar.id;
            const stepTag =
              pillar.id === 'notes' ? 'Weekly' : `0${pillar.partNumber}`;
            return (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                id={`tab-${pillar.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${pillar.id}`}
                className={`res-rail__tab ${isActive ? 'res-rail__tab--active' : ''}`}
                style={{ '--pillar-accent': pillar.accentColor }}
                onClick={() => setActivePillarId(pillar.id)}
              >
                <span className="res-rail__step">{stepTag}</span>
                <span className="res-rail__label">{pillar.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* ── Single Focused Stage Workspace (Zero Stacking Wall) ── */}
        <section
          id={`panel-${activePillar.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activePillar.id}`}
          className="res-deck"
          style={{ '--pillar-accent': activePillar.accentColor }}
        >
          <div className="res-deck__aside">
            <div className="res-deck__media">
              <img
                src={assetPath(activePillar.coverImg)}
                alt={activePillar.coverAlt}
                width="420"
                height="250"
                className="res-deck__img"
              />
              <span className="res-deck__kicker">{activePillar.cardKicker}</span>
            </div>

            <div className="res-deck__summary">
              <h2 className="res-deck__title">{activePillar.partLabel}</h2>
              <p className="res-deck__desc">{activePillar.description}</p>

              <div className="res-deck__actions">
                <Link to={activePillar.path} className="res-btn res-btn--primary">
                  <span>Open Full Series ({activeArticles.length}) →</span>
                </Link>
                <Link to={activePillar.offerBridge.ctaUrl} className="res-btn res-btn--outline">
                  <span>{activePillar.offerBridge.ctaLabel}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="res-deck__list-col">
            <div className="res-deck__list-head">
              <span>RECOMMENDED READING FLOW</span>
              <span>{activeArticles.length} GUIDES</span>
            </div>

            <ol className="res-deck__list">
              {activeArticles.map((article, idx) => (
                <li key={article.slug} className="res-deck__item">
                  <Link
                    to={`/resources/${article.slug}`}
                    className="res-deck__link"
                  >
                    <span className="res-deck__num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="res-deck__link-body">
                      <span className="res-deck__link-title">{article.title}</span>
                      <span className="res-deck__link-sub">{article.description}</span>
                    </span>
                    <span className="res-deck__time">
                      {article.readTimeMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="res-deck__stepper">
              {prevPillar ? (
                <button
                  type="button"
                  className="res-stepper-btn"
                  onClick={() => setActivePillarId(prevPillar.id)}
                >
                  ← {prevPillar.shortTitle}
                </button>
              ) : (
                <span />
              )}

              {nextPillar ? (
                <button
                  type="button"
                  className="res-stepper-btn res-stepper-btn--next"
                  onClick={() => setActivePillarId(nextPillar.id)}
                >
                  Next: {nextPillar.shortTitle} →
                </button>
              ) : (
                <button
                  type="button"
                  className="res-stepper-btn res-stepper-btn--next"
                  onClick={() => setActivePillarId('foundations')}
                >
                  Return to Part 1 →
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Streamlined Horizontal Capture Strip ── */}
        <ResourceAlbumCapture sourceSlug="resources-hub" />
      </div>
    </div>
  );
};

export default ResourcesHub;
