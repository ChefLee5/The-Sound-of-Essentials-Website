import { Link } from 'react-router-dom';

const LICENSE_VARIANTS = {
  household: {
    badge: 'Single-Household Personal License Included',
    summary:
      'Includes unlimited playback and personal printing for your own children (Ages 2–7) within 1 household. Team sharing, school-wide uploading, AI scraping, or commercial resale is prohibited without an active Cloud Academy or Concord License.',
  },
  cad: {
    badge: 'Personal & Single-Classroom Tactile CAD License',
    summary:
      '3D-printable .STL/.3MF/.STEP files and physical kits are licensed for direct child use (Ages 2–7) only. Commercial print-farm resale, marketplace redistribution (Etsy/TPT), or unlicensed multi-school sharing incurs retroactive institutional licensing fees.',
  },
};

export default function DigitalLicenseNotice({ variant = 'household', style = {} }) {
  const copy = LICENSE_VARIANTS[variant] || LICENSE_VARIANTS.household;

  return (
    <div
      className="soe-license-notice"
      style={{
        margin: '1rem auto 0',
        padding: '0.85rem 1.15rem',
        background: 'rgba(255, 111, 0, 0.05)',
        border: '1px solid rgba(255, 111, 0, 0.22)',
        borderRadius: 'var(--radius-sm, 12px)',
        fontSize: '0.78rem',
        color: 'var(--color-text-dark-secondary, #5a4f46)',
        lineHeight: 1.5,
        textAlign: 'left',
        ...style,
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--color-text-dark, #2B2016)', marginBottom: '0.25rem' }}>
        📜 {copy.badge}
      </div>
      <div>
        {copy.summary}{' '}
        <Link
          to="/terms#digital-license"
          style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600, textDecoration: 'underline' }}
        >
          Read Full License Terms
        </Link>{' '}
        ·{' '}
        <Link
          to="/institutions"
          style={{ color: 'var(--color-orange, #FF6F00)', fontWeight: 600, textDecoration: 'underline' }}
        >
          Need a School/Team License?
        </Link>
      </div>
    </div>
  );
}

