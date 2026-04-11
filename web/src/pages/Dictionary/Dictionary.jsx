/**
 * ═══════════════════════════════════════════════════════════════
 * SOE DIGITAL PICTURE DICTIONARY — Main Container
 * ═══════════════════════════════════════════════════════════════
 *
 * "Calm. Focused. Essential."
 *
 * This is the root component that manages:
 *   - Learning mode state (Discovery / Reading / Quiz)
 *   - Land selection
 *   - Scene rendering
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useCallback } from 'react';
import { LANDS, getTotalWordCount } from './dictionaryData';
import { useAudio } from './useAudio';
import './dictionary.css';

/* ── Learning Modes ── */
const MODES = {
    DISCOVERY: 'discovery',  // Audio only, no text
    READING: 'reading',    // Audio + text
    QUIZ: 'quiz',       // Audio prompt → find the hotspot
};

/* ── Mode Toggle ── */
const ModeToggle = ({ mode, onSetMode }) => (
    <div className="mode-toggle" role="radiogroup" aria-label="Learning mode">
        <button
            className={`mode-toggle__btn ${mode === MODES.DISCOVERY ? 'mode-toggle__btn--active' : ''}`}
            onClick={() => onSetMode(MODES.DISCOVERY)}
            role="radio"
            aria-checked={mode === MODES.DISCOVERY}
            aria-label="Discovery Mode: Audio only"
        >
            🔊 Discovery
        </button>
        <button
            className={`mode-toggle__btn ${mode === MODES.READING ? 'mode-toggle__btn--active' : ''}`}
            onClick={() => onSetMode(MODES.READING)}
            role="radio"
            aria-checked={mode === MODES.READING}
            aria-label="Reading Mode: Audio and text"
        >
            📖 Reading
        </button>
        <button
            className={`mode-toggle__btn ${mode === MODES.QUIZ ? 'mode-toggle__btn--active' : ''}`}
            onClick={() => onSetMode(MODES.QUIZ)}
            role="radio"
            aria-checked={mode === MODES.QUIZ}
            aria-label="Quiz Mode: Find the word"
        >
            🎯 Quiz
        </button>
    </div>
);

/* ── Land Selector ── */
const LandSelector = ({ onSelectLand }) => (
    <div className="land-selector">
        {LANDS.map((land, i) => (
            <div
                key={land.id}
                className="land-card animate-in"
                style={{
                    background: land.bgGradient,
                    color: '#fff',
                    animationDelay: `${i * 0.1}s`,
                }}
                onClick={() => onSelectLand(land.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectLand(land.id)}
                aria-label={`Enter ${land.name}: ${land.subtitle}`}
            >
                <div className="land-card__name">{land.name}</div>
                <div className="land-card__subtitle">{land.subtitle}</div>
                <div className="land-card__characters">
                    {land.characterImgs.map((img, j) => (
                        <img
                            key={j}
                            src={img}
                            alt={land.characters[j]}
                            className="land-card__avatar"
                        />
                    ))}
                </div>
                <div className="land-card__word-count">
                    {land.vocabulary.length} words
                </div>
            </div>
        ))}
    </div>
);

/* ── Hotspot Item ── */
const HotspotItem = ({
    item,
    mode,
    activeWord,
    quizTarget,
    quizResult,
    onHotspotClick,
}) => {
    const isActive = activeWord === item.id;
    const isQuizCorrect = quizResult === 'correct' && quizTarget === item.id;
    const isQuizWrong = quizResult === 'incorrect' && activeWord === item.id;

    let stateClass = '';
    if (isActive && mode !== MODES.QUIZ) stateClass = 'hotspot--speaking';
    if (isQuizCorrect) stateClass = 'hotspot--correct';
    if (isQuizWrong) stateClass = 'hotspot--incorrect';

    // In Discovery mode, never show the word text
    // In Reading mode, show text only when active
    // In Quiz mode, hide text always (user must find by audio)
    const showWord =
        mode === MODES.READING ? true :
            mode === MODES.QUIZ ? false :
                false; // Discovery

    const wordVisible = mode === MODES.READING && isActive;

    return (
        <button
            className={`hotspot ${stateClass} animate-in`}
            onClick={() => onHotspotClick(item)}
            aria-label={mode === MODES.QUIZ ? 'Vocabulary hotspot' : item.word}
            title={mode === MODES.QUIZ ? '' : item.word}
        >
            <span className="hotspot__icon" aria-hidden="true">
                {item.icon}
            </span>
            {showWord ? (
                <span className={`hotspot__word ${wordVisible ? '' : 'hotspot__word--hidden'}`}>
                    {item.word}
                </span>
            ) : (
                <span className="hotspot__word hotspot__word--hidden">&nbsp;</span>
            )}
        </button>
    );
};

/* ── Quiz Controller ── */
const QuizBar = ({ targetWord, onReplay, score, total }) => (
    <div className="quiz-bar" role="status" aria-live="polite">
        <span className="quiz-bar__prompt">
            🔊 Find the: <strong>???</strong>
        </span>
        <button className="quiz-bar__replay" onClick={onReplay} aria-label="Replay the word">
            🔁 Replay
        </button>
        <span className="quiz-bar__score">
            ✅ {score}/{total}
        </span>
    </div>
);

/* ── Print Reference Box (Reading Mode) ── */
const PrintReference = ({ word }) => (
    <div className={`print-ref ${word ? '' : 'print-ref--empty'}`} role="status" aria-live="polite">
        <span className="print-ref__word">
            {word || 'Tap a word to hear it'}
        </span>
    </div>
);

/* ── Scene View ── */
const SceneView = ({ landId, mode, onBack }) => {
    const land = LANDS.find(l => l.id === landId);
    const { speak, stop } = useAudio();

    const categories = [...new Set(land.vocabulary.map(v => v.category))];
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeWord, setActiveWord] = useState(null);
    const [printWord, setPrintWord] = useState('');

    // Quiz state
    const [quizTarget, setQuizTarget] = useState(null);
    const [quizResult, setQuizResult] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizTotal, setQuizTotal] = useState(0);
    const [quizPool, setQuizPool] = useState([]);

    // Filter vocabulary by category
    const filteredVocab = activeCategory === 'All'
        ? land.vocabulary
        : land.vocabulary.filter(v => v.category === activeCategory);

    /* ── Start a new quiz round ── */
    const startQuizRound = useCallback((vocab) => {
        const pool = vocab || filteredVocab;
        if (pool.length === 0) return;
        const target = pool[Math.floor(Math.random() * pool.length)];
        setQuizTarget(target.id);
        setQuizResult(null);
        setActiveWord(null);
        // Say "Find the ___!"
        setTimeout(() => {
            speak(`Find the ${target.word}`, { slow: land.slowMode });
        }, 300);
    }, [filteredVocab, land.slowMode, speak]);

    /* ── Initialize quiz when entering quiz mode ── */
    React.useEffect(() => {
        if (mode === MODES.QUIZ) {
            setQuizScore(0);
            setQuizTotal(0);
            startQuizRound(filteredVocab);
        } else {
            setQuizTarget(null);
            setQuizResult(null);
        }
    }, [mode, activeCategory]);

    /* ── Handle hotspot click ── */
    const handleHotspotClick = useCallback((item) => {
        stop();
        setActiveWord(item.id);

        if (mode === MODES.QUIZ) {
            // Check if correct
            if (item.id === quizTarget) {
                setQuizResult('correct');
                setQuizScore(s => s + 1);
                setQuizTotal(t => t + 1);
                speak(`Yes! ${item.word}!`, { slow: false });
                // Next round after pause
                setTimeout(() => startQuizRound(), 1800);
            } else {
                setQuizResult('incorrect');
                setQuizTotal(t => t + 1);
                speak('Try again!', { slow: false });
                setTimeout(() => setQuizResult(null), 1000);
            }
        } else {
            // Discovery & Reading — just speak the word
            speak(item.word, {
                slow: land.slowMode,
                audioSrc: item.audioSrc,
            });

            if (mode === MODES.READING) {
                setPrintWord(item.word);
            }

            // Clear active state after speech
            setTimeout(() => setActiveWord(null), 1500);
        }
    }, [mode, land.slowMode, quizTarget, speak, stop, startQuizRound]);

    /* ── Replay quiz prompt ── */
    const handleReplay = useCallback(() => {
        if (quizTarget) {
            const target = land.vocabulary.find(v => v.id === quizTarget);
            if (target) speak(`Find the ${target.word}`, { slow: land.slowMode });
        }
    }, [quizTarget, land, speak]);

    return (
        <div className="scene animate-in">
            {/* Header */}
            <div className="scene__header">
                <button className="scene__back" onClick={onBack}>
                    ← All Lands
                </button>
                <h2 className="scene__land-name" style={{ color: land.color }}>
                    {land.name}: {land.subtitle}
                </h2>
                <div className="scene__characters">
                    {land.characterImgs.map((img, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <img
                                src={img}
                                alt={land.characters[i]}
                                className="scene__character-avatar"
                                style={{ borderColor: land.color }}
                            />
                            <div className="scene__character-name">{land.characters[i]}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slow Mode Indicator (Aquaria) */}
            {land.slowMode && (
                <div className="scene__slow-badge">
                    🐢 Slow down and say... (words spoken at a deliberate pace)
                </div>
            )}

            {/* Quiz Bar */}
            {mode === MODES.QUIZ && quizTarget && (
                <QuizBar
                    onReplay={handleReplay}
                    score={quizScore}
                    total={quizTotal}
                />
            )}

            {/* Print Reference (Reading Mode) */}
            {mode === MODES.READING && (
                <PrintReference word={printWord} />
            )}

            {/* Category Tabs */}
            <div className="scene__categories">
                <button
                    className={`scene__cat-btn ${activeCategory === 'All' ? 'scene__cat-btn--active' : ''}`}
                    onClick={() => setActiveCategory('All')}
                >
                    All ({land.vocabulary.length})
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`scene__cat-btn ${activeCategory === cat ? 'scene__cat-btn--active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat} ({land.vocabulary.filter(v => v.category === cat).length})
                    </button>
                ))}
            </div>

            {/* Hotspot Grid */}
            <div className="hotspot-grid">
                {filteredVocab.map((item, i) => (
                    <HotspotItem
                        key={item.id}
                        item={item}
                        mode={mode}
                        activeWord={activeWord}
                        quizTarget={quizTarget}
                        quizResult={quizResult}
                        onHotspotClick={handleHotspotClick}
                    />
                ))}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
 * DICTIONARY — Root Component
 * ═══════════════════════════════════════════════════════════════ */
const Dictionary = () => {
    const [mode, setMode] = useState(MODES.READING);
    const [activeLand, setActiveLand] = useState(null);

    return (
        <div className="dictionary">
            {/* ── Header ── */}
            <header className="dictionary__header">
                <div className="container text-center">
                    <h1 className="dictionary__title">
                        SOE <span>Picture Dictionary</span>
                    </h1>
                    <p className="dictionary__subtitle">
                        Sound Before Symbol — An interactive vocabulary experience
                    </p>
                    <div className="dictionary__word-count">
                        {getTotalWordCount()} Words
                    </div>
                </div>
            </header>

            {/* ── Mode Toggle (always visible) ── */}
            <ModeToggle mode={mode} onSetMode={setMode} />

            {/* ── Land Selector or Scene ── */}
            {!activeLand ? (
                <LandSelector onSelectLand={setActiveLand} />
            ) : (
                <SceneView
                    landId={activeLand}
                    mode={mode}
                    onBack={() => {
                        setActiveLand(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dictionary;
