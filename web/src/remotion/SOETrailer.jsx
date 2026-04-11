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

/* ── Scene 1: Logo Intro ── */
const LogoIntro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
    const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const taglineOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });
    const taglineY = interpolate(frame, [25, 45], [20, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #1E88E5, #7B1FA2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                opacity,
                transform: `scale(${scale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
            }}>
                <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6F00, #FFB300)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 48,
                    color: '#fff',
                    boxShadow: '0 8px 40px rgba(255,111,0,0.4)',
                }}>
                    ♪
                </div>
                <h1 style={{
                    fontFamily: 'Fredoka, Outfit, sans-serif',
                    fontSize: 64,
                    fontWeight: 700,
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: 1.1,
                    margin: 0,
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
            </div>
            <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 28,
                color: 'rgba(255,255,255,0.85)',
                marginTop: 20,
                opacity: taglineOpacity,
                transform: `translateY(${taglineY}px)`,
                textAlign: 'center',
            }}>
                Designed for the developing brain, not the algorithm.
            </p>
        </AbsoluteFill>
    );
};

/* ── Scene 2: Crisis Stats ── */
const CrisisStats = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const stats = [
        { value: '300M', label: 'children can\'t read', color: '#FF6F00', delay: 0 },
        { value: '44M', label: 'teachers missing', color: '#4CAF50', delay: 20 },
        { value: '1,000', label: 'critical days', color: '#9C27B0', delay: 40 },
    ];

    return (
        <AbsoluteFill style={{
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 60,
        }}>
            <h2 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: 42,
                fontWeight: 600,
                color: '#1a1a2e',
                marginBottom: 50,
                opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
                textAlign: 'center',
            }}>
                A State of Emergency
            </h2>

            <div style={{
                display: 'flex',
                gap: 80,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {stats.map((stat, i) => {
                    const statScale = spring({
                        frame: Math.max(0, frame - stat.delay),
                        fps,
                        config: { damping: 10, stiffness: 100 },
                    });
                    const statOpacity = interpolate(
                        frame,
                        [stat.delay, stat.delay + 15],
                        [0, 1],
                        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    );

                    return (
                        <div key={i} style={{
                            textAlign: 'center',
                            opacity: statOpacity,
                            transform: `scale(${statScale})`,
                        }}>
                            <div style={{
                                fontFamily: 'Fredoka, sans-serif',
                                fontSize: 84,
                                fontWeight: 700,
                                color: stat.color,
                                lineHeight: 1,
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 22,
                                color: '#4a4a68',
                                marginTop: 12,
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

/* ── Scene 3: Duo Showcase (Replaces CharacterLineup) ── */
const DuoShowcase = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const duos = [
        { name: 'Kenji & Aiko', land: 'Harmonia', src: '/assets/duos/1_Kenji Aiko.jpg' },
        { name: 'Silas & Vesta', land: 'Geometria', src: '/assets/duos/2_Silas Vesta.jpg' },
        { name: 'Felix & Amara', land: 'Vitalis', src: '/assets/duos/3_Felix Amara.jpg' },
        { name: 'Ezra & Athena', land: 'Natura', src: '/assets/duos/4_Ezra Athena.jpg' },
        { name: 'Kwame & Octavia', land: 'Numeria', src: '/assets/duos/5_Kwame Octavia.jpg' },
        { name: 'Elias & Selene', land: 'Chronia', src: '/assets/duos/6_Elias Selene.jpg' },
        { name: 'Ronan & Nerissa', land: 'Lexiconia', src: '/assets/duos/7_Ronan Nerissa.jpg' },
        { name: 'Seriphia', land: 'The Celestial', src: '/assets/characters/ETERNAL LEARNING MOTHER.png' }
    ];

    return (
        <AbsoluteFill style={{ background: '#fff' }}>
            {duos.map((duo, i) => {
                const startFrame = i * 20;
                const duoOpacity = interpolate(frame, [startFrame, startFrame + 10, startFrame + 15, startFrame + 20], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                const duoScale = interpolate(frame, [startFrame, startFrame + 20], [1.1, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

                return (
                    <Sequence from={startFrame} durationInFrames={20} key={duo.name}>
                        <AbsoluteFill style={{
                            opacity: duoOpacity,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 40
                        }}>
                            <div style={{
                                transform: `scale(${duoScale})`,
                                borderRadius: 24,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                width: '80%',
                                maxWidth: 800
                            }}>
                                <Img src={duo.src} style={{ width: '100%', display: 'block' }} />
                            </div>
                            <h2 style={{
                                fontFamily: 'Fredoka, sans-serif',
                                fontSize: 48,
                                fontWeight: 700,
                                color: '#1a1a2e',
                                marginTop: 40
                            }}>
                                Meet <span style={{ color: '#FF6F00' }}>{duo.name}</span>
                            </h2>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, color: '#4a4a68' }}>{duo.land}</p>
                        </AbsoluteFill>
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

/* ── Scene 4: CTA End Card ── */
const CTAEndCard = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
    const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1]);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(135deg, #7B1FA2, #1E88E5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 52,
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 30,
                    lineHeight: 1.2,
                }}>
                    Biology doesn't wait.
                </h2>
                <div style={{
                    display: 'inline-block',
                    padding: '18px 48px',
                    borderRadius: 50,
                    background: 'linear-gradient(135deg, #FF6F00, #FF8F00)',
                    color: '#fff',
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: 28,
                    fontWeight: 600,
                    transform: `scale(${pulse})`,
                    boxShadow: '0 8px 30px rgba(255,111,0,0.35)',
                }}>
                    Join the Quest →
                </div>
            </div>
        </AbsoluteFill>
    );
};

/* ── Main Composition ── */
export const SOETrailer = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={Math.round(fps * 4)}>
                <LogoIntro />
            </Sequence>
            <Sequence from={Math.round(fps * 4)} durationInFrames={Math.round(fps * 4.5)}>
                <CrisisStats />
            </Sequence>
            <Sequence from={Math.round(fps * 8.5)} durationInFrames={Math.round(fps * 5.5)}>
                <DuoShowcase />
            </Sequence>
            <Sequence from={Math.round(fps * 14)} durationInFrames={Math.round(fps * 3)}>
                <CTAEndCard />
            </Sequence>
        </AbsoluteFill>
    );
};
