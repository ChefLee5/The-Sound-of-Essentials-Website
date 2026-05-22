/**
 * Resolves a public asset path using Vite's BASE_URL.
 * Usage: assetPath('/assets/soe-cover.jpg')
 *   -> '/SOE-Picture-Dictionary/assets/soe-cover.jpg' in production
 *   -> '/assets/soe-cover.jpg' in local dev when Vite serves from root
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const assetPath = (path) => `${base}${path.startsWith('/') ? path : '/' + path}`;
