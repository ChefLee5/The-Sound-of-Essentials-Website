import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Terms of Service & Auto-Renewal Policy — SOE Rhythm Quest';
  }, []);

  return (
    <div className="legal-page section" style={{ paddingTop: '8rem', paddingBottom: '5rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto', color: 'var(--color-text-dark, #2B2016)', lineHeight: 1.75 }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <div className="section-label" style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'var(--color-orange-soft, rgba(255,111,0,0.1))', color: 'var(--color-orange, #FF6F00)', borderRadius: 'var(--radius-pill, 50px)', fontWeight: 600, fontSize: '0.85rem' }}>
            Terms &amp; Consumer Protection
          </div>
          <h1 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-heading, "Fredoka", sans-serif)', marginTop: '1rem', color: 'var(--color-text-dark, #2B2016)' }}>
            {t('legal.terms_title')}
          </h1>
          <p style={{ color: 'var(--color-text-dark-secondary, #665c54)', fontSize: '0.95rem' }}>
            Effective Date: October 1, 2026 &bull; The Sound of Essentials: Rhythm Quest
          </p>
        </div>

        <div className="legal-content glass-card" style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-md, 20px)', border: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>1. Agreement to Terms &amp; Eligibility</h2>
            <p>
              By accessing or using the services, products, and website of The Sound of Essentials (&ldquo;SOE&rdquo;), you agree to be bound by these Terms of Service. 
              <strong> You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to make purchases, create subscriptions, or submit personal information.</strong>
            </p>
            <p>
              SOE curriculum and music experiences are designed for children ages 2 to 7 (Toddler, Pre-K to Grade 2) under the active guidance and supervision of parents, legal guardians, or authorized educators.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>2. Automatic Renewal Terms (California ARL &amp; Federal FTC Compliance)</h2>
            <div style={{ background: 'var(--color-bg-cream, #faf9f7)', padding: '1.5rem', borderRadius: 'var(--radius-sm, 12px)', borderLeft: '4px solid var(--color-orange, #FF6F00)', marginBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--color-text-dark, #2B2016)' }}>Continuous Subscription Terms:</h3>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                When you enroll in an optional recurring membership, such as <strong>The Rhythm Pass ($14.99 per month)</strong>:
              </p>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li><strong>Automatic Monthly Billing:</strong> Your subscription will automatically renew each month for the agreed monthly charge ($14.99/mo) charged to your vaulted payment method on file, until cancelled.</li>
                <li><strong>Immediate 1-Click Online Cancellation:</strong> In full compliance with California Automatic Renewal Laws (AB 390 / SB 329), you may cancel your subscription at any time without fees, penalties, or telephone requirements.</li>
                <li><strong>How to Cancel:</strong> You can cancel instantly via your online member dashboard or by sending an email with your order details to <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>info@soelearn.com</a>.</li>
                <li><strong>Post-Cancellation Access:</strong> Upon cancellation, you retain full access through the end of your current paid billing period; no further monthly charges will be incurred.</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>3. Digital Goods &amp; Physical Fulfillment</h2>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>Free Album &amp; Digital Downloads:</strong> The Deluxe 19-Track Album and digital coloring books are provided free of charge for founding families. Digital companions (such as the Rhythm Quest Illustrated Ebook and Picture Dictionary) are delivered immediately via secure cloud download links upon purchase confirmation.</li>
              <li><strong>Physical Workbooks:</strong> Physical editions (such as the print Rhythm Ready Workbook) are fulfilled and shipped to the verified postal address provided at checkout. Tracking numbers are transmitted via email upon dispatch.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>4. Intellectual Property &amp; Educator Licensing</h2>
            <p>
              All audio recordings, musical compositions, visual characters (including Seriphia and the 14 land heroes), artwork, and pedagogical lesson architectures are the exclusive intellectual property of The Sound of Essentials.
            </p>
            <p>
              Purchases grant a single-family or single-classroom non-exclusive license for personal educational use. Institutional, multi-school, or commercial redistribution requires a formal institutional licensing contract.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-orange, #FF6F00)', fontSize: '1.4rem', marginBottom: '0.8rem' }}>5. Contact Information</h2>
            <p>
              For billing inquiries, subscription cancellations, or questions regarding these terms, please contact:
            </p>
            <p>
              <strong>The Sound of Essentials</strong><br />
              Email: <a href="mailto:info@soelearn.com" style={{ color: 'var(--color-orange, #FF6F00)' }}>info@soelearn.com</a><br />
              P.O. Box 724
            </p>
          </section>

          <div style={{ borderTop: '1px solid var(--color-border-light, rgba(0,0,0,0.08))', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/privacy" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>&larr; View Privacy Policy</Link>
            <Link to="/dmca" style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600 }}>View DMCA Policy &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
