/**
 * Shared Square API & Catalog helpers for Cloudflare Pages Functions.
 */

import squareProducts from '../src/data/square-products.json';

export const SQUARE_API_VERSION = '2024-12-18';

export function getSquareBaseUrl(env = {}) {
  const mode = String(env.SQUARE_ENV || 'production').toLowerCase().trim();
  return mode === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';
}

export async function squareApiFetch(env, path, options = {}) {
  const accessToken = env?.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('SQUARE_ACCESS_TOKEN is not configured.');
  }

  const baseUrl = getSquareBaseUrl(env);
  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Square-Version': SQUARE_API_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.errors?.[0]?.detail || data?.message || `HTTP ${res.status}`;
    throw new Error(`Square API error on ${path}: ${detail}`);
  }
  return data;
}

export async function resolveSquareLocationId(env) {
  if (env?.SQUARE_LOCATION_ID) {
    return env.SQUARE_LOCATION_ID;
  }
  const data = await squareApiFetch(env, '/v2/locations');
  const active = (data.locations || []).find((loc) => loc.status === 'ACTIVE') || data.locations?.[0];
  if (!active?.id) {
    throw new Error('No active Square location found for this account.');
  }
  return active.id;
}

export function getSquareProductSpec(handle) {
  return squareProducts[handle] || null;
}

export function listSquareCatalog() {
  return squareProducts;
}

/**
 * Verifies Square webhook HMAC-SHA256 signature using Web Crypto API.
 * Square signs `notificationUrl + rawBody` with the webhook signature key.
 */
export async function verifySquareWebhookSignature({
  signatureHeader,
  signatureKey,
  notificationUrl,
  rawBody,
}) {
  if (!signatureKey) return true;
  if (!signatureHeader || !notificationUrl) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(signatureKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const payload = encoder.encode(`${notificationUrl}${rawBody}`);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, payload);
  const computedBytes = new Uint8Array(signatureBuffer);
  let binary = '';
  for (let i = 0; i < computedBytes.length; i++) {
    binary += String.fromCharCode(computedBytes[i]);
  }
  const computedBase64 = btoa(binary);

  if (computedBase64.length !== signatureHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < computedBase64.length; i++) {
    diff |= computedBase64.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return diff === 0;
}
