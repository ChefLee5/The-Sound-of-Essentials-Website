/**
 * SOE Sovereign Opt-In Analytics Loader
 *
 * COPPA & Family Privacy Safeguard:
 * - Zero third-party scripts (GA4, Clarity, GTM, or ad-network pixels) execute
 *   until the user explicitly grants consent (`soe_privacy_consent === 'granted'`).
 * - First-party UTM parameter persistence (`soe_attribution_data`) operates
 *   locally without external sub-processors.
 * - Even after opt-in, Google signals and ad personalization remain strictly disabled.
 */

import { initAutoTracking } from '../utils/analytics';

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-H5977S1HY4';
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || 'wcdgngeqcm';
const CONSENT_STORAGE_KEY = 'soe_privacy_consent';

let ga4Loaded = false;
let clarityLoaded = false;

export function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

function loadPrivacyMaskedGa4(id) {
  if (!id || ga4Loaded || typeof document === 'undefined') return;
  ga4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);

  window.gtag('js', new Date());
  window.gtag('config', id, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function loadConsentedClarity(id) {
  if (!id || clarityLoaded || typeof document === 'undefined') return;
  clarityLoaded = true;

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    c[a]('consent', true);
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    if (y && y.parentNode) {
      y.parentNode.insertBefore(t, y);
    } else {
      l.head.appendChild(t);
    }
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

export function enableConsentedAnalytics() {
  if (typeof window === 'undefined') return;
  loadPrivacyMaskedGa4(GA4_ID);
  loadConsentedClarity(CLARITY_ID);
  initAutoTracking();
}

export function disableConsentedAnalytics() {
  if (typeof window === 'undefined') return;
  if (typeof window.clarity === 'function') {
    window.clarity('consent', false);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  // Strictly enforce opt-in before loading any external analytics scripts
  if (hasAnalyticsConsent()) {
    enableConsentedAnalytics();
  }
}
