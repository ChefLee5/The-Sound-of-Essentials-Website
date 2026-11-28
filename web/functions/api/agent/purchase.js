/**
 * Cloudflare Pages Function: GET / POST /api/agent/purchase
 * Implements the Linux Foundation x402 (HTTP 402 Payment Required) open standard
 * for machine-to-machine purchases of SOE digital curriculum SKUs in Base USDC.
 */

import {
  DEFAULT_X402_NETWORK,
  buildX402Challenge,
  decodeBase64Json,
  encodeBase64Json,
  getX402ProductSpec,
  validateX402PaymentPayload,
} from '../../../lib/x402Agent.js';

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'X-PAYMENT-REQUIRED, X-PAYMENT-RESPONSE',
      ...extraHeaders,
    },
  });
}

async function handlePurchaseRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin || 'https://thesoundofessentials.com';

  let body = {};
  if (request.method === 'POST') {
    body = await request.json().catch(() => ({}));
  }

  const handle = String(url.searchParams.get('handle') || body.handle || '').trim();
  const refCode = String(url.searchParams.get('ref') || body.ref || '').trim();
  const skuSpec = getX402ProductSpec(handle);

  if (!skuSpec) {
    return jsonResponse(
      {
        error: `Unknown digital SKU handle '${handle}'. Query GET /api/agent/catalog for supported handles.`,
      },
      400
    );
  }

  const treasuryAddress = env?.SOE_TREASURY_WALLET_ADDRESS || '';
  const network = env?.SOE_X402_NETWORK || DEFAULT_X402_NETWORK;
  const paymentHeader =
    request.headers.get('X-PAYMENT') ||
    request.headers.get('PAYMENT-SIGNATURE') ||
    '';

  const resourceUrl = `${origin}/api/agent/purchase?handle=${encodeURIComponent(skuSpec.handle)}`;
  const challenge = buildX402Challenge({
    skuSpec,
    resourceUrl,
    treasuryAddress,
    network,
  });

  // Unpaid discovery / challenge step -> return HTTP 402 Payment Required
  if (!paymentHeader) {
    return jsonResponse(challenge, 402, {
      'X-PAYMENT-REQUIRED': encodeBase64Json(challenge),
    });
  }

  let parsedPayment;
  try {
    parsedPayment = decodeBase64Json(paymentHeader);
  } catch {
    return jsonResponse(
      {
        ...challenge,
        error: 'Malformed X-PAYMENT / PAYMENT-SIGNATURE header (expected Base64 JSON).',
      },
      402,
      {
        'X-PAYMENT-REQUIRED': encodeBase64Json(challenge),
      }
    );
  }

  const check = validateX402PaymentPayload({
    paymentPayload: parsedPayment,
    skuSpec,
    treasuryAddress,
    network,
  });

  if (!check.ok) {
    return jsonResponse(
      {
        ...challenge,
        error: check.reason,
      },
      check.status,
      check.status === 402 ? { 'X-PAYMENT-REQUIRED': encodeBase64Json(challenge) } : {}
    );
  }

  // Optional external facilitator settlement verification when configured
  const facilitatorUrl = String(env?.SOE_X402_FACILITATOR_URL || '').trim();
  let facilitatorReceipt = null;
  if (facilitatorUrl) {
    try {
      const facRes = await fetch(`${facilitatorUrl.replace(/\/$/, '')}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x402Version: challenge.x402Version,
          paymentPayload: parsedPayment,
          paymentRequirements: challenge.accepts[0],
        }),
      });
      const facJson = await facRes.json().catch(() => ({}));
      if (!facRes.ok || facJson?.success === false) {
        return jsonResponse(
          {
            ...challenge,
            error: facJson?.error || 'x402 facilitator settlement rejected.',
          },
          402,
          { 'X-PAYMENT-REQUIRED': encodeBase64Json(challenge) }
        );
      }
      facilitatorReceipt = facJson;
    } catch (err) {
      return jsonResponse(
        {
          error: `Facilitator verification error: ${err.message}`,
        },
        502
      );
    }
  }

  const settlementResponse = {
    success: true,
    protocol: 'x402',
    network,
    sku: skuSpec.sku,
    handle: skuSpec.handle,
    payer: check.payer,
    payTo: treasuryAddress.trim(),
    amountAtomic: check.amountAtomic,
    priceUsd: skuSpec.priceUsd,
    referralCode: refCode || null,
    settledAt: new Date().toISOString(),
    facilitatorReceipt,
  };

  return jsonResponse(
    {
      ...settlementResponse,
      fulfillment: {
        deliveryType: skuSpec.deliveryType,
        accessLinks: skuSpec.fulfillmentPaths.map((p) => `${origin}${p}`),
        supportEmail: 'info@soelearn.com',
        assurance:
          'Instant digital access, lifetime family license, and dedicated support at info@soelearn.com.',
      },
    },
    200,
    {
      'X-PAYMENT-RESPONSE': encodeBase64Json(settlementResponse),
    }
  );
}

export async function onRequestGet(context) {
  return handlePurchaseRequest(context);
}

export async function onRequestPost(context) {
  return handlePurchaseRequest(context);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-PAYMENT, PAYMENT-SIGNATURE',
      'Access-Control-Expose-Headers': 'X-PAYMENT-REQUIRED, X-PAYMENT-RESPONSE',
    },
  });
}
