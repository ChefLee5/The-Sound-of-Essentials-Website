import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

// ── 7 Lands Canonical Color Palette + Gold Accents ──
const LAND_COLORS = [
  '#d4a843', // Harmonia
  '#7fb685', // Numeria
  '#c4785a', // Vitalis
  '#d4897a', // Luminosity
  '#5ba4c9', // Aquaria
  '#5fb685', // Terrasol
  '#9678c4', // Celestia
  '#FF6F00', // SOE Gold/Orange
  '#FFB300', // Sun Yellow
];

const MUSIC_GLYPHS = ['♪', '♫', '♬', '✦', '★', '●', '◆'];

/**
 * High-performance full-screen celebration burst in canonical Land colors.
 * Zero external libraries, pure Canvas 2D, self-cleaning.
 */
export const triggerQuestCelebration = (options = {}) => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = options.count || 90;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const particles = [];
  const originX = options.x ? options.x : window.innerWidth / 2;
  const originY = options.y ? options.y : window.innerHeight * 0.45;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 9 + 4;
    const color = LAND_COLORS[Math.floor(Math.random() * LAND_COLORS.length)];
    const isGlyph = Math.random() > 0.45;
    const glyph = MUSIC_GLYPHS[Math.floor(Math.random() * MUSIC_GLYPHS.length)];

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
      vy: Math.sin(angle) * speed * (0.8 + Math.random() * 0.6) - 4,
      gravity: 0.18 + Math.random() * 0.08,
      drag: 0.965,
      size: Math.random() * 10 + 6,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      color,
      alpha: 1,
      fade: Math.random() * 0.012 + 0.008,
      isGlyph,
      glyph,
    });
  }

  let animationId;
  const startTime = performance.now();

  const render = (time) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.vRot;
      p.alpha -= p.fade;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isGlyph) {
          ctx.font = `bold ${Math.round(p.size * 1.5)}px Fredoka, sans-serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.glyph, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Oval pill confetti
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    if (activeCount > 0 && time - startTime < 3500) {
      animationId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  };

  animationId = requestAnimationFrame(render);
};

/**
 * Triggers a localized melodic particle burst when play is pressed.
 */
export const triggerNoteBurst = (x, y, color = '#FF6F00') => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.width = '0px';
  container.style.height = '0px';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const notes = ['♪', '♫', '✨', '✦', '♬'];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = notes[i % notes.length];
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = 40 + Math.random() * 45;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 25; // drift upward
    const rot = (Math.random() - 0.5) * 60;
    const size = 16 + Math.random() * 10;

    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.fontSize = `${size}px`;
    el.style.color = i % 2 === 0 ? color : '#FFB300';
    el.style.fontFamily = 'Fredoka, sans-serif';
    el.style.transform = 'translate(-50%, -50%) scale(0.4)';
    el.style.opacity = '1';
    el.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out';

    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(1.1)`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 900);
};

/**
 * Magnetic button wrapper with Apple critically damped spring physics.
 */
export const MagneticPill = ({ children, className = '', style = {}, intensity = 0.22, ...props }) => {
  const ref = useRef(null);
  // Apple WWDC 2018 parameters: critically damped (no overshoot, snappy response)
  const x = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 });
  const y = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * intensity;
    const deltaY = (e.clientY - centerY) * intensity;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block', touchAction: 'manipulation', ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 3D Magnetic Tilt Card for Track Previews & Album Art with Apple spring physics.
 */
export const TiltCard = ({ children, className = '', style = {}, maxTilt = 8, _accentColor, ...props }) => {
  const ref = useRef(null);
  // Apple WWDC 2018 fluid rotation springs
  const rotX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.8 });
  const rotY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.8 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    
    // Direct 1:1 physical rotation mapping
    rotY.set((px - 0.5) * (maxTilt * 2));
    rotX.set((0.5 - py) * (maxTilt * 2));

    setGlare({ x: px * 100, y: py * 100, opacity: 0.16 });
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        touchAction: 'manipulation',
        ...style,
      }}
      {...props}
    >
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
        {/* Apple-style specular rim / glare shine */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
            opacity: glare.opacity,
            transition: 'opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            zIndex: 3,
          }}
        />
      </motion.div>
    </div>
  );
};
