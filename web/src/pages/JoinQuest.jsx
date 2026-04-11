import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RevealSection } from '../hooks/useReveal';

const JoinQuest = () => {
    const { t } = useTranslation();
    useEffect(() => { document.title = 'Join the Quest — SOE Rhythm Quest'; }, []);
    // Newsletter State
    const [newsletter, setNewsletter] = useState({ email: '', submitted: false });
    const [newsLoading, setNewsLoading] = useState(false);
    const [newsError, setNewsError] = useState('');

    // Contact State
    const [contact, setContact] = useState({ name: '', org: '', email: '', message: '', submitted: false });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactError, setContactError] = useState('');

    const handleNewsletter = async (e) => {
        e.preventDefault();
        setNewsError('');

        if (!newsletter.email.includes('@')) {
            setNewsError(t('join.email_error'));
            return;
        }

        setNewsLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));

        setNewsLoading(false);
        setNewsletter({ ...newsletter, submitted: true });
    };

    const handleContact = async (e) => {
        e.preventDefault();
        setContactError('');

        if (!contact.email.includes('@')) {
            setContactError(t('join.org_email_error'));
            return;
        }

        setContactLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 2000));

        setContactLoading(false);
        setContact({ ...contact, submitted: true });
    };

    return (
        <div className="join-page">
            {/* ── Hero ── */}
            <header className="join-hero">
                <div className="container text-center">
                    <div className="animate-fade-up">
                        <div className="section-label">{t('join.hero_label')}</div>
                        <h1>
                            {t('join.hero_title_1')}
                            <span className="text-gold">{t('join.hero_title_2')}</span>
                        </h1>
                        <p className="section-subtitle" style={{ margin: '1rem auto' }}>
                            {t('join.hero_subtitle')}
                        </p>
                    </div>
                </div>
            </header>

            {/* ── Newsletter ── */}
            <section className="section glow-sage">
                <div className="container">
                    <RevealSection>
                        <div className="newsletter-block glass-card">
                            <div className="newsletter-block__content">
                                <span className="newsletter-block__icon">📬</span>
                                <h2>{t('join.stay_connected')}</h2>
                                <p>
                                    {t('join.newsletter_desc')}
                                </p>
                            </div>

                            {newsletter.submitted ? (
                                <div className="newsletter-success">
                                    <span style={{ fontSize: '2rem' }}>✨</span>
                                    <h3 className="text-sage">{t('join.welcome_quest')}</h3>
                                    <p>{t('join.welcome_desc')}</p>
                                </div>
                            ) : (
                                <form className="newsletter-form" onSubmit={handleNewsletter}>
                                    <div className="newsletter-form__row">
                                        <input
                                            type="email"
                                            required
                                            disabled={newsLoading}
                                            placeholder={t('join.email_placeholder')}
                                            value={newsletter.email}
                                            onChange={(e) => setNewsletter({ ...newsletter, email: e.target.value })}
                                            className="form-input"
                                            aria-label="Email address for newsletter"
                                        />
                                        <button type="submit" className="btn btn-gold" disabled={newsLoading}>
                                            {newsLoading ? (
                                                <span className="btn-loader"></span>
                                            ) : t('join.subscribe')}
                                        </button>
                                    </div>
                                    {newsError && <p className="form-error-msg animate-fade-in">{newsError}</p>}
                                    <p className="form-note">
                                        {t('join.no_spam')}
                                    </p>
                                </form>
                            )}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── Audiences ── */}
            <section className="section">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('join.who_we_serve')}</div>
                        <h2 className="section-title">
                            {t('join.find_your_role_1')}<span className="text-sage">{t('join.find_your_role_2')}</span>{t('join.find_your_role_3')}
                        </h2>
                    </RevealSection>

                    <div className="audience-grid">
                        <RevealSection delay={0}>
                            <div className="glass-card audience-card">
                                <span className="audience-card__icon">👪</span>
                                <h3>{t('join.audience_1_title')}</h3>
                                <p>
                                    {t('join.audience_1_desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.15}>
                            <div className="glass-card audience-card">
                                <span className="audience-card__icon">🏫</span>
                                <h3>{t('join.audience_2_title')}</h3>
                                <p>
                                    {t('join.audience_2_desc')}
                                </p>
                            </div>
                        </RevealSection>

                        <RevealSection delay={0.3}>
                            <div className="glass-card audience-card">
                                <span className="audience-card__icon">💼</span>
                                <h3>{t('join.audience_3_title')}</h3>
                                <p>
                                    {t('join.audience_3_desc')}
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* ── Partnership Form ── */}
            <section className="section glow-plum">
                <div className="container">
                    <RevealSection className="text-center">
                        <div className="section-label">{t('join.partnerships_label')}</div>
                        <h2 className="section-title">
                            {t('join.build_together_1')}<span className="text-plum">{t('join.build_together_2')}</span>
                        </h2>
                        <p className="section-subtitle" style={{ margin: '0 auto 2rem auto' }}>
                            {t('join.partnerships_subtitle')}
                        </p>
                    </RevealSection>

                    <RevealSection>
                        <div className="contact-form-card glass-card">
                            {contact.submitted ? (
                                <div className="contact-success text-center">
                                    <span style={{ fontSize: '3rem' }}>🤝</span>
                                    <h3 className="text-sage" style={{ marginTop: '1rem' }}>{t('join.message_received')}</h3>
                                    <p style={{ margin: '1rem auto', maxWidth: '400px' }}>
                                        {t('join.partnership_thank_you')}
                                    </p>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleContact}>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="contact-name" className="form-label">{t('join.label_name')}</label>
                                            <input
                                                id="contact-name"
                                                type="text"
                                                required
                                                disabled={contactLoading}
                                                className="form-input"
                                                placeholder={t('join.placeholder_name')}
                                                value={contact.name}
                                                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contact-org" className="form-label">{t('join.label_org')}</label>
                                            <input
                                                id="contact-org"
                                                type="text"
                                                disabled={contactLoading}
                                                className="form-input"
                                                placeholder={t('join.placeholder_org')}
                                                value={contact.org}
                                                onChange={(e) => setContact({ ...contact, org: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-email" className="form-label">{t('join.label_email')}</label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            disabled={contactLoading}
                                            className="form-input"
                                            placeholder={t('join.placeholder_email')}
                                            value={contact.email}
                                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact-message" className="form-label">{t('join.label_partner')}</label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            disabled={contactLoading}
                                            className="form-input form-textarea"
                                            placeholder={t('join.placeholder_message')}
                                            rows="5"
                                            value={contact.message}
                                            onChange={(e) => setContact({ ...contact, message: e.target.value })}
                                        />
                                    </div>

                                    {contactError && <p className="form-error-msg animate-fade-in" style={{ marginBottom: '1rem' }}>{contactError}</p>}

                                    <button type="submit" className="btn btn-gold" disabled={contactLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                                        {contactLoading ? (
                                            <>
                                                <span className="btn-loader"></span>
                                                <span style={{ marginLeft: '0.8rem' }}>{t('join.sending')}</span>
                                            </>
                                        ) : t('join.send_btn')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </RevealSection>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="section text-center">
                <div className="container">
                    <RevealSection>
                        <h2>{t('join.mission_title_1')}<span className="text-gold">{t('join.mission_title_2')}</span></h2>
                        <p className="section-subtitle" style={{ marginTop: '1rem' }}>
                            {t('join.mission_subtitle')}
                        </p>
                        <div style={{ marginTop: '3rem' }}>
                            <Link to="/media" className="page-bottom-link">
                                {t('join.explore_media')}
                            </Link>
                        </div>
                    </RevealSection>
                </div>
            </section>

            <style>{`
        .join-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .join-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .join-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Newsletter ── */
        .newsletter-block {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem;
          text-align: center;
        }

        .newsletter-block__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .newsletter-block h2 {
          margin-bottom: 0.5rem;
        }

        .newsletter-block p {
          color: var(--color-text-secondary);
          margin: 0 auto;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .newsletter-form__row {
          display: flex;
          gap: 0.8rem;
          max-width: 480px;
          margin: 0 auto;
        }

        .newsletter-form__row .form-input {
          flex: 1;
        }

        .newsletter-success {
          padding: 2rem;
        }

        .newsletter-success h3 {
          margin: 0.5rem 0;
        }

        .newsletter-success p {
          color: var(--color-text-secondary);
          margin: 0 auto;
        }

        .form-note {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.8rem;
          text-align: center;
        }

        /* ── Audience Cards ── */
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .audience-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .audience-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .audience-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .audience-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        /* ── Contact Form ── */
        .contact-form-card {
          max-width: 650px;
          margin: 0 auto;
          padding: 3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-sm);
          background: #f8f9fa;
          color: var(--color-text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color var(--transition-med);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-sage);
          box-shadow: 0 0 0 3px var(--color-sage-glow);
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-success {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .audience-grid {
            grid-template-columns: 1fr;
          }
          .newsletter-form__row {
            flex-direction: column;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Loading & Errors ── */
        .btn-loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-error-msg {
          color: #e53935;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default JoinQuest;
