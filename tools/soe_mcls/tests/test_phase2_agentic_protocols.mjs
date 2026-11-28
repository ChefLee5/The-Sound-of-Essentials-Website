import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { verifyCanonCompliance } from '../../../web/lib/mclsCore.js';
import {
  BASE_MAINNET_USDC,
  decodeBase64Json,
  encodeBase64Json,
} from '../../../web/lib/x402Agent.js';
import { onRequestGet as catalogGet } from '../../../web/functions/api/agent/catalog.js';
import { onRequestPost as purchasePost } from '../../../web/functions/api/agent/purchase.js';
import {
  onRequestGet as frameGet,
  onRequestPost as framePost,
} from '../../../web/functions/api/frames/signal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_PUBLIC = path.resolve(__dirname, '..', '..', '..', 'web', 'public');

const VALID_TREASURY = '0x1111111111111111111111111111111111111111';
const VALID_PAYER = '0x2222222222222222222222222222222222222222';
const VALID_SIG = `0x${'ab'.repeat(65)}`;

test('Agentic discovery files (.well-known/agent.json, erc8004.json, ai/summary.json) parse and pass canon', () => {
  const agentCard = JSON.parse(
    fs.readFileSync(path.join(WEB_PUBLIC, '.well-known', 'agent.json'), 'utf8')
  );
  const erc8004 = JSON.parse(
    fs.readFileSync(path.join(WEB_PUBLIC, '.well-known', 'erc8004.json'), 'utf8')
  );
  const summary = JSON.parse(
    fs.readFileSync(path.join(WEB_PUBLIC, 'ai', 'summary.json'), 'utf8')
  );

  assert.equal(agentCard.capabilities.x402Payments, true);
  assert.equal(agentCard.capabilities.webMcp, true);
  assert.equal(agentCard.skills.length, 5);

  assert.equal(erc8004.type, 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1');
  assert.equal(erc8004.x402Support, true);
  assert.equal(erc8004.provenance.catalogUpcGtin12, '885000556098');

  assert.equal(summary.webmcp.tools.length, 4);
  assert.ok(summary.agenticProtocols.x402Purchase.endsWith('/api/agent/purchase'));

  const combined = `${JSON.stringify(agentCard)} ${JSON.stringify(erc8004)} ${JSON.stringify(summary)}`;
  const canon = verifyCanonCompliance(combined);
  assert.equal(canon.passed, true, `Canon violations: ${canon.violations.join('; ')}`);
});

test('GET /api/agent/catalog exposes digital SKUs and Base USDC settlement config', async () => {
  const res = await catalogGet({
    request: new Request('https://thesoundofessentials.com/api/agent/catalog'),
    env: { SOE_TREASURY_WALLET_ADDRESS: VALID_TREASURY, SOE_X402_NETWORK: 'base' },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.protocol, 'x402');
  assert.equal(body.settlement.asset, BASE_MAINNET_USDC);
  assert.equal(body.settlement.treasuryConfigured, true);
  assert.equal(body.settlement.payTo, VALID_TREASURY);
  assert.ok(body.catalog.some((item) => item.handle === 'quest-starter-pack'));
  assert.ok(body.catalog.some((item) => item.handle === 'heritage-pack-es'));
});

test('x402 /api/agent/purchase returns HTTP 402 challenge without payment header and settles with valid EIP-3009 envelope', async () => {
  const unpaidRes = await purchasePost({
    request: new Request('https://thesoundofessentials.com/api/agent/purchase?handle=quest-starter-pack', {
      method: 'POST',
    }),
    env: { SOE_TREASURY_WALLET_ADDRESS: VALID_TREASURY },
  });
  assert.equal(unpaidRes.status, 402);
  const reqHeader = unpaidRes.headers.get('X-PAYMENT-REQUIRED');
  assert.ok(reqHeader);
  const decodedReq = decodeBase64Json(reqHeader);
  assert.equal(decodedReq.accepts[0].maxAmountRequired, '7000000');
  assert.equal(decodedReq.accepts[0].payTo, VALID_TREASURY);

  // Unconfigured treasury must return 503 when payment is attempted
  const futureUnix = Math.floor(Date.now() / 1000) + 600;
  const paymentPayload = {
    x402Version: 1,
    scheme: 'exact',
    network: 'base',
    payload: {
      signature: VALID_SIG,
      authorization: {
        from: VALID_PAYER,
        to: VALID_TREASURY,
        value: '7000000',
        validAfter: 0,
        validBefore: futureUnix,
        nonce: `0x${'11'.repeat(32)}`,
      },
    },
  };
  const encodedPayment = encodeBase64Json(paymentPayload);

  const unconfiguredRes = await purchasePost({
    request: new Request('https://thesoundofessentials.com/api/agent/purchase?handle=quest-starter-pack', {
      method: 'POST',
      headers: { 'X-PAYMENT': encodedPayment },
    }),
    env: {},
  });
  assert.equal(unconfiguredRes.status, 503);

  // Underpayment returns 402
  const underpaidPayload = {
    ...paymentPayload,
    payload: {
      ...paymentPayload.payload,
      authorization: {
        ...paymentPayload.payload.authorization,
        value: '1000000',
      },
    },
  };
  const underpaidRes = await purchasePost({
    request: new Request('https://thesoundofessentials.com/api/agent/purchase?handle=quest-starter-pack', {
      method: 'POST',
      headers: { 'X-PAYMENT': encodeBase64Json(underpaidPayload) },
    }),
    env: { SOE_TREASURY_WALLET_ADDRESS: VALID_TREASURY },
  });
  assert.equal(underpaidRes.status, 402);

  // Valid payment settles 200 with fulfillment & X-PAYMENT-RESPONSE
  const paidRes = await purchasePost({
    request: new Request(
      'https://thesoundofessentials.com/api/agent/purchase?handle=quest-starter-pack&ref=AGENT_NODE_7',
      {
        method: 'POST',
        headers: { 'X-PAYMENT': encodedPayment },
      }
    ),
    env: { SOE_TREASURY_WALLET_ADDRESS: VALID_TREASURY },
  });
  assert.equal(paidRes.status, 200);
  const paidBody = await paidRes.json();
  assert.equal(paidBody.success, true);
  assert.equal(paidBody.referralCode, 'AGENT_NODE_7');
  assert.ok(paidBody.fulfillment.accessLinks.some((u) => u.endsWith('/downloads/SOE_5_Neural_Pathways_Guide.html')));
  assert.ok(paidRes.headers.get('X-PAYMENT-RESPONSE'));
});

test('Farcaster Frame v2 /api/frames/signal renders frame metadata and referral tracking', async () => {
  const getRes = await frameGet({
    request: new Request('https://thesoundofessentials.com/api/frames/signal?ref=CONCORD_01'),
  });
  assert.equal(getRes.status, 200);
  const html = await getRes.text();
  assert.match(html, /name="fc:frame"/);
  assert.match(html, /launch_frame/);
  assert.match(html, /\/signal\?ref=CONCORD_01/);

  const postRes = await framePost({
    request: new Request('https://thesoundofessentials.com/api/frames/signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ untrustedData: { buttonIndex: 2 } }),
    }),
  });
  assert.equal(postRes.status, 200);
  const postHtml = await postRes.text();
  assert.match(postHtml, /5 Neural Pathways/);
});
