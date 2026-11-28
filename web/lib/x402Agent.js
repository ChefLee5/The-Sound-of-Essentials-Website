/**
 * Shared Open-Standard x402 (HTTP 402 Payment Required) & Agentic SKU Registry.
 * Enables autonomous AI agents to discover and settle digital SOE curriculum SKUs
 * using Base Mainnet USDC directly to SOE's self-custodied treasury wallet.
 */

export const BASE_MAINNET_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const DEFAULT_X402_NETWORK = 'base';
export const X402_VERSION = 1;

/**
 * Digital SKUs eligible for instant machine-to-machine x402 settlement.
 * Prices use USDC 6-decimal atomic units (1 USD = 1_000_000 atomic units).
 */
export const X402_DIGITAL_CATALOG = {
  'quest-starter-pack': {
    handle: 'quest-starter-pack',
    sku: 'SOE-STARTER-PACK',
    name: 'The Quest Starter & Coloring Pack (Ages 2–7)',
    description:
      '40-page printable storybook coloring book, Seriphia 432Hz bedtime track, 7-Land rhythm cue cards, and daily rhythm dial.',
    priceUsd: 7.0,
    amountAtomic: '7000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: [
      '/player',
      '/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html',
      '/downloads/SOE_5_Neural_Pathways_Guide.html',
      '/downloads/SOE_Sensory_Regulation_Guide.html',
    ],
  },
  'heritage-pack-es': {
    handle: 'heritage-pack-es',
    sku: 'SOE-HERITAGE-ES',
    name: 'Heritage Language Pack — Español (Aventura del Ritmo, Ages 2–7)',
    description:
      '10 illustrated cultural scenes, 200 Spanish target vocabulary words, and dual-language studio acoustic pronunciation guides.',
    priceUsd: 9.0,
    amountAtomic: '9000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: ['/global-learn-english', '/workbook#dictionary-presale'],
  },
  'heritage-pack-fr': {
    handle: 'heritage-pack-fr',
    sku: 'SOE-HERITAGE-FR',
    name: 'Heritage Language Pack — Français (La Quête du Rythme, Ages 2–7)',
    description:
      '10 illustrated cultural scenes, 200 French target vocabulary words, and dual-language acoustic pronunciation guides paired with Le Cheval.',
    priceUsd: 9.0,
    amountAtomic: '9000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: [
      '/assets/le-cheval/le_cheval_sheet_music.html',
      '/global-learn-english',
    ],
  },
  'rhythm-quest-ebook': {
    handle: 'rhythm-quest-ebook',
    sku: 'SOE-RQ-EBOOK',
    name: 'The Sound of Essentials: Rhythm Quest (66-Page Companion Storybook, Ages 2–7)',
    description:
      '66-page illustrated companion storybook introducing Seriphia and 14 Land Heroes across all 7 Lands (EPUB/PDF).',
    priceUsd: 19.0,
    amountAtomic: '19000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: ['/gallery', '/player'],
  },
  'rhythm-ready-workbook-digital': {
    handle: 'rhythm-ready-workbook-digital',
    sku: 'SOE-RR-DIGITAL',
    name: 'SOE Rhythm Quest: Rhythm Ready Workbook (Digital PDF, Ages 2–7)',
    description:
      '40-day cross-curricular screen-free readiness quest (~400 tactile activities across 10 daily blocks A–J).',
    priceUsd: 21.0,
    amountAtomic: '21000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: ['/rhythm-ready', '/downloads/SOE_5_Neural_Pathways_Guide.html'],
  },
  'educator-4-stem-pack': {
    handle: 'educator-4-stem-pack',
    sku: 'SOE-EDU-STEMS-29',
    name: 'Educator 4-Stem Classroom Pack & ELOF/NAEYC Crosswalk (Ages 2–7)',
    description:
      'Full 19-track educator stem archive plus classroom license and Head Start ELOF / NAEYC standards crosswalk.',
    priceUsd: 29.0,
    amountAtomic: '29000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: [
      '/institutions',
      '/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html',
      '/downloads/SOE_Sensory_Regulation_Guide.html',
    ],
  },
  'complete-quest-pack': {
    handle: 'complete-quest-pack',
    sku: 'SOE-QUEST-PACK',
    name: 'The Complete Quest Pack (Digital Bundle, Ages 2–7)',
    description:
      '19-track studio audio masters, 66-page Companion Storybook, 40-day Rhythm Ready Workbook PDF, and Essential Picture Dictionary reservation.',
    priceUsd: 49.0,
    amountAtomic: '49000000',
    deliveryType: 'instant_digital',
    fulfillmentPaths: ['/workbook', '/rhythm-ready', '/player'],
  },
  'essential-picture-dictionary-digital': {
    handle: 'essential-picture-dictionary-digital',
    sku: 'SOE-DICT-RESERVE',
    name: 'SOE Rhythm Quest: Essential Picture Dictionary (Reserve Your Copy, Ages 2–7)',
    description:
      '4,000+ illustrated vocabulary words across 125 scenes with phonetic guides and ASL sign descriptions (digital delivery upon official release).',
    priceUsd: 55.0,
    amountAtomic: '55000000',
    deliveryType: 'digital_reservation',
    fulfillmentPaths: ['/workbook#dictionary-presale'],
  },
};

export function isValidEvmAddress(address = '') {
  return /^0x[a-fA-F0-9]{40}$/.test(String(address || '').trim());
}

export function getX402CatalogList(origin = 'https://thesoundofessentials.com') {
  const base = String(origin || 'https://thesoundofessentials.com').replace(/\/$/, '');
  return Object.values(X402_DIGITAL_CATALOG).map((item) => ({
    ...item,
    asset: BASE_MAINNET_USDC,
    currency: 'USDC',
    network: DEFAULT_X402_NETWORK,
    purchaseEndpoint: `${base}/api/agent/purchase?handle=${encodeURIComponent(item.handle)}`,
  }));
}

export function getX402ProductSpec(handle = '') {
  return X402_DIGITAL_CATALOG[String(handle || '').trim()] || null;
}

/**
 * Encodes an ASCII string to Base64 safely across Node and Cloudflare Workers.
 */
export function encodeBase64Json(obj) {
  const json = JSON.stringify(obj);
  if (typeof btoa === 'function') {
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  return Buffer.from(json, 'utf8').toString('base64');
}

export function decodeBase64Json(rawHeader = '') {
  const text = String(rawHeader || '').trim();
  if (!text) return null;
  if (text.startsWith('{')) {
    return JSON.parse(text);
  }
  let jsonStr = '';
  if (typeof atob === 'function') {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    jsonStr = new TextDecoder().decode(bytes);
  } else {
    jsonStr = Buffer.from(text, 'base64').toString('utf8');
  }
  return JSON.parse(jsonStr);
}

/**
 * Builds a standard HTTP 402 Payment Required challenge payload & header.
 */
export function buildX402Challenge({
  skuSpec,
  resourceUrl,
  treasuryAddress = '',
  network = DEFAULT_X402_NETWORK,
}) {
  const payTo = isValidEvmAddress(treasuryAddress)
    ? treasuryAddress.trim()
    : 'UNCONFIGURED_SET_SOE_TREASURY_WALLET_ADDRESS';

  const requirement = {
    scheme: 'exact',
    network: network || DEFAULT_X402_NETWORK,
    maxAmountRequired: skuSpec.amountAtomic,
    resource: resourceUrl,
    description: skuSpec.description,
    mimeType: 'application/json',
    payTo,
    maxTimeoutSeconds: 300,
    asset: BASE_MAINNET_USDC,
    extra: {
      name: 'USD Coin',
      version: '2',
      sku: skuSpec.sku,
      handle: skuSpec.handle,
      priceUsd: skuSpec.priceUsd,
      treasuryConfigured: isValidEvmAddress(treasuryAddress),
    },
  };

  return {
    x402Version: X402_VERSION,
    error: isValidEvmAddress(treasuryAddress)
      ? 'Payment Required'
      : 'Payment Required (Operator must set SOE_TREASURY_WALLET_ADDRESS to settle live Base USDC)',
    accepts: [requirement],
  };
}

/**
 * Validates the structure of an inbound x402 payment header payload
 * (EIP-3009 transferWithAuthorization envelope).
 */
export function validateX402PaymentPayload({
  paymentPayload,
  skuSpec,
  treasuryAddress,
  network = DEFAULT_X402_NETWORK,
  nowUnix = Math.floor(Date.now() / 1000),
}) {
  if (!isValidEvmAddress(treasuryAddress)) {
    return {
      ok: false,
      status: 503,
      reason: 'SOE_TREASURY_WALLET_ADDRESS is not configured on the server.',
    };
  }
  if (!paymentPayload || typeof paymentPayload !== 'object') {
    return { ok: false, status: 402, reason: 'Missing or malformed x402 payment payload.' };
  }

  const reqNetwork = String(paymentPayload.network || network).toLowerCase();
  if (reqNetwork !== String(network || DEFAULT_X402_NETWORK).toLowerCase()) {
    return { ok: false, status: 402, reason: `Unsupported network '${reqNetwork}'. Expected '${network}'.` };
  }

  const auth =
    paymentPayload?.payload?.authorization ||
    paymentPayload?.authorization ||
    paymentPayload;
  const signature =
    paymentPayload?.payload?.signature ||
    paymentPayload?.signature ||
    '';

  if (!isValidEvmAddress(auth.from)) {
    return { ok: false, status: 402, reason: 'Invalid payer EVM address in authorization.from.' };
  }
  if (String(auth.to || '').toLowerCase() !== treasuryAddress.trim().toLowerCase()) {
    return { ok: false, status: 402, reason: 'Recipient mismatch: authorization.to must match SOE treasury.' };
  }

  let paidAtomic;
  let requiredAtomic;
  try {
    paidAtomic = BigInt(String(auth.value ?? '0'));
    requiredAtomic = BigInt(String(skuSpec.amountAtomic));
  } catch {
    return { ok: false, status: 402, reason: 'Invalid atomic USDC amount.' };
  }

  if (paidAtomic < requiredAtomic) {
    return {
      ok: false,
      status: 402,
      reason: `Insufficient payment amount: received ${paidAtomic.toString()}, required ${requiredAtomic.toString()}.`,
    };
  }

  const validBefore = Number(auth.validBefore ?? 0);
  if (!Number.isFinite(validBefore) || validBefore <= nowUnix) {
    return { ok: false, status: 402, reason: 'Payment authorization expired (validBefore).' };
  }

  if (!/^0x[a-fA-F0-9]{130}$/.test(String(signature || '').trim())) {
    return { ok: false, status: 402, reason: 'Invalid EIP-712/EIP-3009 signature format.' };
  }

  return {
    ok: true,
    payer: auth.from,
    amountAtomic: paidAtomic.toString(),
    nonce: auth.nonce || null,
  };
}
