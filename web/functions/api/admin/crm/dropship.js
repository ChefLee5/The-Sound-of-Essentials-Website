const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function queryNeon(databaseUrl, sql, params = []) {
  const finalUrl = databaseUrl || FALLBACK_DB_URL;
  const urlObj = new URL(finalUrl);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': finalUrl,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Database error: ${err}`);
  }
  return res.json();
}

export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'all';

    // 1. Orders
    if (action === 'orders' || action === 'all') {
      const ordersRes = await queryNeon(
        databaseUrl,
        `SELECT o.id, o.order_number, o.source, o.external_order_id, o.customer_name, 
                o.customer_email, o.shipping_address, o.items, o.subtotal, o.shipping_fee, 
                o.total_amount, o.payment_status, o.fulfillment_status, o.created_at,
                f.tracking_number, f.carrier_name, f.fulfillment_status as supplier_status, f.synced_to_tiktok
         FROM shop_orders o
         LEFT JOIN dropship_fulfillments f ON o.id = f.order_id
         ORDER BY o.created_at DESC;`
      );

      if (action === 'orders') {
        return new Response(JSON.stringify({ orders: ordersRes.rows }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Also get products & creators if 'all'
      const [productsRes, creatorsRes, statsRes] = await Promise.all([
        queryNeon(databaseUrl, "SELECT * FROM shop_products WHERE is_active = TRUE ORDER BY created_at DESC;"),
        queryNeon(databaseUrl, "SELECT * FROM creator_samples ORDER BY created_at DESC;"),
        queryNeon(databaseUrl, `
          SELECT 
            COALESCE(SUM(CASE WHEN source = 'tiktok_shop' THEN total_amount ELSE 0 END), 0) as tiktok_gmv,
            COALESCE(SUM(CASE WHEN source = 'web_store' THEN total_amount ELSE 0 END), 0) as web_gmv,
            COUNT(CASE WHEN fulfillment_status IN ('unfulfilled', 'processing') THEN 1 END) as pending_dispatch,
            COUNT(*) as total_orders
          FROM shop_orders;
        `)
      ]);

      return new Response(JSON.stringify({
        orders: ordersRes.rows,
        products: productsRes.rows,
        creators: creatorsRes.rows,
        stats: statsRes.rows[0],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Products Only
    if (action === 'products') {
      const productsRes = await queryNeon(databaseUrl, "SELECT * FROM shop_products WHERE is_active = TRUE ORDER BY created_at DESC;");
      return new Response(JSON.stringify({ products: productsRes.rows }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Creators Only
    if (action === 'creators') {
      const creatorsRes = await queryNeon(databaseUrl, "SELECT * FROM creator_samples ORDER BY created_at DESC;");
      return new Response(JSON.stringify({ creators: creatorsRes.rows }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();
    const { action } = body;

    // 1. Dispatch Order to CJ Dropshipping
    if (action === 'dispatch') {
      const { orderId } = body;
      const supplierPo = `CJ_${Date.now().toString().slice(-8)}`;

      await queryNeon(
        databaseUrl,
        `INSERT INTO dropship_fulfillments (order_id, supplier, supplier_order_id, fulfillment_status)
         VALUES ($1, 'cj_dropshipping', $2, 'ordered')
         ON CONFLICT (id) DO NOTHING;`,
        [orderId, supplierPo]
      );

      await queryNeon(
        databaseUrl,
        `UPDATE shop_orders SET fulfillment_status = 'processing', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`,
        [orderId]
      );

      return new Response(JSON.stringify({ success: true, supplierOrderId: supplierPo }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Sync Tracking to TikTok & Mark Dispatched
    if (action === 'sync_tracking') {
      const { orderId, trackingNumber, carrier = 'USPS' } = body;

      await queryNeon(
        databaseUrl,
        `INSERT INTO dropship_fulfillments (order_id, supplier, tracking_number, carrier_name, fulfillment_status, synced_to_tiktok, synced_to_tiktok_at)
         VALUES ($1, 'cj_dropshipping', $2, $3, 'shipped', TRUE, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           tracking_number = EXCLUDED.tracking_number,
           carrier_name = EXCLUDED.carrier_name,
           fulfillment_status = 'shipped',
           synced_to_tiktok = TRUE,
           synced_to_tiktok_at = CURRENT_TIMESTAMP;`,
        [orderId, trackingNumber, carrier]
      );

      await queryNeon(
        databaseUrl,
        `UPDATE shop_orders SET fulfillment_status = 'dispatched', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`,
        [orderId]
      );

      return new Response(JSON.stringify({ success: true, trackingNumber, syncedToTikTok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Inject Test Order
    if (action === 'create_test_order') {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const items = JSON.stringify([{ title: "SafeAudio 85dB Kids Headphones", qty: 1, price: 24.99 }]);

      await queryNeon(
        databaseUrl,
        `INSERT INTO shop_orders (order_number, source, customer_name, customer_email, total_amount, payment_status, fulfillment_status, items)
         VALUES ($1, 'tiktok_shop', 'Audrey Campbell', 'audrey.c@gmail.com', 24.99, 'paid', 'unfulfilled', $2::jsonb);`,
        [`TT-2026-${randNum}`, items]
      );

      return new Response(JSON.stringify({ success: true, orderNumber: `TT-2026-${randNum}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
