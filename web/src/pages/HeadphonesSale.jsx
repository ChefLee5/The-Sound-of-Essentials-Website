import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import { trackInitiateCheckout } from '../utils/analytics';
import './HeadphonesSale.css';

const STRIPE_HEADPHONES_URL = 'https://buy.stripe.com/test_cNi6oH01eacl8gC5IC6Vq07';
const STRIPE_BUNDLE_URL = 'https://buy.stripe.com/test_28E00j9BOacldAWc706Vq08';
const TIKTOK_SHOP_URL = 'https://www.tiktok.com/@soe.learn';

const COLOR_VARIANTS = [
  { id: 'terrasol', name: 'Ventura Orange', color: '#FF6F00', land: 'Ventura' },
  { id: 'aquaria', name: 'Aquaria Ocean', color: '#2563EB', land: 'Aquaria' },
  { id: 'celestia', name: 'Celestia Violet', color: '#9333EA', land: 'Celestia' },
  { id: 'vitalis', name: 'Terrasol Sage', color: '#16A34A', land: 'Terrasol' },
];

const FEATURES = [
  {
    icon: '🛡️',
    title: '85dB Volume Safety Limiter',
    desc: 'Strictly capped at 85 decibels in compliance with the World Health Organization (WHO) and American Academy of Pediatrics to prevent acoustic fatigue and protect fragile young eardrums.',
  },
  {
    icon: '🌀',
    title: 'Indestructible EVA Flex-Foam',
    desc: 'Crafted from super-pliable, non-toxic EVA foam. Twist it 360 degrees, drop it on tile, bend the headband backwards — it immediately snaps back into shape. 100% toddler proof.',
  },
  {
    icon: '🔌',
    title: 'Zero-Radiation Wired Acoustic Jack',
    desc: 'No Bluetooth microwave EMF radiation, no rechargeable lithium batteries, and no dead-battery mid-trip meltdowns. Pure analog acoustic resonance through a tangle-free braided 3.5mm cord.',
  },
  {
    icon: '👥',
    title: 'Dual SharePort Co-Listening Jack',
    desc: 'Features a built-in auxiliary pass-through port directly on the ear cup. Connect a second pair of headphones with zero splitters so siblings or parent and child can listen together.',
  },
  {
    icon: '☁️',
    title: 'Hypoallergenic Breathable Pillows',
    desc: 'Engineered specifically for sensory-sensitive and neurodivergent children. Ultra-soft protein leather ear cushions that never pinch or overheat delicate ear cartilage.',
  },
  {
    icon: '🎵',
    title: 'Paired to The 19-Track Album',
    desc: 'Fine-tuned frequency curve optimized for clear vocal articulation and phonetic clarity across all 19 tracks of The Sound of Essentials: Rhythm Quest.',
  },
];

const HeadphonesSale = () => {
  const [selectedVariant, setSelectedVariant] = useState(COLOR_VARIANTS[0]);

  const handleCheckoutClick = (sku, name, price) => {
    trackInitiateCheckout({ sku, name, price });
  };

  return (
    <div className="hp-page">
      <div className="hp-container">
        {/* ── Breadcrumb ── */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#786454' }}>
          <Link to="/" style={{ color: '#FF6F00', textDecoration: 'none', fontWeight: 600 }}>Home</Link> &gt; 
          <span style={{ marginLeft: '0.5rem' }}>Sensory Headphones</span>
        </div>

        {/* ── Main Product Hero ── */}
        <section className="hp-hero">
          {/* Left: Interactive Visual & Color Selector */}
          <div className="hp-visual-card">
            <div className="hp-visual-glow" />
            
            <div className="hp-art-wrap">
              <img
                src={assetPath('/assets/marketing/sensory-kids-headphones.jpg')}
                alt="Sound of Essentials Safe Sensory Kids Headphones (85dB Max)"
                className="hp-art-img"
              />
            </div>

            <div className="hp-variants">
              {COLOR_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  className={`hp-color-pill ${selectedVariant.id === v.id ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  <span className="hp-dot" style={{ backgroundColor: v.color }} />
                  <span>{v.name}</span>
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.85rem', color: '#786454', fontStyle: 'italic' }}>
              Selected Edition: <strong>{selectedVariant.name}</strong> ({selectedVariant.land} Land Edition)
            </p>
          </div>

          {/* Right: Product Details & Buying Controls */}
          <div>
            <div className="hp-badge-row">
              <span className="hp-badge hp-badge--safety">🛡️ 85dB WHO Safe Standard</span>
              <span className="hp-badge hp-badge--tiktok">🎵 TikTok Shop Official</span>
              <span className="hp-badge">Ages 2–7 Verified</span>
            </div>

            <h1 className="hp-title">
              Safe Sensory Kids Headphones
              <span className="hp-title-highlight"> "Just Add Sound."</span>
            </h1>

            <p className="hp-subtitle">
              Engineered specifically for little ears. Indestructible twistable EVA flex-foam, 
              zero-radiation wired listening, hypoallergenic sensory ear cushions, and built-in 
              SharePort daisy-chaining for shared family discovery.
            </p>

            <div className="hp-pricing-box">
              <div className="hp-price-row">
                <span className="hp-price-current">$24.99</span>
                <span className="hp-price-compare">$34.99</span>
                <span className="hp-price-savings">SAVE 30%</span>
              </div>

              <div className="hp-shipping-note">
                <span>📦</span> Free Fast Standard Shipping (US &amp; Canada)
              </div>

              <div className="hp-cta-group">
                <a
                  href={STRIPE_HEADPHONES_URL}
                  className="btn-stripe-pay"
                  onClick={() => handleCheckoutClick('SOE-HP-85DB', 'Sensory Kids Headphones', 24.99)}
                >
                  <span>⚡ Order with Stripe Checkout</span>
                  <span style={{ opacity: 0.9, fontSize: '0.95rem' }}>($24.99)</span>
                </a>

                <a
                  href={TIKTOK_SHOP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tiktok-shop"
                >
                  <span className="tiktok-icon">🎵</span>
                  <span>Buy on TikTok Shop</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.75, marginLeft: 'auto' }}>@soe.learn ↗</span>
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', color: '#5C4A3A', fontSize: '0.9rem' }}>
              <div>✔ 30-Day Sanctuary Guarantee</div>
              <div>✔ Universal 3.5mm Jack (iPad / Tablet)</div>
              <div>✔ No Batteries Needed</div>
            </div>
          </div>
        </section>

        {/* ── 6 Core Sensory Highlights ── */}
        <section className="hp-grid-section">
          <h2 className="hp-section-title">Built for Little Brains, Not Algorithms</h2>
          <p className="hp-section-subtitle">
            Why pediatric audiologists and mindful educators prefer volume-limited wired listening 
            for early linguistic phonics and sound immersion.
          </p>

          <div className="hp-features-grid">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="hp-feature-card">
                <div className="hp-feature-icon">{feat.icon}</div>
                <h3 className="hp-feature-title">{feat.title}</h3>
                <p className="hp-feature-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Complete Curriculum Bundle Callout ── */}
        <section className="hp-bundle-banner">
          <div>
            <span className="hp-bundle-badge">🌟 Best Value Starter Pack</span>
            <h2 className="hp-bundle-title">Sensory Listening &amp; 8-Week Readiness Bundle</h2>
            <p className="hp-bundle-desc">
              Everything your child needs for a complete screen-free learning revolution:
              Get the <strong>85dB Safe Sensory Headphones</strong> shipped to your door, 
              paired with the full-color physical <strong>Rhythm Ready 8-Week Workbook</strong> 
              (~400 activities across all 7 Lands) and instant album access.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: '#5C4A3A', lineHeight: 1.8 }}>
              <li>✔ 85dB Safe Sensory Headphones ($34.99 value)</li>
              <li>✔ Physical 8-Week Rhythm Ready Workbook ($35.00 value)</li>
              <li>✔ Dual SharePort Audio Cable included</li>
              <li>✔ Free 19-Track Album Streaming &amp; Lyrics</li>
            </ul>
          </div>

          <div className="hp-bundle-card">
            <span style={{ fontSize: '0.9rem', color: '#786454', textTransform: 'uppercase', fontWeight: 700 }}>Bundle Deal</span>
            <div style={{ margin: '0.75rem 0' }}>
              <span className="hp-bundle-price">$39</span>
              <span className="hp-bundle-retail">$69.99</span>
            </div>
            <p style={{ color: '#16A34A', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Save $30.99 + Free Shipping
            </p>
            <a
              href={STRIPE_BUNDLE_URL}
              className="btn-stripe-pay"
              style={{ width: '100%' }}
              onClick={() => handleCheckoutClick('SOE-HP-WB-BUNDLE', 'Headphones + Workbook Bundle', 39.00)}
            >
              Get The Bundle · $39 →
            </a>
          </div>
        </section>

        {/* ── Creator Sample Program for TikTok Shop Affiliates ── */}
        <section className="hp-creator-box">
          <div className="hp-creator-text">
            <h3>Are you a TikTok Creator or Homeschool Parent?</h3>
            <p>
              Join the Sound of Essentials TikTok Shop Affiliate program! We ship complimentary 
              sample headphone kits to parenting, homeschool, and early childhood creators. 
              Earn up to 20% commission on every verified sale.
            </p>
          </div>
          <div>
            <Link to="/join#contact" className="btn-creator-sample">
              <span>Request Free Creator Sample</span>
              <span>↗</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeadphonesSale;
