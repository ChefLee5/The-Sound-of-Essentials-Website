import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResearchAssistant from '../components/ResearchAssistant';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';

const Science = () => {
    const { t } = useTranslation();
    useEffect(() => { document.title = 'Science of the Sound — SOE Rhythm Quest'; }, []);
    return (
        <div className="science-page">
            {/* ── Hero ── */}
            <header className="science-hero">
                <div className="container text-center">
                    <div className="animate-fade-up">
                        <div className="section-label">Pedagogy & Science</div>
                        <h1>Science of the <span className="text-gold">Sound</span></h1>
                        <p className="section-subtitle" style={{ margin: '1rem auto' }}>
                            Chronicles of the Clock: Understanding the neurological architecture behind every rhythm.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Lyrics Section ── */}
            <section className="section glow-sage">
                <div className="container">
                    <div className="grid-2 align-center">
                        <RevealSection>
                            <div className="lyrics-card glass-card">
                                <span className="section-label" style={{ background: 'var(--color-orange)' }}>The Track</span>
                                <h2 style={{ marginBottom: '1.5rem' }}>Do You Know What Time It Is?</h2>
                                <div className="lyrics-content" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                    <p>Do you know? Do you know? Do you know what time it is?</p>
                                    <p>Is it 1:00, 2:00, 3:00, 4:00, 5:00, 6:00, 7:00, 8:00, 9:00, 10:00, 11:00, 12:00?</p>
                                    <p>Do you know? Do you know? Do you know what time it is?</p>
                                    <p>Is it 1:30, 2:30, 3:30, 4:30, 5:30, 6:30, 7:30, 8:30, 9:30, 10:30, 11:30, 12:30?</p>
                                    <p>Do you know? Do you know? Do you know what time it is?</p>
                                    <p>Is it in the morning when you just wake up?</p>
                                    <p>Is it in the afternoon and you're eating some lunch?</p>
                                    <p>Is it in the evening and you're getting ready for bed?</p>
                                    <p>Do you know what time it is?</p>
                                    <p>Is it 1:00? Is it 1:30?</p>
                                    <p>Is it in the morning when you just wake up?</p>
                                    <p>Is it in the afternoon and you're eating some lunch?</p>
                                    <p>Is it in the evening and you're getting ready for bed?</p>
                                    <p>Do you know? Do you know? Do you know what time it is?</p>
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Link to="/media" className="btn btn-outline">
                                        Listen to the Tracks →
                                    </Link>
                                </div>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.2}>
                            <div className="science-intro">
                                <h2 className="section-title">Beyond the <span className="text-sage">Melody</span></h2>
                                <p>
                                    It may seem just like lyrics to a catchy song, but dive deeper and you'll see a brilliantly disguised lesson in <strong>Temporal Scaffolding and Numeracy</strong>.
                                </p>
                                <p style={{ marginTop: '1rem' }}>
                                    This track is a vital addition to <em>Celestia: The Garden of Time</em>, where our heroes <strong>Elias & Selene</strong> guide children through abstract concepts using rhythmic sequencing and emotional anchors.
                                </p>
                                <div style={{ marginTop: '3rem' }}>
                                    <ResearchAssistant />
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* ── Pedagogical Breakdown ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('science.breakdown_label')}</div>
                        <h2 className="section-title">{t('science.breakdown_title_1')} <span className="text-plum">{t('science.breakdown_title_2')}</span></h2>
                        <p className="section-subtitle" style={{ margin: '0 auto 4rem auto' }}>
                            {t('science.breakdown_subtitle')}
                        </p>
                    </RevealSection>

                    <div className="grid-3">
                        <RevealSection delay={0.1}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">🔢</div>
                                <h3>{t('science.cards.sequencing.title')}</h3>
                                <p>
                                    {t('science.cards.sequencing.desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.2}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">⚓</div>
                                <h3>{t('science.cards.anchoring.title')}</h3>
                                <p>
                                    {t('science.cards.anchoring.desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.3}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">🧠</div>
                                <h3>{t('science.cards.regulation.title')}</h3>
                                <p>
                                    {t('science.cards.regulation.desc')}
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* ── Strategic Implementation ── */}
            <section className="section glow-plum">
                <div className="container">
                    <RevealSection>
                        <div className="implementation-block glass-card">
                            <div className="grid-2 align-center">
                                <div>
                                    <div className="section-label" style={{ background: 'var(--color-purple)' }}>{t('science.implementation_label')}</div>
                                    <h2>{t('science.implementation_title_1')} <span className="text-plum">{t('science.implementation_title_2')}</span></h2>
                                    <p>
                                        {t('science.implementation_desc_1')}
                                    </p>
                                    <p style={{ marginTop: '1rem' }}>
                                        {t('science.implementation_desc_2')}
                                    </p>
                                </div>
                                <div className="science-image-wrap animate-float">
                                    <div className="science-image-placeholder">⏰</div>
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="section text-center">
                <div className="container">
                    <RevealSection>
                        <h2>{t('science.cta_title_1')} <span className="text-gold">{t('science.cta_title_2')}</span></h2>
                        <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                            {t('science.cta_subtitle')}
                        </p>
                        <div style={{ marginTop: '3rem' }}>
                            <Link to="/media" className="page-bottom-link">
                                {t('home.explore_media')}
                            </Link>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <style>{`
                .science-page .reveal-block {
                    opacity: 0;
                    transform: translateY(25px);
                    transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
                }
                .science-page .reveal-block.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }

                .science-hero {
                    padding: 10rem 0 4rem;
                }

                .lyrics-card {
                    padding: 2.5rem;
                }

                .lyrics-content p {
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                    color: var(--color-text-primary);
                }

                .science-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .science-card__icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .science-card h3 {
                    font-size: 1.3rem;
                    color: var(--color-text-primary);
                }

                .science-card p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                }

                .implementation-block {
                    padding: 4rem;
                }

                .align-center {
                    align-items: center;
                }

                .science-image-wrap {
                    position: relative;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .science-image {
                    width: 100%;
                    border-radius: var(--radius-lg);
                    border: 2px solid var(--color-border);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
                }

                .science-image-placeholder {
                    width: 100%;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 6rem;
                    background: rgba(0,0,0,0.03);
                    border-radius: var(--radius-lg);
                    border: 2px dashed var(--color-border);
                }

                @media (max-width: 768px) {
                    .implementation-block {
                        padding: 2rem;
                    }
                    .grid-2 {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .science-hero {
                        padding: 7rem 0 3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Science;
