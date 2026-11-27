import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assetPath } from '../utils/assetPath';
import { SoeIcon, SoeBrandLogo, LandIcon } from './ui/SoeIcon';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img
                src={assetPath('/assets/soe-official-logo-96.webp')}
                alt="SOE Logo"
                width="36"
                height="36"
                loading="lazy"
                decoding="async"
                className="footer__logo-img"
              />
              <span>Sound of Essentials: <span className="logo-accent-cursive">Rhythm Quest</span></span>
            </div>
            <p className="footer__tagline">{t('footer.tagline')}</p>
            <div className="footer__social">
              <a href="https://youtube.com/@soundofessentials" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <SoeBrandLogo name="youtube" size={20} />
                <span className="sr-only">YouTube</span>
              </a>
              <a href="https://www.tiktok.com/@soe.learn" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <SoeBrandLogo name="tiktok" size={18} />
                <span className="sr-only">TikTok</span>
              </a>
              <a href="https://instagram.com/soundofessentials" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <SoeBrandLogo name="instagram" size={18} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>

            {/* Direct Email Badge */}
            <div className="footer__email-badge">
              <a href="mailto:info@soelearn.com" className="footer__email-pill" title="Email us directly">
                <SoeIcon name="messaging-mail" size={15} />
                <span>info@soelearn.com</span>
              </a>
            </div>
          </div>

          {/* Curriculum Lands Directory */}
          <div className="footer__col">
            <h3 className="footer__heading">Curriculum Lands</h3>
            <Link to="/heroes#harmonia" className="footer__link"><LandIcon landId="harmonia" variant="normal" tinted={false} size={15} /> Harmonia (Language)</Link>
            <Link to="/heroes#numeria" className="footer__link"><LandIcon landId="numeria" variant="normal" tinted={false} size={15} /> Numeria (Math)</Link>
            <Link to="/heroes#vitalis" className="footer__link"><LandIcon landId="vitalis" variant="normal" tinted={false} size={15} /> Vitalis (Movement)</Link>
            <Link to="/heroes#luminosity" className="footer__link"><LandIcon landId="luminosity" variant="normal" tinted={false} size={15} /> Luminosity (Civics)</Link>
            <Link to="/heroes#aquaria" className="footer__link"><LandIcon landId="aquaria" variant="normal" tinted={false} size={15} /> Aquaria (Emotional Calm)</Link>
            <Link to="/heroes#terrasol" className="footer__link"><LandIcon landId="terrasol" variant="normal" tinted={false} size={15} /> Terrasol (Science)</Link>
            <Link to="/heroes#celestia" className="footer__link"><LandIcon landId="celestia" variant="normal" tinted={false} size={15} /> Celestia (Time)</Link>
          </div>

          {/* Shop & Quest Products (Prices Stripped to Prevent SERP Disqualification) */}
          <div className="footer__col">
            <h3 className="footer__heading">Core Products</h3>
            <Link to="/listen" className="footer__link"><SoeIcon name="senses-ear" size={15} /> The 19-Track Album</Link>
            <Link to="/rhythm-ready" className="footer__link"><SoeIcon name="documents-book-bookmark" size={15} /> Rhythm Ready Workbook</Link>
            <Link to="/workbook#dictionary-presale" className="footer__link"><SoeIcon name="documents-library" size={15} /> Essential Picture Dictionary</Link>
            <Link to="/listen" className="footer__link"><SoeIcon name="tools-star" size={15} /> Quest Starter Bedtime Kit</Link>
            <Link to="/gallery" className="footer__link"><SoeIcon name="playback-images" size={15} /> Storybook Gallery</Link>
          </div>

          {/* Research & Standards Authority */}
          <div className="footer__col">
            <h3 className="footer__heading">Research &amp; Standards</h3>
            <Link to="/resources" className="footer__link"><SoeIcon name="documents-library" size={15} /> Learning Library</Link>
            <Link to="/science" className="footer__link"><SoeIcon name="metrics-activity" size={15} /> Sound Before Symbol</Link>
            <Link to="/solutions" className="footer__link"><SoeIcon name="layouts-columns-3" size={15} /> Head Start &amp; NAEYC</Link>
            <Link to="/institutions" className="footer__link"><SoeIcon name="tools-house" size={15} /> School &amp; Clinic Licensing</Link>
            <Link to="/institutions" className="footer__link"><SoeIcon name="senses-hand" size={15} /> Institutional Advocacy</Link>
            <Link to="/mission" className="footer__link"><SoeIcon name="tools-map" size={15} /> Our Mission</Link>
          </div>

          {/* Stay Connected */}
          <div className="footer__col">
            <h3 className="footer__heading">{t('footer.stay_connected')}</h3>
            <p className="footer__newsletter-text">{t('footer.weekly_activities')}</p>
            <div className="footer__btn-group">
              <Link
                to="/join"
                className="footer__subscribe-btn"
              >
                {t('footer.subscribe')}
              </Link>
              <a
                href="mailto:info@soelearn.com"
                className="footer__contact-us-btn"
                title="Send an email to info@soelearn.com"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <SoeIcon name="messaging-mail" size={15} />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-info">
            <p>© {new Date().getFullYear()} The Sound of Essentials: <span className="logo-accent-cursive">Rhythm Quest</span>. {t('footer.all_rights_reserved')}</p>
            <p className="footer__compliance-notice" style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.35rem' }}>
              The Sound of Essentials · P.O. Box 724 · New York, NY 10027 · info@soelearn.com
            </p>
          </div>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link to="/dmca" className="footer__bottom-link">DMCA Notice</Link>
            <a href="mailto:info@soelearn.com" className="footer__bottom-link footer__bottom-email" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <SoeIcon name="messaging-mail" size={13} />
              <span>info@soelearn.com</span>
            </a>
            <Link to="/join" className="footer__bottom-link">{t('navbar.contact', 'Contact Us')}</Link>
            <Link to="/mission" className="footer__bottom-link">{t('navbar.mission')}</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ──────────────────────────────────────────────
           Footer — Bright & Playful redesign
           Replaces the old dark purple→blue gradient
           with a clean warm white, perfectly on-brand.
        ────────────────────────────────────────────── */

        .site-footer {
          background-color: #FF6F00;
          background-image: linear-gradient(135deg, #FFA726 0%, #FF5722 100%);
          border-top: none;
          padding: 4rem 0 2rem 0;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        /* Decorative light blob top-right */
        .site-footer::after {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Rainbow accent strip */
        .site-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg,
            #4CAF50,
            #29B6F6,
            #7B1FA2,
            #FF6F00
          );
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.1fr 1.2fr;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }

        .footer__brand {
          max-width: 320px;
        }

        .footer__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer__logo span {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.15rem;
          color: #ffffff;
        }

        .footer__logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
        }

        .footer__tagline {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.7);
          font-style: italic;
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }

        .footer__social {
          display: flex;
          gap: 0.6rem;
        }

        .footer__social a {
          color: #2B2016;
          transition: all var(--transition-med);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.92);
          border: 1.5px solid rgba(255,255,255,0.65);
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }

        .footer__social a:hover {
          background: #ffffff;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }

        .footer__email-badge {
          margin-top: 1.1rem;
        }

        .footer__email-pill {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.16);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          padding: 0.5rem 0.95rem;
          border-radius: var(--radius-xl, 99px);
          font-family: var(--font-display, inherit);
          font-weight: 700;
          font-size: 0.82rem;
          text-decoration: none;
          transition: all var(--transition-med, 0.25s ease);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .footer__email-pill:hover {
          background: #ffffff;
          color: #FF6F00;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .footer__col {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .footer__heading {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.4rem;
        }

        .footer__link {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.85);
          transition: color var(--transition-med);
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 0.25rem 0;
          gap: 0.35rem;
        }

        .footer__link:hover {
          color: #ffffff;
        }

        .footer__newsletter-text {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 0.25rem;
        }

        .footer__btn-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: 0.4rem;
        }

        .footer__subscribe-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.65rem 1.4rem;
          background: linear-gradient(135deg, var(--color-green), var(--color-blue));
          color: #fff;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: var(--radius-xl);
          text-decoration: none;
          transition: all var(--transition-med);
          width: fit-content;
          box-shadow: 0 4px 12px var(--color-green-soft);
        }

        .footer__subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(76,175,80,0.25);
        }

        .footer__contact-us-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0.6rem 1.25rem;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.82rem;
          border-radius: var(--radius-xl);
          text-decoration: none;
          transition: all var(--transition-med);
          width: fit-content;
        }

        .footer__contact-us-btn:hover {
          background: #ffffff;
          color: var(--color-orange, #FF6F00);
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .footer__bottom-email {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.15);
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .footer__bottom > p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
          max-width: none;
        }

        .footer__bottom-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.25rem;
        }

        .footer__bottom-link {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 0.25rem 0.15rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.72);
          transition: color var(--transition-med);
        }

        .footer__bottom-link:hover {
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 600px) {
          .footer__grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .footer__brand {
            max-width: 100%;
          }
          .footer__bottom {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .footer__bottom-links {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          body.has-sticky-cta .site-footer {
            padding-bottom: calc(5.5rem + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
