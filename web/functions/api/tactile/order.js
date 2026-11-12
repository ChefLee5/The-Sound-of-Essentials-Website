/**
 * Cloudflare Pages Function: /api/tactile/order
 * SOE Cloud Academy & Direct Stripe -> Slant 3D REST API Print-on-Demand Bridge.
 * Captures verified physical shipping addresses (legally unlocking $14.99/mo The Rhythm Pass)
 * with $0 upfront manufacturing inventory (Made in the land of America).
 */

const RETIRED_CANON_RE = /\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria|Ages?\s*2\s*[-–—]\s*8|Grade\s*3|Shopify)\b/i;

const SOE_TACTILE_CATALOG = [
  {
    sku: 'SOE-HARM-NAME-01',
    name: 'My Name in Harmonia — Personalized Phonics & Syllable Board',
    land: 'Harmonia (Kenji & Aiko)',
    age_range: 'Ages 2–7 (Pre-K to Grade 2)',
    price_usd: 29,
    estimated_pod_cost_usd: 5.25,
    unlocks_rhythm_pass: true,
    cloud_academy_3mf_included: true,
    parametric_inputs: ['child_name', 'color'],
  },
  {
    sku: 'SOE-VIT-KNUCKLE-01',
    name: 'Vitalis Somatic Knuckle-Tap & Midline Rhythm Board',
    land: 'Vitalis (Amara & Felix)',
    age_range: 'Ages 2–7 (Pre-K to Grade 2)',
    price_usd: 34,
    estimated_pod_cost_usd: 6.1,
    unlocks_rhythm_pass: true,
    cloud_academy_3mf_included: true,
    parametric_inputs: ['beats', 'color'],
  },
  {
    sku: 'SOE-CONCORD-NFC-01',
    name: 'Phygital NFC Hero Totem Plinth (Seriphia, 14 Heroes & Lil G)',
    land: 'All 7 Lands + The Concord',
    age_range: 'Ages 2–7 (Pre-K to Grade 2)',
    price_usd: 19,
    estimated_pod_cost_usd: 3.4,
    unlocks_rhythm_pass: true,
    cloud_academy_3mf_included: true,
    parametric_inputs: ['hero_name', 'color'],
  },
];

const SOE_DIGITAL_CAD_LICENSE = {
  license_id: 'SOE-PERSONAL-OR-POD-V1',
  terms_url: 'https://soelearn.com/terms#digital-license',
  permitted: 'Single-household personal use or 1 licensed Cloud Academy classroom/school site (Ages 2–7).',
  prohibited: 'No commercial 3D-print resale (Etsy/TPT), public STL reposting, or unlicensed multi-school sharing.',
  unauthorized_fee_remedy: 'Retroactive commercial/multi-seat licensing fee ($199/classroom or $499/campus minimum).',
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildSlant3dPayload({ customerName, customerEmail, shippingAddress, sku, stlUrl, color = 'Orange', quantity = 1 }) {
  return {
    endpoint: 'https://www.slant3dapi.com/api/order',
    customer: {
      name: customerName,
      email: customerEmail,
      shipping_address: {
        address_line_1: shippingAddress.address_line_1 || shippingAddress.line1 || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || '',
        postal_code: shippingAddress.postal_code || '',
        country: shippingAddress.country || 'US',
      },
    },
    line_items: [
      {
        sku,
        file_url: stlUrl,
        filament: 'PLA',
        color,
        quantity: Number(quantity) || 1,
      },
    ],
  };
}

export async function onRequestGet() {
  return jsonResponse({
    success: true,
    engine: 'SOE Cloud Academy Text-to-CAD + Slant 3D POD',
    age_canon: 'Ages 2–7 (Pre-K to Grade 2)',
    cpsc_small_parts_clearance_mm: 31.8,
    digital_license: SOE_DIGITAL_CAD_LICENSE,
    catalog: SOE_TACTILE_CATALOG,
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { action = 'preview_cad_spec' } = body;

    const catalogMap = Object.fromEntries(SOE_TACTILE_CATALOG.map((item) => [item.sku, item]));
    const sku = body.sku || 'SOE-HARM-NAME-01';
    const itemSpec = catalogMap[sku];
    if (!itemSpec) {
      return jsonResponse({ error: `Unknown SOE Tactile SKU: ${sku}` }, 400);
    }

    const customLabel = String(body.child_name || body.hero_name || '').trim();
    if (RETIRED_CANON_RE.test(customLabel) || RETIRED_CANON_RE.test(JSON.stringify(body))) {
      return jsonResponse(
        {
          error: 'SOE Canon Block: retired entity, age-range violation, or disallowed stack keyword detected.',
          canon_status: 'BLOCKED',
        },
        422
      );
    }

    if (action === 'preview_cad_spec') {
      const cleanName = (customLabel || 'SOE').toUpperCase().replace(/[^A-Z -]/g, '').slice(0, 12) || 'SOE';
      const widthMm = sku === 'SOE-HARM-NAME-01' ? Math.max(90, 32 + cleanName.length * 22 - 7) : 110;
      const depthMm = sku === 'SOE-VIT-KNUCKLE-01' ? 64 : 50;
      const stlSlug = cleanName.toLowerCase().replace(/\s+/g, '_');
      const stlUrl = `https://soelearn.com/cad/${sku.toLowerCase()}_${stlSlug}.stl`;

      return jsonResponse({
        success: true,
        action,
        canon_status: 'PASS',
        item: itemSpec,
        parametric_spec: {
          clean_label: cleanName,
          dimensions_mm: { width: widthMm, depth: depthMm, height: 8.5 },
          cpsc_1501_child_safe_ages_2_7: Math.min(widthMm, depthMm) >= 31.8,
          stl_url: stlUrl,
          cad_generator: 'tools/soe_tactile_cad (build123d / Binary STL)',
        },
        gate_2_continuity: {
          captures_shipping_address: true,
          unlocks_rhythm_pass: '$14.99/mo The Rhythm Pass',
        },
        digital_license: SOE_DIGITAL_CAD_LICENSE,
      });
    }

    if (action === 'submit_pod_order') {
      const {
        customer_name = '',
        customer_email = '',
        shipping_address = {},
        payment_intent_id = '',
        stl_url = `https://soelearn.com/cad/${sku.toLowerCase()}.stl`,
        color = 'Orange',
        quantity = 1,
      } = body;

      if (!payment_intent_id || !shipping_address?.address_line_1 || !shipping_address?.postal_code) {
        return jsonResponse(
          { error: 'Direct Stripe payment_intent_id and verified shipping_address are required to unlock physical fulfillment.' },
          400
        );
      }

      const slantPayload = buildSlant3dPayload({
        customerName: customer_name || 'SOE Family',
        customerEmail: customer_email || 'info@soelearn.com',
        shippingAddress: shipping_address,
        sku,
        stlUrl: stl_url,
        color,
        quantity,
      });

      const slantApiKey = env?.SLANT3D_API_KEY || '';
      let mode = 'SANDBOX_DRY_RUN';
      let providerResponse = null;

      if (slantApiKey) {
        const res = await fetch(slantPayload.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': slantApiKey,
          },
          body: JSON.stringify({
            customer: slantPayload.customer,
            line_items: slantPayload.line_items,
          }),
        });
        mode = res.ok ? 'LIVE_SUBMITTED' : 'PROVIDER_ERROR';
        providerResponse = await res.json().catch(() => ({ status: res.status }));
      }

      return jsonResponse({
        success: mode !== 'PROVIDER_ERROR',
        mode,
        order_ref: `SOE-POD-${Date.now().toString().slice(-6)}`,
        payment_intent_id,
        unlocks_rhythm_pass_continuity: true,
        slant3d_payload: slantPayload,
        provider_response: providerResponse,
      });
    }

    return jsonResponse({ error: `Unsupported action: ${action}` }, 400);
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

