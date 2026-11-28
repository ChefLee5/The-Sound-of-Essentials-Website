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
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID || '';
const PINTEREST_TAG_ID = import.meta.env.VITE_PINTEREST_TAG_ID || '';
const X_PIXEL_ID = import.meta.env.VITE_X_PIXEL_ID || '';
const REDDIT_PIXEL_ID = import.meta.env.VITE_REDDIT_PIXEL_ID || '';
const CONSENT_STORAGE_KEY = 'soe_privacy_consent';

let ga4Loaded = false;
let clarityLoaded = false;
let adChannelsLoaded = false;

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

function loadConsentedChannelTags() {
  if (adChannelsLoaded || typeof document === 'undefined') return;
  adChannelsLoaded = true;

  if (GOOGLE_ADS_ID && typeof window.gtag === 'function') {
    window.gtag('config', GOOGLE_ADS_ID, { allow_enhanced_conversions: false });
  }

  if (PINTEREST_TAG_ID && !window.pintrk) {
    window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments));
    };
    window.pintrk.queue = [];
    window.pintrk.version = '3.0';
    const ps = document.createElement('script');
    ps.async = true;
    ps.src = 'https://s.pinimg.com/ct/core.js';
    document.head.appendChild(ps);
    window.pintrk('load', PINTEREST_TAG_ID);
    window.pintrk('page');
  }

  if (X_PIXEL_ID && !window.twq) {
    window.twq = function () {
      window.twq.exe ? window.twq.exe.apply(window.twq, arguments) : window.twq.queue.push(arguments);
    };
    window.twq.version = '1.1';
    window.twq.queue = [];
    const xs = document.createElement('script');
    xs.async = true;
    xs.src = 'https://static.ads-twitter.com/uwt.js';
    document.head.appendChild(xs);
    window.twq('config', X_PIXEL_ID);
  }

  if (REDDIT_PIXEL_ID && !window.rdt) {
    window.rdt = function () {
      window.rdt.sendEvent
        ? window.rdt.sendEvent.apply(window.rdt, arguments)
        : window.rdt.callQueue.push(arguments);
    };
    window.rdt.callQueue = [];
    const rs = document.createElement('script');
    rs.async = true;
    rs.src = 'https://www.redditstatic.com/ads/pixel.js';
    document.head.appendChild(rs);
    window.rdt('init', REDDIT_PIXEL_ID);
    window.rdt('track', 'PageVisit');
  }
}

export function enableConsentedAnalytics() {
  if (typeof window === 'undefined') return;
  loadPrivacyMaskedGa4(GA4_ID);
  loadConsentedClarity(CLARITY_ID);
  loadConsentedChannelTags();
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
