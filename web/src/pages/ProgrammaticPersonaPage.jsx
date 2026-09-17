import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getPseoBySlug, pseoPages } from '../data/pseoData';
import { assetPath } from '../utils/assetPath';
import JsonLd from '../components/JsonLd';
import './ProgrammaticPersonaPage.css';

const getPageUrl = (p) => {
  const prefix = p.type === 'for' ? '/for/' : p.type === 'solution' ? '/solutions/' : '/guides/';
  return `${prefix}${p.slug}`;
};

const ProgrammaticPersonaPage = () => {
  const { slug } = useParams();
  const page = getPseoBySlug(slug);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (page) {
      document.title = page.metaTitle || `${page.h1} | The Sound of Essentials`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = page.metaDescription;

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://thesoundofessentials.com${getPageUrl(page)}`;
      
      window.scrollTo(0, 0);
    }
  }, [page]);

  if (!page) {
    return <Navigate to="/solutions" replace />;
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Structured Data (JSON-LD) for Google Rich Results
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://thesoundofessentials.com/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Solutions',
          'item': 'https://thesoundofessentials.com/solutions'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': page.badge,
          'item': `https://thesoundofessentials.com${getPageUrl(page)}`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': page.h1,
      'description': page.metaDescription,
      'provider': {
        '@type': 'Organization',
        'name': 'The Sound of Essentials',
        'sameAs': 'https://thesoundofessentials.com'
      },
      'educationalCredentialAwarded': 'Early Childhood Sensory & Phonics Readiness',
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': 'blended',
        'courseWorkload': 'PT15M'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': page.faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      }))
    }
  ];

  // Related internal links (spokes)
  const relatedPages = pseoPages
    .filter((p) => p.slug !== page.slug)
    .slice(0, 3);

  return (
    <div className="pseo-page">
      <JsonLd data={structuredData} />

      {/* ── Breadcrumb Bar ───────────────────────────────── */}
      <nav className="pseo-breadcrumb-nav" aria-label="Breadcrumb">
        <div className="pseo-container">
          <Link to="/">Home</Link>
          <span className="pseo-breadcrumb-sep">/</span>
          <Link to="/solutions">Solutions</Link>
          <span className="pseo-breadcrumb-sep">/</span>
          <span className="pseo-breadcrumb-current">{page.badge}</span>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <header className="pseo-hero">
        <div className="pseo-container pseo-hero-inner">
          <div className="pseo-badge-pill">
            <span className="pseo-badge-dot" style={{ backgroundColor: page.landColor || '#FF6F00' }}></span>
            {page.badge}
          </div>
          <h1 className="pseo-hero-title">{page.h1}</h1>
          <p className="pseo-hero-desc">{page.metaDescription}</p>

          <div className="pseo-quote-card">
            <p className="pseo-quote-text">{page.quote}</p>
            <div className="pseo-quote-author">
              <strong>{page.hero}</strong> · {page.heroTitle} ({page.land})
            </div>
          </div>

          <div className="pseo-hero-actions">
            <Link to={page.primaryCta.url} className="pseo-btn pseo-btn-primary">
              {page.primaryCta.text}
            </Link>
            <Link to={page.secondaryCta.url} className="pseo-btn pseo-btn-secondary">
              {page.secondaryCta.text}
            </Link>
          </div>
        </div>
      </header>

      {/* ── 3-Layer Delta Framework ──────────────────────── */}
      <section className="pseo-section pseo-delta-section">
        <div className="pseo-container">
          <div className="pseo-section-header">
            <span className="pseo-section-eyebrow">{page.delta}</span>
            <h2 className="pseo-section-title">The Foundation of Our Approach</h2>
            <p className="pseo-section-subtitle">
              Why mainstream methods fall short, and how acoustic rhythm creates lasting cognitive development.
            </p>
          </div>

          <div className="pseo-delta-grid">
            <div className="pseo-delta-card pseo-card-problem">
              <div className="pseo-delta-icon">⚠️</div>
              <h3>The Mainstream Dilemma</h3>
              <p>{page.deltaSummary.problem}</p>
            </div>

            <div className="pseo-delta-card pseo-card-truth">
              <div className="pseo-delta-icon">💡</div>
              <h3>The Neurological Truth</h3>
              <p>{page.deltaSummary.counterTruth}</p>
            </div>

            <div className="pseo-delta-card pseo-card-solution">
              <div className="pseo-delta-icon">🎵</div>
              <h3>The Rhythm Quest Solution</h3>
              <p>{page.deltaSummary.soeSolution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Track & Sensory Spotlight ───────────────────── */}
      <section className="pseo-section pseo-track-spotlight">
        <div className="pseo-container">
          <div className="pseo-spotlight-card" style={{ borderColor: page.landColor || '#FF6F00' }}>
            <div className="pseo-spotlight-meta">
              <span className="pseo-track-tag">Featured Audio Track</span>
              <h3 className="pseo-spotlight-title">{page.trackTitle}</h3>
              <span className="pseo-spotlight-sub">{page.trackNumber} · {page.trackFocus}</span>
              <p className="pseo-spotlight-desc">
                Recorded with organic nylon-string guitars, wooden kalimbas, and hand percussion. Calibrated at gentle 90–110 BPM resting heart-rate tempo to nurture autonomic nervous system balance.
              </p>
              <div className="pseo-spotlight-actions">
                <Link to="/listen?unlocked=true" className="pseo-btn pseo-btn-primary">
                  Stream Full 19 Tracks Free
                </Link>
                <Link to="/rhythm-ready" className="pseo-btn pseo-btn-ghost">
                  Explore Activity Workbook →
                </Link>
              </div>
            </div>
            <div className="pseo-spotlight-visual">
              <div className="pseo-hero-avatar-frame">
                <img
                  src={assetPath(page.heroImg)}
                  alt={page.hero}
                  className="pseo-hero-avatar-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = assetPath('/assets/characters/SERIPHIA.webp');
                  }}
                />
              </div>
              <div className="pseo-spotlight-land-pill" style={{ backgroundColor: page.landColor || '#FF6F00' }}>
                Land of {page.land}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Benefits Grid ────────────────────────────── */}
      <section className="pseo-section pseo-benefits-section">
        <div className="pseo-container">
          <div className="pseo-section-header">
            <span className="pseo-section-eyebrow">Practical Impact</span>
            <h2 className="pseo-section-title">Engineered for Real-World Learning</h2>
            <p className="pseo-section-subtitle">
              Concrete outcomes for classrooms, therapy clinics, and conscious home environments.
            </p>
          </div>

          <div className="pseo-benefits-grid">
            {page.benefits.map((benefit, idx) => (
              <div key={idx} className="pseo-benefit-card">
                <div className="pseo-benefit-number">0{idx + 1}</div>
                <h4 className="pseo-benefit-title">{benefit.title}</h4>
                <p className="pseo-benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum Features Checklist ────────────────── */}
      <section className="pseo-section pseo-features-section">
        <div className="pseo-container pseo-features-inner">
          <div className="pseo-features-text">
            <span className="pseo-section-eyebrow">Turnkey Delivery</span>
            <h2 className="pseo-section-title">Everything Included in the Ecosystem</h2>
            <p className="pseo-features-p">
              Designed as a complete, multi-sensory learning system that scales effortlessly from home morning baskets to multi-site early education centers.
            </p>
            <ul className="pseo-checklist">
              {page.features.map((feat, idx) => (
                <li key={idx} className="pseo-check-item">
                  <span className="pseo-check-icon">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pseo-features-media">
            <div className="pseo-features-card">
              <div className="pseo-media-pill">Ages 2–7 Canon</div>
              <h4>Screen-Free Cognitive Foundation</h4>
              <p>
                Spanning the 5 Core Domains (Language, Math, Movement, Science, Social-Emotional) across all 7 living Lands.
              </p>
              <div className="pseo-stat-row">
                <div className="pseo-stat-box">
                  <div className="pseo-stat-num">19</div>
                  <div className="pseo-stat-lbl">Acoustic Tracks</div>
                </div>
                <div className="pseo-stat-box">
                  <div className="pseo-stat-num">4,000+</div>
                  <div className="pseo-stat-lbl">Vocabulary Words</div>
                </div>
                <div className="pseo-stat-box">
                  <div className="pseo-stat-num">40</div>
                  <div className="pseo-stat-lbl">Days of Quests</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive FAQ Accordion ───────────────────── */}
      <section className="pseo-section pseo-faq-section">
        <div className="pseo-container pseo-faq-container">
          <div className="pseo-section-header">
            <span className="pseo-section-eyebrow">Questions & Answers</span>
            <h2 className="pseo-section-title">Frequently Asked Questions</h2>
            <p className="pseo-section-subtitle">
              Clear answers to help you deploy the curriculum with complete confidence.
            </p>
          </div>

          <div className="pseo-faq-list">
            {page.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`pseo-faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="pseo-faq-question"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="pseo-faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="pseo-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom Conversion Banner ─────────────────────── */}
      <section className="pseo-cta-banner">
        <div className="pseo-container pseo-cta-inner">
          <div className="pseo-cta-pill">Staying on the path, always learning</div>
          <h2 className="pseo-cta-title">Begin Your Sensory Learning Journey Today</h2>
          <p className="pseo-cta-desc">
            Crafted by a father's heart and a mother's love for our children. Then for yours.
          </p>
          <div className="pseo-cta-buttons">
            <Link to="/listen?unlocked=true" className="pseo-btn pseo-btn-primary pseo-btn-lg">
              Stream the 19 Tracks Free
            </Link>
            <Link to="/rhythm-ready" className="pseo-btn pseo-btn-white pseo-btn-lg">
              Order Rhythm Ready Workbook ($19)
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Spokes / Internal Linking ─────────────── */}
      <footer className="pseo-related-footer">
        <div className="pseo-container">
          <h4 className="pseo-related-title">Explore Related Solutions & Frameworks</h4>
          <div className="pseo-related-grid">
            {relatedPages.map((rel) => (
              <Link key={rel.slug} to={getPageUrl(rel)} className="pseo-related-card">
                <span className="pseo-related-badge">{rel.badge}</span>
                <span className="pseo-related-heading">{rel.h1}</span>
                <span className="pseo-related-arrow">Read Solution →</span>
              </Link>
            ))}
          </div>
          <div className="pseo-hub-link-row">
            <Link to="/solutions" className="pseo-view-all-link">
              View All 17 Educational Solutions in the Hub →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProgrammaticPersonaPage;
