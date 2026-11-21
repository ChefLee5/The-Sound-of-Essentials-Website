import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { SoeIcon } from './ui/SoeIcon';

/* ----------------------------------------------------------------- useRafLoop */
function useRafLoop(cb) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      cbRef.current(now, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/* ------------------------------------------------------ useAudioPlayer */
function shuffleOrder(pinFirst, count) {
  const rest = Array.from({ length: count }, (_, i) => i).filter(x => x !== pinFirst);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [pinFirst, ...rest];
}

function reducer(state, action) {
  switch (action.type) {
    case 'PLAY': return { ...state, isPlaying: true };
    case 'PAUSE': return { ...state, isPlaying: false };
    case 'SET_TRACK': return { ...state, currentIndex: action.index, direction: action.direction };
    case 'TOGGLE_SHUFFLE': {
      const shuffled = !state.shuffled;
      const order = shuffled
        ? shuffleOrder(state.currentIndex, action.trackCount)
        : Array.from({ length: action.trackCount }, (_, i) => i);
      return { ...state, shuffled, order };
    }
    case 'CYCLE_LOOP': {
      const next = state.loopMode === 'off' ? 'all' : state.loopMode === 'all' ? 'one' : 'off';
      return { ...state, loopMode: next };
    }
    default: return state;
  }
}

function useAudioPlayer(tracks) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    order: Array.from({ length: tracks.length }, (_, i) => i),
    shuffled: false,
    loopMode: 'off',
    isPlaying: false,
    direction: null,
  });

  const loadTrack = useCallback((index, autoplay, direction) => {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: 'SET_TRACK', index, direction });
    audio.src = tracks[index].src;
    audio.load();
    if (autoplay) {
      audio.play().catch((err) => {
        console.warn('Playback note:', err);
      });
    }
  }, [tracks]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch((err) => {
        console.warn('Playback note:', err);
      });
    } else {
      audio.pause();
    }
  }, []);

  const next = useCallback((forceAutoplay) => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldPlay = forceAutoplay || !audio.paused;
    const pos = state.order.indexOf(state.currentIndex);
    const np = pos + 1;
    if (np >= state.order.length) {
      if (state.loopMode === 'all') loadTrack(state.order[0], shouldPlay, 'next');
      else { audio.pause(); audio.currentTime = 0; }
      return;
    }
    loadTrack(state.order[np], shouldPlay, 'next');
  }, [state.order, state.currentIndex, state.loopMode, loadTrack]);

  const prev = useCallback((forceAutoplay) => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldPlay = forceAutoplay || !audio.paused;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const pos = state.order.indexOf(state.currentIndex);
    const pp = pos - 1;
    if (pp < 0) {
      if (state.loopMode === 'all') loadTrack(state.order[state.order.length - 1], shouldPlay, 'prev');
      else audio.currentTime = 0;
      return;
    }
    loadTrack(state.order[pp], shouldPlay, 'prev');
  }, [state.order, state.currentIndex, state.loopMode, loadTrack]);

  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = pct * audio.duration;
  }, []);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHUFFLE', trackCount: tracks.length });
  }, [tracks.length]);

  const cycleLoop = useCallback(() => { dispatch({ type: 'CYCLE_LOOP' }); }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => dispatch({ type: 'PLAY' });
    const onPause = () => dispatch({ type: 'PAUSE' });
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => { setCurrentTime(audio.currentTime); if (audio.duration) setDuration(audio.duration); };
    const onEnded = () => {
      if (state.loopMode === 'one') { audio.currentTime = 0; audio.play().catch(() => {}); }
      else next(true);
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [state.loopMode, next]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = tracks[0].src;
    audio.load();
  }, [tracks]);

  return {
    audioRef, state, currentTime, duration,
    currentTrack: tracks[state.currentIndex],
    toggle, next, prev, seek, toggleShuffle, cycleLoop, loadTrack,
  };
}

/* ------------------------------------------------ useKeyboardShortcuts */
function useKeyboardShortcuts(actions) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case ' ': e.preventDefault(); actions.toggle(); break;
        case 'ArrowRight': e.preventDefault(); e.shiftKey ? actions.next() : actions.seekForward(); break;
        case 'ArrowLeft': e.preventDefault(); e.shiftKey ? actions.prev() : actions.seekBackward(); break;
        case 's': case 'S': actions.toggleShuffle(); break;
        case 'l': case 'L': actions.cycleLoop(); break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [actions]);
}

/* --------------------------------------------------------- ScalesMixer */
const COLS = 10;
const ROWS = 10;
const sineOut = (x) => Math.sin((x * Math.PI) / 2);
const sineIn = (x) => 1 - Math.cos((x * Math.PI) / 2);
const sineInOut = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const PART_A_DUR = 1.5;
const PART_A_TO = 11;
const PART_A_STEP = 3 / (COLS - 1);
const PART_B_DUR = 1;
const SCALE_FROM = 0.133;
const SCALE_TO = 0.8;

function partAColumnY(time, col) {
  const local = time - col * PART_A_STEP;
  const period = PART_A_DUR * 2;
  const cyc = ((local % period) + period) % period;
  if (cyc < PART_A_DUR) return PART_A_TO * sineInOut(cyc / PART_A_DUR);
  return PART_A_TO * sineInOut(1 - (cyc - PART_A_DUR) / PART_A_DUR);
}
function partBCircle(time, col, row) {
  const frac = row / ROWS;
  const yFrom = lerp(77, -77, frac);
  const yTo = lerp(col, -col, frac);
  const local = time - col / COLS;
  const period = PART_B_DUR * 2;
  const cyc = ((local % period) + period) % period;
  let e;
  if (cyc < PART_B_DUR) e = sineOut(cyc / PART_B_DUR);
  else e = sineIn(1 - (cyc - PART_B_DUR) / PART_B_DUR);
  return [lerp(yFrom, yTo, e), lerp(SCALE_FROM, SCALE_TO, e)];
}

function ScalesMixer({ isPlaying }) {
  const maskId = useId().replace(/:/g, '_');
  const colRefs = useRef([]);
  const circleRefs = useRef(Array.from({ length: COLS }, () => []));
  const tRef = useRef(50);

  useRafLoop((_, dt) => {
    if (isPlaying) tRef.current += dt / 1000;
    const time = tRef.current;
    for (let c = 0; c < COLS; c++) {
      const colEl = colRefs.current[c];
      if (colEl) colEl.style.transform = `translate(${c * 10}px, ${partAColumnY(time, c)}px)`;
      for (let r = 0; r < ROWS; r++) {
        const circle = circleRefs.current[c][r];
        if (!circle) continue;
        const [ty, s] = partBCircle(time, c, r);
        circle.style.transform = `translateY(${ty}px) scale(${s})`;
      }
    }
  });

  return (
    <svg className="mpw-scales" viewBox="0 0 98 108" aria-hidden="true">
      <mask id={maskId}><rect width="10" height="10" fill="#fff" /></mask>
      {Array.from({ length: COLS }, (_, c) => (
        <g key={c} ref={el => { colRefs.current[c] = el; }} style={{ transform: `translate(${c * 10}px, 0px)` }}>
          {Array.from({ length: ROWS }, (_, r) => (
            <g key={r} mask={`url(#${maskId})`} transform={`translate(0 ${r * 10})`}>
              <circle ref={el => { circleRefs.current[c][r] = el; }} cx="5" cy="5" r="5"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------- Disc */
const SPIN_MAX = 0.4375;
const BURST_DURATION = 620;

function Disc({ layers, isPlaying, isZoomed, trackKey, direction, onZoomToggle }) {
  const spinRef = useRef(null);
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const burstRef = useRef({ from: 0, start: 0, active: false, pending: false });
  const lastKey = useRef(trackKey);

  useEffect(() => {
    if (trackKey !== lastKey.current) {
      lastKey.current = trackKey;
      if (direction) { burstRef.current.from = direction === 'prev' ? 360 : -360; burstRef.current.pending = true; }
    }
  }, [trackKey, direction]);

  useRafLoop((now) => {
    const el = spinRef.current;
    if (!el) return;
    if (isPlaying) velRef.current += (SPIN_MAX - velRef.current) * 0.2;
    else { velRef.current *= 0.96; if (velRef.current < 0.001) velRef.current = 0; }
    if (isZoomed) {
      const target = Math.round(rotRef.current / 360) * 360;
      const nx = rotRef.current + (target - rotRef.current) * 0.08;
      rotRef.current = Math.abs(target - nx) < 0.1 ? target : nx;
    } else { rotRef.current += velRef.current; }
    const burst = burstRef.current;
    if (burst.pending) { burst.start = now; burst.pending = false; burst.active = true; }
    let b = 0;
    if (burst.active) {
      const t = (now - burst.start) / BURST_DURATION;
      if (t >= 1) burst.active = false;
      else b = burst.from * (1 - (1 - Math.pow(1 - t, 3)));
    }
    el.style.transform = `scale(1.01) rotate(${rotRef.current + b}deg)`;
  });

  return (
    <div className={`mpw-mask ${isZoomed ? 'is-zoomed' : ''}`} onClick={e => { e.stopPropagation(); onZoomToggle(); }}>
      <div className="mpw-spin" ref={spinRef}>
        {layers.map((l, i) => {
          const isNewest = i === layers.length - 1;
          const cls = isNewest ? (l.dir ? 'mpw-cover mpw-cover-enter' : 'mpw-cover') : 'mpw-cover mpw-cover-exit';
          return <img key={l.id} src={l.track.cover} alt={`${l.track.title}`} className={cls} draggable={false} />;
        })}
      </div>
      <div className="mpw-hole"><div className="mpw-hole-inner" /></div>
    </div>
  );
}

/* ------------------------------------------------------------ TrackInfo */
function TrackInfo({ layers }) {
  return (
    <div className="mpw-track-info">
      {layers.map((l, i) => {
        const isNewest = i === layers.length - 1;
        const dx = l.dir === 'next' ? 14 : l.dir === 'prev' ? -14 : 0;
        const exitDx = -dx;
        const state = isNewest ? (l.dir ? 'mpw-ti-enter' : '') : 'mpw-ti-exit';
        const style = { '--dx': `${isNewest ? dx : exitDx}px` };
        return (
          <div key={l.id} className={`mpw-ti-layer ${isNewest ? '' : 'mpw-ti-abs'}`}>
            <p className={`mpw-artist ${state}`} style={style}>{l.track.artist}</p>
            <h2 className={`mpw-track ${state}`} style={style}>{l.track.title}</h2>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- ProgressBar */
function fmt(s) {
  if (!isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function ProgressBar({ currentTime, duration, onSeek }) {
  const pct = duration ? (currentTime / duration) * 100 : 0;
  return (
    <>
      <div className="mpw-bar" onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      }}>
        <div className="mpw-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="mpw-time">
        <span className="mpw-current">{fmt(currentTime)}</span>
        <span className="mpw-sep">/</span>
        <span className="mpw-total">{fmt(duration)}</span>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- Controls */
function Controls({ isPlaying, shuffled, loopMode, hasLyrics, showLyrics, onToggle, onNext, onPrev, onShuffle, onLoop, onLyrics }) {
  return (
    <div className="mpw-controls">
      <button className={`mpw-ctrl mpw-ctrl-toggle ${shuffled ? 'is-active' : ''}`} onClick={onShuffle} aria-label="Shuffle">
        <SoeIcon name="arrows-arrow-left-right" type={shuffled ? 'duotone' : 'normal'} size={14} />
      </button>
      <button className="mpw-ctrl" onClick={onPrev} aria-label="Previous">
        <SoeIcon name="arrows-step-back" type="fill" size={16} />
      </button>
      <button className="mpw-ctrl mpw-ctrl-play" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
        <SoeIcon name={isPlaying ? 'playback-pause' : 'playback-play'} type="fill" size={15} />
      </button>
      <button className="mpw-ctrl" onClick={onNext} aria-label="Next">
        <SoeIcon name="arrows-skip-forward" type="fill" size={16} />
      </button>
      <button className={`mpw-ctrl mpw-ctrl-toggle mpw-ctrl-loop ${loopMode !== 'off' ? 'is-active' : ''} ${loopMode === 'one' ? 'mode-one' : ''}`} onClick={onLoop} aria-label="Loop">
        <SoeIcon name="schedule-repeat" type={loopMode !== 'off' ? 'duotone' : 'normal'} size={14} />
        <span className="mpw-loop-one">1</span>
      </button>
      <button
        className={`mpw-ctrl mpw-ctrl-toggle mpw-ctrl-lyrics ${showLyrics ? 'is-active' : ''} ${!hasLyrics ? 'is-disabled' : ''}`}
        onClick={hasLyrics ? onLyrics : undefined}
        disabled={!hasLyrics}
        aria-label="Toggle lyrics"
        title={hasLyrics ? 'Show lyrics' : 'No lyrics available'}
      >
        <SoeIcon name="documents-file-text" type={showLyrics ? 'fill' : 'normal'} size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------- LyricsPanel */
function LyricsPanel({ lyrics, show }) {
  if (!show || !lyrics) return null;
  return (
    <div className="mpw-lyrics">
      <div className="mpw-lyrics__content">
        {lyrics.split('\n').map((line, i) => (
          <p key={i} className={line.startsWith('(') ? 'mpw-lyrics__label' : ''}>
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------- MusicPlayerWidget */
export function MusicPlayerWidget({ tracks, crossOrigin, onTrackChange, selectedTrack }) {
  const player = useAudioPlayer(tracks);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const [layers, setLayers] = useState(() => [{ id: 0, track: tracks[0], dir: null }]);
  const lastIndex = useRef(0);
  const idRef = useRef(1);

  useEffect(() => {
    if (player.state.currentIndex === lastIndex.current) return;
    lastIndex.current = player.state.currentIndex;
    const id = idRef.current++;
    setLayers(prev => [...prev, { id, track: player.currentTrack, dir: player.state.direction }]);
    const t = setTimeout(() => { setLayers(prev => prev.filter(l => l.id === id)); }, 760);
    return () => clearTimeout(t);
  }, [player.state.currentIndex, player.currentTrack, player.state.direction]);

  // Report track changes to parent
  useEffect(() => {
    onTrackChange?.(player.state.currentIndex);
  }, [player.state.currentIndex, onTrackChange]);

  // Jump to track when parent sets selectedTrack
  const prevSelectedRef = useRef(selectedTrack);
  useEffect(() => {
    if (selectedTrack != null && selectedTrack !== prevSelectedRef.current && selectedTrack !== player.state.currentIndex) {
      const dir = selectedTrack > player.state.currentIndex ? 'next' : 'prev';
      player.loadTrack(selectedTrack, true, dir);
    }
    prevSelectedRef.current = selectedTrack;
  }, [selectedTrack, player.state.currentIndex, player.loadTrack]);

  // Close lyrics when track changes
  useEffect(() => { setShowLyrics(false); }, [player.state.currentIndex]);

  const seekForward = useCallback(() => {
    const a = player.audioRef.current;
    if (a) a.currentTime = Math.min(a.duration || 0, a.currentTime + 5);
  }, [player.audioRef]);
  const seekBackward = useCallback(() => {
    const a = player.audioRef.current;
    if (a) a.currentTime = Math.max(0, a.currentTime - 5);
  }, [player.audioRef]);

  const shortcuts = useMemo(() => ({
    toggle: player.toggle, next: player.next, prev: player.prev,
    seekForward, seekBackward, toggleShuffle: player.toggleShuffle, cycleLoop: player.cycleLoop,
  }), [player.toggle, player.next, player.prev, seekForward, seekBackward, player.toggleShuffle, player.cycleLoop]);
  useKeyboardShortcuts(shortcuts);

  const currentLyrics = player.currentTrack?.lyrics;

  return (
    <>
      <div
        className={`mpw-card ${player.state.isPlaying ? 'is-playing' : ''} ${isZoomed ? 'is-zoomed' : ''}`}
        onClick={e => { if (!e.target.closest('.mpw-mask')) setIsZoomed(false); }}
      >
        <audio ref={player.audioRef} preload="metadata" crossOrigin={crossOrigin} />
        <Disc
          layers={layers} isPlaying={player.state.isPlaying} isZoomed={isZoomed}
          trackKey={player.state.currentIndex} direction={player.state.direction}
          onZoomToggle={() => setIsZoomed(z => !z)}
        />
        <div className="mpw-info">
          <ScalesMixer isPlaying={player.state.isPlaying} />
          <TrackInfo layers={layers} />
          <ProgressBar currentTime={player.currentTime} duration={player.duration} onSeek={player.seek} />
          <Controls
            isPlaying={player.state.isPlaying} shuffled={player.state.shuffled} loopMode={player.state.loopMode}
            hasLyrics={!!currentLyrics} showLyrics={showLyrics}
            onToggle={player.toggle} onNext={player.next} onPrev={player.prev}
            onShuffle={player.toggleShuffle} onLoop={player.cycleLoop}
            onLyrics={() => setShowLyrics(v => !v)}
          />
          <LyricsPanel lyrics={currentLyrics} show={showLyrics} />
        </div>
      </div>

      <style>{`
        /* ════════════════════════════════════════════════════════════
           MusicPlayerWidget — SOE Vanilla CSS (Bright & Playful)
           ════════════════════════════════════════════════════════════ */

        .mpw-card {
          --mpw-bg: rgba(255, 255, 255, 0.94);
          --mpw-fg: var(--color-text, #2D3142);
          --mpw-accent: var(--color-orange, #FF6F00);
          --mpw-muted: var(--color-text-light, #5C6479);
          --mpw-radius: 28px;

          position: relative;
          display: flex;
          align-items: center;
          gap: 2rem;
          max-width: 680px;
          margin: 0 auto;
          padding: 1.75rem;
          background: var(--mpw-bg);
          border-radius: var(--mpw-radius);
          border: 1.5px solid rgba(255, 111, 0, 0.20);
          color: var(--mpw-fg);
          box-shadow: 0 20px 50px rgba(74, 53, 30, 0.10), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px) saturate(160%);
          overflow: hidden;
          transition: box-shadow 0.4s ease, border-color 0.3s ease;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        .mpw-card.is-playing {
          box-shadow: 0 20px 50px rgba(74, 53, 30, 0.12), 0 0 35px rgba(255, 111, 0, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 111, 0, 0.4);
        }

        /* ── Disc ── */
        .mpw-mask {
          position: relative;
          flex-shrink: 0;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(74, 53, 30, 0.2);
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .mpw-mask.is-zoomed {
          transform: scale(1.3);
          z-index: 10;
        }

        .mpw-spin {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
        }

        .mpw-cover {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .mpw-cover-enter { animation: mpw-cover-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mpw-cover-exit  { animation: mpw-cover-out 0.7s ease forwards; }

        @keyframes mpw-cover-in {
          from { opacity: 0; transform: scale(1.08); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mpw-cover-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.9); }
        }

        .mpw-hole {
          position: absolute;
          top: 50%; left: 50%;
          width: 30px; height: 30px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #FAF9F7;
          border: 2px solid rgba(255, 111, 0, 0.3);
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .mpw-hole-inner {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #FF6F00;
          margin: 8px auto 0;
        }

        /* ── Info panel ── */
        .mpw-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* ── ScalesMixer ── */
        .mpw-scales {
          width: 100%;
          height: 80px;
          fill: var(--mpw-accent);
          opacity: 0.75;
          transition: opacity 0.3s;
        }

        .mpw-card.is-playing .mpw-scales { opacity: 1; }

        /* ── Track info ── */
        .mpw-track-info { position: relative; min-height: 3.5rem; }

        .mpw-ti-layer { display: flex; flex-direction: column; gap: 0.15rem; }
        .mpw-ti-abs   { position: absolute; inset: 0; }

        .mpw-artist {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--mpw-muted);
          margin: 0;
        }

        .mpw-track {
          font-family: var(--font-heading, Fredoka, system-ui);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--mpw-fg);
          line-height: 1.2;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mpw-ti-enter { animation: mpw-ti-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mpw-ti-exit  { animation: mpw-ti-out 0.35s ease forwards; }

        @keyframes mpw-ti-in {
          from { opacity: 0; transform: translateX(var(--dx)); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mpw-ti-out {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(var(--dx)); }
        }

        /* ── Progress ── */
        .mpw-bar {
          width: 100%;
          height: 8px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          touch-action: none;
        }

        .mpw-bar::before {
          content: '';
          position: absolute;
          top: -12px;
          bottom: -12px;
          left: 0;
          right: 0;
        }

        .mpw-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF6F00, #FFB300);
          border-radius: 4px;
          transition: width 0.1s linear;
        }

        .mpw-time {
          display: flex;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--mpw-muted);
        }

        /* ── Controls ── */
        .mpw-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .mpw-ctrl {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.04);
          color: var(--mpw-muted);
          cursor: pointer;
          transition: color 0.2s, background 0.2s, transform 0.15s;
          touch-action: manipulation;
        }

        .mpw-ctrl:hover {
          color: var(--mpw-fg);
          background: rgba(255, 111, 0, 0.12);
          transform: scale(1.08);
        }

        .mpw-ctrl-play {
          width: 50px; height: 50px;
          background: linear-gradient(135deg, #FF6F00, #FF9800);
          color: #fff;
          box-shadow: 0 4px 15px rgba(255, 111, 0, 0.35);
        }

        .mpw-ctrl-play:hover {
          background: linear-gradient(135deg, #FF6F00, #FFA726);
          filter: brightness(1.08);
          transform: scale(1.1);
        }

        .mpw-ctrl-toggle.is-active { color: var(--mpw-accent); }

        .mpw-loop-one {
          display: none;
          position: absolute;
          font-size: 0.55rem;
          font-weight: 800;
          top: 4px; right: 3px;
        }

        .mpw-ctrl-loop.mode-one .mpw-loop-one { display: block; }
        .mpw-ctrl-loop { position: relative; }

        /* ── Lyrics Button ── */
        .mpw-ctrl-lyrics.is-active {
          color: var(--mpw-accent);
        }

        .mpw-ctrl-lyrics.is-disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }
        .mpw-ctrl-lyrics.is-disabled:hover {
          background: transparent;
          transform: none;
        }

        /* ── Lyrics Panel ── */
        .mpw-lyrics {
          max-height: 180px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0.75rem 1rem;
          background: rgba(255, 248, 240, 0.95);
          border: 1px solid rgba(255, 111, 0, 0.18);
          border-radius: 14px;
          animation: mpw-lyrics-in 0.3s ease forwards;
        }

        @keyframes mpw-lyrics-in {
          from { opacity: 0; max-height: 0; padding: 0 1rem; }
          to   { opacity: 1; max-height: 180px; padding: 0.75rem 1rem; }
        }

        .mpw-lyrics__content p {
          font-family: var(--font-body, system-ui);
          font-size: 0.8rem;
          line-height: 1.7;
          color: var(--mpw-muted);
          margin: 0;
          max-width: none;
        }

        .mpw-lyrics__label {
          font-weight: 700 !important;
          color: var(--mpw-accent) !important;
          font-size: 0.75rem !important;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.6rem !important;
        }

        .mpw-lyrics__content p:first-child.mpw-lyrics__label {
          margin-top: 0 !important;
        }

        .mpw-lyrics::-webkit-scrollbar { width: 4px; }
        .mpw-lyrics::-webkit-scrollbar-track { background: transparent; }
        .mpw-lyrics::-webkit-scrollbar-thumb { background: rgba(255, 111, 0, 0.3); border-radius: 2px; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .mpw-card {
            flex-direction: column;
            align-items: center;
            padding: 1.25rem 1rem;
            max-width: 100%;
            width: 100%;
          }

          .mpw-mask { width: 170px; height: 170px; }
          .mpw-scales { height: 54px; }
          .mpw-track { font-size: 1.15rem; }
          .mpw-lyrics { max-height: 140px; }
          .mpw-controls { gap: 0.35rem; width: 100%; justify-content: space-evenly; }
        }
      `}</style>
    </>
  );
}

export default MusicPlayerWidget;
