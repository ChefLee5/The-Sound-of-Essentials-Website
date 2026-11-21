import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  RESOURCE_AUTHOR,
  getArticleBySlug,
  getNextArticle,
  getPillarById,
} from '../data/resourcesData';
import { SoeIcon } from '../components/ui/SoeIcon';
import ResourceAlbumCapture from '../components/ResourceAlbumCapture';
import ResourcePillarStrip from '../components/ResourcePillarStrip';
import './Resources.css';

/**
 * Editorial Guide Template (/resources/:slug)
 * Combines sticky TOC, GEO Direct Answer box, emoji callout cards, FAQ block,
 * pillar offer bridge, single-track "Read this next" link, inline Brevo capture,
 * and persistent 4-part roadmap strip.
 */
const ResourceArticlePage = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const pillar = article ? getPillarById(article.pillarId) : null;
  const nextArticle = article ? getNextArticle(article) : null;

  usePageMeta({
    title: article?.metaTitle || 'SOE Resources | The Sound of Essentials',
    description: article?.description || '',
    canonicalPath: article ? `/resources/${article.slug}` : '/resources',
  });

  if (!article || !pillar) {
    return <Navigate to="/resources" replace />;
  }

  return (
    <div className="res-page">
      <div className="res-container">
        <nav className="res-breadcrumb" aria-label="Breadcrumb">
          <Link to="/resources">Learning Library</Link>
          <span aria-hidden="true">/</span>
          <Link to={pillar.path}>{pillar.partLabel}</Link>
          <span aria-hidden="true">/</span>
          <span>Guide</span>
        </nav>

        <header className="res-article-header">
          <span className="res-pill-badge res-pill-badge--orange">
            <SoeIcon name="schedule-clock" size={14} />
            <span>
              {pillar.shortTitle} · {article.readTimeMinutes} MIN READ · AGES 2–7
            </span>
          </span>
          <h1 className="res-article-title">{article.title}</h1>
          <p className="res-article-subtitle">{article.description}</p>

          <div className="res-byline">
            <span>
              Guide by <strong>{RESOURCE_AUTHOR.name}</strong> ({RESOURCE_AUTHOR.role})
            </span>
            <span>·</span>
            <span>Updated {article.updatedAt}</span>
          </div>
        </header>

        <div className="res-article-layout">
          {/* ── Sticky Table of Contents Sidebar ── */}
          <aside className="res-toc" aria-label="Table of contents">
            <p className="res-toc__title">On this page</p>
            <ul className="res-toc__list">
              <li>
                <a href="#direct-answer" className="res-toc__link">
                  Quick Answer
                </a>
              </li>
              {article.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="res-toc__link">
                    {section.heading}
                  </a>
                </li>
              ))}
              {Array.isArray(article.faqs) && article.faqs.length > 0 && (
                <li>
                  <a href="#guide-faqs" className="res-toc__link">
                    Common Questions
                  </a>
                </li>
              )}
            </ul>

            <div className="res-toc__mini-cta">
              <p>
                Experience all 19 studio-recorded acoustic tracks (60–80 BPM) as our founding gift for ages 2–7.
              </p>
              <Link
                to="/listen"
                className="res-btn res-btn--primary"
                style={{ width: '100%', padding: '0.68rem 1rem', fontSize: '0.88rem' }}
              >
                <SoeIcon name="senses-ear" type="fill" size={14} />
                <span>Experience the Album</span>
              </Link>
            </div>
          </aside>

          {/* ── Editorial Article Body ── */}
          <article className="res-article-body">
            <section id="direct-answer" className="res-direct-answer" aria-label="Direct Answer">
              <span className="res-direct-answer__label">KEY TAKEAWAY · AGES 2–7</span>
              <p>{article.directAnswer}</p>
            </section>

            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="res-section">
                <h2>{section.heading}</h2>

                {Array.isArray(section.paragraphs) &&
                  section.paragraphs.map((para, idx) => <p key={idx}>{para}</p>)}

                {Array.isArray(section.bullets) && section.bullets.length > 0 && (
                  <ul>
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {section.callout && (
                  <div
                    className={`res-callout ${
                      section.callout.tone === 'sage'
                        ? 'res-callout--sage'
                        : 'res-callout--warm'
                    }`}
                  >
                    <span className="res-callout__emoji" aria-hidden="true">
                      {section.callout.emoji}
                    </span>
                    <div>
                      <strong>{section.callout.title}</strong>
                      <p>{section.callout.text}</p>
                    </div>
                  </div>
                )}
              </section>
            ))}

            {Array.isArray(article.faqs) && article.faqs.length > 0 && (
              <section id="guide-faqs" className="res-faq" aria-label="Frequently Asked Questions">
                <h2>Common Questions</h2>
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="res-faq__item">
                    <h3>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </section>
            )}

            {/* ── Contextual SOE Product / Next Step Bridge ── */}
            <section className="res-offer-bridge" aria-label="Recommended Next Step">
              <div className="res-offer-bridge__copy">
                <span className="res-pill-badge res-pill-badge--orange">
                  {pillar.offerBridge.badge}
                </span>
                <h3>{pillar.offerBridge.title}</h3>
                <p>{pillar.offerBridge.body}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <Link to={pillar.offerBridge.ctaUrl} className="res-btn res-btn--primary">
                  <span>{pillar.offerBridge.ctaLabel}</span>
                </Link>
                {article.relatedRoute && article.relatedRoute.url !== pillar.offerBridge.ctaUrl && (
                  <Link
                    to={article.relatedRoute.url}
                    className="res-btn res-btn--outline"
                    style={{ fontSize: '0.88rem', padding: '0.62rem 1.25rem' }}
                  >
                    <span>{article.relatedRoute.label} →</span>
                  </Link>
                )}
              </div>
            </section>

            {/* ── Single-Track "Read This Next" Linear Continuation ── */}
            {nextArticle && (
              <Link to={`/resources/${nextArticle.slug}`} className="res-read-next">
                <div>
                  <span className="res-read-next__kicker">— Read this next —</span>
                  <span className="res-read-next__title">{nextArticle.title}</span>
                </div>
                <SoeIcon name="arrows-arrow-right" size={22} style={{ color: '#FFB300' }} />
              </Link>
            )}
          </article>
        </div>

        <ResourceAlbumCapture sourceSlug={article.slug} />

        <ResourcePillarStrip activePillarId={pillar.id} />
      </div>
    </div>
  );
};

export default ResourceArticlePage;
