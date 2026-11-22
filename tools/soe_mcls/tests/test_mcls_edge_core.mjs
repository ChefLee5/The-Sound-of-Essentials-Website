import test from 'node:test';
import assert from 'node:assert/strict';

import {
  verifyCanonCompliance,
  runAdversarialPreflightReview,
  evaluateRhythmGuardian,
  buildAdBundle,
  compileForemanPlan,
  buildWebhookReactiveDraft,
  buildBrowserTakeoverDraft,
} from '../../../web/lib/mclsCore.js';

import { onRequestGet as bridgeGet, onRequestPost as bridgePost } from '../../../web/functions/api/mcls/bridge.js';
import { onRequestPost as dispatchPost } from '../../../web/functions/api/mcls/dispatch.js';

test('Helix Gate 1 canon verifier catches violations and passes valid copy', () => {
  const clean = verifyCanonCompliance(
    'Ages 2–7 screen-free Rhythm Quest with 19 studio-recorded songs and 4,000+ illustrated words at soelearn.com/listen.'
  );
  assert.equal(clean.passed, true);
  assert.equal(clean.status, 'PASS');

  const dirty = verifyCanonCompliance(
    'Ages 2-8 guide with Marcus on Shopify featuring 4,232 words and no credit card required.'
  );
  assert.equal(dirty.passed, false);
  assert.equal(dirty.status, 'BLOCKED');
  assert.equal(dirty.violations.length, 5);
});

test('Adversarial preflight review detects shiny-object drift and slop', () => {
  const shiny = runAdversarialPreflightReview('MCLS-PRIME', {
    title: 'Launch crypto token via Linktree',
    summary: 'Side hustle',
    target_destination: 'https://linktr.ee/test',
    payload: {},
  });
  assert.equal(shiny.passed, false);
  assert.equal(shiny.verdict, 'SHINY_OBJECT_HOLD');

  const slop = runAdversarialPreflightReview('MCLS-STUDIO', {
    title: 'Purple gradient claymorphism ad',
    summary: 'Uses stock photo background',
    target_destination: '/listen',
    payload: {},
  });
  assert.equal(slop.passed, false);
  assert.equal(slop.verdict, 'CAUTION');
});

test('Rhythm Guardian evaluates Engine A and Engine B metrics accurately', () => {
  const res = evaluateRhythmGuardian([
    { ad_id: 'a_win', engine_type: 'ENGINE_A_VALUE_GATE', spend: 25, leads: 15, ctr: 2.1, current_budget_cents: 5000 },
    { ad_id: 'a_kill', engine_type: 'ENGINE_A_VALUE_GATE', spend: 18, leads: 0, ctr: 0.4, current_budget_cents: 3000 },
    { ad_id: 'a_hold', engine_type: 'ENGINE_A_VALUE_GATE', spend: 5, leads: 0, ctr: 1.0, current_budget_cents: 3000 },
    { ad_id: 'b_kill', engine_type: 'ENGINE_B_DIRECT_OFFER', spend: 40, purchases: 0, ctr: 1.2, current_budget_cents: 3000 },
    { ad_id: 'b_win', engine_type: 'ENGINE_B_DIRECT_OFFER', spend: 40, purchases: 2, ctr: 1.8, current_budget_cents: 4000 },
  ]);
  assert.equal(res.evaluated_ads_count, 5);
  assert.equal(res.decisions.a_win.action, 'SCALE_BUDGET');
  assert.equal(res.decisions.a_win.new_budget_cents, 6000);
  assert.equal(res.decisions.a_kill.action, 'PAUSE');
  assert.equal(res.decisions.a_hold.action, 'HOLD');
  assert.equal(res.decisions.b_kill.action, 'PAUSE');
  assert.equal(res.decisions.b_win.action, 'SCALE_BUDGET');
  assert.equal(res.decisions.b_win.new_budget_cents, 4800);
});

test('Creative Forge bundle builder respects engine routing and canon lock', () => {
  const bundleA = buildAdBundle({
    delta: 'TESTING_VS_ARTS',
    campaign: 'THE_ENEMY',
    language: 'en',
    engine_type: 'ENGINE_A_VALUE_GATE',
  });
  assert.equal(bundleA.canon_verification.passed, true);
  assert.equal(bundleA.ad_variant.status, 'PAUSED');
  assert.match(bundleA.ad_variant.destination_url, /^https:\/\/soelearn\.com\/listen\?/);

  const bundleB = buildAdBundle({
    delta: 'SCREEN_VS_SENSORY',
    engine_type: 'ENGINE_B_DIRECT_OFFER',
  });
  assert.match(bundleB.ad_variant.destination_url, /^https:\/\/soelearn\.com\/workbook\?/);
});

test('Foreman goal compiler selects relevant MCLS units and flags canon breaches', () => {
  const plan = compileForemanPlan({
    goal: 'Launch a Meta phonics ad campaign and pitch 5 Head Start preschools with ROAS guardrails.',
  });
  assert.ok(plan.selected_units.includes('MCLS-CONCORD'));
  assert.ok(plan.selected_units.includes('MCLS-STUDIO'));
  assert.ok(plan.selected_units.includes('MCLS-GUARDIAN'));
  assert.equal(plan.blocked_count, 0);

  const badPlan = compileForemanPlan({
    goal: 'Target Ages 2-8 on Shopify',
  });
  assert.ok(badPlan.blocked_count > 0);
});

test('Webhook reactive mapper and browser takeover builder emit gated drafts', () => {
  const highOrder = buildWebhookReactiveDraft({
    event_type: 'stripe.checkout.completed',
    event_data: { order_total: 55, client_reference_id: 'SOE-DICT-01' },
  });
  assert.equal(highOrder.unit_key, 'MCLS-GUARDIAN');
  assert.equal(highOrder.action_type, 'webhook_roas_signal');
  assert.equal(highOrder.canon_status, 'PASS');

  const takeover = buildBrowserTakeoverDraft({
    unit_key: 'MCLS-CONCORD',
    target_url: 'https://portal.example.gov/vendor',
    checkpoint_reason: '2FA_OR_CAPTCHA',
    task_summary: 'Paused before final vendor registration submit.',
  });
  assert.equal(takeover.action_type, 'browser_takeover_handoff');
  assert.equal(takeover.payload.requires_human_takeover, true);
});

test('Edge /api/mcls/bridge exposes all 9 MCP tools and executes pure tools over JSON-RPC', async () => {
  const getRes = await bridgeGet();
  assert.equal(getRes.status, 200);
  const getData = await getRes.json();
  assert.equal(getData.tools.length, 9);

  const listRes = await bridgePost({
    request: new Request('https://soelearn.com/api/mcls/bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    }),
    env: {},
  });
  const listData = await listRes.json();
  const names = listData.result.tools.map((t) => t.name);
  assert.ok(names.includes('mcls_foreman_compile_goal'));
  assert.ok(names.includes('mcls_trigger_webhook_event'));
  assert.ok(names.includes('mcls_stage_browser_takeover'));

  const foremanRes = await bridgePost({
    request: new Request('https://soelearn.com/api/mcls/bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'mcls_foreman_compile_goal',
          arguments: {
            goal: 'Audit llms.txt AI citations and launch a screen-free Meta bundle',
            stage_cards: false,
          },
        },
      }),
    }),
    env: {},
  });
  assert.equal(foremanRes.status, 200);
  const foremanBody = await foremanRes.json();
  const parsed = JSON.parse(foremanBody.result.content[0].text);
  assert.ok(parsed.plan.selected_units.includes('MCLS-RECON'));
  assert.equal(parsed.staged_count, 0);
});

test('Edge /api/mcls/dispatch supports foreman_compile and webhook_trigger dry modes', async () => {
  const dispatchRes = await dispatchPost({
    request: new Request('https://soelearn.com/api/mcls/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'webhook_trigger',
        event_type: 'brevo.b2b_reply',
        source: 'brevo_inbound',
        event_data: { organization: 'Oakridge Montessori Preschool' },
        stage_card: false,
      }),
    }),
    env: {},
  });
  assert.equal(dispatchRes.status, 200);
  const dispatchBody = await dispatchRes.json();
  assert.equal(dispatchBody.success, true);
  assert.equal(dispatchBody.draft.unit_key, 'MCLS-CONCORD');
  assert.equal(dispatchBody.draft.canon_status, 'PASS');
});
