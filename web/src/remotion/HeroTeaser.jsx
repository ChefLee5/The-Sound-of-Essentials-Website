import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Img,
    AbsoluteFill,
    Sequence,
} from 'remotion';

/* ── Hero character data ── */
const heroes = [
    { name: 'Seriphia', land: 'The Celestial', icon: '✨', color: '#9C27B0', img: '/assets/characters/ETERNAL LEARNING MOTHER.png' },
    { name: 'Kenji', land: 'Harmonia', icon: '🎵', color: '#d4a843', img: '/assets/characters/KENJI.jpg' },
    { name: 'Aiko', land: 'Harmonia', icon: '🎵', color: '#d4a843', img: '/assets/characters/AIKO.jpg' },
    { name: 'Kwame', land: 'Numeria', icon: '🔢', color: '#7fb685', img: '/assets/characters/KWAME.jpg' },
    { name: 'Octavia', land: 'Numeria', icon: '🔢', color: '#7fb685', img: '/assets/characters/OCTAVIA.jpg' },
    { name: 'Felix', land: 'Vitalis', icon: '🤸', color: '#c4785a', img: '/assets/characters/FELIX.jpg' },
    { name: 'Amara', land: 'Vitalis', icon: '🤸', color: '#c4785a', img: '/assets/characters/AMARA.jpg' },
    { name: 'Elias', land: 'Chronia', icon: '⏰', color: '#9678c4', img: '/assets/characters/ELIAS.jpg' },
    { name: 'Selene', land: 'Chronia', icon: '⏰', color: '#9678c4', img: '/assets/characters/SELENE.jpg' },
    { name: 'Ronan', land: 'Lexiconia', icon: '📖', color: '#d4a843', img: '/assets/characters/RONAN.jpg' },
    { name: 'Nerissa', land: 'Lexiconia', icon: '📖', color: '#d4a843', img: '/assets/characters/NERISSA.jpg' },
    { name: 'Silas', land: 'Geometria', icon: '📐', color: '#7fb685', img: '/assets/characters/SILAS.jpg' },
    { name: 'Vesta', land: 'Geometria', icon: '📐', color: '#7fb685', img: '/assets/characters/VESTA.jpg' },
    { name: 'Ezra', land: 'Natura', icon: '🌊', color: '#5ba4c9', img: '/assets/characters/EZRA.jpg' },
    { name: 'Athena', land: 'Natura', icon: '🌊', color: '#5ba4c9', img: '/assets/characters/ATHENA.jpg' },
];

/* ── Scene 1: Episode Title Card ── */
const TitleCard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleScale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
    const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
    const subtitleY = interpolate(frame, [20, 40], [25, 0], { extrapolateRight: 'clamp' });
    const badgeOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #4CAF50, #1E88E5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                padding: '8px 24px',
                borderRadius: 50,
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 20,
                opacity: badgeOpacity,
            }}>
                Episode 1
            </div>

            <h1 style={{
                fontFamily: 'Fredoka, Outfit, sans-serif',
                fontSize: 64,
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
                lineHeight: 1.1,
                transform: `scale(${titleScale})`,
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}>
                The Sound of Essentials:<br />
                <span style={{
                    fontFamily: 'Dancing Script, cursive',
                    fontSize: '1.2em',
                    color: '#FFB300',
                    display: 'block',
                    marginTop: 10
                }}>Rhythm Quest</span>
            </h1>

            <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 26,
                color: 'rgba(255,255,255,0.9)',
                marginTop: 16,
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                textAlign: 'center',
            }}>
                The Hero's Journey Begins
            </p>
        </AbsoluteFill>
    );
};

/* ── Scene 2: Character Parade ── */
const CharacterParade = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const charsPerStep = 3;
    const steps = Math.ceil(heroes.length / charsPerStep);
    const stepDuration = 30;

    return (
        <AbsoluteFill style={{
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 40,
            padding: 20,
        }}>
            {heroes.map((hero, i) => {
                const stepIndex = Math.floor(i / charsPerStep);
                const startFrame = stepIndex * stepDuration;
                const heroSpring = spring({
                    frame: Math.max(0, frame - startFrame - (i % charsPerStep) * 5),
                    fps,
                    config: { damping: 10, stiffness: 100 },
                });
                const opacity = interpolate(
                    frame,
                    [startFrame, startFrame + 10, startFrame + stepDuration - 5, startFrame + stepDuration],
                    [0, 1, 1, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                    <div key={hero.name} style={{
                        textAlign: 'center',
                        position: 'absolute',
                        opacity,
                        transform: `scale(${heroSpring})`,
                        left: `${20 + (i % charsPerStep) * 30}%`,
                    }}>
                        <div style={{
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `5px solid ${hero.color}`,
                            boxShadow: `0 8px 30px ${hero.color}33`,
                            margin: '0 auto',
                        }}>
                            <Img
                                src={hero.img}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                        <p style={{
                            fontFamily: 'Fredoka, sans-serif',
                            fontSize: 26,
                            fontWeight: 600,
                            color: hero.color,
                            marginTop: 14,
                            marginBottom: 0,
                        }}>
                            {hero.name}
                        </p>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 14,
                            color: '#4a4a68',
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}>
                            {hero.land}
                        </p>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

/* ── Scene 3: Land Reveal ── */
const LandReveal = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
    const iconSize = interpolate(frame, [0, 25], [40, 100], { extrapolateRight: 'clamp' });
    const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(180deg, #FFF3E0, #ffffff)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                transform: `scale(${scale})`,
                textAlign: 'center',
            }}>
                <span style={{ fontSize: iconSize, display: 'block', marginBottom: 20 }}>
                    🎵
                </span>
                <h2 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 56,
                    fontWeight: 700,
                    color: '#1a1a2e',
                    opacity: textOpacity,
                    margin: 0,
                }}>
                    Welcome to <span style={{ color: '#FF6F00' }}>Harmonia</span>
                </h2>
                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 24,
                    color: '#4a4a68',
                    marginTop: 12,
                    opacity: textOpacity,
                }}>
                    The Land of Language & Manners
                </p>
            </div>
        </AbsoluteFill>
    );
};

/* ── Scene 4: End Card ── */
const EndCard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
    const shimmer = interpolate(frame % 60, [0, 30, 60], [0.85, 1, 0.85]);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #7B1FA2, #1E88E5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
                <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 34,
                    margin: '0 auto 20px',
                }}>
                    ♪
                </div>
                <h2 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 48,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 12,
                }}>
                    Coming Soon
                </h2>
                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 22,
                    color: `rgba(255,255,255,${shimmer})`,
                }}>
                    The Sound of Essentials: <span style={{ fontFamily: 'Dancing Script, cursive', fontSize: '1.1em', color: '#FFB300' }}>Rhythm Quest</span>
                </p>
            </div>
        </AbsoluteFill>
    );
};

/* ── Main Composition ── */
export const HeroTeaser = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={Math.round(fps * 3)}>
                <TitleCard />
            </Sequence>
            <Sequence from={Math.round(fps * 3)} durationInFrames={Math.round(fps * 4)}>
                <CharacterParade />
            </Sequence>
            <Sequence from={Math.round(fps * 7)} durationInFrames={Math.round(fps * 2.5)}>
                <LandReveal />
            </Sequence>
            <Sequence from={Math.round(fps * 9.5)} durationInFrames={Math.round(fps * 2.5)}>
                <EndCard />
            </Sequence>
        </AbsoluteFill>
    );
};
