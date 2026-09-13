import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetPath } from '../utils/assetPath';

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Dark-background pages (none currently, player is now bright & playful)
  const isDark = false;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { to: '/',           label: t('navbar.home') },
    { to: '/heroes',     label: t('navbar.heroes') },
    { to: '/science',    label: t('navbar.science') },
    { to: '/listen',     label: t('navbar.media') },
    { to: '/workbook',   label: '📘 Workbook' },
    { to: '/headphones', label: '🎧 Headphones' },
    { to: '/gallery',    label: '📖 Gallery' },
    { to: '/join',       label: '✉️ ' + t('navbar.contact', 'Contact') },
  ];

  const isActive = (to) =>
    to === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(to);

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isDark ? 'navbar--dark' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* ── Logo ── */}
      <Link to="/" className="navbar__logo" aria-label={t('app_title')}>
        <div className="navbar__logo-icon-wrap">
          <img
            src={assetPath('/assets/soe-official-logo.webp')}
            alt="The Sound of Essentials Official Logo"
            className="navbar__logo-img"
          />
          <div className="navbar__logo-sparkle" aria-hidden="true">✨</div>
        </div>
        <span className="navbar__logo-wordmark">
          <span className="navbar__logo-soe">The Sound of Essentials</span>
          <span className="navbar__logo-sub">A Musical Learning Experience</span>
          <span className="navbar__logo-shine" aria-hidden="true" />
        </span>
      </Link>

      {/* ── Desktop center links ── */}
      <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
        {/* Mobile-only header inside the drawer */}
        <div className="navbar__drawer-header">
          <span className="navbar__drawer-title">Menu</span>
          <button
            className="navbar__drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`navbar__link ${isActive(to) ? 'navbar__link--active' : ''}`}
            aria-current={isActive(to) ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}

        {/* CTA inside mobile drawer */}
        <Link to="/listen" className="navbar__cta-btn navbar__cta-btn--mobile">
          🎧 Listen Free
        </Link>
      </div>

      {/* ── Right controls ── */}
      <div className="navbar__right">
        <Link to="/listen" className="navbar__cta-btn">
          🎧 Listen Free
        </Link>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('navbar.toggle_menu')}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className="navbar__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <style>{`
        /* ─────────────────────────────────────────
           Navbar — Bricolage Grotesque / Learnify-style
        ───────────────────────────────────────── */

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(1.5rem, 5vw, 3rem);
          height: 68px;
          transition: background 0.35s ease, box-shadow 0.35s ease, height 0.35s ease;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .navbar--scrolled {
          height: 60px;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.09), 0 4px 24px rgba(0,0,0,0.07);
        }

        /* ── Logo ── */
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          flex-shrink: 0;
        }

        .navbar__logo-icon-wrap {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }

        .navbar__logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 8px;
          transition: transform 0.25s ease;
        }

        .navbar__logo:hover .navbar__logo-img {
          transform: rotate(-4deg) scale(1.08);
        }

        /* ── Sparkle on icon ── */
        .navbar__logo-sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.7rem;
          opacity: 0;
          transform: scale(0.3);
          pointer-events: none;
          animation: logoSparkle 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        @keyframes logoSparkle {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          15% { opacity: 1; transform: scale(1.2) rotate(15deg); }
          30% { opacity: 0; transform: scale(0.3) rotate(30deg); }
        }

        .navbar__logo-wordmark {
          display: flex;
          flex-direction: column;
          line-height: 1;
          gap: 1px;
          position: relative;
          overflow: hidden;
        }

        .navbar__logo-soe {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          background: linear-gradient(90deg, var(--color-orange), var(--color-green), var(--color-blue), var(--color-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
        }

        .navbar__logo-sub {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.58rem;
          letter-spacing: 0.025em;
          background: linear-gradient(90deg, var(--color-green), var(--color-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* ── Shimmer sweep across wordmark ── */
        .navbar__logo-shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.8) 45%,
            rgba(255, 255, 255, 0.95) 50%,
            rgba(255, 255, 255, 0.8) 55%,
            transparent 65%,
            transparent 100%
          );
          background-size: 250% 100%;
          background-position: 200% center;
          animation: logoShine 4s ease-in-out infinite;
          animation-delay: 2s;
          mix-blend-mode: overlay;
        }

        @keyframes logoShine {
          0%   { background-position: 200% center; }
          20%  { background-position: -50% center; }
          100% { background-position: -50% center; }
        }

        /* ── Center nav links ── */
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }

        /* Drawer header — mobile only */
        .navbar__drawer-header {
          display: none;
        }

        .navbar__link {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--color-orange);
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          text-decoration: none;
          letter-spacing: -0.01em;
          transition: color 0.2s ease, background 0.2s ease;
          position: relative;
          white-space: nowrap;
        }

        .navbar__link:hover {
          color: var(--color-green);
          background: var(--color-green-soft);
        }

        .navbar__link--active {
          color: var(--color-blue);
          font-weight: 700;
        }

        .navbar__link--active::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 0.7rem;
          right: 0.7rem;
          height: 2.5px;
          background: linear-gradient(90deg, var(--color-green), var(--color-blue));
          border-radius: 99px;
        }

        /* Hide mobile-only CTA on desktop */
        .navbar__cta-btn--mobile {
          display: none;
        }

        /* ── Right controls ── */
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .navbar__cta-btn {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: -0.01em;
          color: #fff;
          background: linear-gradient(135deg, var(--color-green), var(--color-blue));
          padding: 0.5rem 1.3rem;
          border-radius: 99px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(76,175,80,0.3);
        }

        .navbar__cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.35);
        }

        /* ── Hamburger ── */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          min-width: 44px;
          min-height: 44px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 8px;
          transition: background 0.2s;
          z-index: 1001;
          position: relative;
        }

        .navbar__hamburger:hover {
          background: rgba(0,0,0,0.06);
        }

        .navbar__hamburger span {
          width: 22px;
          height: 2px;
          background: var(--color-text-primary);
          border-radius: 2px;
          display: block;
          transition: all 0.3s ease;
        }

        .navbar__hamburger--open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .navbar__hamburger--open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .navbar__hamburger--open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* ── Backdrop (mobile overlay) ── */
        .navbar__backdrop {
          display: none;
        }

        /* ── Mobile ── */
        @media (max-width: 840px) {
          .navbar {
            padding: max(0.5rem, env(safe-area-inset-top, 0px)) 1rem 0.5rem 1rem;
          }

          .navbar__links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            height: 100dvh;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 0.25rem;
            padding: max(1.25rem, env(safe-area-inset-top, 0px)) 1.5rem max(2rem, env(safe-area-inset-bottom, 0px));
            background: #fff;
            box-shadow: -8px 0 40px rgba(0,0,0,0.15);
            transition: right 0.38s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .navbar__links--open {
            right: 0;
          }

          /* Drawer header */
          .navbar__drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0.5rem 0 1rem;
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--color-border);
          }

          .navbar__drawer-title {
            font-family: var(--font-display);
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-text-muted);
          }

          .navbar__drawer-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--color-text-secondary);
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: background 0.2s;
          }

          .navbar__drawer-close:hover {
            background: rgba(0,0,0,0.06);
          }

          .navbar__link {
            font-size: 1.05rem;
            width: 100%;
            min-height: 44px;
            display: flex;
            align-items: center;
            padding: 0.65rem 0.75rem;
            border-radius: 10px;
          }

          /* Mobile CTA inside drawer */
          .navbar__cta-btn--mobile {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-top: 1.25rem;
            min-height: 48px;
            padding: 0.85rem;
            font-size: 1rem;
          }

          .navbar__hamburger {
            display: flex;
          }

          /* Hide desktop CTA on mobile */
          .navbar__cta-btn:not(.navbar__cta-btn--mobile) {
            display: none;
          }

          /* Backdrop */
          .navbar__backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 999;
            animation: backdropFade 0.2s ease;
          }

          @keyframes backdropFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }

        @media (max-width: 1024px) and (min-width: 841px) {
          .navbar__link {
            font-size: 0.82rem;
            padding: 0.4rem 0.55rem;
          }
        }

        /* ═══════════════════════════════════════
           Dark Variant — Player page
           ═══════════════════════════════════════ */
        .navbar--dark {
          background: rgba(10, 6, 4, 0.6);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .navbar--dark.navbar--scrolled {
          background: rgba(10, 6, 4, 0.92);
          box-shadow: 0 1px 0 rgba(255,200,120,0.08), 0 4px 24px rgba(0,0,0,0.4);
        }

        /* Logo text */
        .navbar--dark .navbar__logo-soe {
          background: linear-gradient(90deg, #FFB74D, #FFD54F, #FFF8E1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar--dark .navbar__logo-sub {
          background: linear-gradient(90deg, rgba(255,200,120,0.7), rgba(255,213,79,0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Nav links */
        .navbar--dark .navbar__link {
          color: rgba(255,200,120,0.75);
        }

        .navbar--dark .navbar__link:hover {
          color: #FFD54F;
          background: rgba(255,200,120,0.1);
        }

        .navbar--dark .navbar__link--active {
          color: #FFB74D;
        }

        .navbar--dark .navbar__link--active::after {
          background: linear-gradient(90deg, #FF8F00, #FFD54F);
        }

        /* CTA button */
        .navbar--dark .navbar__cta-btn {
          background: linear-gradient(135deg, #FF8F00, #FFB74D);
          color: #1a0f00;
          box-shadow: 0 2px 10px rgba(255,143,0,0.3);
        }

        .navbar--dark .navbar__cta-btn:hover {
          box-shadow: 0 6px 20px rgba(255,143,0,0.4);
        }

        /* Hamburger bars */
        .navbar--dark .navbar__hamburger span {
          background: #FFB74D;
        }

        .navbar--dark .navbar__hamburger:hover {
          background: rgba(255,200,120,0.1);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
