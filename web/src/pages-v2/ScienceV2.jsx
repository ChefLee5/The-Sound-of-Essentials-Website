import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath';
import FullSection from '../components-v2/FullSection';
import CharSplitText from '../components-v2/CharSplitText';
import { RevealV2 } from '../hooks/useScrollReveal';

const CHAPTERS = [
  {
    n: '01',
    title: 'The Window of Plasticity',
    body: 'In the first eight years, the brain forms more than a million new neural connections every second. Music — with its built-in structure of rhythm, pitch, and repetition — gives those connections something durable to wrap around. We design every track to land inside this window, when the return on a well-formed pathway is highest.',
    stat: { value: '1M+', label: 'new synapses per second in early childhood' },
  },
  {
    n: '02',
    title: 'Rhythm Before Reading',
    body: 'Steady-beat competency is one of the strongest early predictors of later reading fluency. When a child can keep time, they are rehearsing the same temporal segmentation skills that decode language. Our songs make the beat impossible to ignore — clapping, marching, and call-and-response are lessons disguised as play.',
    stat: { value: '7', label: 'developmental domains set to rhythm' },
  },
  {
    n: '03',
    title: 'Multi-Sensory Encoding',
    body: 'A concept met through sound, sight, and movement at once is encoded across multiple regions and recalled far more reliably than one met through a single channel. Each hero pairs a melody with a story, a color, and a gesture, so every idea arrives with more than one handle to hold it by.',
    stat: { value: '15', label: 'hero guides, one per concept cluster' },
  },
  {
    n: '04',
    title: 'Calm by Design',
    body: 'Most children’s media is engineered to capture attention through novelty and speed. We engineer for the opposite: predictable structure, gentle pacing, and no manipulative loops. A regulated nervous system learns better — so the absence of the algorithm is itself a feature.',
    stat: { value: '0', label: 'autoplay traps, dark patterns, or ads' },
  },
];

const ScienceV2 = () => {
  useEffect(() => {
    document.title = 'The Science — SOE Rhythm Quest';
  }, []);

  return (
    <div className="science-v2">
      {/* ── Hero ── */}
      <FullSection
        bg={assetPath('/assets/lands/celestia-panorama.webp')}
        overlay="heavy"
      >
        <div className="v2-container v2-text-center">
          <RevealV2>
            <span className="v2-label">The research behind the rhythm</span>
          </RevealV2>
          <CharSplitText tag="h1" className="v2-display v2-display--section" stagger={26}>
            Grounded in Neuroscience
          </CharSplitText>
          <RevealV2 className="v2-reveal--delay-2">
            <p className="v2-body v2-body--lg" style={{ maxWidth: '600px', margin: '1.25rem auto 0' }}>
              Why music is one of the most efficient delivery systems for early learning —
              and how we engineer every track around it.
            </p>
          </RevealV2>
        </div>
        <div className="v2-scroll-hint">↓</div>
      </FullSection>

      {/* ── Numbered chapters ── */}
      {CHAPTERS.map((ch, i) => (
        <section
          key={ch.n}
          className={`v2-section ${i % 2 === 1 ? 'v2-section--alt' : ''}`}
        >
          <div className="v2-container--narrow v2-container">
            <RevealV2>
              <span
                className="v2-display"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--v2-accent-orange-soft)', display: 'block', lineHeight: 1 }}
              >
                {ch.n}
              </span>
              <h2 className="v2-heading v2-heading--lg" style={{ marginTop: '-0.5rem' }}>
                {ch.title}
              </h2>
              <p className="v2-body v2-body--lg" style={{ marginTop: '1.25rem' }}>
                {ch.body}
              </p>

              <div className="v2-card v2-card--flat" style={{ marginTop: '2rem', display: 'flex', alignItems: 'baseline', gap: '1.25rem' }}>
                <span className="v2-stat__number" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
                  {ch.stat.value}
                </span>
                <span className="v2-serif-italic" style={{ color: 'var(--v2-text-secondary)' }}>
                  {ch.stat.label}
                </span>
              </div>
            </RevealV2>
          </div>
        </section>
      ))}

      {/* ── Closing ── */}
      <section className="v2-quote-section v2-section--plum">
        <CharSplitText tag="p" className="v2-quote-text" stagger={20}>
          Learning should feel like play, and sound like music.
        </CharSplitText>
      </section>

      <section className="v2-section v2-text-center">
        <div className="v2-container">
          <RevealV2>
            <Link to="/v2/listen" className="v2-btn v2-btn--gold">Hear it for yourself →</Link>
          </RevealV2>
        </div>
      </section>
    </div>
  );
};

export default ScienceV2;
