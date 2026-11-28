import { useState } from 'react';
import squareProducts from '../data/square-products.json';
import { appendUtmsToUrl } from './analytics';

const ENV_LINK_MAP = {
  'quest-starter-pack': import.meta.env.VITE_SQUARE_STARTER_PACK_URL,
  'sound-of-essentials-rhythm-quest-storybook': import.meta.env.VITE_SQUARE_STORYBOOK_URL,
  'rhythm-ready-workbook-digital': import.meta.env.VITE_SQUARE_WORKBOOK_DIGITAL_URL,
  'rhythm-ready-workbook-print': import.meta.env.VITE_SQUARE_WORKBOOK_PRINT_URL,
  'complete-quest-pack': import.meta.env.VITE_SQUARE_COMPLETE_PACK_URL,
  'the-rhythm-pass': import.meta.env.VITE_SQUARE_RHYTHM_PASS_URL,
  'essential-picture-dictionary-presale': import.meta.env.VITE_SQUARE_DICTIONARY_URL,
  'soe-sensory-headphones': import.meta.env.VITE_SQUARE_HEADPHONES_URL,
  'soe-headphones-workbook-bundle': import.meta.env.VITE_SQUARE_BUNDLE_URL,
  'soe-philanthropic-donation': import.meta.env.VITE_SQUARE_DONATION_URL,
};

/**
 * Returns the static Square Payment Link configured for a catalog handle, if available.
 */
export function getStaticSquareUrl(handle, envOverride = '') {
  const candidate = envOverride || ENV_LINK_MAP[handle] || squareProducts[handle]?.url || '';
  if (!candidate || !/^https?:\/\//i.test(candidate)) {
    return '';
  }
  return appendUtmsToUrl(candidate);
}

/**
 * Initiates Square checkout by requesting a dynamic Payment Link from `/api/checkout/square`,
 * with automatic fallback to any configured static Square Payment Link.
 */
export async function launchSquareCheckout({
  handle,
  variantId = '',
  variantLabel = '',
  amountCents = null,
  customerEmail = '',
  envOverride = '',
  returnPath = '/order-success',
} = {}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://soelearn.com';
  const storedEmail =
    customerEmail ||
    (typeof window !== 'undefined' ? window.localStorage?.getItem('soe_user_email') || '' : '');

  try {
    const res = await fetch('/api/checkout/square', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle,
        variantId,
        variantLabel,
        amountCents,
        customerEmail: storedEmail,
        origin,
        returnPath,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        const finalUrl = appendUtmsToUrl(data.url);
        if (typeof window !== 'undefined') {
          window.location.assign(finalUrl);
        }
        return { ok: true, url: finalUrl, mode: 'api' };
      }
    }
  } catch {
    // Fall back to static Square Payment Link if backend API is unavailable (e.g. local Vite dev).
  }

  const staticUrl = getStaticSquareUrl(handle, envOverride);
  if (staticUrl) {
    if (typeof window !== 'undefined') {
      window.location.assign(staticUrl);
    }
    return { ok: true, url: staticUrl, mode: 'static' };
  }

  return {
    ok: false,
    reason: 'SQUARE_NOT_CONFIGURED',
    message:
      'Square checkout is being finalized. Contact info@soelearn.com or add Square credentials to activate instant checkout.',
  };
}

/**
 * Shared React hook for Square checkout links and buttons.
 */
export function useSquareCheckoutAction({
  handle,
  variantId = '',
  variantLabel = '',
  amountCents = null,
  customerEmail = '',
  envOverride = '',
  onTrack = null,
} = {}) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [notice, setNotice] = useState('');

  const staticUrl = getStaticSquareUrl(handle, envOverride);
  const href = staticUrl || '#square-checkout';

  const handleClick = async (e) => {
    if (onTrack) onTrack();
    if (e?.preventDefault) e.preventDefault();
    if (isLaunching) return;

    setNotice('');
    setIsLaunching(true);
    const result = await launchSquareCheckout({
      handle,
      variantId,
      variantLabel,
      amountCents,
      customerEmail,
      envOverride,
    });
    setIsLaunching(false);

    if (!result.ok) {
      setNotice(result.message);
    }
  };

  return {
    href,
    isLaunching,
    notice,
    handleClick,
    hasStaticUrl: Boolean(staticUrl),
  };
}
