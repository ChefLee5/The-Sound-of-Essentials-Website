import React, { useState, useEffect } from 'react';
import { useSquareCheckoutAction } from '../utils/checkout';
import './PhilanthropicDonationSection.css';

const PRESET_AMOUNTS = [
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50', default: true },
  { amount: 100, label: '$100' },
  { amount: 250, label: '$250' },
  { amount: null, label: 'Custom' },
];

export const PhilanthropicDonationSection = ({ className = '' }) => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('donation') === 'success') {
        setIsSuccess(true);
      }
    }
  }, []);

  const { href, isLaunching, notice, handleClick } = useSquareCheckoutAction({
    handle: 'soe-philanthropic-donation',
    amountCents: selectedAmount ? selectedAmount * 100 : null,
  });

  return (
    <section className={`mission-donation-section ${className}`} id="philanthropy">
      <div className="mission-donation-card text-center">
        <div className="section-label">Education Concord Advocacy</div>
        
        <h2>
          Sponsor <span className="accent-text">Screen-Free Classrooms</span>
        </h2>

        <p className="section-subtitle">
          Our front door is a complete 19-track acoustic album and 10-minute tactile ritual card, gifted 100% free to every family and classroom.
          Foundational sensory learning is a birthright, not a luxury.
        </p>

        <p className="mission-donation-text">
          We created The Sound of Essentials as an education advocacy movement against screen fatigue, sensory overload, and teacher prep burnout.
          Your support helps us equip under-resourced classrooms and families with free, ad-free organic acoustic music and tactile print kits for children ages 2 to 7.
        </p>

        {isSuccess && (
          <div className="mission-donation-success" role="alert">
            <p><strong>Thank you for your support.</strong></p>
            <p>Your gift helps keep our music and learning sanctuary free and open for families everywhere.</p>
          </div>
        )}

        <div className="mission-donation-presets" role="radiogroup" aria-label="Donation amounts">
          {PRESET_AMOUNTS.map((preset) => {
            const isSelected = selectedAmount === preset.amount;
            return (
              <button
                key={preset.label}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`donation-preset-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedAmount(preset.amount)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="mission-donation-action">
          <a
            href={href}
            onClick={handleClick}
            aria-busy={isLaunching}
            className="btn btn-gold mission-donation-btn"
          >
            {isLaunching
              ? 'Opening Square Checkout...'
              : selectedAmount
                ? `Donate $${selectedAmount} via Square →`
                : 'Donate via Square Checkout →'}
          </a>
        </div>

        {notice && (
          <p className="mission-donation-footnote" role="status" style={{ color: '#B45309', marginTop: '0.75rem' }}>
            {notice}
          </p>
        )}

        <p className="mission-donation-footnote">
          Secure payment processed directly through Square. Crafted by a father&apos;s heart and a mother&apos;s love.
        </p>
      </div>
    </section>
  );
};

export default PhilanthropicDonationSection;
