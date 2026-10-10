import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import FullSection from '../components-v2/FullSection';
import CharSplitText from '../components-v2/CharSplitText';
import { RevealV2 } from '../hooks/useScrollReveal';
import PhilanthropicDonationSection from '../components/PhilanthropicDonationSection';

const SECTIONS = [
  {
    heading: 'Building a Sanctuary',
    paras: [
      'The Sound of Essentials was born from a simple refusal: children deserve better than content built to maximize watch-time. We set out to build a sanctuary instead — a calm, neuro-affirming world where learning is the point, not the bait.',
      'Every song, hero, and land exists to serve one child at one moment, learning one thing. Nothing is engineered to keep them scrolling. Everything is engineered to help them grow.',
    ],
  },
  {
    heading: 'A World, Not a Worksheet',
    paras: [
      'We could have made flashcards. Instead we built a universe — seven lands, fifteen heroes, and a guardian who watches over them all. Because a concept lived inside a story is a concept a child carries for life.',
      'Numeria counts in beats. Harmonia speaks in melody. Vitalis moves. Each land turns an abstract domain into a place a child can visit, again and again, until it feels like home.',
    ],
  },
  {
    heading: 'The Equitable Exchange',
    paras: [
      'We do not treat music as background filler. We record acoustic songs that soothe the nervous system and help young minds focus. Our front door is a complete 19-track album, gifted freely to every family, because sensory learning should never be locked behind a paywall.',
      'When parents choose to bring our physical companion storybook and workbooks into their homes, it is an honest exchange for something tangible that protects their child from screen fatigue. Apps fade, algorithms shift, and hardware breaks down. Acoustic music and shared stories stay in the home for generations.',
    ],
  },
  {
    heading: 'Made by Educators, for Families',
    paras: [
      'This is not a tech company’s side quest. It is the work of teachers, parents, musicians, and clinicians who care about how the youngest minds actually develop — crafted by a father’s heart and a mother’s love, and measured in mastered concepts rather than minutes watched.',
      'We are just getting started. The quest grows with every family who joins it.',
    ],
  },
];

const MissionV2 = () => {
  useEffect(() => {
    document.title = 'Our Mission — SOE Rhythm Quest';
  }, []);

  return (
    <div className="mission-v2">
      {/* ── Hero ── */}
      <FullSection
        bg={assetPath('/assets/marketing/quest-complete.webp')}
        overlay="light"
        kenBurns
      >
        <div className="v2-container v2-text-center">
          <RevealV2>
            <span className="v2-label">Why we exist</span>
          </RevealV2>
          <CharSplitText tag="h1" className="v2-display v2-display--section" stagger={26}>
            Designed for the Developing Brain
          </CharSplitText>
        </div>
        <div className="v2-scroll-hint">↓</div>
      </FullSection>

      {/* ── Manifesto chapters ── */}
      {SECTIONS.map((s, i) => (
        <section
          key={s.heading}
          className={`v2-section ${i % 2 === 1 ? 'v2-section--alt' : ''}`}
        >
          <div className="v2-container">
            <RevealV2>
              <div className="v2-split">
                <div className="v2-split__left">
                  <CharSplitText tag="h2" className="v2-display v2-display--section" stagger={18}>
                    {s.heading}
                  </CharSplitText>
                </div>
                <div className="v2-split__right">
                  {s.paras.map((p, j) => (
                    <p key={j} className={j === 0 ? 'v2-body v2-body--lg' : 'v2-body'}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </RevealV2>
          </div>
        </section>
      ))}

      {/* ── Pull quote ── */}
      <section className="v2-quote-section v2-section--sage">
        <CharSplitText tag="p" className="v2-quote-text" stagger={20}>
          Not the algorithm. The child.
        </CharSplitText>
      </section>

      {/* ── Philanthropic Giving & Mission Sponsorship ── */}
      <RevealV2>
        <PhilanthropicDonationSection />
      </RevealV2>

      {/* ── Two-Path Audience Split CTA (BP-01) ── */}
      <section className="v2-section v2-text-center">
        <div className="v2-container">
          <RevealV2>
            <span className="v2-label">Choose Your Path</span>
            <h2 className="v2-heading v2-heading--lg" style={{ marginTop: '0.5rem' }}>
              Begin the Journey
            </h2>
            <p className="v2-body v2-body--lg" style={{ margin: '1rem auto 0', maxWidth: '580px' }}>
              Whether in the living room sanctuary or the early childhood classroom, sensory learning begins with rhythm.
            </p>

            <div className="v2-two-path">
              {/* Path 1: Families & Homeschool */}
              <div className="v2-two-path__card v2-two-path__card--accent">
                <span className="v2-two-path__badge v2-two-path__badge--orange">
                  For Families & Homeschool
                </span>
                <h3 className="v2-two-path__title">Bring the Sanctuary Home</h3>
                <p className="v2-two-path__desc">
                  Access the complete 19-track acoustic album 100% free, plus screen-free tactile workbooks and phonics literature for ages 2 to 7.
                </p>
                <ul className="v2-two-path__list">
                  <li className="v2-two-path__item">
                    <span className="v2-two-path__check">✓</span>
                    <span>100% Free 19-Track Album Download</span>
                  </li>
                  <li className="v2-two-path__item">
                    <span className="v2-two-path__check">✓</span>
                    <span>Tactile Phonics & Rhythm Literature</span>
                  </li>
                  <li className="v2-two-path__item">
                    <span className="v2-two-path__check">✓</span>
                    <span>Zero Algorithmic Screen Time</span>
                  </li>
                </ul>
                <Link to="/v2/join" className="v2-btn v2-btn--gold" style={{ width: '100%' }}>
                  Start the Family Quest →
                </Link>
              </div>

              {/* Path 2: Educators & Consortia */}
              <div className="v2-two-path__card">
                <span className="v2-two-path__badge v2-two-path__badge--green">
                  For Classrooms & Consortia
                </span>
                <h3 className="v2-two-path__title">Equip Your Learning Spaces</h3>
                <p className="v2-two-path__desc">
                  Turnkey 10–15 minute music-powered sensory lessons aligned with Head Start ELOF, NAEYC, and state early learning standards.
                </p>
                <ul className="v2-two-path__list">
                  <li className="v2-two-path__item v2-two-path__item--green">
                    <span className="v2-two-path__check">✓</span>
                    <span>State DOE & Consortia Procurement Alignment</span>
                  </li>
                  <li className="v2-two-path__item v2-two-path__item--green">
                    <span className="v2-two-path__check">✓</span>
                    <span>ELOF & Multi-Institutional Crosswalks</span>
                  </li>
                  <li className="v2-two-path__item v2-two-path__item--green">
                    <span className="v2-two-path__check">✓</span>
                    <span>Non-Tech Screen-Free Classroom Kits</span>
                  </li>
                </ul>
                <Link to="/education-sovereignty" className="v2-btn v2-btn--outline" style={{ width: '100%' }}>
                  Explore Education Sovereignty →
                </Link>
              </div>
            </div>

            <p className="v2-two-path__reassurance">
              Acoustic music and tactile literature crafted by a father's heart and a mother's love.
            </p>
          </RevealV2>
        </div>
      </section>
    </div>
  );
};

export default MissionV2;
