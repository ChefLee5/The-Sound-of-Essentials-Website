/**
 * Resolves a public asset path using Vite's BASE_URL.
 * Usage: assetPath('/assets/soe-cover.jpg')
 *   → '/The-Sound-of-Essentials-Eco-System/assets/soe-cover.jpg' (prod)
 *   → '/assets/soe-cover.jpg' (dev)
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const assetPath = (path) => `${base}${path.startsWith('/') ? path : '/' + path}`;
