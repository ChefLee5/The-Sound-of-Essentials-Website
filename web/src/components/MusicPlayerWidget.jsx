import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

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

/* -------------------------------------------------- useTransitionSound */
function useTransitionSound() {
  const ctxRef = useRef(null);
  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);
  return useCallback((bassEnergy = 0.5) => {
    try {
      if (!ctxRef.current) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return;
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = 440 + bassEnergy * 440;
      const endFreq = startFreq * (2 / 3);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch { /* Web Audio unavailable */ }
  }, []);
}

/* --------------------------------------------------- useAudioAnalyser */
const FFT_SIZE = 256;

function useAudioAnalyser(audioRef) {
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(new Uint8Array(FFT_SIZE / 2));
  const connectedRef = useRef(false);

  const connect = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || connectedRef.current) return;
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      connectedRef.current = true;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch { /* unavailable or already connected */ }
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('play', connect, { once: true });
    return () => audio.removeEventListener('play', connect);
  }, [audioRef, connect]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const getFrequencyData = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return null;
    if (ctxRef.current?.state === 'suspended')
      ctxRef.current.resume().catch(() => {});
    analyser.getByteFrequencyData(dataRef.current);
    return dataRef.current;
  }, []);

  const getBandEnergy = useCallback((startBin, endBin) => {
    if (!analyserRef.current) return 0;
    const data = dataRef.current;
    const count = endBin - startBin;
    if (count <= 0) return 0;
    let sum = 0;
    for (let i = startBin; i < endBin && i < data.length; i++) sum += data[i];
    return sum / count / 255;
  }, []);

  return { getFrequencyData, getBandEnergy };
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

  const { getFrequencyData, getBandEnergy } = useAudioAnalyser(audioRef);
  const playTransitionSound = useTransitionSound();

  const loadTrack = useCallback((index, autoplay, direction) => {
    const audio = audioRef.current;
    if (!audio) return;
    const bassEnergy = getBandEnergy(0, 4);
    playTransitionSound(bassEnergy);
    dispatch({ type: 'SET_TRACK', index, direction });
    audio.src = tracks[index].src;
    audio.load();
    if (autoplay) audio.play().catch(() => {});
  }, [tracks, playTransitionSound, getBandEnergy]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const pos = state.order.indexOf(state.currentIndex);
    const np = pos + 1;
    if (np >= state.order.length) {
      if (state.loopMode === 'all') loadTrack(state.order[0], !audio.paused, 'next');
      else { audio.pause(); audio.currentTime = 0; }
      return;
    }
    loadTrack(state.order[np], !audio.paused, 'next');
  }, [state.order, state.currentIndex, state.loopMode, loadTrack]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const pos = state.order.indexOf(state.currentIndex);
    const pp = pos - 1;
    if (pp < 0) {
      if (state.loopMode === 'all') loadTrack(state.order[state.order.length - 1], !audio.paused, 'prev');
      else audio.currentTime = 0;
      return;
    }
    loadTrack(state.order[pp], !audio.paused, 'prev');
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
      else next();
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
    toggle, next, prev, seek, toggleShuffle, cycleLoop, getFrequencyData,
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
const BAND_RANGES = [
  [0, 1], [1, 3], [3, 6], [6, 10], [10, 16],
  [16, 24], [24, 36], [36, 52], [52, 74], [74, 100],
];
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

function ScalesMixer({ isPlaying, getFrequencyData }) {
  const maskId = useId().replace(/:/g, '_');
  const colRefs = useRef([]);
  const circleRefs = useRef(Array.from({ length: COLS }, () => []));
  const tRef = useRef(50);

  useRafLoop((_, dt) => {
    if (isPlaying) tRef.current += dt / 1000;
    const time = tRef.current;
    const freqData = getFrequencyData?.();
    for (let c = 0; c < COLS; c++) {
      let energy = 1.0;
      if (freqData) {
        const [binStart, binEnd] = BAND_RANGES[c];
        let sum = 0;
        for (let b = binStart; b < binEnd; b++) sum += freqData[b] ?? 0;
        energy = Math.sqrt(sum / (binEnd - binStart) / 255);
      }
      const bobGain = freqData ? 0.4 + energy : 1;
      const scaleGain = freqData ? 0.5 + energy : 1;
      const colEl = colRefs.current[c];
      if (colEl) colEl.style.transform = `translate(${c * 10}px, ${partAColumnY(time, c) * bobGain}px)`;
      for (let r = 0; r < ROWS; r++) {
        const circle = circleRefs.current[c][r];
        if (!circle) continue;
        const [ty, s] = partBCircle(time, c, r);
        circle.style.transform = `translateY(${ty}px) scale(${s * scaleGain})`;
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
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3h5v5" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /><path d="M16 21h5v-5" /><path d="M21 21l-7-7" /><path d="M3 3l7 7" />
        </svg>
      </button>
      <button className="mpw-ctrl" onClick={onPrev} aria-label="Previous">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 5L8 12l11 7zM5 5h2v14H5z" /></svg>
      </button>
      <button className="mpw-ctrl mpw-ctrl-play" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 5h3v14H6zM15 5h3v14h-3z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7 5v14l11-7z" /></svg>
        )}
      </button>
      <button className="mpw-ctrl" onClick={onNext} aria-label="Next">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M5 5l11 7L5 19zM17 5h2v14h-2z" /></svg>
      </button>
      <button className={`mpw-ctrl mpw-ctrl-toggle mpw-ctrl-loop ${loopMode !== 'off' ? 'is-active' : ''} ${loopMode === 'one' ? 'mode-one' : ''}`} onClick={onLoop} aria-label="Loop">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12V8a2 2 0 0 1 2-2h12" /><path d="M16 3l4 3l-4 3" /><path d="M20 12v4a2 2 0 0 1-2 2H6" /><path d="M8 21l-4-3l4-3" />
        </svg>
        <span className="mpw-loop-one">1</span>
      </button>
      <button
        className={`mpw-ctrl mpw-ctrl-toggle mpw-ctrl-lyrics ${showLyrics ? 'is-active' : ''} ${!hasLyrics ? 'is-disabled' : ''}`}
        onClick={hasLyrics ? onLyrics : undefined}
        disabled={!hasLyrics}
        aria-label="Toggle lyrics"
        title={hasLyrics ? 'Show lyrics' : 'No lyrics available'}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16" /><path d="M4 10h16" /><path d="M4 14h10" /><path d="M4 18h6" />
        </svg>
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
export function MusicPlayerWidget({ tracks, crossOrigin }) {
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
          <ScalesMixer isPlaying={player.state.isPlaying} getFrequencyData={player.getFrequencyData} />
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
           MusicPlayerWidget — SOE Vanilla CSS
           ════════════════════════════════════════════════════════════ */

        .mpw-card {
          --mpw-bg: #0d0d0d;
          --mpw-fg: #fff;
          --mpw-accent: var(--color-gold, #FF6F00);
          --mpw-muted: rgba(255,255,255,0.45);
          --mpw-radius: 24px;

          position: relative;
          display: flex;
          align-items: center;
          gap: 2rem;
          max-width: 680px;
          margin: 0 auto;
          padding: 1.5rem;
          background: var(--mpw-bg);
          border-radius: var(--mpw-radius);
          color: var(--mpw-fg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          overflow: hidden;
          transition: box-shadow 0.4s ease;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        .mpw-card.is-playing {
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,111,0,0.12), 0 0 0 1px rgba(255,255,255,0.08);
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
          width: 28px; height: 28px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: var(--mpw-bg);
          border: 2px solid rgba(255,255,255,0.1);
        }

        .mpw-hole-inner {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          margin: 7px auto 0;
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
          opacity: 0.6;
          transition: opacity 0.3s;
        }

        .mpw-card.is-playing .mpw-scales { opacity: 1; }

        /* ── Track info ── */
        .mpw-track-info { position: relative; min-height: 3.5rem; }

        .mpw-ti-layer { display: flex; flex-direction: column; gap: 0.15rem; }
        .mpw-ti-abs   { position: absolute; inset: 0; }

        .mpw-artist {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--mpw-muted);
          margin: 0;
        }

        .mpw-track {
          font-family: var(--font-heading, var(--font-body));
          font-size: 1.25rem;
          font-weight: 700;
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
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          cursor: pointer;
          overflow: hidden;
        }

        .mpw-bar-fill {
          height: 100%;
          background: var(--mpw-accent);
          border-radius: 3px;
          transition: width 0.1s linear;
        }

        .mpw-time {
          display: flex;
          gap: 0.3rem;
          font-size: 0.7rem;
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
          width: 36px; height: 36px;
          border: none;
          border-radius: 50%;
          background: transparent;
          color: var(--mpw-muted);
          cursor: pointer;
          transition: color 0.2s, background 0.2s, transform 0.15s;
        }

        .mpw-ctrl:hover {
          color: var(--mpw-fg);
          background: rgba(255,255,255,0.08);
          transform: scale(1.1);
        }

        .mpw-ctrl-play {
          width: 44px; height: 44px;
          background: var(--mpw-accent);
          color: #fff;
        }

        .mpw-ctrl-play:hover {
          background: var(--mpw-accent);
          filter: brightness(1.2);
          transform: scale(1.12);
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
          padding: 0.75rem 1rem;
          background: rgba(0,0,0,0.06);
          border-radius: 12px;
          animation: mpw-lyrics-in 0.3s ease forwards;
        }

        @keyframes mpw-lyrics-in {
          from { opacity: 0; max-height: 0; padding: 0 1rem; }
          to   { opacity: 1; max-height: 180px; padding: 0.75rem 1rem; }
        }

        .mpw-lyrics__content p {
          font-family: var(--font-body, system-ui);
          font-size: 0.75rem;
          line-height: 1.7;
          color: var(--mpw-muted);
          margin: 0;
          max-width: none;
        }

        .mpw-lyrics__label {
          font-weight: 700 !important;
          color: var(--mpw-accent) !important;
          font-size: 0.7rem !important;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 0.6rem !important;
        }

        .mpw-lyrics__content p:first-child.mpw-lyrics__label {
          margin-top: 0 !important;
        }

        .mpw-lyrics::-webkit-scrollbar { width: 4px; }
        .mpw-lyrics::-webkit-scrollbar-track { background: transparent; }
        .mpw-lyrics::-webkit-scrollbar-thumb { background: var(--mpw-muted); border-radius: 2px; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .mpw-card {
            flex-direction: column;
            align-items: center;
            padding: 1.25rem;
            max-width: 340px;
          }

          .mpw-mask { width: 180px; height: 180px; }
          .mpw-scales { height: 60px; }
          .mpw-track { font-size: 1.1rem; }
        }
      `}</style>
    </>
  );
}

export default MusicPlayerWidget;
