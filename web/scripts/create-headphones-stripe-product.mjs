import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

async function stripeRequest(endpoint, params = {}, method = 'POST') {
  const formBody = new URLSearchParams();
  
  function buildFormData(obj, prefix = '') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const propName = prefix ? `${prefix}[${key}]` : key;
        const val = obj[key];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          buildFormData(val, propName);
        } else if (Array.isArray(val)) {
          val.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              buildFormData(item, `${propName}[${index}]`);
            } else {
              formBody.append(`${propName}[${index}]`, item);
            }
          });
        } else if (val !== undefined && val !== null) {
          formBody.append(propName, val);
        }
      }
    }
  }
  
  buildFormData(params);

  const res = await fetch(`${STRIPE_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'POST' ? formBody.toString() : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe API Error on ${endpoint}: ${data.error?.message || JSON.stringify(data)}`);
  }
  return data;
}

const HEADPHONES_PRODUCTS = [
  {
    handle: 'soe-sensory-headphones',
    name: 'SOE "Just Add Headphones" Safe Sensory Kids Headphones (85dB Max)',
    description: 'Volume-limited safe 85dB listening for toddlers and young kids (Ages 2-7). Indestructible EVA flex-foam, wired zero-radiation jack, and dual SharePort co-listening.',
    priceCents: 2499,
    collectShipping: true,
    sku: 'SOE-HP-85DB',
  },
  {
    handle: 'soe-headphones-workbook-bundle',
    name: 'SOE Sensory Listening & Workbook Bundle (Headphones + 8-Week Workbook)',
    description: 'The complete physical listening starter kit: 85dB Safe Sensory Kids Headphones shipped to your door + Full 8-Week Rhythm Ready Workbook.',
    priceCents: 3900,
    collectShipping: true,
    sku: 'SOE-HP-WB-BUNDLE',
  }
];

async function main() {
  console.log('🎧 Creating Stripe Products for Dropship Sensory Headphones...\n');
  const mappingPath = path.resolve(__dirname, '../src/data/stripe-products.json');
  let currentMapping = {};
  if (fs.existsSync(mappingPath)) {
    try { currentMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8')); } catch (_) {}
  }

  for (const item of HEADPHONES_PRODUCTS) {
    console.log(`📦 Creating: ${item.name}...`);
    const product = await stripeRequest('/products', {
      name: item.name,
      description: item.description,
      metadata: {
        sku: item.sku,
        handle: item.handle,
        category: 'Dropship Sensory Hardware',
        supplier: 'CJ Dropshipping',
        channel: 'Web & TikTok Shop',
      },
    });

    const price = await stripeRequest('/prices', {
      product: product.id,
      unit_amount: item.priceCents,
      currency: 'usd',
    });

    const paymentLinkPayload = {
      'line_items[0][price]': price.id,
      'line_items[0][quantity]': 1,
      'shipping_address_collection[allowed_countries][0]': 'US',
      'shipping_address_collection[allowed_countries][1]': 'CA',
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': 'https://thesoundofessentials.com/order-success?session_id={CHECKOUT_SESSION_ID}',
    };

    const paymentLink = await stripeRequest('/payment_links', paymentLinkPayload);

    console.log(`   ✓ Product ID: ${product.id}`);
    console.log(`   ✓ Price ID: ${price.id} ($${(item.priceCents / 100).toFixed(2)})`);
    console.log(`   ✓ Payment Link: ${paymentLink.url}\n`);

    currentMapping[item.handle] = {
      productId: product.id,
      priceId: price.id,
      url: paymentLink.url,
      name: item.name,
      price: item.priceCents / 100,
      sku: item.sku,
    };
  }

  fs.writeFileSync(mappingPath, JSON.stringify(currentMapping, null, 2));
  console.log('🎉 Successfully saved Stripe products to stripe-products.json!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
