import React from 'react';
import { Link } from 'react-router-dom';

/**
 * FooterV2 — Minimal sparse footer (kaikaku-style).
 *
 * Three small columns (Social, Pages, Resources) + CTA link on right.
 * Dark background for contrast against light pages.
 */
const FooterV2 = () => {
  return (
    <footer className="v2-footer">
      <div className="v2-container">
        <div className="v2-footer__grid">
          {/* Column 1: Social */}
          <div className="v2-footer__col">
            <div className="v2-footer__col-title">Social</div>
            <a href="https://www.instagram.com/thesoundofessentials" target="_blank" rel="noopener noreferrer" className="v2-footer__link">Instagram</a>
            <a href="https://www.youtube.com/@TheSoundofEssentials" target="_blank" rel="noopener noreferrer" className="v2-footer__link">YouTube</a>
            <a href="https://www.tiktok.com/@soe.learn" target="_blank" rel="noopener noreferrer" className="v2-footer__link">TikTok</a>
          </div>

          {/* Column 2: Pages */}
          <div className="v2-footer__col">
            <div className="v2-footer__col-title">Explore</div>
            <Link to="/v2/heroes" className="v2-footer__link">Heroes</Link>
            <Link to="/v2/listen" className="v2-footer__link">Listen</Link>
            <Link to="/v2/science" className="v2-footer__link">Science</Link>
          </div>

          {/* Column 3: Resources */}
          <div className="v2-footer__col">
            <div className="v2-footer__col-title">Resources</div>
            <Link to="/v2/mission" className="v2-footer__link">Mission</Link>
            <Link to="/v2/join" className="v2-footer__link">Join</Link>
            <a href="mailto:info@soelearn.com" className="v2-footer__link">Contact: info@soelearn.com</a>
          </div>

          {/* Right: CTA */}
          <div className="v2-footer__cta">
            <Link to="/v2/join" className="v2-footer__cta-link">
              JOIN THE QUEST →
            </Link>
          </div>
        </div>

        <div className="v2-footer__bottom">
          © {new Date().getFullYear()} The Sound of Essentials. Designed by relentless educators and sheer love.
        </div>
      </div>
    </footer>
  );
};

export default FooterV2;
