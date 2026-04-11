import { useEffect, useRef } from 'react';

/**
 * CanvasBackground — replaces the Spline 3D background.
 *
 * Renders a fixed full-page <canvas> with:
 *  - Slowly drifting colour orbs (green / purple / orange / blue)
 *  - Floating musical note glyphs that rise and fade
 *  - Small sparkle dots for texture
 *
 * All rendering is pure canvas 2D — zero external dependencies,
 * works on every device, and never hijacks body scroll.
 *
 * position: fixed, z-index: 0  → sits behind all page content
 * pointer-events: none          → all site interactions unaffected
 */

// ── Palette: mirrors the CSS design tokens ──────────────────────
const COLORS = {
  green:  { r: 76,  g: 175, b: 80  },
  purple: { r: 123, g: 31,  b: 162 },
  orange: { r: 255, g: 111, b: 0   },
  blue:   { r: 30,  g: 136, b: 229 },
  yellow: { r: 255, g: 179, b: 0   },
};
const ORB_PALETTE = Object.values(COLORS);

// ── Musical notes ────────────────────────────────────────────────
const NOTES = ['♩', '♪', '♫', '♬', '𝅗𝅥', '♭', '♮'];

// ─────────────────────────────────────────────────────────────────
// Helper: random float between min and max
function rand(min, max) { return Math.random() * (max - min) + min; }

// ─────────────────────────────────────────────────────────────────
// Orb class — large soft circle that drifts slowly
class Orb {
  constructor(W, H) { this.reset(W, H, true); }

  reset(W, H, init = false) {
    const c = ORB_PALETTE[Math.floor(Math.random() * ORB_PALETTE.length)];
    this.x    = rand(0, W);
    this.y    = init ? rand(0, H) : rand(H * 0.8, H + 200);
    this.r    = rand(180, 380);
    this.vx   = rand(-0.18, 0.18);
    this.vy   = rand(-0.25, -0.08);
    this.alpha = rand(0.022, 0.055);
    this.r_   = `${c.r},${c.g},${c.b}`;
  }

  update(W, H) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y + this.r < -200) this.reset(W, H);
    if (this.x < -this.r) this.x = W + this.r;
    if (this.x > W + this.r) this.x = -this.r;
  }

  draw(ctx) {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0,   `rgba(${this.r_},${this.alpha})`);
    g.addColorStop(0.5, `rgba(${this.r_},${this.alpha * 0.5})`);
    g.addColorStop(1,   `rgba(${this.r_},0)`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// ─────────────────────────────────────────────────────────────────
// Note class — musical glyph that rises and fades out
class Note {
  constructor(W, H) { this.reset(W, H, true); }

  reset(W, H, init = false) {
    const c = ORB_PALETTE[Math.floor(Math.random() * ORB_PALETTE.length)];
    this.x     = rand(40, W - 40);
    this.y     = init ? rand(0, H) : H + rand(20, 80);
    this.size  = rand(14, 28);
    this.vy    = rand(-0.45, -0.2);
    this.vx    = rand(-0.08, 0.08);
    this.alpha = 0;
    this.maxA  = rand(0.12, 0.28);
    this.life  = 0; // 0 → 1 lifecycle
    this.glyph = NOTES[Math.floor(Math.random() * NOTES.length)];
    this.color = `${c.r},${c.g},${c.b}`;
    this.wobbleOffset = rand(0, Math.PI * 2);
    this.wobbleSpeed  = rand(0.008, 0.02);
  }

  update(W, H, t) {
    this.life += 0.003;
    this.y += this.vy;
    this.x += this.vx + Math.sin(t * this.wobbleSpeed + this.wobbleOffset) * 0.25;

    // Fade in (0→0.3 life), hold (0.3→0.7), fade out (0.7→1)
    if (this.life < 0.3) {
      this.alpha = (this.life / 0.3) * this.maxA;
    } else if (this.life < 0.7) {
      this.alpha = this.maxA;
    } else {
      this.alpha = ((1 - this.life) / 0.3) * this.maxA;
    }

    if (this.life >= 1 || this.y < -60) this.reset(W, H);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font        = `${this.size}px serif`;
    ctx.fillStyle   = `rgb(${this.color})`;
    ctx.textAlign   = 'center';
    ctx.fillText(this.glyph, this.x, this.y);
    ctx.restore();
  }
}

// ─────────────────────────────────────────────────────────────────
// Sparkle class — tiny dot that pulses and drifts
class Sparkle {
  constructor(W, H) { this.reset(W, H, true); }

  reset(W, H, init = false) {
    const c = ORB_PALETTE[Math.floor(Math.random() * ORB_PALETTE.length)];
    this.x    = rand(0, W);
    this.y    = init ? rand(0, H) : rand(H * 0.7, H + 50);
    this.r    = rand(1.5, 4);
    this.vy   = rand(-0.3, -0.08);
    this.vx   = rand(-0.05, 0.05);
    this.maxA = rand(0.15, 0.4);
    this.life = init ? rand(0, 1) : 0;
    this.color = `${c.r},${c.g},${c.b}`;
  }

  update(W, H) {
    this.life += 0.005;
    this.x += this.vx;
    this.y += this.vy;
    if (this.life >= 1 || this.y < -20) this.reset(W, H);
  }

  alpha() {
    if (this.life < 0.2) return (this.life / 0.2) * this.maxA;
    if (this.life < 0.8) return this.maxA;
    return ((1 - this.life) / 0.2) * this.maxA;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha()})`;
    ctx.fill();
  }
}

// ─────────────────────────────────────────────────────────────────
const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;
    let t = 0;

    // Particle pools
    let orbs     = [];
    let notes    = [];
    let sparkles = [];

    const setup = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;

      orbs     = Array.from({ length: 8  }, () => new Orb(W, H));
      notes    = Array.from({ length: 22 }, () => new Note(W, H));
      sparkles = Array.from({ length: 40 }, () => new Sparkle(W, H));
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Background fill — warm cream white matching --color-bg-white
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, W, H);

      // Draw layers: orbs → sparkles → notes
      for (const o of orbs)     { o.update(W, H);    o.draw(ctx); }
      for (const s of sparkles) { s.update(W, H);    s.draw(ctx); }
      for (const n of notes)    { n.update(W, H, t); n.draw(ctx); }

      t++;
      raf = requestAnimationFrame(draw);
    };

    setup();
    draw();

    const onResize = () => {
      cancelAnimationFrame(raf);
      setup();
      draw();
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};

export default CanvasBackground;
