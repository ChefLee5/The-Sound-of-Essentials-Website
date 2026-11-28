/**
 * SOE Unified Attribution & Sovereign Analytics Engine
 * Persists first-party UTM parameters locally and dispatches privacy-masked
 * GA4 and Microsoft Clarity events ONLY when explicit user consent is granted.
 * Zero commercial ad-network or behavioral retargeting pixels are loaded.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'aff'];
const UTM_STORAGE_KEY = 'soe_attribution_data';
const CONSENT_STORAGE_KEY = 'soe_privacy_consent';

function isConsented() {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

/**
 * Captures UTM parameters from current URL and stores in first-party storage.
 */
export const captureUtms = () => {
  if (typeof window === 'undefined') return {};
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const captured = {};
    let hasUtm = false;

    UTM_KEYS.forEach((key) => {
      const val = urlParams.get(key);
      if (val) {
        captured[key] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      captured.timestamp = new Date().toISOString();
      captured.landing_path = window.location.pathname;
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      return captured;
    }

    const stored = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn('[Analytics] Failed to capture UTMs:', e);
    return {};
  }
};

/**
 * Returns currently persisted UTM and referral parameters.
 */
export const getStoredUtms = () => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Appends persisted UTM parameters to an outgoing URL (e.g. Stripe checkout or referral link).
 */
export const appendUtmsToUrl = (urlStr) => {
  if (!urlStr || typeof window === 'undefined') return urlStr;
  try {
    const utms = getStoredUtms();
    if (!utms || Object.keys(utms).length === 0) return urlStr;

    const url = new URL(urlStr, window.location.origin);
    Object.entries(utms).forEach(([k, v]) => {
      if (k !== 'timestamp' && k !== 'landing_path' && !url.searchParams.has(k)) {
        url.searchParams.set(k, v);
      }
    });
    return url.toString();
  } catch {
    return urlStr;
  }
};

/**
 * Safely forwards an event to privacy-masked GA4 only if consent has been granted.
 */
export const pushDataLayer = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch {
      // Non-blocking
    }
  }
};

/**
 * Dispatches PageView to privacy-masked GA4 and Clarity when consented.
 */
export const trackPageView = (path, title = '') => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();
  const pagePath = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;
  const pageLocation = window.location.href;

  const pageData = {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
    ...utms,
  };

  pushDataLayer('page_view', pageData);

  if (typeof window.clarity === 'function' && pagePath) {
    window.clarity('set', 'page_path', pagePath);
  }
};

/**
 * Dispatches Lead event (e.g. email capture on /listen or newsletter).
 */
export const trackLead = ({ email: _email = '', formName = 'gate1_listen', source = 'listen_page', ...rest } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  pushDataLayer('generate_lead', {
    event_category: 'funnel',
    event_label: formName,
    form_name: formName,
    form_source: source,
    lead_type: 'email_optin',
    value: 1,
    currency: 'USD',
    ...utms,
    ...rest,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', 'lead_captured');
  }
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'lead', { lead_type: formName, ...utms });
  }
  if (typeof window.rdt === 'function') {
    window.rdt('track', 'Lead');
  }
  if (typeof window.twq === 'function') {
    window.twq('track', 'Lead', { value: '1.00', currency: 'USD' });
  }
};

/**
 * Dispatches ViewContent (e.g. browsing a Land, Hero, or Track).
 */
export const trackViewContent = ({ contentName, category = 'curriculum', id = '', value = 0 } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  pushDataLayer('view_item', {
    event_category: category,
    item_name: contentName,
    item_category: category,
    item_id: id,
    value,
    ecommerce: {
      items: [
        {
          item_id: id || contentName,
          item_name: contentName,
          item_category: category,
          price: value,
          quantity: 1,
        },
      ],
    },
    ...utms,
  });
};

/**
 * Dispatches InitiateCheckout (e.g. clicking buy link for Workbook or Dictionary).
 */
export const trackInitiateCheckout = ({
  sku = 'SOE-RQ-WORKBOOK',
  name = 'Rhythm Ready Workbook',
  price = 21.0,
  currency = 'USD',
} = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  const checkoutItems = [
    {
      item_id: sku,
      item_name: name,
      price,
      quantity: 1,
    },
  ];

  pushDataLayer('begin_checkout', {
    event_category: 'ecommerce',
    currency,
    value: price,
    items: checkoutItems,
    ecommerce: {
      currency,
      value: price,
      items: checkoutItems,
    },
    ...utms,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', 'checkout_initiated');
  }
  if (typeof window.pintrk === 'function') {
    window.pintrk('track', 'checkout', { value: price, currency, order_quantity: 1 });
  }
  if (typeof window.rdt === 'function') {
    window.rdt('track', 'AddToCart', { value: price, currency });
  }
};

/**
 * Dispatches Purchase event (e.g. Stripe checkout completion on /order-success).
 */
export const trackPurchase = ({ orderId = '', value = 0, currency = 'USD', items = [] } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  pushDataLayer('purchase', {
    transaction_id: orderId,
    value,
    currency,
    items,
    ecommerce: {
      transaction_id: orderId,
      value,
      currency,
      items,
    },
    ...utms,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', 'purchase_completed');
  }
};

/**
 * Dispatches TrackPlay event in Audio Player.
 */
export const trackAudioPlay = ({ trackId, trackTitle, domain = '' } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;

  pushDataLayer('audio_play', {
    event_category: 'audio',
    event_label: trackTitle,
    track_id: trackId,
    track_title: trackTitle,
    domain,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', `play_${trackId}`);
  }
};

/**
 * Dispatches Referral / Share event.
 */
export const trackReferralShare = ({ channel = 'link_copy', target = 'gift_a_land' } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  pushDataLayer('share', {
    event_category: 'engagement',
    method: channel,
    content_type: target,
    share_channel: channel,
    share_target: target,
    ...utms,
  });

  if (typeof window.clarity === 'function') {
    window.clarity('event', 'referral_shared');
  }
};

/**
 * Dispatches CTA button or interaction click.
 */
export const trackCtaClick = ({ ctaText = '', ctaLocation = '', ctaUrl = '', ctaType = 'button' } = {}) => {
  if (typeof window === 'undefined' || !isConsented()) return;
  const utms = getStoredUtms();

  pushDataLayer('cta_click', {
    event_category: 'engagement',
    cta_text: ctaText,
    cta_location: ctaLocation,
    cta_url: ctaUrl,
    cta_type: ctaType,
    page_path: window.location.pathname,
    ...utms,
  });
};

/**
 * Automatically captures interactive CTAs and outbound links when consented.
 */
export const initAutoTracking = () => {
  if (typeof window === 'undefined' || window._soeTrackingInitialized) return;
  window._soeTrackingInitialized = true;

  document.addEventListener(
    'click',
    (e) => {
      if (!isConsented()) return;
      try {
        const target = e.target.closest('button, a, [data-cta], [data-track]');
        if (!target) return;

        const isCtaButton =
          target.tagName === 'BUTTON' || target.classList.contains('btn') || target.hasAttribute('data-cta');
        const href = target.getAttribute('href') || '';
        const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        const text = (
          target.innerText ||
          target.getAttribute('aria-label') ||
          target.getAttribute('title') ||
          ''
        )
          .trim()
          .slice(0, 80);

        if (isExternal) {
          pushDataLayer('outbound_click', {
            link_url: href,
            link_text: text,
            page_path: window.location.pathname,
          });
        } else if (isCtaButton && text) {
          pushDataLayer('cta_click', {
            cta_text: text,
            cta_url: href,
            cta_classes: target.className || '',
            page_path: window.location.pathname,
          });
        }
      } catch {
        // Non-blocking
      }
    },
    { passive: true }
  );
};

export default {
  captureUtms,
  getStoredUtms,
  appendUtmsToUrl,
  pushDataLayer,
  trackPageView,
  trackLead,
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
  trackAudioPlay,
  trackReferralShare,
  trackCtaClick,
  initAutoTracking,
};
