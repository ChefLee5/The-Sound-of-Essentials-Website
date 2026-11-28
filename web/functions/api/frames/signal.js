/**
 * Cloudflare Pages Function: GET / POST /api/frames/signal
 * Farcaster Frame v2 + v1 compatible interactive mini-experience for The Seriphia Signal.
 * Allows Web3 social feeds to preview Seriphia's Ages 2–7 lifeline and route directly to
 * /signal, printable field guides, or /api/agent/catalog with optional ?ref= tracking.
 */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildFrameHtml({ origin, refCode, headline, description, imageUrl }) {
  const refQuery = refCode ? `?ref=${encodeURIComponent(refCode)}` : '';
  const signalUrl = `${origin}/signal${refQuery}`;
  const guideUrl = `${origin}/downloads/SOE_5_Neural_Pathways_Guide.html`;
  const catalogUrl = `${origin}/api/agent/catalog`;
  const postUrl = `${origin}/api/frames/signal${refQuery}`;

  const frameV2Embed = JSON.stringify({
    version: 'next',
    imageUrl,
    button: {
      title: 'Answer the Signal (Free 19 Tracks)',
      action: {
        type: 'launch_frame',
        name: 'The Seriphia Signal',
        url: signalUrl,
        splashImageUrl: `${origin}/assets/soe-official-logo.png`,
        splashBackgroundColor: '#FFF8F0',
      },
    },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(headline)}</title>
  <meta property="og:title" content="${escapeHtml(headline)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta name="fc:frame" content='${escapeHtml(frameV2Embed)}' />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${escapeHtml(imageUrl)}" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:post_url" content="${escapeHtml(postUrl)}" />
  <meta property="fc:frame:button:1" content="Unlock Free 19-Track Signal" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="${escapeHtml(signalUrl)}" />
  <meta property="fc:frame:button:2" content="5 Neural Pathways Guide" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="${escapeHtml(guideUrl)}" />
  <meta property="fc:frame:button:3" content="Agent x402 Catalog" />
  <meta property="fc:frame:button:3:action" content="link" />
  <meta property="fc:frame:button:3:target" content="${escapeHtml(catalogUrl)}" />
</head>
<body style="font-family: Inter, sans-serif; background: #FFF8F0; color: #1F2937; padding: 32px; text-align: center;">
  <h1 style="color: #FF6F00;">${escapeHtml(headline)}</h1>
  <p style="max-width: 640px; margin: 12px auto 24px;">${escapeHtml(description)}</p>
  <a href="${escapeHtml(signalUrl)}" style="display: inline-block; padding: 12px 24px; border-radius: 50px; background: #FF6F00; color: #FFFFFF; text-decoration: none; font-weight: 700;">Open The Seriphia Signal &rarr;</a>
</body>
</html>`;
}

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const origin = url.origin || 'https://thesoundofessentials.com';
  const refCode = String(url.searchParams.get('ref') || '').trim();

  const html = buildFrameHtml({
    origin,
    refCode,
    headline: "Seriphia's Acoustic Signal for Early Learning (Ages 2–7)",
    description:
      '19 master studio recordings with authentic human vocals and warm acoustic arrangements plus 3 printable screen-free field guides ($0). Staying on the path, always learning.',
    imageUrl: `${origin}/assets/marketing/quest-collage.webp`,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export async function onRequestPost(context) {
  const { request } = context;
  const url = new URL(request.url);
  const origin = url.origin || 'https://thesoundofessentials.com';
  const refCode = String(url.searchParams.get('ref') || '').trim();
  const body = await request.json().catch(() => ({}));
  const buttonIndex = Number(body?.untrustedData?.buttonIndex || 1);

  const html = buildFrameHtml({
    origin,
    refCode,
    headline:
      buttonIndex === 2
        ? 'The 5 Neural Pathways Built in Rhythm Quest (Ages 2–7)'
        : "Seriphia's Acoustic Signal Ready — Ages 2–7 Screen-Free Lifeline",
    description:
      'Tap below to unlock all 19 studio recordings free ($0) or inspect our x402 Base USDC digital catalog.',
    imageUrl: `${origin}/assets/marketing/quest-collage.webp`,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
