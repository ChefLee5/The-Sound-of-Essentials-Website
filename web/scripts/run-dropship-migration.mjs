import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function runDropshipMigration() {
  const schemaPath = path.resolve('scripts/dropship-tiktok-crm-schema.sql');
  const rawSql = fs.readFileSync(schemaPath, 'utf8');
  console.log('🚀 Executing Dropship & TikTok Shop Schema Migration on Neon PostgreSQL...');

  const urlObj = new URL(connectionString);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  // Remove comment lines
  const cleanSql = rawSql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  // Split into clean statements
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const sql of statements) {
    const preview = sql.split('\n')[0].slice(0, 60);
    console.log(`Executing: ${preview}...`);
    const response = await fetch(neonHttpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': connectionString,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Statement Failed:', errorText);
      process.exit(1);
    }
  }

  console.log('✅ Tables created successfully!');

  // Check if products exist, otherwise seed
  const checkProd = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({
      query: "SELECT COUNT(*) as count FROM shop_products;",
    }),
  });
  const checkData = await checkProd.json();
  const count = parseInt(checkData.rows[0].count, 10);

  if (count === 0) {
    console.log('\n🌱 Seeding initial "Just Add Headphones" products and demo orders...');

    const seedStatements = [
      `INSERT INTO shop_products (
        title, slug, category, cost_price, selling_price, compare_at_price,
        supplier_name, supplier_sku, tiktok_sync_status, specs_json
      ) VALUES (
        'SafeAudio 85dB Wired Kids Headphones (Wired Zero-Radiation • SharePort • Toddler-Proof EVA Foam)',
        'safe-audio-85db-kids-headphones',
        'Audio & Sensory Electronics',
        5.50,
        24.99,
        34.99,
        'CJ Dropshipping',
        'CJ-HEADPHONE-85DB-01',
        'live',
        '{"volume_limit":"85dB","radiation":"Zero (Wired Non-Bluetooth)","material":"Food-Grade EVA Foam","connector":"3.5mm Gold-Plated with Sibling SharePort","compliance":"CPC & ASTM F963 Certified"}'::jsonb
      );`,

      `INSERT INTO shop_products (
        title, slug, category, cost_price, selling_price, compare_at_price,
        supplier_name, supplier_sku, tiktok_sync_status, specs_json
      ) VALUES (
        'The Complete Rhythm Quest Sensory Bundle (Storybook + Workbook + SafeAudio 85dB Headphones)',
        'rhythm-quest-complete-sensory-bundle',
        'Curriculum & Sensory Bundles',
        5.50,
        64.99,
        89.99,
        'SOE + CJ Dropshipping',
        'SOE-BUNDLE-HQ-01',
        'live',
        '{"bundle_items":["66-Page Illustrated Storybook","40-Day Readiness Workbook","85dB SafeAudio Headphones"]}'::jsonb
      );`,

      `INSERT INTO shop_orders (
        order_number, source, external_order_id, customer_name, customer_email,
        customer_phone, shipping_address, items, subtotal, shipping_fee, total_amount,
        payment_status, fulfillment_status
      ) VALUES (
        'TT-2026-10492',
        'tiktok_shop',
        'TT_SHOP_ORD_9823412',
        'Sarah Jenkins',
        'sarah.jenkins@gmail.com',
        '(415) 882-9012',
        '{"street":"742 Evergreen Terrace","city":"Springfield","state":"IL","zip":"62704","country":"US"}'::jsonb,
        '[{"title":"SafeAudio 85dB Wired Kids Headphones","qty":1,"price":24.99,"color":"Pastel Sky Blue"}]'::jsonb,
        24.99,
        0.00,
        24.99,
        'paid',
        'processing'
      );`,

      `INSERT INTO shop_orders (
        order_number, source, external_order_id, customer_name, customer_email,
        customer_phone, shipping_address, items, subtotal, shipping_fee, total_amount,
        payment_status, fulfillment_status
      ) VALUES (
        'WEB-2026-0518',
        'web_store',
        'pi_3PjX912KlMn',
        'David Alvarez',
        'david.alvarez@outlook.com',
        '(512) 304-7718',
        '{"street":"1204 Barton Springs Rd","city":"Austin","state":"TX","zip":"78704","country":"US"}'::jsonb,
        '[{"title":"The Complete Rhythm Quest Sensory Bundle","qty":1,"price":64.99}]'::jsonb,
        64.99,
        0.00,
        64.99,
        'paid',
        'dispatched'
      );`,

      `INSERT INTO dropship_fulfillments (
        order_id, supplier, supplier_order_id, tracking_number, carrier_code,
        carrier_name, tracking_url, fulfillment_status, synced_to_tiktok, synced_to_tiktok_at
      ) 
      SELECT id, 'cj_dropshipping', 'CJ_ORD_889210', '9400111899561234567890', 'USPS', 'USPS Priority Mail',
             'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899561234567890',
             'shipped', TRUE, CURRENT_TIMESTAMP
      FROM shop_orders WHERE order_number = 'WEB-2026-0518';`,

      `INSERT INTO creator_samples (
        creator_handle, platform, follower_count, niche, stage,
        tracking_number, video_url, video_views, attributed_orders, attributed_gmv, commission_rate, notes
      ) VALUES (
        '@MontessoriMamaKate',
        'tiktok',
        142000,
        'Montessori Early Learning & Gentle Parenting',
        'video_posted',
        '9400111899561298765432',
        'https://tiktok.com/@MontessoriMamaKate/video/739182371892',
        48500,
        34,
        849.66,
        15.00,
        'Loved the zero-radiation angle! Video hook: "Why I tossed our wireless Bluetooth headphones for the 85dB safe wire."'
      );`,

      `INSERT INTO creator_samples (
        creator_handle, platform, follower_count, niche, stage,
        tracking_number, video_url, video_views, attributed_orders, attributed_gmv, commission_rate, notes
      ) VALUES (
        '@SpeechAndSensoryKids',
        'tiktok',
        88500,
        'Pediatric Speech & Sensory Development',
        'sample_shipped',
        '9400111899561244332211',
        NULL,
        0,
        0,
        0.00,
        15.00,
        'Sample dispatched via CJ US Warehouse. Planning review hook around listening to SOE phonemic rhymes.'
      );`
    ];

    for (const seedSql of seedStatements) {
      await fetch(neonHttpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': connectionString,
        },
        body: JSON.stringify({ query: seedSql }),
      });
    }

    console.log('✨ Seed data inserted successfully!');
  } else {
    console.log(`ℹ️ Products table already has ${count} records, skipping seed.`);
  }

  console.log('\n🎉 Dropship & TikTok CRM database migration completed 100%!');
}

runDropshipMigration().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
