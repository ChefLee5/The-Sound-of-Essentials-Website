import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_ENV = String(process.env.SQUARE_ENV || 'production').toLowerCase().trim();
const SQUARE_BASE_URL =
  SQUARE_ENV === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

if (!SQUARE_ACCESS_TOKEN) {
  console.error('❌ Error: SQUARE_ACCESS_TOKEN is not set in web/.env');
  console.log('Add SQUARE_ACCESS_TOKEN (and optional SQUARE_LOCATION_ID) to web/.env and re-run.');
  process.exit(1);
}

async function squareRequest(endpoint, body = undefined, method = 'POST') {
  const res = await fetch(`${SQUARE_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Square-Version': '2024-12-18',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.errors?.[0]?.detail || JSON.stringify(data);
    throw new Error(`Square API Error on ${endpoint}: ${msg}`);
  }
  return data;
}

async function resolveLocationId() {
  if (process.env.SQUARE_LOCATION_ID) {
    return process.env.SQUARE_LOCATION_ID;
  }
  const res = await squareRequest('/v2/locations', undefined, 'GET');
  const active = (res.locations || []).find((l) => l.status === 'ACTIVE') || res.locations?.[0];
  if (!active?.id) {
    throw new Error('No Square locations found on this account.');
  }
  return active.id;
}

async function main() {
  const catalogPath = path.resolve(__dirname, '../src/data/square-products.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const locationId = await resolveLocationId();

  console.log(`🚀 Creating Square Payment Links for SOE (${SQUARE_ENV}, Location: ${locationId})...\n`);

  for (const [handle, spec] of Object.entries(catalog)) {
    const productKey = spec.productKey || handle;
    const redirectUrl = `https://soelearn.com/order-success?provider=square&product=${encodeURIComponent(
      productKey
    )}&sku=${encodeURIComponent(spec.sku)}`;

    const payload = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: spec.name.slice(0, 255),
        price_money: {
          amount: Number(spec.priceCents) || 5000,
          currency: 'USD',
        },
        location_id: locationId,
      },
      checkout_options: {
        redirect_url: redirectUrl,
        ask_for_shipping_address: Boolean(spec.collectShipping),
        allow_tipping: false,
        merchant_support_email: 'info@soelearn.com',
      },
      payment_note: `SKU:${spec.sku} | HANDLE:${handle}`,
    };

    const res = await squareRequest('/v2/online-checkout/payment-links', payload, 'POST');
    const link = res.payment_link;
    catalog[handle].url = link.url;
    console.log(`✓ ${spec.sku} (${handle}) -> ${link.url}`);
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  console.log(`\n🎉 Saved all Square Payment Links to ${catalogPath}`);
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
