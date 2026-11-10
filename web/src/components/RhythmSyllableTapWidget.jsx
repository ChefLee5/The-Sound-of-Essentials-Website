import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { animate, stagger } from 'animejs';
import './RhythmSyllableTapWidget.css';

// Canonical vocabulary words for rhythm and phonics exploration (Ages 2–7)
const RHYTHM_WORDS = [
  {
    id: 'harmonia',
    word: 'Harmonia',
    land: 'Harmonia',
    syllables: ['Har', 'mo', 'ni', 'a'],
    pitches: [261.63, 293.66, 329.63, 392.00], // C4, D4, E4, G4
  },
  {
    id: 'rhythm-quest',
    word: 'Rhythm Quest',
    land: 'Harmonia',
    syllables: ['Rhyt', 'hm', 'Quest'],
    pitches: [293.66, 329.63, 440.00], // D4, E4, A4
  },
  {
    id: 'numeria',
    word: 'Numeria',
    land: 'Numeria',
    syllables: ['Nu', 'me', 'ri', 'a'],
    pitches: [329.63, 349.23, 392.00, 440.00], // E4, F4, G4, A4
  },
  {
    id: 'vitalis',
    word: 'Vitalis',
    land: 'Vitalis',
    syllables: ['Vi', 'ta', 'lis'],
    pitches: [349.23, 392.00, 440.00], // F4, G4, A4
  },
  {
    id: 'seriphia',
    word: 'Seriphia',
    land: 'Luminosity',
    syllables: ['Se', 'ri', 'phi', 'a'],
    pitches: [392.00, 440.00, 493.88, 523.25], // G4, A4, B4, C5
  },
  {
    id: 'terrasol',
    word: 'Terrasol',
    land: 'Terrasol',
    syllables: ['Ter', 'ra', 'sol'],
    pitches: [261.63, 329.63, 392.00], // C4, E4, G4
  },
];

export default function RhythmSyllableTapWidget() {
  const { t } = useTranslation();
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [currentSyllableIndex, setCurrentSyllableIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const audioCtxRef = useRef(null);
  const drumButtonRef = useRef(null);
  const particlesContainerRef = useRef(null);
  const syllablesContainerRef = useRef(null);
  const syllableRefs = useRef([]);
  const celebrateBadgeRef = useRef(null);

  const currentWord = RHYTHM_WORDS[selectedWordIndex];

  // Initialize or resume Web Audio context
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Synthesize acoustic percussion block tone (clean physical resonance)
  const playSynthesizedTap = useCallback((frequency) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft wooden triangle timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.75, ctx.currentTime + 0.12);

      // Snappy percussive amplitude decay
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // AudioContext unavailable or blocked by browser policy
    }
  }, [getAudioContext]);

  // Anime.js v4: Spawn tactile radial musical notes & sparkle particles
  const spawnMusicalParticles = useCallback((isFanfare = false) => {
    const container = particlesContainerRef.current;
    if (!container) return;

    // Check accessibility reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const count = isFanfare ? 14 : 7;
    const notes = isFanfare
      ? ['✨', '⭐', '🌟', '🎉', '♪', '♫']
      : ['♩', '♪', '♫', '♬', '✨', '★'];
    const colors = ['#FF6F00', '#FF8A00', '#4CAF50', '#9C27B0', '#1E88E5', '#FFB300'];

    const elements = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'rhythm-particle';
      p.textContent = notes[Math.floor(Math.random() * notes.length)];
      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
      elements.push(p);
    }

    animate(elements, {
      translateX: () => (Math.random() - 0.5) * (isFanfare ? 240 : 160),
      translateY: () => -(Math.random() * (isFanfare ? 120 : 80) + 30),
      scale: [0.3, isFanfare ? 1.4 : 1.15, 0],
      rotate: () => (Math.random() - 0.5) * 80,
      opacity: [1, 1, 0],
      duration: isFanfare ? 850 : 600,
      ease: 'outQuad',
      onComplete: () => {
        elements.forEach((el) => el.remove());
      },
    });
  }, []);

  // Anime.js v4: Tactile Drum elastic squash-and-rebound
  const animateDrumPulse = useCallback(() => {
    if (!drumButtonRef.current) return;
    animate(drumButtonRef.current, {
      scaleX: [1, 1.14, 0.94, 1.03, 1],
      scaleY: [1, 0.86, 1.06, 0.98, 1],
      duration: 380,
      ease: 'outElastic(1, .5)',
    });
  }, []);

  // Anime.js v4: Syllable block active bounce
  const animateSyllableBounce = useCallback((index) => {
    const el = syllableRefs.current[index];
    if (!el) return;
    animate(el, {
      translateY: [0, -14, 0],
      scale: [1, 1.22, 1.12],
      duration: 340,
      ease: 'outBack(2)',
    });
  }, []);

  // Anime.js v4: Completion Fanfare
  const triggerCompletionFanfare = useCallback(() => {
    const activeRefs = syllableRefs.current.filter(Boolean);
    if (activeRefs.length) {
      animate(activeRefs, {
        translateY: [0, -18, 0],
        duration: 500,
        delay: stagger(60),
        ease: 'outBounce',
      });
    }
    spawnMusicalParticles(true);
  }, [spawnMusicalParticles]);

  // Handle tap on drum button or syllable
  const handleTap = useCallback(() => {
    const nextIndex = currentSyllableIndex + 1;
    const totalSyllables = currentWord.syllables.length;

    // Trigger physical drum squash & particle burst
    animateDrumPulse();
    spawnMusicalParticles(false);

    if (nextIndex < totalSyllables) {
      const pitch = currentWord.pitches[nextIndex] || 330;
      playSynthesizedTap(pitch);
      setCurrentSyllableIndex(nextIndex);
      animateSyllableBounce(nextIndex);

      if (nextIndex === totalSyllables - 1) {
        setIsCompleted(true);
        setTimeout(triggerCompletionFanfare, 120);
      }
    } else {
      // Loop back to first syllable
      const pitch = currentWord.pitches[0] || 330;
      playSynthesizedTap(pitch);
      setCurrentSyllableIndex(0);
      setIsCompleted(false);
      animateSyllableBounce(0);
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);
  }, [
    currentSyllableIndex,
    currentWord,
    playSynthesizedTap,
    animateDrumPulse,
    spawnMusicalParticles,
    animateSyllableBounce,
    triggerCompletionFanfare,
  ]);

  // Handle word selection
  const handleSelectWord = (index) => {
    setSelectedWordIndex(index);
    setCurrentSyllableIndex(-1);
    setIsCompleted(false);
  };

  // Anime.js v4: Staggered entry when changing words
  useEffect(() => {
    if (syllablesContainerRef.current) {
      const blocks = syllablesContainerRef.current.querySelectorAll('.syllable-block');
      if (blocks.length) {
        animate(blocks, {
          translateY: [18, 0],
          opacity: [0, 1],
          scale: [0.85, 1],
          delay: stagger(55),
          duration: 400,
          ease: 'outBack(1.4)',
        });
      }
    }
  }, [selectedWordIndex]);

  // Anime.js v4: Celebrate badge entrance
  useEffect(() => {
    if (isCompleted && celebrateBadgeRef.current) {
      animate(celebrateBadgeRef.current, {
        scale: [0.7, 1.1, 1],
        opacity: [0, 1],
        duration: 450,
        ease: 'outElastic(1, .6)',
      });
    }
  }, [isCompleted]);

  // Keyboard accessibility: trigger tap with Space or Enter
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleTap();
    }
  };

  // Clean up Web Audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section
      className="rhythm-tap-widget"
      aria-label={t('rhythmWidget.ariaLabel', 'Interactive Syllable and Rhythm Tap Pad for Ages 2 to 7')}
    >
      <div className="rhythm-tap-header">
        <div className="rhythm-tap-pill">
          <span className="pulse-dot" aria-hidden="true" />
          <span>{t('rhythmWidget.badge', 'Interactive Phonics & Rhythm Pad • Ages 2–7')}</span>
        </div>
        <h3 className="rhythm-tap-title">
          {t('rhythmWidget.heading', 'Tap the Syllables, Feel the Cadence')}
        </h3>
        <p className="rhythm-tap-subtitle">
          {t(
            'rhythmWidget.subheading',
            'Connect spoken words to musical tempo. Tap the drum to guide early phonemic awareness one beat at a time.'
          )}
        </p>
      </div>

      {/* Word Selection Chips */}
      <div
        className="rhythm-word-selector"
        role="tablist"
        aria-label={t('rhythmWidget.wordSelectorLabel', 'Select a word to tap')}
      >
        {RHYTHM_WORDS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selectedWordIndex === idx}
            className={`rhythm-word-chip ${selectedWordIndex === idx ? 'active' : ''}`}
            onClick={() => handleSelectWord(idx)}
          >
            {item.word}
          </button>
        ))}
      </div>

      {/* Syllable Blocks Display */}
      <div
        ref={syllablesContainerRef}
        className="rhythm-syllable-display"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentWord.syllables.map((syl, idx) => {
          const isCurrent = idx === currentSyllableIndex;
          const isPast = idx < currentSyllableIndex;
          return (
            <div
              key={`${currentWord.id}-${idx}`}
              ref={(el) => (syllableRefs.current[idx] = el)}
              className={`syllable-block ${isCurrent ? 'active' : ''} ${isPast || (isCompleted && isCurrent) ? 'completed' : ''}`}
            >
              {syl}
            </div>
          );
        })}
      </div>

      {/* Big Tactile Drum Button with Particle Stage */}
      <div className="rhythm-tap-action-area">
        <div className="rhythm-drum-wrapper">
          <div
            ref={particlesContainerRef}
            className="rhythm-particles-container"
            aria-hidden="true"
          />
          <button
            ref={drumButtonRef}
            type="button"
            className={`rhythm-drum-button ${isPressed ? 'pressed' : ''}`}
            onClick={handleTap}
            onKeyDown={handleKeyDown}
            aria-label={t('rhythmWidget.tapButtonLabel', 'Tap drum for next syllable')}
          >
            <span className="drum-icon" aria-hidden="true">🥁</span>
            <span>{isCompleted ? t('rhythmWidget.tapAgain', 'Again!') : t('rhythmWidget.tap', 'Tap!')}</span>
          </button>
        </div>

        {isCompleted && (
          <div>
            <div
              ref={celebrateBadgeRef}
              className="rhythm-celebrate-badge"
              role="status"
            >
              <span>✨</span>
              <span>{t('rhythmWidget.complete', 'Word rhythm complete! Tap on your child’s hands!')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Screen-Free Tactile Anchor */}
      <div className="rhythm-tactile-footer">
        <span>👋</span>
        <span>
          <strong>{t('rhythmWidget.tactileTipTitle', 'Tactile Habit:')}</strong>{' '}
          {t(
            'rhythmWidget.tactileTip',
            'Transfer this pulse offline. Tap these syllables on your child’s knees or shoulders during daily transitions.'
          )}
        </span>
      </div>
    </section>
  );
}
