import React, { useEffect, useRef, useState } from 'react';

/**
 * ParallaxHero — floating branded SVG shapes that respond to scroll.
 * Drop this inside any hero <header> for instant depth.
 *
 * Props:
 *   variant: 'home' | 'universe' — determines which set of floating elements to render
 */

/* ── SVG shape definitions ── */
const MusicNote = ({ color = 'currentColor' }) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3v11.5A3.5 3.5 0 1 1 7 11V7l12-3v4a3.5 3.5 0 1 1-2-3.18V5.56L9 7.33V3z" />
    </svg>
);

const SoundWave = ({ color = 'currentColor' }) => (
    <svg width="1em" height="0.6em" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="6" width="3" height="6" rx="1.5" fill={color} />
        <rect x="5" y="3" width="3" height="12" rx="1.5" fill={color} />
        <rect x="10" y="0" width="3" height="18" rx="1.5" fill={color} />
        <rect x="15" y="3" width="3" height="12" rx="1.5" fill={color} />
        <rect x="20" y="6" width="3" height="6" rx="1.5" fill={color} />
        <rect x="25" y="8" width="3" height="2" rx="1" fill={color} />
    </svg>
);

const Star = ({ color = 'currentColor' }) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
);

const Diamond = ({ color = 'currentColor' }) => (
    <svg width="0.8em" height="0.8em" viewBox="0 0 16 16" fill={color} xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,0 16,8 8,16 0,8" />
    </svg>
);

const Circle = ({ color = 'currentColor' }) => (
    <svg width="0.8em" height="0.8em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" />
    </svg>
);

// Map shape name to component
const SHAPES = { note: MusicNote, wave: SoundWave, star: Star, diamond: Diamond, circle: Circle };

/* ── Element configs ── */
const homeElements = [
    { shape: 'note', size: 28, top: '12%', left: '8%', speed: 0.3, delay: 0, opacity: 0.28, color: '#4CAF50' },
    { shape: 'wave', size: 38, top: '25%', left: '84%', speed: 0.5, delay: 0.5, opacity: 0.22, color: '#1E88E5' },
    { shape: 'star', size: 22, top: '60%', left: '5%', speed: 0.2, delay: 1, opacity: 0.20, color: '#FF6F00' },
    { shape: 'diamond', size: 16, top: '18%', left: '45%', speed: 0.4, delay: 0.3, opacity: 0.15, color: '#7B1FA2' },
    { shape: 'circle', size: 20, top: '75%', left: '90%', speed: 0.35, delay: 0.8, opacity: 0.18, color: '#4CAF50' },
    { shape: 'note', size: 24, top: '40%', left: '92%', speed: 0.25, delay: 1.2, opacity: 0.22, color: '#FF6F00' },
    { shape: 'wave', size: 32, top: '55%', left: '20%', speed: 0.45, delay: 0.6, opacity: 0.15, color: '#1E88E5' },
    { shape: 'star', size: 18, top: '8%', left: '72%', speed: 0.55, delay: 0.2, opacity: 0.18, color: '#FFB300' },
    { shape: 'note', size: 20, top: '85%', left: '35%', speed: 0.3, delay: 1.5, opacity: 0.22, color: '#7B1FA2' },
    { shape: 'circle', size: 14, top: '35%', left: '55%', speed: 0.6, delay: 0.9, opacity: 0.12, color: '#1E88E5' },
    { shape: 'note', size: 18, top: '5%', left: '30%', speed: 0.32, delay: 0.15, opacity: 0.18, color: '#4CAF50' },
    { shape: 'star', size: 14, top: '22%', left: '62%', speed: 0.48, delay: 0.7, opacity: 0.14, color: '#FF6F00' },
    { shape: 'diamond', size: 20, top: '48%', left: '12%', speed: 0.28, delay: 1.1, opacity: 0.16, color: '#7B1FA2' },
    { shape: 'wave', size: 40, top: '68%', left: '75%', speed: 0.52, delay: 0.35, opacity: 0.18, color: '#4CAF50' },
    { shape: 'circle', size: 12, top: '90%', left: '50%', speed: 0.38, delay: 1.4, opacity: 0.12, color: '#1E88E5' },
    { shape: 'note', size: 26, top: '15%', left: '95%', speed: 0.22, delay: 0.55, opacity: 0.18, color: '#FFB300' },
    { shape: 'star', size: 16, top: '32%', left: '3%', speed: 0.42, delay: 0.85, opacity: 0.14, color: '#FF6F00' },
    { shape: 'note', size: 22, top: '72%', left: '42%', speed: 0.33, delay: 1.25, opacity: 0.20, color: '#4CAF50' },
    { shape: 'diamond', size: 12, top: '52%', left: '68%', speed: 0.58, delay: 0.4, opacity: 0.12, color: '#7B1FA2' },
];

const universeElements = [
    { shape: 'star', size: 26, top: '15%', left: '10%', speed: 0.25, delay: 0, opacity: 0.22, color: '#FFB300' },
    { shape: 'circle', size: 20, top: '20%', left: '80%', speed: 0.5, delay: 0.4, opacity: 0.18, color: '#4CAF50' },
    { shape: 'note', size: 28, top: '65%', left: '6%', speed: 0.2, delay: 0.8, opacity: 0.20, color: '#1E88E5' },
    { shape: 'diamond', size: 14, top: '30%', left: '50%', speed: 0.45, delay: 0.2, opacity: 0.14, color: '#7B1FA2' },
    { shape: 'wave', size: 36, top: '70%', left: '88%', speed: 0.35, delay: 1, opacity: 0.18, color: '#FF6F00' },
    { shape: 'star', size: 16, top: '10%', left: '60%', speed: 0.55, delay: 0.6, opacity: 0.14, color: '#4CAF50' },
    { shape: 'note', size: 22, top: '50%', left: '90%', speed: 0.3, delay: 1.3, opacity: 0.22, color: '#FFB300' },
    { shape: 'circle', size: 18, top: '80%', left: '25%', speed: 0.4, delay: 0.5, opacity: 0.14, color: '#7B1FA2' },
    { shape: 'diamond', size: 12, top: '45%', left: '18%', speed: 0.6, delay: 1.1, opacity: 0.12, color: '#1E88E5' },
    { shape: 'star', size: 14, top: '88%', left: '65%', speed: 0.35, delay: 0.7, opacity: 0.18, color: '#FF6F00' },
    { shape: 'wave', size: 42, top: '5%', left: '35%', speed: 0.28, delay: 0.15, opacity: 0.16, color: '#4CAF50' },
    { shape: 'note', size: 16, top: '25%', left: '95%', speed: 0.48, delay: 0.55, opacity: 0.18, color: '#7B1FA2' },
    { shape: 'diamond', size: 20, top: '58%', left: '15%', speed: 0.32, delay: 1.2, opacity: 0.14, color: '#FF6F00' },
    { shape: 'circle', size: 12, top: '72%', left: '42%', speed: 0.52, delay: 0.35, opacity: 0.12, color: '#1E88E5' },
    { shape: 'note', size: 24, top: '38%', left: '72%', speed: 0.22, delay: 0.9, opacity: 0.20, color: '#FFB300' },
];

const ParallaxHero = ({ variant = 'home' }) => {
    const containerRef = useRef(null);
    const [scrollY, setScrollY] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                setScrollY(window.scrollY);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const elements = variant === 'universe' ? universeElements : homeElements;
    const bgMap = {
        home: `${import.meta.env.BASE_URL}assets/backgrounds/bg1.png`,
        universe: `${import.meta.env.BASE_URL}assets/backgrounds/bg2.png`,
        media: `${import.meta.env.BASE_URL}assets/backgrounds/bg3.png`,
    };
    const bgImage = bgMap[variant];

    return (
        <div className="parallax-hero-layer" ref={containerRef} aria-hidden="true">
            {bgImage && (
                <div
                    className="parallax-hero-layer__bg"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        transform: `translateY(${scrollY * 0.12}px)`,
                    }}
                />
            )}
            {elements.map((el, i) => {
                const ShapeComponent = SHAPES[el.shape] || Star;
                return (
                    <span
                        key={i}
                        className="parallax-hero-layer__item"
                        style={{
                            position: 'absolute',
                            top: el.top,
                            left: el.left,
                            fontSize: `${el.size}px`,
                            opacity: el.opacity,
                            color: el.color,
                            transform: `translateY(${scrollY * el.speed * -1}px) rotate(${scrollY * el.speed * 0.08}deg)`,
                            animationDelay: `${el.delay}s`,
                            willChange: 'transform',
                            transition: 'transform 0.1s linear',
                        }}
                    >
                        <ShapeComponent color={el.color} />
                    </span>
                );
            })}

            <style>{`
                .parallax-hero-layer {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                }

                .parallax-hero-layer__bg {
                    position: absolute;
                    inset: -10% -5%;
                    background-size: cover;
                    background-position: center;
                    opacity: 0.09;
                    filter: blur(3px) saturate(0.7);
                    mix-blend-mode: luminosity;
                    will-change: transform;
                    transition: transform 0.1s linear;
                }

                .parallax-hero-layer__item {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    animation: parallaxFloat 9s ease-in-out infinite;
                }

                @keyframes parallaxFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(4deg); }
                    66% { transform: translateY(-6px) rotate(-3deg); }
                }
            `}</style>
        </div>
    );
};

export default ParallaxHero;
