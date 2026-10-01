import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Privacy Policy & COPPA Compliance — SOE Rhythm Quest';
  }, []);

  return (
    <div className="legal-page section" style={{ paddingTop: '8rem', paddingBottom: '5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto', color: 'var(--color-text-dark, #2B2016)', lineHeight: 1.75 }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-label" style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'var(--color-orange-soft, rgba(255,111,0,0.1))', color: 'var(--color-orange, #FF6F00)', borderRadius: 'var(--radius-pill, 50px)', fontWeight: 600, fontSize: '0.85rem' }}>
            Legal &amp; Privacy Trust
          </div>
          <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading, "Fredoka", sans-serif)', marginTop: '1rem', color: 'var(--color-text-dark, #2B2016)' }}>
            {t('legal.privacy_title')}
          </h1>
          <p style={{ color: 'var(--color-text-dark-secondary, #665c54)', fontSize: '0.95rem' }}>
            Effective Date: October 1, 2026 &bull; The Sound of Essentials: Rhythm Quest
          </p>
        </div>

        <div className="legal-content glass-card" style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-md, 20px)', border: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>1. Our Core Commitment to Children and Families</h2>
            <p>
              The Sound of Essentials (&ldquo;SOE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) produces sensory-first, neuro-affirming educational music and physical tactile curriculum designed for children ages 2 to 7 (Toddler, Pre-K to Grade 2). 
              <strong> We do not market directly to children, we do not require accounts for children, and we never sell personal data or display third-party advertisements.</strong>
            </p>
            <p>
              All purchases, newsletter subscriptions, and communications must be initiated and administered exclusively by parents, legal guardians, or authorized educators aged 18 or older.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>2. COPPA Compliance (Children&rsquo;s Online Privacy Protection Act)</h2>
            <p>
              In accordance with FTC regulations under 16 CFR Part 312 (COPPA), SOE does not knowingly collect personal identifiers from children under the age of 13:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Adult Affirmation Gate:</strong> All forms collecting an email address (such as free album downloads and newsletter subscriptions) require affirmative confirmation that the subscriber is an adult parent, guardian, or educator (18+).</li>
              <li><strong>No Student Profiling:</strong> We do not track, profile, or monetize children&rsquo;s activity.</li>
              <li><strong>Parental Rights:</strong> If a parent or guardian discovers that a child under 13 has submitted personal contact information without adult authorization, please contact us immediately at <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>info@soelearn.com</a>. We will promptly delete such records within 48 hours.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>3. Zero Third-Party Font Leakage (GDPR Compliance)</h2>
            <p>
              To protect the privacy of all visitors and uphold strict European Union General Data Protection Regulation (GDPR) standards, <strong>all typography and font assets on this website are 100% self-hosted on our first-party origin servers</strong>. No visitor IP addresses or browser metadata are transmitted to external font hosting services (such as Google Fonts servers).
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>4. Privacy-Masked Analytics &amp; CIPA Wiretapping Safeguards</h2>
            <p>
              We prioritize privacy-by-design for all interactive sessions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Keystroke &amp; Input Masking:</strong> In strict alignment with California privacy laws and the California Invasion of Privacy Act (CIPA), all input fields, contact boxes, and form entries are automatically masked (<code>data-clarity-mask="true"</code>). We do not record or view sensitive user keystrokes.</li>
              <li><strong>Affirmative Cookie Consent:</strong> Analytics tracking operates in restricted mode until affirmative consent is provided via our cookie banner. Visitors may decline non-essential cookies at any time without impacting access to free learning materials.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>5. What Information We Collect</h2>
            <p>We only collect information deliberately provided by adult users:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Adult name and email address provided during opt-in for album access, curriculum guides, or educator inquiries.</li>
              <li><strong>Order &amp; Billing Data:</strong> Direct payment processing is tokenized securely via PCI-DSS certified payment processors (Stripe). SOE never stores raw credit card numbers or CVV codes on our servers.</li>
              <li><strong>Shipping Details:</strong> Physical mailing addresses captured solely for print workbook deliveries.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>6. CAN-SPAM Compliance &amp; Contact Information</h2>
            <p>
              Every educational email and newsletter sent by SOE includes an instant one-click unsubscribe link and our verified physical contact address:
            </p>
            <div style={{ background: 'var(--color-bg-cream, #faf9f7)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-sm, 12px)', marginTop: '0.5rem', borderLeft: '4px solid var(--color-orange, #FF6F00)' }}>
              <strong>The Sound of Essentials</strong><br />
              Attn: Privacy &amp; Compliance Officer<br />
              P.O. Box 724<br />
              Email: <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange, #FF6F00)' }}>info@soelearn.com</a><br />
              Website: <a href="https://thesoundofessentials.com" style={{ color: 'var(--color-orange, #FF6F00)' }}>thesoundofessentials.com</a>
            </div>
          </section>

          <div style={{ borderTop: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/terms" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>&larr; View Terms of Service</Link>
            <Link to="/dmca" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>View DMCA Policy &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
