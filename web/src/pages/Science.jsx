import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ResearchAssistant from '../components/ResearchAssistant';
import { assetPath } from '../utils/assetPath';
import { RevealSection } from '../hooks/useReveal';
import KineticHeadline from '../components/KineticHeadline';
import JsonLd from '../components/JsonLd';
import { scienceSchema } from '../utils/schema';
import { usePageMeta } from '../hooks/usePageMeta';

const Science = () => {
    const { t } = useTranslation();
    usePageMeta({
        title: 'Science of the Sound — SOE Rhythm Quest',
        description: 'Auditory neuroscience, Sound Before Symbol pedagogy, Dalcroze Eurhythmics, Orff Schulwerk, and Kodály foundations for ages 2–7.',
        canonicalPath: '/science',
    });
    return (
        <div className="science-page">
            <JsonLd data={scienceSchema()} />
            {/* ── Hero ── */}
            <header className="science-hero">
                <div className="container text-center">
                    <div className="animate-fade-up">
                        <div className="section-label">Education Concord · Pedagogy &amp; Science</div>
                        <KineticHeadline
                            tag="h1"
                            variant="musical-bounce"
                            delay={0.1}
                            scrollTrigger={false}
                        >
                            Science of the <span className="text-gold">Sound</span>
                        </KineticHeadline>
                        <p className="section-subtitle" style={{ margin: '1rem auto' }}>
                            Why we advocate for 60 to 80 BPM organic acoustic rhythm and tactile movement over passive screens during the critical ages 2 to 7 auditory window.
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Pedagogical Methods (moved from Universe) ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('universe.science_label')}</div>
                        <KineticHeadline
                            tag="h2"
                            className="section-title"
                            variant="musical-bounce"
                        >
                            {t('universe.science_title_1')} <span className="text-plum">{t('universe.science_title_2')}</span>
                        </KineticHeadline>
                        <p className="section-subtitle" style={{ margin: '0 auto 3rem auto' }}>
                            {t('universe.science_subtitle')}
                        </p>
                    </RevealSection>

                    <div className="pedagogy-grid">
                        {[
                            { name: t('universe.pedagogy.Dalcroze.name'), desc: t('universe.pedagogy.Dalcroze.desc'), icon: '💃' },
                            { name: t('universe.pedagogy.Orff.name'), desc: t('universe.pedagogy.Orff.desc'), icon: '🥁' },
                            { name: t('universe.pedagogy.Kodaly.name'), desc: t('universe.pedagogy.Kodaly.desc'), icon: '🎶' },
                        ].map((m, i) => (
                            <RevealSection key={m.name} delay={i * 0.15}>
                                <div className="glass-card pedagogy-card">
                                    <span className="pedagogy-card__icon">{m.icon}</span>
                                    <h3>{m.name}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                    <RevealSection className="text-center">
                        <p className="pedagogy-validated">
                            {t('science.pedagogy_validated')}{' '}
                            <sup>
                                <a href="#ref-1">[1]</a>, <a href="#ref-12">[12]</a>
                            </sup>
                        </p>
                    </RevealSection>
                </div>
            </section>

            {/* ── Rhythm Builds Readers ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('science.rhythm_label')}</div>
                        <KineticHeadline
                            tag="h2"
                            className="section-title"
                            variant="musical-bounce"
                        >
                            {t('science.rhythm_title_1')} <span className="text-gold">{t('science.rhythm_title_2')}</span>
                        </KineticHeadline>
                        <p className="section-subtitle" style={{ margin: '0 auto 4rem auto' }}>
                            {t('science.rhythm_subtitle')}
                        </p>
                    </RevealSection>

                    <div className="grid-3">
                        <RevealSection delay={0.1}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">🥁</div>
                                <h3>{t('science.rhythm_cards.rhythm_not_melody.title')}</h3>
                                <p>{t('science.rhythm_cards.rhythm_not_melody.desc')}<sup><a href="#ref-2">[2]</a></sup></p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.2}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">📖</div>
                                <h3>{t('science.rhythm_cards.preschool.title')}</h3>
                                <p>{t('science.rhythm_cards.preschool.desc')}<sup><a href="#ref-3">[3]</a></sup></p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.3}>
                            <div className="glass-card science-card">
                                <div className="science-card__icon">🧬</div>
                                <h3>{t('science.rhythm_cards.genetics.title')}</h3>
                                <p>{t('science.rhythm_cards.genetics.desc')}<sup><a href="#ref-4">[4]</a></sup></p>
                            </div>
                        </RevealSection>
                    </div>

                    <RevealSection className="text-center">
                        <p className="equity-note">
                            {t('science.equity_note')}{' '}
                            <sup>
                                <a href="#ref-5">[5]</a>, <a href="#ref-12">[12]</a>
                            </sup>
                        </p>
                    </RevealSection>
                </div>
            </section>


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
                                    <Link to="/listen" className="btn btn-outline">
                                        Listen to the Tracks →
                                    </Link>
                                </div>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.2}>
                            <div className="science-intro">
                                <KineticHeadline
                                    tag="h2"
                                    className="section-title"
                                    variant="musical-bounce"
                                >
                                    Beyond the <span className="text-sage">Melody</span>
                                </KineticHeadline>
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

            {/* ── Lyrics Section 2: Hard Words (literacy) ── */}
            <section className="section glow-sage">
                <div className="container">
                    <div className="grid-2 align-center">
                        <RevealSection>
                            <div className="lyrics-card glass-card">
                                <span className="section-label" style={{ background: 'var(--color-orange)' }}>{t('science.track2_label')}</span>
                                <h2 style={{ marginBottom: '1.5rem' }}>{t('science.track2_title')}</h2>
                                <div className="lyrics-content" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                    <p>Sometimes you may hear a word that's hard to say,</p>
                                    <p>but don't worry. Slow down and say...</p>
                                    <p>Balloon. Hawaii. Oklahoma.</p>
                                    <p>Louisiana. Octopus. Vegetables.</p>
                                    <p>Spaghetti. Macaroni.</p>
                                    <p>Alaska. Nevada. Colorado.</p>
                                </div>
                                <div style={{ marginTop: '2rem' }}>
                                    <Link to="/listen" className="btn btn-outline">
                                        {t('science.listen_btn')}
                                    </Link>
                                </div>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.2}>
                            <div className="science-intro">
                                <KineticHeadline
                                    tag="h2"
                                    className="section-title"
                                    variant="musical-bounce"
                                >
                                    {t('science.beyond2_title_1')} <span className="text-sage">{t('science.beyond2_title_2')}</span>
                                </KineticHeadline>
                                <p>
                                    {t('science.beyond2_desc_1')}<sup><a href="#ref-2">[2]</a><a href="#ref-6">[6]</a></sup>
                                </p>
                                <p style={{ marginTop: '1rem' }}>
                                    {t('science.beyond2_desc_2')}
                                </p>
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
                        <KineticHeadline
                            tag="h2"
                            className="section-title"
                            variant="musical-bounce"
                        >
                            {t('science.breakdown_title_1')} <span className="text-plum">{t('science.breakdown_title_2')}</span>
                        </KineticHeadline>
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
                                    <h2>{t('science.implementation_title_1')} <span className="text-gold">{t('science.implementation_title_2')}</span></h2>
                                    <p>
                                        {t('science.implementation_desc_1')}
                                    </p>
                                    <p style={{ marginTop: '1rem' }}>
                                        {t('science.implementation_desc_2')}
                                    </p>
                                </div>
                                <div className="science-image-wrap animate-float">
                                    <img
                                        src={assetPath('/assets/scenes/time-celestia.webp')}
                                        alt="Time concept illustration from Celestia"
                                        className="science-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── Global & Domestic Screen-Free Policy Alignment ── */}
            <section className="section">
                <div className="container">
                    <RevealSection>
                        <div className="implementation-block glass-card">
                            <div className="section-label" style={{ background: 'var(--color-orange)' }}>Global &amp; Domestic Policy Alignment</div>
                            <h2 style={{ marginBottom: '1rem' }}>
                                Aligned With Leading <span className="text-gold">Screen-Free Guidelines</span>
                            </h2>
                            <p>
                                Strictly built for ages 2 to 7, the Rhythm Quest curriculum aligns independently with published public-health and early-learning standards worldwide: <strong>WHO Under-5 Screen Guidelines</strong><sup><a href="#ref-13">[13]</a></sup>, <strong>AAP &amp; India IAP Pediatric Screen Recommendations</strong><sup><a href="#ref-15">[15]</a></sup>, <strong>Singapore MOH/ECDA <em>Grow Well SG</em></strong><sup><a href="#ref-14">[14]</a></sup>, <strong>China MOE Early-Childhood Myopia Prevention Measures</strong><sup><a href="#ref-16">[16]</a></sup>, <strong>Head Start ELOF &amp; NAEYC</strong>, and <strong>Jamaica ECC Early-Learning Pillars</strong>.
                            </p>
                            <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.85 }}>
                                The Sound of Essentials (SOE) is an independent curriculum designed in alignment with publicly published early-childhood health and learning guidelines. Alignment reflects pedagogical design and does not imply formal endorsement, accreditation, or sponsorship by any government agency or intergovernmental body.
                            </p>
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── References ── */}
            <section className="section">
                <div className="container">
                    <RevealSection>
                        <div className="references-block glass-card">
                            <div className="section-label">{t('science.references_label')}</div>
                            <h2 style={{ marginBottom: '0.5rem' }}>{t('science.references_title_1')} <span className="text-gold">{t('science.references_title_2')}</span></h2>
                            <p className="section-subtitle" style={{ marginBottom: '2rem' }}>{t('science.references_subtitle')}</p>
                            <ol className="references-list">
                                <li id="ref-1">Diouf Lewis, J., &amp; Kim, S. J. Scoping Review of Music Interventions Aimed at Improving Reading Skills in Children with Specific Learning Disorders in Reading. <em>Journal of Music Therapy / PubMed</em> (2024). <a href="https://pubmed.ncbi.nlm.nih.gov/38683748/" target="_blank" rel="noopener noreferrer">pubmed.ncbi.nlm.nih.gov</a></li>
                                <li id="ref-2">Rhythm but not melody processing helps reading via phonological awareness. <em>Nature Scientific Reports</em> (2022). <a href="https://www.nature.com/articles/s41598-022-15596-7" target="_blank" rel="noopener noreferrer">nature.com</a></li>
                                <li id="ref-3">The Effect of a Music Program on Phonological Awareness in Preschoolers. <em>Frontiers in Psychology</em> (2011). <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3121007/" target="_blank" rel="noopener noreferrer">pmc.ncbi.nlm.nih.gov</a></li>
                                <li id="ref-4">Genome-wide study of musical rhythm and language/reading skills, 1M+ individuals. <em>Nature Human Behaviour</em> (2024). <a href="https://neurosciencenews.com/genetics-music-language-28151/" target="_blank" rel="noopener noreferrer">nature.com / neurosciencenews.com</a></li>
                                <li id="ref-5">Zuk, J., et al. Neural correlates of phonological processing: Disrupted in children with dyslexia and enhanced in musically trained children. <em>Developmental Cognitive Neuroscience / PMC</em> (2018). <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6481189/" target="_blank" rel="noopener noreferrer">pmc.ncbi.nlm.nih.gov</a></li>
                                <li id="ref-6">Music Training Increases Phonological Awareness and Reading Skills in Developmental Dyslexia (RCT). <em>PLOS ONE</em> (2015). <a href="https://amu.hal.science/hal-01236724/document" target="_blank" rel="noopener noreferrer">amu.hal.science</a></li>
                                <li id="ref-7">Cognitive Musical Training (CMT) for children with dyslexia: A randomized controlled trial. <em>Frontiers in Psychology</em> (2016). <a href="https://doi.org/10.3389/fpsyg.2016.00026" target="_blank" rel="noopener noreferrer">doi:10.3389/fpsyg.2016.00026</a></li>
                                <li id="ref-8">Brain Architecture &amp; Neural Plasticity in Early Childhood (Ages 0–7). <em>Harvard Center on the Developing Child</em> (2024). <a href="https://developingchild.harvard.edu" target="_blank" rel="noopener noreferrer">developingchild.harvard.edu</a></li>
                                <li id="ref-9">The Nation’s Report Card: 4th-Grade Reading Assessment. <em>National Center for Education Statistics (NAEP)</em> (2024). <a href="https://www.nationsreportcard.gov/reading/" target="_blank" rel="noopener noreferrer">nationsreportcard.gov</a></li>
                                <li id="ref-10">The State of Global Learning Poverty &amp; The 44 Million Global Teacher Shortage. <em>UNESCO &amp; World Bank</em> (2024). <a href="https://www.unesco.org/gem-report" target="_blank" rel="noopener noreferrer">unesco.org</a></li>
                                <li id="ref-11">Growth-Mindset Supportive Language (GMSL) and intrinsic motivation in early learning environments. <em>Proceedings of the National Academy of Sciences (PNAS)</em> (2023). <a href="https://doi.org/10.1073/pnas.2217743120" target="_blank" rel="noopener noreferrer">pnas.org</a></li>
                                <li id="ref-12">Slater, J., et al. Longitudinal Effects of Group Music Instruction on Literacy Skills in Low-Income Children. <em>PLOS ONE</em> (2014). <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4237413/" target="_blank" rel="noopener noreferrer">pmc.ncbi.nlm.nih.gov</a></li>
                                <li id="ref-13">World Health Organization (WHO). <em>Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age</em> (2019). <a href="https://www.who.int/publications/i/item/9789241550536" target="_blank" rel="noopener noreferrer">who.int</a></li>
                                <li id="ref-14">Singapore Ministry of Health (MOH) &amp; Early Childhood Development Agency (ECDA). <em>Grow Well SG — Guidance on Screen Use in Children</em> (2025). <a href="https://www.ecda.gov.sg" target="_blank" rel="noopener noreferrer">ecda.gov.sg</a></li>
                                <li id="ref-15">Indian Academy of Pediatrics (IAP). <em>Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents</em>. <a href="https://www.iapindia.org" target="_blank" rel="noopener noreferrer">iapindia.org</a></li>
                                <li id="ref-16">Ministry of Education of the People&apos;s Republic of China (MOE). <em>Eight Measures on Early-Childhood Myopia Prevention and Control</em> (Nov 2024). <a href="http://en.moe.gov.cn/news/press_releases/202411/t20241118_1163560.html" target="_blank" rel="noopener noreferrer">en.moe.gov.cn</a></li>
                            </ol>
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
                            <Link to="/listen" className="page-bottom-link">
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

                /* ── Ken Burns keyframes ── */
                @keyframes kenBurnsSci {
                    0%   { transform: scale(1.0) translate(0, 0); }
                    25%  { transform: scale(1.06) translate(1%, -0.5%); }
                    50%  { transform: scale(1.10) translate(0.5%, -1.5%); }
                    75%  { transform: scale(1.04) translate(-1%, -0.5%); }
                    100% { transform: scale(1.0) translate(0, 0); }
                }

                /* ── Full-page celestia sky background with Ken Burns ── */
                .science-page {
                    position: relative;
                    overflow: hidden;
                    color: #fff;
                }

                .science-page::before {
                    content: '';
                    position: fixed;
                    inset: -5%;
                    width: 110%;
                    height: 110%;
                    z-index: -1;
                    background:
                        url('${assetPath('/assets/scenes/celestia-sky-bg.png')}') center top / cover no-repeat;
                    animation: kenBurnsSci 40s ease-in-out infinite;
                    will-change: transform;
                }

                .science-page::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    z-index: -1;
                    background: linear-gradient(
                        180deg,
                        rgba(15, 15, 45, 0.45) 0%,
                        rgba(25, 25, 60, 0.30) 30%,
                        rgba(30, 30, 70, 0.25) 60%,
                        rgba(200, 210, 235, 0.40) 100%
                    );
                    pointer-events: none;
                }

                .science-page h1,
                .science-page h2,
                .science-page h3,
                .science-page .section-title {
                    color: #fff;
                }

                .science-page .section-subtitle,
                .science-page p {
                    color: rgba(255, 255, 255, 0.88);
                }

                .science-page .section-label {
                    color: rgba(255, 255, 255, 0.95);
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
                    color: rgba(255, 255, 255, 0.9);
                }

                /* ── Dark theme glass cards ── */
                .science-page .glass-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
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
                    color: #fff;
                }

                .science-card p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                }

                /* ── Pedagogy grid (from Universe) ── */
                .pedagogy-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }

                .pedagogy-card {
                    text-align: center;
                    padding: 2.5rem 2rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }

                .pedagogy-card__icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .pedagogy-card h3 {
                    font-size: 1.2rem;
                    color: #fff;
                }

                .pedagogy-card p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    color: rgba(255, 255, 255, 0.8);
                }

                .implementation-block {
                    padding: 4rem;
                }

                .pedagogy-validated,
                .equity-note {
                    margin: 2.25rem auto 0;
                    max-width: 760px;
                    padding: 1rem 1.5rem;
                    font-size: 0.98rem;
                    line-height: 1.65;
                    color: rgba(255, 255, 255, 0.94);
                    background: rgba(15, 18, 48, 0.62);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.22);
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
                    font-style: normal;
                }

                .science-page sup a {
                    color: #FFD54F;
                    text-decoration: none;
                    font-weight: 700;
                }

                .science-page sup a:hover {
                    text-decoration: underline;
                }

                .references-block {
                    padding: 3rem;
                }

                .references-list {
                    margin: 0;
                    padding-left: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .references-list li {
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.8);
                }

                .references-list a {
                    color: rgba(255, 255, 255, 0.95);
                    text-decoration: underline;
                }

                .science-page sup {
                    font-size: 0.65em;
                    opacity: 0.7;
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
                    .references-block {
                        padding: 1.5rem;
                    }
                    .grid-2 {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .science-hero {
                        padding: 7rem 0 3rem;
                    }
                    .pedagogy-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Science;
