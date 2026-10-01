import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const DmcaPolicy = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'DMCA Copyright & Safe Harbor Policy — SOE Rhythm Quest';
  }, []);

  return (
    <div className="legal-page section" style={{ paddingTop: '8rem', paddingBottom: '5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto', color: 'var(--color-text-dark, #2B2016)', lineHeight: 1.75 }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-label" style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'var(--color-orange-soft, rgba(255,111,0,0.1))', color: 'var(--color-orange, #FF6F00)', borderRadius: 'var(--radius-pill, 50px)', fontWeight: 600, fontSize: '0.85rem' }}>
            Intellectual Property &amp; Safe Harbor
          </div>
          <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading, "Fredoka", sans-serif)', marginTop: '1rem', color: 'var(--color-text-dark, #2B2016)' }}>
            {t('legal.dmca_title')}
          </h1>
          <p style={{ color: 'var(--color-text-dark-secondary, #665c54)', fontSize: '0.95rem' }}>
            In Compliance with 17 U.S.C. &sect; 512 (Digital Millennium Copyright Act)
          </p>
        </div>

        <div className="legal-content glass-card" style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-md, 20px)', border: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>1. Notice and Takedown Policy</h2>
            <p>
              The Sound of Essentials (&ldquo;SOE&rdquo;) respects the intellectual property rights of creators and artists. In accordance with Title 17, United States Code, Section 512(c)(2), we maintain an expedited notice-and-takedown procedure to respond promptly to notices of alleged copyright infringement.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>2. Designated Copyright Agent</h2>
            <p>
              Notices of claimed copyright infringement should be directed to our Designated Agent:
            </p>
            <div style={{ background: 'var(--color-bg-cream, #faf9f7)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-sm, 12px)', borderLeft: '4px solid var(--color-orange, #FF6F00)', marginTop: '0.5rem' }}>
              <strong>Attn: DMCA Designated Agent</strong><br />
              The Sound of Essentials<br />
              P.O. Box 724<br />
              Email: <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>info@soelearn.com</a><br />
              Subject Line: &ldquo;DMCA Takedown Notice&rdquo;
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>3. How to Submit a Valid Infringement Notice</h2>
            <p>
              To ensure compliance under 17 U.S.C. &sect; 512(c)(3), your notice must be in writing and include:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material claimed to be infringing, with sufficient URL/location details to allow us to locate it.</li>
              <li>Contact details of the complaining party (address, telephone number, and email).</li>
              <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement made under penalty of perjury that the information provided is accurate and that you are authorized to act.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>4. Counter-Notification &amp; Repeat Infringers</h2>
            <p>
              If material you submitted was removed in error or misidentification, you may submit a formal counter-notice to our Designated Agent containing the statutory requirements of 17 U.S.C. &sect; 512(g)(3). In accordance with the DMCA, SOE reserves the right to terminate access for users deemed to be repeat infringers in appropriate circumstances.
            </p>
          </section>

          <div style={{ borderTop: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/privacy" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>&larr; View Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>View Terms of Service &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmcaPolicy;
