/**
 * Cloudflare Pages Function: GET /api/agent/catalog
 * Machine-readable digital catalog and x402 / A2A / ERC-8004 endpoint directory
 * for autonomous AI agents visiting thesoundofessentials.com.
 */

import {
  BASE_MAINNET_USDC,
  DEFAULT_X402_NETWORK,
  X402_VERSION,
  getX402CatalogList,
  isValidEvmAddress,
} from '../../../lib/x402Agent.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const origin = new URL(request.url).origin || 'https://thesoundofessentials.com';
  const treasuryAddress = env?.SOE_TREASURY_WALLET_ADDRESS || '';
  const network = env?.SOE_X402_NETWORK || DEFAULT_X402_NETWORK;

  const payload = {
    protocol: 'x402',
    x402Version: X402_VERSION,
    organization: 'The Sound of Essentials',
    guide: 'Seriphia',
    ageRange: 'Ages 2–7 (Pre-K to Grade 2)',
    canonicalDomain: 'https://thesoundofessentials.com',
    qrResolverDomain: 'https://soelearn.com',
    settlement: {
      network,
      asset: BASE_MAINNET_USDC,
      currency: 'USDC',
      treasuryConfigured: isValidEvmAddress(treasuryAddress),
      payTo: isValidEvmAddress(treasuryAddress) ? treasuryAddress.trim() : null,
    },
    freeSignal: {
      priceUsd: 0,
      route: `${origin}/signal`,
      description:
        'Free 19 master studio recordings with authentic human vocals and warm acoustic arrangements plus 3 printable screen-free guides.',
    },
    discovery: {
      agentCard: `${origin}/.well-known/agent.json`,
      erc8004: `${origin}/.well-known/erc8004.json`,
      aiTxt: `${origin}/.well-known/ai.txt`,
      llmsTxt: `${origin}/llms.txt`,
      farcasterFrame: `${origin}/api/frames/signal`,
      mcpBridge: `${origin}/api/mcls/bridge`,
    },
    referralProgram: {
      name: 'Share the Sound Ambassador Loop',
      bountyRange: '30% to 35%',
      queryParam: 'ref',
      exampleUrl: 'https://soelearn.com/signal?ref=YOUR_AGENT_OR_ADVOCATE_CODE',
    },
    catalog: getX402CatalogList(origin),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
