import React from 'react';
import { Composition } from 'remotion';
import { SOETrailer } from './SOETrailer.jsx';
import { HeroTeaser } from './HeroTeaser.jsx';
import { LyricVideo } from './LyricVideo.jsx';
import { TactileExplainer } from './TactileExplainer.jsx';

const DEFAULT_PULSE_AD24_CUES = [
    {
        index: 1,
        start_sec: 0,
        end_sec: 4.5,
        beat: 'LAYER_1_ACHE',
        text: 'Many classrooms treat phonics as an optional strategy beside picture-guessing.',
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
        text: 'Accurate letter sounds before guessing starts → soelearn.com/listen',
    },
];

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="TactileExplainer"
                component={TactileExplainer}
                durationInFrames={450}
                fps={30}
                width={1080}
                height={1080}
                defaultProps={{
                    topic: 'Accurate Letter Sounds Before Guessing Starts (Ad24)',
                    stylePreset: 'MARBLE_RUN',
                    srtCues: DEFAULT_PULSE_AD24_CUES,
                }}
            />
            <Composition
                id="TactileExplainerVertical"
                component={TactileExplainer}
                durationInFrames={450}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    topic: 'Give Your Child a Tech-Free Literacy Sanctuary (Ad25)',
                    stylePreset: 'PAPER_POPUP',
                    srtCues: DEFAULT_PULSE_AD24_CUES,
                }}
            />
            <Composition
                id="SOETrailer"
                component={SOETrailer}
                durationInFrames={510}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="HeroTeaser"
                component={HeroTeaser}
                durationInFrames={360}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="LyricVideo"
                component={LyricVideo}
                durationInFrames={450}
                fps={30}
                width={1080}
                height={1080}
                defaultProps={{
                    track: {
                        title: 'Welcome to Harmonia',
                        domain: 'Harmonia • Language & Phonics',
                        domainIcon: '🎵',
                        color: '#FF6F00',
                        lyrics: 'Every letter holds a sound\nListen close and gather round\nClap the beat and sing along\nHarmonia makes readers strong',
                    },
                }}
            />
        </>
    );
};
