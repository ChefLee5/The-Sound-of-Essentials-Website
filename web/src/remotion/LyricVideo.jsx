import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    AbsoluteFill,
} from 'remotion';

/* ── Lyric Video Composition ── */
export const LyricVideo = ({ track }) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    if (!track || !track.lyrics) {
        return (
            <AbsoluteFill style={{
                background: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h2 style={{ color: '#fff', fontFamily: 'Fredoka, sans-serif' }}>No Lyrics Found</h2>
            </AbsoluteFill>
        );
    }

    const lines = track.lyrics.split('\n').filter(l => l.trim() !== '');
    const lineDuration = durationInFrames / lines.length;

    return (
        <AbsoluteFill style={{
            background: `linear-gradient(135deg, ${track.color}22, #000)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 60,
        }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                height: 800,
                borderRadius: '50%',
                background: track.color,
                filter: 'blur(150px)',
                opacity: 0.15,
            }} />

            {lines.map((line, i) => {
                const startFrame = i * lineDuration;
                const endFrame = (i + 1) * lineDuration;

                // Show current line, previous line (dimmed), and next line (dimmed)
                const isCurrent = frame >= startFrame && frame < endFrame;
                const isPrevious = frame >= startFrame - lineDuration && frame < startFrame;

                if (!isCurrent && !isPrevious) return null;

                const opacity = isCurrent
                    ? interpolate(frame, [startFrame, startFrame + 10], [0, 1])
                    : interpolate(frame, [startFrame, startFrame + 5], [0.3, 0]);

                const translateY = isCurrent
                    ? interpolate(frame, [startFrame, startFrame + 10], [20, 0])
                    : interpolate(frame, [startFrame, startFrame + 5], [0, -20]);

                return (
                    <div
                        key={i}
                        style={{
                            opacity,
                            transform: `translateY(${translateY}px)`,
                            textAlign: 'center',
                            width: '90%',
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h2 style={{
                            fontFamily: 'Fredoka, sans-serif',
                            fontSize: line.startsWith('(') ? 32 : 64,
                            fontWeight: 700,
                            color: line.startsWith('(') ? track.color : '#fff',
                            margin: 0,
                            lineHeight: 1.2,
                            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                            textTransform: line.startsWith('(') ? 'uppercase' : 'none',
                            letterSpacing: line.startsWith('(') ? 4 : 0,
                        }}>
                            {line}
                        </h2>
                    </div>
                );
            })}

            {/* Track Info Overlay */}
            <div style={{
                position: 'absolute',
                bottom: 40,
                left: 60,
                display: 'flex',
                alignItems: 'center',
                gap: 16
            }}>
                <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    background: track.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                }}>
                    {track.domainIcon || '🎵'}
                </div>
                <div>
                    <h3 style={{
                        color: '#fff',
                        fontFamily: 'Fredoka, sans-serif',
                        margin: 0,
                        fontSize: 24
                    }}>
                        {track.title}
                    </h3>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: 'Inter, sans-serif',
                        margin: 0,
                        fontSize: 14,
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>
                        {track.domain}
                    </p>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                top: 40,
                right: 60,
                fontFamily: 'Fredoka, sans-serif',
                fontSize: 18,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: 1,
                textTransform: 'uppercase',
            }}>
                Sound of Essentials: <span style={{ fontFamily: 'Dancing Script, cursive', textTransform: 'none', fontSize: '1.2em', color: '#FFB300' }}>Rhythm Quest</span>
            </div>
        </AbsoluteFill>
    );
};
