import React, { useState, useEffect } from 'react';
import { appendUtmsToUrl } from '../utils/analytics';
import './PhilanthropicDonationSection.css';

const STRIPE_DONATION_FALLBACK = 'https://buy.stripe.com/test_14A9AT9BO4S140mc706Vq09';

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

  const rawStripeUrl = import.meta.env.VITE_STRIPE_DONATION_URL || STRIPE_DONATION_FALLBACK;
  const targetStripeUrl = appendUtmsToUrl(rawStripeUrl);

  return (
    <section className={`mission-donation-section ${className}`} id="philanthropy">
      <div className="mission-donation-card text-center">
        <div className="section-label">Philanthropic Support</div>
        
        <h2>
          Support Our <span className="accent-text">Mission</span>
        </h2>

        <p className="section-subtitle">
          Our front door is a complete 19-track acoustic album, gifted 100% free to every family and classroom.
          Foundational sensory learning is a birthright, not a luxury.
        </p>

        <p className="mission-donation-text">
          We created The Sound of Essentials as an antidote to screen fatigue, sensory overload, and algorithmic dopamine loops.
          Philanthropic contributions help us remain entirely independent, ad-free, and dedicated to crafting calm, tactile literature
          and music for children ages 2 to 7.
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
            href={targetStripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mission-donation-btn"
          >
            {selectedAmount
              ? `Donate $${selectedAmount} via Stripe →`
              : 'Donate via Stripe Checkout →'}
          </a>
        </div>

        <p className="mission-donation-footnote">
          Secure payment processed directly through Stripe. Crafted by a father&apos;s heart and a mother&apos;s love.
        </p>
      </div>
    </section>
  );
};

export default PhilanthropicDonationSection;
