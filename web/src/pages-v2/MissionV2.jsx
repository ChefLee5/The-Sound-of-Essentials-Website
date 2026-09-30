import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import FullSection from '../components-v2/FullSection';
import CharSplitText from '../components-v2/CharSplitText';
import { RevealV2 } from '../hooks/useScrollReveal';

const SECTIONS = [
  {
    heading: 'Building a Sanctuary',
    paras: [
      'The Sound of Essentials was born from a simple refusal: children deserve better than content built to maximize watch-time. We set out to build a sanctuary instead — a calm, neuro-affirming world where learning is the point, not the bait.',
      'Every song, character, and land exists to serve one child at one moment, learning one thing. Nothing is engineered to keep them scrolling. Everything is engineered to help them grow.',
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
      'We do not sell music as background noise; we bring an enduring acoustic solution to the modern home. Our front door is a complete 19-track studio album, gifted freely to every family. Foundational sensory learning is a birthright, not a luxury.',
      'When parents invest in our physical workbooks and picture dictionaries, it is an equitable exchange for the profound calm and cognitive focus brought into their home sanctuary. We are not corporate proprietors peddling dopamine loops. Apps fade, algorithms shift, and digital gadgets rot. The Sound of Essentials is an evergreen and eternal sound.',
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

      {/* ── CTA ── */}
      <section className="v2-section v2-text-center">
        <div className="v2-container">
          <RevealV2>
            <h2 className="v2-heading v2-heading--lg">Join the quest</h2>
            <p className="v2-body v2-body--lg" style={{ margin: '1rem auto 2rem', maxWidth: '480px' }}>
              Be part of a different kind of childhood media.
            </p>
            <Link to="/v2/join" className="v2-btn v2-btn--gold">Get Involved →</Link>
          </RevealV2>
        </div>
      </section>
    </div>
  );
};

export default MissionV2;
