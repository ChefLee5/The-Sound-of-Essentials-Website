import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import heroesData from '../data/heroes.json';
import tracksData from '../data/tracks.json';
import { assetPath } from '../utils/assetPath';
import { audioUrl } from '../utils/audioUrl';
import { usePageMeta } from '../hooks/usePageMeta';
import JsonLd from '../components/JsonLd';
import { triggerQuestCelebration } from '../components/ui/DesignSpells';
import { submitSoeInterest } from '../services/soeSubmissions';
import { trackLead, trackInitiateCheckout } from '../utils/analytics';
import { useSquareCheckoutAction } from '../utils/checkout';
import {
  getCapturedEmail,
  isGateUnlocked,
  isValidEmail,
  setGateUnlocked,
} from '../utils/gateAuth';
import './SeriphiaSignal.css';

const EMERGENCY_RECEIPTS = [
  {
    stat: '40% Below Basic',
    title: 'The Early Reading Gap',
    body: 'National assessment data shows 40% of U.S. fourth graders read below a basic level. Strong decoding starts with ear training in ages 2–7 before guessing habits set in.',
    source: 'Source: 2024 NAEP Reading Report Card',
  },
  {
    stat: '49th to 9th',
    title: 'Phonics Beats Guessing',
    body: 'For thirty years, three-cueing reading models trained young learners to guess from pictures. When Mississippi shifted to systematic phonics, fourth-grade reading climbed from 49th to 9th.',
    source: 'Source: Mississippi Literacy-Based Promotion Act Outcomes',
  },
  {
    stat: '27% Floor Policies',
    title: 'Report Cards Can Hide Delays',
    body: 'Twenty-seven percent of surveyed U.S. teachers report minimum 50% grading policies that obscure missing mastery. Families need clear screen-free milestones at home.',
    source: 'Source: National Educator Grading Floor Survey',
  },
  {
    stat: '411,549 Vacancies',
    title: 'Relief for Stretched Classrooms',
    body: 'Over four hundred thousand teaching roles face shortages or uncertified coverage. Zero-prep 10-minute tactile lesson extensions give educators calm circle-time relief.',
    source: 'Source: 2025 U.S. Educator Staffing Ledger',
  },
];

const SANCTUARY_FREQUENCIES = [
  {
    tag: 'Frequency 01 · Neuro-Parenting',
    title: 'Brain Architecture Without Screens',
    body: 'Map the 5 developmental pathways across the 7 Lands using steady 60–110 BPM master studio recordings with authentic human vocals and warm acoustic arrangements.',
    primaryLabel: 'Open 5 Neural Pathways Guide',
    primaryHref: '/downloads/SOE_5_Neural_Pathways_Guide.html',
    isExternalOrStatic: true,
    secondaryLabel: 'Read the Science',
    secondaryTo: '/science',
  },
  {
    tag: 'Frequency 02 · Micro-School Pods & B2B',
    title: 'Classroom & Co-Op Sanctuary Kits',
    body: 'Turnkey 10–15 minute screen-free circle-time rituals designed in alignment with Head Start ELOF, NAEYC, and state early learning frameworks for ages 2–7.',
    primaryLabel: 'Explore Pod & School Pilots',
    primaryTo: '/institutions',
    isExternalOrStatic: false,
    secondaryLabel: '10-Min Ritual Card',
    secondaryHref: '/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html',
  },
  {
    tag: 'Frequency 03 · Heritage & Bilingual',
    title: '4,000+ Words Across 125 Scenes',
    body: 'Pair lived family stories with phonetic guides and bilingual EN/ES/FR support inside the Essential Picture Dictionary ($55 — Reserve your copy; compare at $79).',
    primaryLabel: 'Reserve Dictionary ($55)',
    primaryTo: '/workbook#dictionary-presale',
    isExternalOrStatic: false,
    secondaryLabel: 'Global Bilingual Guide',
    secondaryTo: '/global-learn-english',
  },
  {
    tag: 'Frequency 04 · Sensory Regulation',
    title: 'OT, SLP & Neuro-Affirming Pacing',
    body: 'Replace overstimulating screen flicker with predictable 60–80 BPM calming rests, bilateral midline taps in Vitalis, and 10 daily workbook blocks (A–J).',
    primaryLabel: 'Open Sensory Guide',
    primaryHref: '/downloads/SOE_Sensory_Regulation_Guide.html',
    isExternalOrStatic: true,
    secondaryLabel: 'Tempo & Speech Brief',
    secondaryTo: '/sing-along-time',
  },
  {
    tag: 'Frequency 05 · Tactile Print Editions',
    title: 'Rhythm Ready Workbook & Storybook',
    body: 'Hold real pages away from screens: the 40-day Rhythm Ready Workbook ($21 Digital PDF / $45 Physical Print with Free US Shipping) and Companion Storybook ($19 Ebook / $35 Print).',
    primaryLabel: 'Explore Workbook ($21 / $45)',
    primaryTo: '/rhythm-ready',
    isExternalOrStatic: false,
    secondaryLabel: 'View Storybook Gallery',
    secondaryTo: '/gallery',
  },
];

const SeriphiaSignal = () => {
  const [email, setEmail] = useState('');
  const [unlocked, setUnlocked] = useState(() => isGateUnlocked());
  const [capturedEmail, setCapturedEmail] = useState(() => getCapturedEmail());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [audioStatus, setAudioStatus] = useState('Click to preview Track 06 (68 BPM calm reset)');
  const audioRef = useRef(null);

  const seriphiaHero = useMemo(
    () => heroesData.find((hero) => hero.id === 'seriphia') || heroesData[0],
    []
  );
  const signalTrack = useMemo(
    () => tracksData.find((track) => track.slug === 'lets-stretch') || tracksData[0],
    []
  );

  const starterPackCheckout = useSquareCheckoutAction({
    handle: 'quest-starter-pack',
    customerEmail: capturedEmail,
    onTrack: () => {
      trackInitiateCheckout({
        sku: 'SOE-STARTER-PACK',
        name: 'The Quest Starter & Coloring Pack: 40-Page Coloring Book, 432Hz Reset Track & Transition Kit',
        price: 7.0,
      });
    },
  });

  usePageMeta({
    title: 'The Seriphia Signal | Free 19-Track Screen-Free Acoustic Lifeline & Guides (Ages 2–7)',
    description:
      'Seriphia answers the early learning state of emergency for ages 2–7. Unlock the free 19-track studio-recorded acoustic lifeline, 5 Neural Pathways Guide, and Sensory Regulation Guide.',
    canonicalPath: '/signal',
  });

  const signalJsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'The Seriphia Signal — Screen-Free Early Learning Lifeline (Ages 2–7)',
        url: 'https://thesoundofessentials.com/signal',
        description:
          'Free 19-track studio-recorded acoustic lifeline and printable tactile field guides for families, micro-schools, and early childhood educators serving ages 2–7.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is included free inside The Seriphia Signal for ages 2–7?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Families and educators unlock free streaming for all 19 master studio recordings (60–110 BPM) plus three printable screen-free guides: the First 10 Minutes Tactile Ritual Card, the 5 Neural Pathways Field Guide, and the SOE Sensory & Acoustic Regulation Guide.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does The Sound of Essentials support children ages 2–7 without screens?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Guided by Seriphia and 14 Land Heroes across 7 developmental Lands, the curriculum delivers Sound Before Symbol phonemic songs, bilateral midline movement, and tactile 10-block daily workbook routines for Pre-K through Grade 2.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which print and digital editions follow the free 19-track signal?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Families can add the $7 Quest Starter & Coloring Pack, explore the Rhythm Quest Companion Storybook ($19 Digital / $35 Physical Print), order the 40-day Rhythm Ready Workbook ($21 Digital PDF / $45 Physical Print with Free US Shipping), or reserve their copy of the $55 Essential Picture Dictionary (4,000+ words across 125 scenes).',
            },
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePreview = async () => {
    if (!signalTrack) return;
    if (!audioRef.current) {
      const audio = new Audio(audioUrl(signalTrack.audioFile));
      audio.preload = 'none';
      audio.addEventListener('ended', () => {
        setIsPlayingPreview(false);
        setAudioStatus('Preview finished · Unlock all 19 studio tracks below');
      });
      audio.addEventListener('error', () => {
        setIsPlayingPreview(false);
        setAudioStatus('Open the 19-track player after unlocking below');
      });
      audioRef.current = audio;
    }

    if (isPlayingPreview) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
      setAudioStatus('Paused · Click to resume Track 06 preview');
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlayingPreview(true);
      setAudioStatus('Playing Track 06 ("Let’s Stretch" · 68 BPM studio recording)');
    } catch {
      setIsPlayingPreview(false);
      setAudioStatus('Press play again or unlock full streaming access below');
    }
  };

  const handleUnlockSignal = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address to unlock your free signal pack.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSoeInterest({
        kind: 'interest',
        email: cleanEmail,
        name: 'Signal Explorer',
        sourcePath: '/signal',
      });
    } catch {
      // submitSoeInterest persists offline backup leads automatically
    } finally {
      setIsSubmitting(false);
    }

    setGateUnlocked(cleanEmail, 'Signal Explorer', 'parent');
    setCapturedEmail(cleanEmail);
    setUnlocked(true);
    trackLead({ formName: 'seriphia_signal_gate', email: cleanEmail, source: 'signal_page' });
    triggerQuestCelebration();
  };

  return (
    <div className="signal-page">
      <JsonLd data={signalJsonLd} />

      <div className="signal-container">
        {/* ── 1. HERO: SERIPHIA ANSWERS THE CALL ── */}
        <section className="signal-hero" aria-labelledby="signal-hero-heading">
          <div>
            <span className="signal-motto-pill">
              Staying on the path, always learning · Ages 2–7
            </span>
            <h1 id="signal-hero-heading" className="signal-hero__title">
              Seriphia&apos;s <span>Acoustic Signal</span> for Early Learning
            </h1>
            <p className="signal-hero__lead">
              Across living rooms and Pre-K to Grade 2 classrooms, screens and guessing drills have pushed early attention into a state of emergency. Seriphia and 14 Land Heroes broadcast a calm, screen-free answer: <strong>19 master studio recordings with authentic human vocals and warm acoustic arrangements</strong> plus three printable tactile field guides—free ($0) for every family and educator.
            </p>

            {/* Lazy Click-to-Play Audio Preview (never preloaded on mount) */}
            <div className="signal-audio-preview">
              <button
                type="button"
                className="signal-audio-btn"
                onClick={handleTogglePreview}
                aria-pressed={isPlayingPreview}
              >
                {isPlayingPreview ? '❚❚ Pause Signal Preview' : '▶ Preview the 60–80 BPM Signal'}
              </button>
              <span className="signal-audio-meta">{audioStatus}</span>
            </div>

            {/* Gate 1 Unlock Form / Unlocked Signal Vault */}
            {!unlocked ? (
              <div className="signal-gate-box">
                <p className="signal-gate-box__label">
                  Unlock the Free 19-Track Acoustic Signal &amp; 3 Printable Guides ($0)
                </p>
                <p className="signal-gate-box__sub">
                  Instant access to the 19-track player, the 10-Minute Tactile Ritual Card, the 5 Neural Pathways Guide, and the Sensory Regulation Guide.
                </p>
                <form onSubmit={handleUnlockSignal} noValidate>
                  <div className="signal-form-row">
                    <label htmlFor="signal-email-input" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="signal-email-input"
                      type="email"
                      className="signal-email-input"
                      placeholder="Enter your best parent or educator email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="signal-pill-cta"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Unlocking Signal...'
                        : 'Receive the Free 19-Track Signal & 3 Printable Guides'}
                    </button>
                  </div>
                  {errorMsg && (
                    <p className="signal-error" role="alert">
                      {errorMsg}
                    </p>
                  )}
                </form>
              </div>
            ) : (
              <div className="signal-unlocked-panel" role="region" aria-label="Unlocked Seriphia Signal Resources">
                <p className="signal-unlocked-panel__title">
                  Signal Unlocked{capturedEmail ? ` for ${capturedEmail}` : ''}
                </p>
                <p className="signal-unlocked-panel__sub">
                  Open the full 19-track audio player or print any of your three screen-free field guides below.
                </p>
                <div className="signal-unlocked-links">
                  <Link to="/player" className="signal-pill-cta">
                    Open 19-Track Player &rarr;
                  </Link>
                  <a
                    href="/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html"
                    className="signal-pill-secondary"
                  >
                    10-Minute Ritual Card
                  </a>
                  <a
                    href="/downloads/SOE_5_Neural_Pathways_Guide.html"
                    className="signal-pill-secondary"
                  >
                    5 Neural Pathways Guide
                  </a>
                  <a
                    href="/downloads/SOE_Sensory_Regulation_Guide.html"
                    className="signal-pill-secondary"
                  >
                    Sensory Regulation Guide
                  </a>
                </div>
                <div className="signal-bump-row">
                  <div className="signal-bump-text">
                    <strong>Optional $7 Upgrade:</strong> Add the 40-Page Printable Coloring Book, Seriphia&apos;s 432Hz bedtime calming track, and 7-Land rhythm cue cards.
                  </div>
                  <a
                    href={starterPackCheckout.href}
                    onClick={starterPackCheckout.handleClick}
                    className="signal-pill-secondary"
                  >
                    {starterPackCheckout.isLaunching ? 'Opening Square...' : 'Add $7 Quest Starter Pack →'}
                  </a>
                </div>
                {starterPackCheckout.notice && (
                  <p role="status" style={{ fontSize: '0.82rem', color: '#9A3412', marginTop: '0.5rem' }}>
                    {starterPackCheckout.notice}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="signal-portrait-card">
            <img
              src={assetPath(seriphiaHero?.img || '/assets/characters/SERIPHIA.webp')}
              alt="Seriphia, Guardian of the Sound and Brand Ambassador of The Sound of Essentials"
              width="800"
              height="1433"
              loading="eager"
              decoding="async"
              className="signal-portrait-img"
            />
            <p className="signal-portrait-caption">Seriphia</p>
            <p className="signal-portrait-role">
              An Eternal Learning Mother · Guardian of the 7 Lands
            </p>
          </div>
        </section>

        {/* ── 2. EMPIRICAL STATE-OF-EMERGENCY RECEIPTS ── */}
        <section className="signal-section" aria-labelledby="signal-emergency-heading">
          <div className="signal-section__head">
            <span className="signal-section__eyebrow">Why This Signal Matters Now</span>
            <h2 id="signal-emergency-heading" className="signal-section__title">
              The Early Learning State of Emergency (With Receipts)
            </h2>
            <p className="signal-section__desc">
              Children ages 2–7 are not broken. Decades of visual guessing programs, grading floors, and screen saturation created predictable gaps—and proven phonics plus rhythm reverse them.
            </p>
          </div>

          <div className="signal-receipts-grid">
            {EMERGENCY_RECEIPTS.map((item) => (
              <article key={item.title} className="signal-receipt-card">
                <div className="signal-receipt-card__stat">{item.stat}</div>
                <h3 className="signal-receipt-card__title">{item.title}</h3>
                <p className="signal-receipt-card__body">{item.body}</p>
                <p className="signal-receipt-card__source">{item.source}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 3. THE 5 SANCTUARY FREQUENCIES (NICHE BENDS) ── */}
        <section className="signal-section" aria-labelledby="signal-frequencies-heading">
          <div className="signal-section__head">
            <span className="signal-section__eyebrow">5 Sanctuary Frequencies · Ages 2–7</span>
            <h2 id="signal-frequencies-heading" className="signal-section__title">
              Choose the Pathway Serving Your Home or Classroom
            </h2>
            <p className="signal-section__desc">
              Every frequency connects directly into Seriphia&apos;s 7 Lands—Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, and Terrasol.
            </p>
          </div>

          <div className="signal-frequencies-grid">
            {SANCTUARY_FREQUENCIES.map((freq) => (
              <article key={freq.tag} className="signal-freq-card">
                <div>
                  <span className="signal-freq-card__tag">{freq.tag}</span>
                  <h3 className="signal-freq-card__title">{freq.title}</h3>
                  <p className="signal-freq-card__body">{freq.body}</p>
                </div>
                <div className="signal-freq-card__actions">
                  {freq.isExternalOrStatic ? (
                    <a href={freq.primaryHref} className="signal-pill-cta">
                      {freq.primaryLabel} &rarr;
                    </a>
                  ) : (
                    <Link to={freq.primaryTo} className="signal-pill-cta">
                      {freq.primaryLabel} &rarr;
                    </Link>
                  )}
                  {freq.secondaryHref ? (
                    <a href={freq.secondaryHref} className="signal-pill-secondary">
                      {freq.secondaryLabel}
                    </a>
                  ) : (
                    <Link to={freq.secondaryTo} className="signal-pill-secondary">
                      {freq.secondaryLabel}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 4. ASSURANCE & COMPLIANCE FOOTER STRIP ── */}
        <section className="signal-assurance-box" aria-label="Brand Assurance and Policy Alignment">
          <p className="signal-assurance-box__quote">
            &ldquo;Crafted by a father&apos;s heart and a mother&apos;s love.&rdquo; · Staying on the path, always learning.
          </p>
          <p className="signal-assurance-box__promise">
            All digital editions—including the 19-track audio stream, $7 Quest Starter Pack, $19 Companion Storybook, $21 Rhythm Ready Digital Workbook, and $55 Essential Picture Dictionary reservation—include instant digital delivery, lifetime family access, tablet and print compatibility, and dedicated educator or parent support at{' '}
            <a href="mailto:info@soelearn.com" style={{ color: '#FF6F00', fontWeight: 600 }}>
              info@soelearn.com
            </a>
            . Physical editions ship free in the US via print-on-demand.
          </p>
          <p className="signal-assurance-box__footnote">
            The Sound of Essentials (SOE) is an independent curriculum designed in alignment with publicly published early-childhood health and learning guidelines (including Head Start ELOF, NAEYC, WHO under-5 screen guidelines, AAP pediatric recommendations, Singapore Grow Well SG, India IAP, and Caribbean ECC pillars). Alignment reflects pedagogical design and does not imply formal endorsement, accreditation, or sponsorship by any government agency or intergovernmental body.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SeriphiaSignal;
