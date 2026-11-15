import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    AbsoluteFill,
} from 'remotion';
import { Tactile3DCanvas } from './Tactile3DCanvas.jsx';

export const SOE_STYLE_SURFACES = {
    PAPER_POPUP: {
        label: 'Atlas #02 • Paper Pop-Up',
        bg: 'linear-gradient(160deg, #FFF8F0 0%, #FFEEDB 100%)',
        cardBg: '#FFFFFF',
        border: '3px solid #FF6F00',
        shadow: '0 18px 0 #E0C5A8, 0 28px 50px rgba(121,85,72,0.18)',
        accent: '#FF6F00',
    },
    SOFT_CLAY: {
        label: 'Atlas #03 • Soft Clay',
        bg: 'linear-gradient(160deg, #FFF8F0 0%, #F7EFE5 100%)',
        cardBg: '#FFF3E0',
        border: '4px solid #FFB300',
        shadow: 'inset 0 -8px 0 rgba(255,111,0,0.18), 0 20px 40px rgba(121,85,72,0.16)',
        accent: '#E65100',
    },
    TINY_DIORAMA: {
        label: 'Atlas #04 • Tiny Diorama',
        bg: 'linear-gradient(160deg, #FFF8F0 0%, #E8F5E9 100%)',
        cardBg: '#FFFFFF',
        border: '3px solid #4CAF50',
        shadow: '0 16px 0 #795548, 0 24px 44px rgba(26,26,46,0.15)',
        accent: '#2E7D32',
    },
    MARBLE_RUN: {
        label: 'Atlas #09 • Marble Run',
        bg: 'linear-gradient(160deg, #FFF8F0 0%, #EFEBE9 100%)',
        cardBg: '#FAF3EA',
        border: '3px solid #795548',
        shadow: '0 14px 0 #5D4037, 0 24px 44px rgba(93,64,55,0.2)',
        accent: '#FF6F00',
    },
    PAINTED_STORYBOOK: {
        label: 'Atlas #13 • Painted',
        bg: 'linear-gradient(160deg, #FFF8F0 0%, #FFE0B2 100%)',
        cardBg: '#FFFDF9',
        border: '3px solid #D84315',
        shadow: '0 16px 36px rgba(216,67,21,0.16)',
        accent: '#D84315',
    },
};

const DEFAULT_CUES = [
    {
        index: 1,
        start_sec: 0,
        end_sec: 4.5,
        beat: 'LAYER_1_ACHE',
        text: 'Algorithmic cartoons overstimulate young minds before they ever learn to love reading.',
    },
    {
        index: 2,
        start_sec: 4.5,
        end_sec: 11,
        beat: 'LAYER_2_SOLUTION',
        text: "Crafted by a father's heart and a mother's love: 19 studio songs & 4,000+ illustrated words (Ages 2–7).",
    },
    {
        index: 3,
        start_sec: 11,
        end_sec: 15,
        beat: 'LAYER_3_INVITATION',
        text: 'Stream the 19-Track Rhythm Quest Album 100% Free → soelearn.com/listen',
    },
];

/* ── TactileExplainer: Code-Video Iteration & SRT Beat-Synced Template ── */
export const TactileExplainer = ({
    topic = 'Why Screen-Free Rhythm Builds Reading Readiness (Ages 2–7)',
    stylePreset = 'PAPER_POPUP',
    srtCues = DEFAULT_CUES,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const surface = SOE_STYLE_SURFACES[stylePreset] || SOE_STYLE_SURFACES.PAPER_POPUP;
    const currentSec = frame / fps;
    const cues = Array.isArray(srtCues) && srtCues.length > 0 ? srtCues : DEFAULT_CUES;
    const activeCue =
        cues.find((c) => currentSec >= c.start_sec && currentSec < c.end_sec) ||
        cues[cues.length - 1];

    const cueStartFrame = Math.round((activeCue?.start_sec || 0) * fps);
    const localFrame = Math.max(0, frame - cueStartFrame);
    const cardPop = spring({
        frame: localFrame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });
    const textOpacity = interpolate(localFrame, [0, 10], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill
            style={{
                background: surface.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '64px 56px',
                color: '#1A1A2E',
            }}
        >
            <Tactile3DCanvas stylePreset={stylePreset} />

            {/* Top Brand & Style Lock Pill */}
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        padding: '10px 22px',
                        borderRadius: 999,
                        background: surface.accent,
                        color: '#FFF8F0',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                >
                    AGES 2–7 • 100% SCREEN-FREE
                </div>
                <div
                    style={{
                        padding: '8px 18px',
                        borderRadius: 999,
                        background: 'rgba(26,26,46,0.08)',
                        color: '#4E342E',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    {surface.label}
                </div>
            </div>

            {/* Center Tactile Layer Card */}
            <div
                style={{
                    width: '92%',
                    background: surface.cardBg,
                    border: surface.border,
                    borderRadius: 32,
                    padding: '54px 48px',
                    boxShadow: surface.shadow,
                    transform: `scale(${0.92 + cardPop * 0.08})`,
                    opacity: textOpacity,
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 20,
                        fontWeight: 700,
                        color: surface.accent,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        marginBottom: 18,
                    }}
                >
                    {topic}
                </div>
                <h2
                    style={{
                        fontFamily: 'Fredoka, Outfit, sans-serif',
                        fontSize: 48,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: '#1A1A2E',
                        margin: 0,
                    }}
                >
                    {activeCue?.text}
                </h2>
            </div>

            {/* Bottom Heritage Lock */}
            <div
                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#5D4037',
                    letterSpacing: 0.5,
                }}
            >
                Crafted by a father&apos;s heart and a mother&apos;s love • 19 Studio Songs • 4,000+ Words
            </div>
        </AbsoluteFill>
    );
};

