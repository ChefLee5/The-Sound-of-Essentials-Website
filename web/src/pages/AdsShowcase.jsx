import React, { useState, useMemo } from 'react';
import { assetPath } from '../utils/assetPath';
import { ADS_DATA } from '../data/adsData';
import { usePageMeta } from '../hooks/usePageMeta';
import './AdsShowcase.css';

const DELTAS = [
  'All Deltas',
  'Δ1: Screen vs. Sensory',
  'Δ2: Testing vs. Arts',
  'Δ3: Algorithm vs. Handcrafted',
  'Δ4: Institution vs. Sanctuary',
  'Δ5: Consumption vs. Quest',
];

const WAVES = ['All Waves', 'Wave 1', 'Wave 2', 'Wave 3', 'Wave 4', 'Wave 5'];

const AdsShowcase = () => {
  usePageMeta({
    title: 'Ad Campaign Showcase — The Sound of Essentials',
    canonicalPath: null,
    noindex: true,
  });
  const [selectedDelta, setSelectedDelta] = useState('All Deltas');
  const [selectedWave, setSelectedWave] = useState('All Waves');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredAds = useMemo(() => {
    return ADS_DATA.filter((ad) => {
      const matchDelta =
        selectedDelta === 'All Deltas' || ad.delta.startsWith(selectedDelta.split(':')[0]);
      const matchWave = selectedWave === 'All Waves' || ad.wave === selectedWave;
      const matchSearch =
        searchQuery.trim() === '' ||
        ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.primaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.audience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.archetype.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDelta && matchWave && matchSearch;
    });
  }, [selectedDelta, selectedWave, searchQuery]);

  const handleCopyText = (ad) => {
    const text = `${ad.primaryText}\n\nHeadline: ${ad.headline}\nDescription: ${ad.description}\nLink: ${ad.url}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ad.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ads-showcase-page">
      <div className="container">
        <header className="ads-showcase-header">
          <div className="ads-showcase-badge">🚀 Meta Ads 30-Archetype Engine</div>
          <h1 className="section-title">The Sound of Essentials — Complete Ad Campaign (30 Ads)</h1>
          <p className="section-subtitle">
            All 30 production-ready ad units across 5 testing waves and 5 Cultural Deltas. Built for ages 2–7.
          </p>
        </header>

        {/* Filter Controls */}
        <div className="ads-filter-container glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 240px' }}>
              <input
                type="text"
                placeholder="🔍 Search 30 ads (archetype, hook, keyword)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 111, 0, 0.25)',
                  background: '#FFF8F0',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            {/* Wave Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {WAVES.map((wave) => (
                <button
                  key={wave}
                  onClick={() => setSelectedWave(wave)}
                  className={`btn ${selectedWave === wave ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', borderRadius: '20px' }}
                >
                  {wave}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural Delta Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {DELTAS.map((delta) => (
              <button
                key={delta}
                onClick={() => setSelectedDelta(delta)}
                className={`btn ${selectedDelta === delta ? 'btn-gold' : 'btn-ghost'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                {delta}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#666' }}>
            Showing <strong>{filteredAds.length}</strong> of <strong>{ADS_DATA.length}</strong> production-ready ads
          </div>
        </div>

        {/* Ads Grid */}
        <div className="ads-feed-grid">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="meta-ad-card">
              {/* Meta Card Header */}
              <div className="meta-ad-header">
                <img
                  src={assetPath('/assets/branding/soe-favicon.png')}
                  alt="SOE"
                  className="meta-ad-avatar"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="meta-ad-page-info">
                  <div className="meta-ad-page-name">
                    The Sound of Essentials <span className="meta-verified">✓</span>
                  </div>
                  <div className="meta-ad-sponsored">Sponsored • 🌐 ({ad.wave})</div>
                </div>
                <div className="meta-ad-tag">{ad.delta}</div>
              </div>

              {/* Primary Text */}
              <div className="meta-ad-body">
                <p className="meta-ad-text">{ad.primaryText}</p>
              </div>

              {/* Ad Image Visual */}
              <div className="meta-ad-image-wrap">
                <img
                  src={assetPath(ad.image)}
                  alt={ad.headline}
                  className="meta-ad-image"
                  loading="lazy"
                />
              </div>

              {/* Bottom Link Bar */}
              <div className="meta-ad-bottom-bar">
                <div className="meta-ad-link-info">
                  <span className="meta-ad-display-url">THESOUNDOFESSENTIALS.COM</span>
                  <div className="meta-ad-headline">{ad.headline}</div>
                  <div className="meta-ad-desc">{ad.description}</div>
                </div>
                <a
                  href={ad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta-ad-cta-btn"
                >
                  {ad.cta.replace('_', ' ')}
                </a>
              </div>

              {/* Meta Card Footer Tool */}
              <div className="meta-card-actions">
                <span className="meta-ad-target-pill">🎯 {ad.audience}</span>
                <button
                  className="meta-copy-btn"
                  onClick={() => handleCopyText(ad)}
                >
                  {copiedId === ad.id ? '✓ Copied' : '📋 Copy Copy & UTM Link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdsShowcase;
