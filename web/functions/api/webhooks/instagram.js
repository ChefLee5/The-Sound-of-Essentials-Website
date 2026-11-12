/**
 * Cloudflare Pages Function: /api/webhooks/instagram
 * SOE Native Meta Graph API v21.0 Comment-to-DM Funnel Auto-Responder (Zero ManyChat SaaS).
 * Implements high-converting "Comment [KEYWORD] -> Auto-DM Link" flow for Instagram Reels
 * (e.g., 8s aesthetic Reel + value caption + keyword trigger RHYTHM / NAMEPLATE / LICENSE / PILOT).
 */

const RETIRED_CANON_RE = /\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria|Ages?\s*2\s*[-–—]\s*8|Grade\s*3|Shopify)\b/i;

const KEYWORD_ROUTES = [
  {
    keywords: ['RHYTHM', 'LISTEN', 'TRACKS', 'FREE'],
    route_key: 'ENGINE_A_LISTEN_VAULT',
    target_url: 'https://soelearn.com/listen?utm_source=ig_dm&utm_medium=comment_trigger',
    reply_text:
      "Sent! Here's your free 19-track Rhythm Quest stream for ages 2–7 (no screen fatigue, just studio rhythm & movement) + our $7 Quest Starter Pack inside: https://soelearn.com/listen",
  },
  {
    keywords: ['NAME', 'NAMEPLATE', 'CAD', 'TACTILE'],
    route_key: 'CLOUD_ACADEMY_NAMEPLATE_POD',
    target_url: 'https://soelearn.com/listen?utm_source=ig_dm&utm_medium=comment_nameplate',
    reply_text:
      'Tap here to customize your child’s 3D-printed Harmonia Phonics Nameplate ($29, made in America — Ages 2–7) right after streaming the album free: https://soelearn.com/listen',
  },
  {
    keywords: ['LICENSE', 'EDIT', 'TERMS', 'LEGAL', 'SCHOOL', 'PILOT'],
    route_key: 'SOE_LICENSE_AND_CONCORD',
    target_url: 'https://soelearn.com/terms#digital-license',
    reply_text:
      'Here is our clear SOE Digital & 3D CAD License Guide (Personal Household vs. $199/yr Cloud Academy Classroom Pod & $499/yr School License): https://soelearn.com/terms#digital-license — or apply for a District Pilot at https://soelearn.com/institutions',
  },
  {
    keywords: ['WORKBOOK', 'BOOK', 'DICTIONARY'],
    route_key: 'ENGINE_B_WORKBOOK',
    target_url: 'https://soelearn.com/workbook?utm_source=ig_dm&utm_medium=comment_workbook',
    reply_text:
      'Here is the 40-Day Rhythm Ready Workbook ($21 digital / $45 print) & 4,232-Word Picture Dictionary for ages 2–7: https://soelearn.com/workbook',
  },
];

function matchCommentKeyword(commentText = '') {
  const normalized = String(commentText).toUpperCase();
  for (const rule of KEYWORD_ROUTES) {
    if (rule.keywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(normalized))) {
      return rule;
    }
  }
  return null;
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  const expectedToken = context.env?.META_WEBHOOK_VERIFY_TOKEN || 'soe_ig_webhook_2026';

  if (mode === 'subscribe' && token === expectedToken && challenge) {
    return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }

  return jsonResponse({
    success: true,
    service: 'SOE Instagram Comment-to-DM Webhook',
    supported_keywords: KEYWORD_ROUTES.flatMap((r) => r.keywords),
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // Support both simulation tests and real Meta Webhook comment payloads
    let commentId = '';
    let commentText = '';
    let igUserId = env?.META_IG_USER_ID || '';

    if (body.action === 'simulate_comment') {
      commentId = body.comment_id || `sim_cmt_${Date.now()}`;
      commentText = String(body.comment_text || '');
    } else {
      const changeVal = body.entry?.[0]?.changes?.[0]?.value || {};
      commentId = changeVal.id || '';
      commentText = changeVal.text || '';
      igUserId = body.entry?.[0]?.id || igUserId;
    }

    const matchedRule = matchCommentKeyword(commentText);
    if (!matchedRule) {
      return jsonResponse({
        success: true,
        matched: false,
        reason: 'No SOE DM trigger keyword matched.',
      });
    }

    if (RETIRED_CANON_RE.test(matchedRule.reply_text)) {
      return jsonResponse({ error: 'SOE Canon Block triggered on DM reply template.' }, 422);
    }

    const pageToken = env?.META_PAGE_ACCESS_TOKEN || env?.META_ACCESS_TOKEN || '';
    const endpoint = `https://graph.facebook.com/v21.0/${igUserId || 'me'}/messages`;
    const privateReplyPayload = {
      recipient: { comment_id: commentId },
      message: { text: matchedRule.reply_text },
    };

    let mode = 'SANDBOX_DRY_RUN';
    let metaResponse = null;

    if (pageToken && body.action !== 'simulate_comment' && commentId) {
      const res = await fetch(`${endpoint}?access_token=${encodeURIComponent(pageToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privateReplyPayload),
      });
      mode = res.ok ? 'LIVE_DM_SENT' : 'META_API_ERROR';
      metaResponse = await res.json().catch(() => ({ status: res.status }));
    }

    return jsonResponse({
      success: mode !== 'META_API_ERROR',
      matched: true,
      mode,
      route_key: matchedRule.route_key,
      comment_id: commentId,
      target_url: matchedRule.target_url,
      private_reply_payload: privateReplyPayload,
      meta_response: metaResponse,
    });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

