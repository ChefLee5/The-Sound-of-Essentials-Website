/**
 * Cloudflare Pages Catch-all Handler:
 * 1. Passes API requests to /api/* handlers.
 * 2. Returns 410 Gone for retired e-commerce/campaign endpoints.
 * 3. Redirects legacy, social, and QR utility routes with 301.
 * 4. Fetches static/prerendered assets directly (including dist/<route>/index.html).
 * 5. Rewrites ONLY allowlisted client-only utility routes (/player, /admin/crm, etc.) to /index.html with X-Robots-Tag: noindex, nofollow.
 * 6. Returns true HTTP 404 (dist/404.html) for all unmapped paths to prevent Soft-404s.
 */

const RETIRED_410_PREFIXES = ['/products/', '/collections/', '/promo/'];
const RETIRED_410_EXACT = new Set(['/cart', '/checkout']);

const LEGACY_301_REDIRECTS = {
  '/universe': '/heroes',
  '/characters': '/heroes',
  '/media': '/listen',
  '/seriphia-signal': '/signal',
  '/distress-call': '/signal',
  '/starter-pack': '/listen',
  '/qr': '/listen',
  '/ritual': '/listen',
  '/curriculum': '/rhythm-ready',
  '/rhythmready': '/rhythm-ready',
  '/rhythm-quest': '/rhythm-ready',
  '/rhythmquest': '/rhythm-ready',
  '/start': '/rhythm-ready',
  '/dictionary': '/workbook#dictionary-presale',
  '/shop': '/headphones',
  '/sensory-headphones': '/headphones',
  '/classroom': '/institutions',
  '/enterprise': '/institutions',
  '/qpc': '/institutions',
  '/ally-annex': '/institutions',
  '/allies': '/',
  '/about': '/mission',
  '/quieter-way': '/story',
  '/advertorial': '/story',
  '/story.html': '/story',
  '/dad-review': '/dad-reading-apps-review',
  '/dad-reading-apps-review.html': '/dad-reading-apps-review',
  '/sovereign-child': '/education-sovereignty',
  '/education-sovereignty.html': '/education-sovereignty',
  '/sound-before-symbol': '/global-learn-english',
  '/global-learn-english.html': '/global-learn-english',
  '/rhythm-reset': '/sing-along-time',
  '/sing-along-time.html': '/sing-along-time',
  '/abcmouse-alternatives': '/alternatives/abcmouse',
  '/abcmouse-alternatives.html': '/alternatives/abcmouse',
  '/compare/abcmouse': '/alternatives/abcmouse',
  '/reading-eggs-alternatives': '/alternatives/reading-eggs',
  '/reading-eggs-alternatives.html': '/alternatives/reading-eggs',
  '/compare/reading-eggs': '/alternatives/reading-eggs',
  '/hooked-on-phonics-alternatives': '/alternatives/hooked-on-phonics',
  '/hooked-on-phonics-alternatives.html': '/alternatives/hooked-on-phonics',
  '/compare/hooked-on-phonics': '/alternatives/hooked-on-phonics',
  '/admin': '/admin/crm',
  '/crm': '/admin/crm',
};

const NOINDEX_SPA_EXACT = new Set([
  '/player',
  '/order-success',
  '/download',
  '/ads',
  '/ads-showcase',
  '/campaigns',
  '/launcher',
  '/mcls',
  '/admin/crm',
  '/v2',
]);

const NOINDEX_SPA_PREFIXES = ['/admin/crm/', '/v2/'];

function withSecurityHeaders(res, extraHeaders = {}) {
  const headers = new Headers(res.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  for (const [k, v] of Object.entries(extraHeaders)) {
    headers.set(k, v);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const normalizedPath = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;

  // 1. Pass /api/* to functions/api/*
  if (normalizedPath.startsWith('/api/')) {
    return next();
  }

  // 2. Return 410 Gone for retired storefront & campaign URLs
  if (
    RETIRED_410_EXACT.has(normalizedPath) ||
    RETIRED_410_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return withSecurityHeaders(new Response('Gone', { status: 410 }), {
      'X-Robots-Tag': 'noindex, nofollow',
    });
  }

  // 3. 301 redirect legacy & QR utility paths to canonical URLs
  if (LEGACY_301_REDIRECTS[normalizedPath]) {
    const dest = new URL(LEGACY_301_REDIRECTS[normalizedPath], url.origin);
    dest.search = url.search;
    return Response.redirect(dest.toString(), 301);
  }
  if (normalizedPath.startsWith('/music-u/')) {
    const dest = new URL('/listen', url.origin);
    dest.search = url.search;
    return Response.redirect(dest.toString(), 301);
  }

  // 4. Allowlisted client-only SPA utility/admin routes (with noindex)
  const isNoindexSpa =
    NOINDEX_SPA_EXACT.has(normalizedPath) ||
    NOINDEX_SPA_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
  if (isNoindexSpa) {
    const indexUrl = new URL('/index.html', request.url);
    const spaRes = await env.ASSETS.fetch(new Request(indexUrl, request));
    return withSecurityHeaders(spaRes, { 'X-Robots-Tag': 'noindex, nofollow' });
  }

  // 5. Try fetching the exact static or prerendered asset (e.g. /listen -> /listen/index.html)
  const assetRes = await env.ASSETS.fetch(request);
  if (assetRes.status !== 404) {
    return withSecurityHeaders(assetRes);
  }

  // 6. Serve true HTTP 404 via /404.html for all unknown routes
  const notFoundUrl = new URL('/404.html', request.url);
  const notFoundRes = await env.ASSETS.fetch(new Request(notFoundUrl, request));
  return new Response(notFoundRes.body, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
