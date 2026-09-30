import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * NavbarV2 — Floating kaikaku-style navigation.
 *
 * Corner-positioned elements:
 *   Top-left: Brand logo + name
 *   Top-right: Vertical nav links (desktop) / hamburger (mobile)
 *   Bottom-left: Age range + language + socials
 *   Bottom-right: Brand tagline
 */
const NavbarV2 = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const BASE = import.meta.env.BASE_URL;

  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const links = [
    { to: '/v2/universe', label: 'UNIVERSE' },
    { to: '/v2/listen',   label: 'LISTEN' },
    { to: '/v2/science',  label: 'SCIENCE' },
    { to: '/v2/heroes',   label: 'HEROES' },
    { to: '/v2/join',     label: 'JOIN' },
  ];

  const isActive = (path) => location.pathname === path;

  const cycleLang = useCallback(() => {
    const langs = ['en', 'es', 'fr'];
    const idx = langs.indexOf(i18n.language);
    i18n.changeLanguage(langs[(idx + 1) % langs.length]);
  }, [i18n]);

  const langFlag = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷' }[i18n.language] || '🇺🇸';

  return (
    <nav className="v2-nav" role="navigation" aria-label="Main navigation">
      {/* ── Top-left: Brand ── */}
      <Link to="/v2" className="v2-nav__brand" onClick={closeMobile}>
        <img
          src={`${BASE}assets/soe-logo.webp`}
          alt="SOE"
          className="v2-nav__logo"
        />
        <div className="v2-nav__brand-text">
          THE SOUND OF ESSENTIALS
          <span>RHYTHM QUEST</span>
        </div>
      </Link>

      {/* ── Top-right: Desktop links ── */}
      <ul className="v2-nav__links">
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`v2-nav__link ${isActive(link.to) ? 'v2-nav__link--active' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Bottom-left: Metadata ── */}
      <div className="v2-nav__meta-left">
        <span>Ages 2–7</span>
        <span>·</span>
        <button
          onClick={cycleLang}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
          aria-label="Change language"
        >
          {langFlag} {i18n.language.toUpperCase()}
        </button>
      </div>

      {/* ── Bottom-right: Tagline ── */}
      <div className="v2-nav__tagline">
        DESIGNED FOR THE DEVELOPING BRAIN
      </div>

      {/* ── Mobile hamburger ── */}
      <button
        className="v2-nav__hamburger"
        onClick={toggleMobile}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <span className="v2-nav__hamburger-line" />
        <span className="v2-nav__hamburger-line" />
        <span className="v2-nav__hamburger-line" />
      </button>

      {/* ── Mobile overlay ── */}
      <div className={`v2-nav__overlay ${mobileOpen ? 'is-open' : ''}`}>
        <button className="v2-nav__overlay-close" onClick={closeMobile} aria-label="Close menu">
          ✕
        </button>
        <Link to="/v2" className="v2-nav__overlay-link" onClick={closeMobile}>HOME</Link>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="v2-nav__overlay-link"
            onClick={closeMobile}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={cycleLang}
          className="v2-nav__overlay-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {langFlag} {i18n.language.toUpperCase()}
        </button>
      </div>
    </nav>
  );
};

export default NavbarV2;
