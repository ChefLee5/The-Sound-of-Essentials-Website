/**
 * Cloudflare Pages Function: POST /api/checkout/square
 * Creates a Square Payment Link dynamically via Square Online Checkout API
 * for SOE digital downloads, print/POD goods, donations, and Rhythm Pass continuity.
 */

import {
  getSquareProductSpec,
  resolveSquareLocationId,
  squareApiFetch,
} from '../../../lib/squareCatalog.js';

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    if (!env?.SQUARE_ACCESS_TOKEN) {
      return jsonResponse(
        {
          error: 'Square checkout API is not configured yet (missing SQUARE_ACCESS_TOKEN).',
          code: 'SQUARE_NOT_CONFIGURED',
        },
        503
      );
    }

    const body = await request.json().catch(() => ({}));
    const handle = String(body.handle || '').trim();
    const spec = getSquareProductSpec(handle);

    if (!spec) {
      return jsonResponse({ error: `Unknown product handle: ${handle}` }, 400);
    }

    const locationId = await resolveSquareLocationId(env);
    const variantId = String(body.variantId || '').trim();
    const variantLabel = String(body.variantLabel || '').trim();
    const customerEmail = String(body.customerEmail || '').trim();
    const origin =
      String(body.origin || '').trim() ||
      new URL(request.url).origin ||
      'https://soelearn.com';
    const returnPath = String(body.returnPath || '/order-success').startsWith('/')
      ? body.returnPath
      : '/order-success';

    // Determine authoritative amount in cents (never trust client price for fixed SKUs)
    let amountCents = Number(spec.priceCents) || 0;
    if (spec.type === 'donation') {
      const requestedCents = Number(body.amountCents);
      amountCents =
        Number.isFinite(requestedCents) && requestedCents >= 100
          ? Math.round(requestedCents)
          : spec.priceCents || 5000;
    }

    if (!amountCents || amountCents < 50) {
      return jsonResponse({ error: 'Invalid checkout amount.' }, 400);
    }

    const itemName = variantLabel ? `${spec.name} — ${variantLabel}` : spec.name;
    const skuRef = variantId ? `${spec.sku}-${variantId}` : spec.sku;
    const redirectUrl = `${origin.replace(/\/$/, '')}${returnPath}?provider=square&product=${encodeURIComponent(
      spec.productKey || handle
    )}&sku=${encodeURIComponent(skuRef)}`;

    const checkoutOptions = {
      redirect_url: redirectUrl,
      ask_for_shipping_address: Boolean(spec.collectShipping),
      allow_tipping: false,
      merchant_support_email: 'info@soelearn.com',
    };

    const subscriptionPlanId =
      env?.SQUARE_RHYTHM_PASS_PLAN_ID || spec.squareSubscriptionPlanId || '';
    if (spec.type === 'recurring' && subscriptionPlanId) {
      checkoutOptions.subscription_plan_id = subscriptionPlanId;
    }

    const payload = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: itemName.slice(0, 255),
        price_money: {
          amount: amountCents,
          currency: 'USD',
        },
        location_id: locationId,
      },
      checkout_options: checkoutOptions,
      payment_note: `SKU:${skuRef} | HANDLE:${handle}`,
    };

    if (customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      payload.pre_populated_data = { buyer_email: customerEmail };
    }

    const result = await squareApiFetch(env, '/v2/online-checkout/payment-links', {
      method: 'POST',
      body: payload,
    });

    const paymentLink = result?.payment_link;
    if (!paymentLink?.url) {
      return jsonResponse({ error: 'Square did not return a checkout URL.' }, 502);
    }

    return jsonResponse({
      success: true,
      id: paymentLink.id,
      order_id: paymentLink.order_id || null,
      url: paymentLink.url,
      sku: skuRef,
    });
  } catch (err) {
    console.error('Square Checkout Error:', err);
    return jsonResponse({ error: err.message || 'Square checkout failed' }, 500);
  }
}
