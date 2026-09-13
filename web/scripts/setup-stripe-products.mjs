import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY is not set in .env');
  console.log('Please add your Stripe Secret Key (sk_test_... or sk_live_...) to web/.env');
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

const PRODUCTS_TO_CREATE = [
  {
    handle: 'sound-of-essentials-rhythm-quest-storybook',
    name: 'The Sound of Essentials: Rhythm Quest (Storybook)',
    description: 'The 66-page illustrated companion storybook connecting musical rhythm to sensory phonics and reading readiness for ages 2–7. Instant EPUB/PDF.',
    priceCents: 1900,
    type: 'one_time',
    collectShipping: false,
    sku: 'SOE-RQ-EBOOK',
  },
  {
    handle: 'quest-starter-pack',
    name: 'The Quest Starter Pack',
    description: 'Gate-1 printables, sensory phonics guides, rhythm flashcards, and high-fidelity bonus audio stems.',
    priceCents: 700,
    type: 'one_time',
    collectShipping: false,
    sku: 'SOE-STARTER-PACK',
  },
  {
    handle: 'rhythm-ready-workbook-digital',
    name: 'SOE Rhythm Quest: Rhythm Ready Workbook (Digital)',
    description: '7-week cross-curricular readiness workbook spanning all 7 Lands. ~400 activities across 10 daily blocks building bedrock literacy and motor skills.',
    priceCents: 2100,
    type: 'one_time',
    collectShipping: false,
    sku: 'SOE-RR-DIGITAL',
  },
  {
    handle: 'rhythm-ready-workbook-print',
    name: 'SOE Rhythm Quest: Rhythm Ready Workbook (Physical Print)',
    description: 'Spiral/softcover coil-bound 8-week full-color physical workbook shipped directly to your door.',
    priceCents: 3500,
    type: 'one_time',
    collectShipping: true,
    sku: 'SOE-RR-PRINT',
  },
  {
    handle: 'complete-quest-pack',
    name: 'The Complete Quest Pack',
    description: 'The complete Sound of Essentials digital suite: Storybook + Workbook + 19-track Album + Parent Guides.',
    priceCents: 4900,
    type: 'one_time',
    collectShipping: false,
    sku: 'SOE-QUEST-PACK',
  },
  {
    handle: 'the-rhythm-pass',
    name: 'The Rhythm Pass (Monthly Membership)',
    description: 'Continuous monthly rhythm quests, weekly lesson extensions across the 5 Core Domains, and subscriber-only printables.',
    priceCents: 1499,
    type: 'recurring',
    interval: 'month',
    collectShipping: false,
    sku: 'SOE-RHYTHM-PASS',
  },
  {
    handle: 'essential-picture-dictionary-presale',
    name: 'SOE Rhythm Quest: Essential Picture Dictionary (Pre-Sale)',
    description: '125-scene illustrated vocabulary journey through all 7 Lands. Over 4,000 words with phonetic guides and bilingual EN/ES support.',
    priceCents: 5500,
    type: 'one_time',
    collectShipping: false,
    sku: 'SOE-DICT-PRESALE',
  },
];

async function main() {
  console.log('🚀 Setting up Stripe Products, Prices, and Payment Links for The Sound of Essentials...\n');
  const results = {};

  for (const item of PRODUCTS_TO_CREATE) {
    console.log(`📦 Creating/Configuring Product: ${item.name}...`);
    
    // 1. Create Product
    const product = await stripeRequest('/products', {
      name: item.name,
      description: item.description,
      metadata: {
        sku: item.sku,
        handle: item.handle,
        brand: 'The Sound of Essentials',
        ages: '2-7',
      },
    });

    console.log(`   ✓ Product created: ${product.id}`);

    // 2. Create Price
    const pricePayload = {
      product: product.id,
      unit_amount: item.priceCents,
      currency: 'usd',
    };

    if (item.type === 'recurring') {
      pricePayload.recurring = { interval: item.interval };
    }

    const price = await stripeRequest('/prices', pricePayload);
    console.log(`   ✓ Price created: ${price.id} ($${(item.priceCents / 100).toFixed(2)})`);

    // 3. Create Payment Link
    const paymentLinkPayload = {
      'line_items[0][price]': price.id,
      'line_items[0][quantity]': 1,
      'after_completion[type]': 'redirect',
      'after_completion[redirect][url]': 'https://thesoundofessentials.com/order-success?session_id={CHECKOUT_SESSION_ID}',
    };

    if (item.collectShipping) {
      paymentLinkPayload['shipping_address_collection[allowed_countries][0]'] = 'US';
      paymentLinkPayload['shipping_address_collection[allowed_countries][1]'] = 'CA';
    }

    const paymentLink = await stripeRequest('/payment_links', paymentLinkPayload);
    console.log(`   ✓ Payment Link: ${paymentLink.url}\n`);

    results[item.handle] = {
      productId: product.id,
      priceId: price.id,
      url: paymentLink.url,
      name: item.name,
      price: item.priceCents / 100,
      sku: item.sku,
    };
  }

  const outputPath = path.resolve(__dirname, '../src/data/stripe-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`🎉 Done! All 7 Stripe products, prices, and payment links generated.`);
  console.log(`Saved mapping to: ${outputPath}`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
