/**
 * Cloudflare Pages Catch-all Handler:
 * 1. Passes API requests to /api/* handlers.
 * 2. Returns 410 Gone for retired Shopify/campaign endpoints.
 * 3. Redirects legacy routes (/universe, /characters, /media, /quieter-way) with 301.
 * 4. Serves dedicated static HTML landing pages for editorial & comparison routes.
 * 5. Fetches static/prerendered assets directly (including dist/<route>/index.html).
 * 6. Rewrites unmatched non-file client routes to /index.html with HTTP 200.
 */

const RETIRED_410_PREFIXES = ['/products/', '/collections/', '/promo/', '/shopify/'];
const RETIRED_410_EXACT = new Set(['/cart', '/checkout']);

const LEGACY_301_REDIRECTS = {
  '/universe': '/heroes',
  '/characters': '/heroes',
  '/media': '/listen',
  '/quieter-way': '/story',
};

const STATIC_HTML_ROUTES = {
  '/story': '/story.html',
  '/dad-reading-apps-review': '/dad-reading-apps-review.html',
  '/education-sovereignty': '/education-sovereignty.html',
  '/global-learn-english': '/global-learn-english.html',
  '/sing-along-time': '/sing-along-time.html',
  '/alternatives/abcmouse': '/abcmouse-alternatives.html',
  '/abcmouse-alternatives': '/abcmouse-alternatives.html',
  '/alternatives/reading-eggs': '/reading-eggs-alternatives.html',
  '/reading-eggs-alternatives': '/reading-eggs-alternatives.html',
  '/alternatives/hooked-on-phonics': '/hooked-on-phonics-alternatives.html',
  '/hooked-on-phonics-alternatives': '/hooked-on-phonics-alternatives.html',
};

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const normalizedPath = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;

  // 1. Pass /api/* to functions/api/*
  if (normalizedPath.startsWith('/api/')) {
    return next();
  }

  // 2. Return 410 Gone for retired Shopify & campaign URLs
  if (
    RETIRED_410_EXACT.has(normalizedPath) ||
    RETIRED_410_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return new Response('Gone', { status: 410 });
  }

  // 3. 301 redirect legacy paths to canonical URLs
  if (LEGACY_301_REDIRECTS[normalizedPath]) {
    const dest = new URL(LEGACY_301_REDIRECTS[normalizedPath], url.origin);
    dest.search = url.search;
    return Response.redirect(dest.toString(), 301);
  }

  // 4. Serve static pre-sell & comparison HTML pages directly
  if (STATIC_HTML_ROUTES[normalizedPath]) {
    const staticUrl = new URL(STATIC_HTML_ROUTES[normalizedPath], request.url);
    const staticRes = await env.ASSETS.fetch(new Request(staticUrl, request));
    if (staticRes.status !== 404) {
      return staticRes;
    }
  }

  // 5. Try fetching the exact static or prerendered asset (e.g. /listen -> /listen/index.html)
  const assetRes = await env.ASSETS.fetch(request);
  if (assetRes.status !== 404) {
    return assetRes;
  }

  // 6. If 404 and it's an HTML/SPA route (no file extension), return index.html with 200 OK
  const isFile = normalizedPath.split('/').pop().includes('.');
  if (!isFile) {
    const indexUrl = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  }

  return assetRes;
}
