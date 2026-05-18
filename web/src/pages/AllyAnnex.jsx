import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import JsonLd from '../components/JsonLd';
import { productsSchema } from '../utils/schema';
import './AllyAnnex.css';

/* ─── Partner Data ─────────────────────────────────────────────────── */


const CATEGORIES = [
  { key: 'all',        emoji: '✨', label: 'All Allies' },
  { key: 'education',  emoji: '', label: 'Education' },
  { key: 'sanctuary',  emoji: '🏡', label: 'Sanctuary' },
  { key: 'caregiver',  emoji: '🧘', label: 'Caregiver' },
  { key: 'biohacking', emoji: '🔬', label: 'Biohacking' },
  { key: 'energy',     emoji: '⚡', label: 'Energy' },
  { key: 'music',      emoji: '🎵', label: 'Music' },
];

const PARTNERS = [
  // Tier 1 -> Essential Foundations
  { id:'mindvalley', name:'Mindvalley', sub:'Conscious Parenting Mastery', tier:1, arch:'guide', cat:'caregiver', hl:'Dr. Shefali\'s program — the ultimate expression of conscious parenting.', cta:'Explore Program', url:'#', badge:'TOP PICK', img: '/assets/allies/mindvalley.png' },
  { id:'hoffman', name:'Hoffman Academy', sub:'Music-First Piano Lessons', tier:1, arch:'engine', cat:'education', hl:'Ear-before-eye piano lessons that build neural bridges through rhythm.', cta:'Start Piano', url:'#', badge:'FEATURED', img: '/assets/allies/hoffman.png' },
  { id:'airdoctor', name:'Water & Wellness', sub:'AirDoctor & AquaTru', tier:1, arch:'explorer', cat:'sanctuary', hl:'Clean air and water for growing brains — environmental purity supports cognition.', cta:'Purify Your Home', url:'#', img: '/assets/allies/airdoctor.png' },
  { id:'compass', name:'Compass Classroom', sub:'Video Curricula', tier:1, arch:'engine', cat:'education', hl:'Rich, engaging video curricula for older siblings to learn alongside.', cta:'Browse Curricula', url:'#', img: '/assets/allies/compass.png' },
  { id:'crystalquest', name:'Crystal Quest', sub:'Water Filtration', tier:1, arch:'explorer', cat:'sanctuary', hl:'Premium water filtration systems for a toxin-free learning environment.', cta:'Shop Filtration', url:'#', badge:'LIFETIME', img: '/assets/allies/crystalquest.png' },
  // Tier 2 -> Premium Investments
  { id:'saunakit', name:'Sauna Kit Co', sub:'At-Home Barrel Saunas', tier:2, arch:'guide', cat:'biohacking', hl:'Deep nervous system regulation and recovery for caregivers.', cta:'Explore Saunas', url:'#', badge:'PREMIUM', img: '/assets/allies/saunakit.png' },
  { id:'cedarworks', name:'CedarWorks', sub:'Premium Playsets', tier:2, arch:'explorer', cat:'education', hl:'Gross motor play structures that encourage physical exploration.', cta:'Design Playset', url:'#', badge:'CUSTOM', img: '/assets/allies/cedarworks.png' },
  { id:'avocado', name:'Avocado Green', sub:'Organic Eco-Luxury Sleep', tier:2, arch:'explorer', cat:'sanctuary', hl:'Organic eco-luxury mattresses. Better sleep equals better memory consolidation.', cta:'Shop Mattresses', url:'#', img: '/assets/allies/avocado.png' },
  { id:'jai', name:'Jai Institute', sub:'Parent Coach Certification', tier:2, arch:'guide', cat:'caregiver', hl:'Empower yourself with deep parenting frameworks and certification.', cta:'Learn More', url:'#', badge:'CERTIFICATION', img: '/assets/allies/jai.png' },
  { id:'ecoflow', name:'EcoFlow', sub:'Portable Power Stations', tier:2, arch:'guide', cat:'energy', hl:'Off-grid independence for dynamic, anywhere-learning setups.', cta:'Go Off-Grid', url:'#', img: '/assets/allies/ecoflow.png' },
  // Tier 3 -> Supporting Resources
  { id:'sproutkids', name:'Sprout Kids', sub:'Montessori Furniture', tier:3, arch:'explorer', cat:'education', hl:'Montessori-aligned furniture for independent physical learning spaces.', cta:'Shop Furniture', url:'#', img: '/assets/allies/sproutkids.png' },
  { id:'charlotte', name:'Simply Charlotte Mason', sub:'Literature-Rich Homeschool', tier:3, arch:'engine', cat:'education', hl:'Nature-focused curriculum that mirrors a gentle pacing philosophy.', cta:'Explore Curriculum', url:'#', img: '/assets/allies/charlotte.png' },
  { id:'wonderkids', name:'WonderKidsToy', sub:'STEM Sensory Boards', tier:3, arch:'explorer', cat:'education', hl:'STEM boards that actively build neural pathways through sensory play.', cta:'Shop STEM Toys', url:'#', img: '/assets/allies/wonderkids.png' },
  { id:'higherdose', name:'HigherDOSE', sub:'Infrared & PEMF Wellness', tier:3, arch:'guide', cat:'biohacking', hl:'Infrared and PEMF frequency healing for caregiver recovery.', cta:'Shop Wellness', url:'#', img: '/assets/allies/higherdose.png' },
  { id:'zzounds', name:'zZounds', sub:'Musical Instruments', tier:3, arch:'explorer', cat:'music', hl:'High-quality musical instruments for aspiring young musicians.', cta:'Shop Instruments', url:'#', img: '/assets/allies/zzounds.png' },
  { id:'naturepedic', name:'Naturepedic', sub:'GOTS-Certified Mattresses', tier:3, arch:'explorer', cat:'sanctuary', hl:'GOTS-certified organic mattresses — the gold standard for healthy sleep.', cta:'Shop Organic', url:'#', img: '/assets/allies/naturepedic.png' },
  { id:'essentia', name:'Essentia', sub:'Natural Memory Foam', tier:3, arch:'explorer', cat:'sanctuary', hl:'All-natural memory foam for deep, restorative recovery.', cta:'Shop Foam', url:'#', img: '/assets/allies/essentia.png' },
];

const TIER_LABELS = {
  1: { label: 'Essential Foundations', desc: 'High-impact tools to start building your sanctuary.' },
  2: { label: 'Premium Investments', desc: 'Transformative additions for your learning environment.' },
  3: { label: 'Supporting Resources', desc: 'Enhancements and ongoing tools for everyday growth.' },
};

/* ─── Components ───────────────────────────────────────────────────── */



const TierBadge = ({ badge }) => {
  if (!badge) return null;
  return <span className="annex-tier-badge">{badge}</span>;
};

const PartnerCard = ({ p }) => {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !p.img || imgError;

  return (
    <div className={`annex-card annex-card--tier${p.tier}`} id={`ally-${p.id}`}>
      <div className="annex-card__image-wrapper">
        {showPlaceholder ? (
          <div className="annex-card__placeholder">
            <span className="annex-card__placeholder-name">{p.name}</span>
            <span className="annex-card__placeholder-sub">{p.sub}</span>
          </div>
        ) : (
          <img
            src={assetPath(p.img)}
            alt={p.name}
            className="annex-card__image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="annex-card__content">
        <div className="annex-card__header">
          <div className="annex-card__title-row">
            <h3 className="annex-card__name">{p.name}</h3>
            <TierBadge badge={p.badge} />
          </div>
          <p className="annex-card__sub">{p.sub}</p>
        </div>
        <p className="annex-card__highlight">{p.hl}</p>
        <a
          href={p.url}
          className="annex-card__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {p.cta} →
        </a>
      </div>
    </div>
  );
};



/* ─── Main Page ────────────────────────────────────────────────────── */

const AllyAnnex = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTier, setActiveTier] = useState(0); // 0 = all

  useEffect(() => {
    document.title = 'Ally Annex — SOE Rhythm Quest';
  }, []);

  const filtered = useMemo(() => {
    return PARTNERS.filter(p => {
      const catMatch = activeCategory === 'all' || p.cat === activeCategory;
      const tierMatch = activeTier === 0 || p.tier === activeTier;
      return catMatch && tierMatch;
    });
  }, [activeCategory, activeTier]);

  const grouped = useMemo(() => {
    const groups = { 1: [], 2: [], 3: [] };
    filtered.forEach(p => groups[p.tier].push(p));
    return groups;
  }, [filtered]);

  return (
    <div className="annex-page">
      <JsonLd data={productsSchema()} />
      {/* ── Hero ── */}
      <header className="annex-hero">
        <div className="scene-backdrop" aria-hidden="true">
          <img
            src={assetPath('/assets/marketing/quest-collage.webp')}
            alt=""
            className="scene-backdrop__img"
          />
          <div className="scene-backdrop__scrim" />
        </div>
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up">
            <div className="section-label">The Ally Annex</div>
            <h1>
              Curated Solutions for Your{' '}
              <span className="text-gold">Learning Sanctuary</span>
            </h1>
            <p className="section-subtitle" style={{ margin: '1rem auto', maxWidth: '680px' }}>
              Every product in this annex has been carefully selected and vetted
              to provide your family with the best tools for the Rhythm Quest.
            </p>
          </div>
        </div>
      </header>



      {/* ── Filter Bar ── */}
      <section className="section">
        <div className="container">
          <div className="animate-fade-up">
            <div className="section-label">Our Allies</div>
            <h2 className="text-center">
              17 Vetted{' '}
              <span className="text-gold">Partners</span>
            </h2>
          </div>

          {/* Category Filter — always visible, not reveal-gated */}
          <div className="annex-filters">
            <div className="annex-filter-group">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  className={`annex-filter-btn ${activeCategory === c.key ? 'annex-filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(c.key)}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="annex-filter-group annex-filter-group--tiers">
              {[0, 1, 2, 3].map(t => (
                <button
                  key={t}
                  className={`annex-filter-btn annex-filter-btn--tier ${activeTier === t ? 'annex-filter-btn--active' : ''}`}
                  onClick={() => setActiveTier(t)}
                >
                  {t === 0 ? 'All Tiers' : `Tier ${t}`}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Grid — grouped by tier, always rendered */}
          {[1, 2, 3].map(tier => {
            const partners = grouped[tier];
            if (!partners.length) return null;
            return (
              <div key={tier} className="annex-tier-section">
                <div className="annex-tier-header">
                  <h3>{TIER_LABELS[tier].label}</h3>
                  <p>{TIER_LABELS[tier].desc}</p>
                </div>
                <div className="annex-grid">
                  {partners.map(p => (
                    <PartnerCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="annex-empty">
              <p>No allies match the current filters. Try broadening your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section glow-gold">
        <div className="container text-center">
          <div className="animate-fade-up">
            <h2>
              Ready to Build Your{' '}
              <span className="text-gold">Learning Sanctuary</span>?
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '560px', margin: '0.5rem auto 2rem' }}>
              Start with the free Teacher's Guide and discover how the SOE ecosystem
              supports every dimension of your child's development.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/join" className="btn btn--primary">
                Join the Quest →
              </Link>
              <Link to="/listen" className="btn btn--outline">
                Explore Media Room
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllyAnnex;
