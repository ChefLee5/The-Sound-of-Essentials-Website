// Meta Pixel + GA4 loaders.
//
// Listen.jsx already fires window.fbq('track', 'Lead') and window.gtag('event',
// 'generate_lead') on a successful album unlock. Neither global existed — index.html
// loaded Microsoft Clarity and nothing else — so every one of those calls was a no-op
// and no conversion on the funnel was ever measurable.
//
// IDs come from env so they differ per environment and never sit in git:
//   VITE_META_PIXEL_ID=1234567890
//   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
// Missing ID = that tag simply does not load. No placeholder ever ships.

import { initAutoTracking } from '../utils/analytics';

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;
const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

function loadMetaPixel(id) {
  // Meta's own snippet, kept verbatim so it stays diffable against their docs.
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', id);
  window.fbq('track', 'PageView');
}

function loadGa4(id) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // gtag must forward `arguments`, so this cannot be an arrow function.
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // 1. Always guarantee dataLayer exists for Google Tag Manager (GTM-N2NKDFW6)
  window.dataLayer = window.dataLayer || [];

  // 2. Safe gtag fallback if direct gtag calls are made anywhere
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  // 3. Initialize automatic click tracking for CTAs and outbound links
  initAutoTracking();

  if (META_PIXEL_ID) {
    loadMetaPixel(META_PIXEL_ID);
  } else if (import.meta.env.DEV) {
    console.info('[analytics] VITE_META_PIXEL_ID not set — Meta Pixel direct loader skipped.');
  }

  if (GA4_ID) {
    loadGa4(GA4_ID);
  } else if (import.meta.env.DEV) {
    console.info('[analytics] VITE_GA4_MEASUREMENT_ID not set — GA4 can be configured via GTM container.');
  }
}

