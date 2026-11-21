/**
 * Cloudflare Pages Function: /api/mcls/bridge
 * Proprietary SOE Market Campaign Launch System (MCLS) — Remote Command Bridge (JSON-RPC 2.0 / MCP).
 * Unified MCP endpoint giving voice, IDE, or external coworker runtimes (Rerun / Claude / Cursor)
 * full parity across directives, canon verification, Creative Forge, Rhythm Guardian,
 * Foreman multi-unit goal compilation, webhook triggers, and browser takeover checkpoints.
 */

import {
  DEFAULT_NEON_DB_URL,
  queryNeon,
  verifyCanonCompliance,
  evaluateRhythmGuardian,
  buildAdBundle,
  compileForemanPlan,
  buildWebhookReactiveDraft,
  buildBrowserTakeoverDraft,
} from '../../../lib/mclsCore.js';

const FALLBACK_DB_URL = DEFAULT_NEON_DB_URL;

const MCLS_BRIDGE_TOOLS = [
  {
    name: 'mcls_get_directives',
    description:
      'Returns the 5 SOE MCLS Master Strategy Directives and Canonical World Contract (Ages 2–7, 7 Lands, 5 Cultural Deltas).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mcls_list_pending_approvals',
    description:
      'Lists all pending Human-in-the-Loop approval cards staged by MCLS Autonomous Units.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of pending cards to return (default 10)' },
      },
    },
  },
  {
    name: 'mcls_verify_canon_copy',
    description:
      'Audits draft marketing, curriculum, or ad copy against SOE Helix Gate 1 Canon rules (Ages 2–7, zero banned entities).',
    inputSchema: {
      type: 'object',
      properties: {
        copy_text: { type: 'string', description: 'Draft text to validate against SOE Canon' },
      },
      required: ['copy_text'],
    },
  },
  {
    name: 'mcls_stage_unit_task',
    description:
      'Stages a new task for an MCLS Autonomous Unit (MCLS-PRIME, MCLS-RECON, MCLS-FORGE, MCLS-PULSE, MCLS-STUDIO, MCLS-CONCORD). Always pauses in the Approval Gate before going live.',
    inputSchema: {
      type: 'object',
      properties: {
        unit_key: {
          type: 'string',
          enum: [
            'MCLS-PRIME',
            'MCLS-RECON',
            'MCLS-FORGE',
            'MCLS-PULSE',
            'MCLS-STUDIO',
            'MCLS-CONCORD',
            'MCLS-GUARDIAN',
            'MCLS-INTEL-SCOUT',
            'MCLS-AUTOPILOT',
          ],
        },
        delta_key: {
          type: 'string',
          enum: [
            'SCREEN_VS_SENSORY',
            'ALGORITHM_VS_HANDCRAFTED',
            'TESTING_VS_ARTS',
            'INSTITUTION_VS_SANCTUARY',
            'CONSUMPTION_VS_QUEST',
          ],
        },
        directive_note: { type: 'string', description: 'Specific campaign or objective instructions' },
      },
      required: ['unit_key', 'directive_note'],
    },
  },
  {
    name: 'mcls_forge_ad_bundle',
    description:
      'Edge Parity: Builds a canon-verified 3-Layer Meta/Pinterest Ad Variant (Ache -> Solution -> Zero-Risk Invitation) in PAUSED safety state.',
    inputSchema: {
      type: 'object',
      properties: {
        archetype_id: { type: 'string', default: 'ARC-01' },
        delta: {
          type: 'string',
          enum: [
            'SCREEN_VS_SENSORY',
            'ALGORITHM_VS_HANDCRAFTED',
            'TESTING_VS_ARTS',
            'INSTITUTION_VS_SANCTUARY',
            'CONSUMPTION_VS_QUEST',
          ],
          default: 'SCREEN_VS_SENSORY',
        },
        campaign: { type: 'string', default: 'THE_ENEMY' },
        language: { type: 'string', enum: ['en', 'es', 'fr'], default: 'en' },
        buyer_track: { type: 'string', enum: ['D2C', 'B2B'], default: 'D2C' },
        engine_type: {
          type: 'string',
          enum: ['ENGINE_A_VALUE_GATE', 'ENGINE_B_DIRECT_OFFER'],
          default: 'ENGINE_A_VALUE_GATE',
        },
      },
    },
  },
  {
    name: 'mcls_evaluate_rhythm_guardian',
    description:
      'Edge Parity: Evaluates ad performance metrics against dual-horizon Engine A (<= $2.50 Lead CPA, 90-day protection) & Engine B ROAS guardrails.',
    inputSchema: {
      type: 'object',
      properties: {
        ad_metrics: {
          type: 'array',
          description: 'Array of ad metric objects ({ ad_id, spend, leads, purchases, ctr, current_budget_cents, engine_type }).',
          items: { type: 'object' },
        },
      },
      required: ['ad_metrics'],
    },
  },
  {
    name: 'mcls_foreman_compile_goal',
    description:
      'Foreman Compiler: Converts a plain-English growth goal into a canon-verified multi-unit MCLS execution plan and optionally stages approval cards in Neon.',
    inputSchema: {
      type: 'object',
      properties: {
        goal: { type: 'string', description: 'Plain-English campaign or B2B growth goal.' },
        delta_key: { type: 'string', default: 'SCREEN_VS_SENSORY' },
        campaign_key: { type: 'string', default: 'THE_ENEMY' },
        engine_type: { type: 'string', default: 'ENGINE_A_VALUE_GATE' },
        daily_budget: { type: 'number', default: 20 },
        stage_cards: { type: 'boolean', default: true },
      },
      required: ['goal'],
    },
  },
  {
    name: 'mcls_trigger_webhook_event',
    description:
      'Event Trigger: Translates a business/funnel webhook (e.g., stripe.checkout.completed, brevo.b2b_reply, funnel.cpa_spike, portal.takeover_needed) into a gated MCLS approval card.',
    inputSchema: {
      type: 'object',
      properties: {
        event_type: { type: 'string' },
        source: { type: 'string', default: 'mcp_bridge' },
        event_data: { type: 'object' },
        stage_card: { type: 'boolean', default: true },
      },
      required: ['event_type'],
    },
  },
  {
    name: 'mcls_stage_browser_takeover',
    description:
      'Coworker Box Handoff: Stages a Tier 2 browser checkpoint card in mcls_approvals when an authenticated portal/UI workflow pauses for 2FA, CAPTCHA, or final human review.',
    inputSchema: {
      type: 'object',
      properties: {
        unit_key: { type: 'string', default: 'MCLS-CONCORD' },
        target_url: { type: 'string' },
        checkpoint_reason: { type: 'string', default: 'FINAL_PORTAL_SUBMIT' },
        task_summary: { type: 'string' },
        vnc_or_worker_url: { type: 'string' },
        resume_instructions: { type: 'string' },
      },
      required: ['target_url', 'task_summary'],
    },
  },
];

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function mcpTextResponse(id, data) {
  return jsonResponse({
    jsonrpc: '2.0',
    id,
    result: {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    },
  });
}

async function insertApprovalDraft(databaseUrl, draft) {
  const ins = await queryNeon(
    databaseUrl,
    `INSERT INTO mcls_approvals
      (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
     RETURNING *;`,
    [
      draft.unit_key,
      draft.action_type,
      draft.title,
      draft.channel,
      draft.target_destination,
      draft.delta_alignment || 'SCREEN_VS_SENSORY',
      draft.canon_status || 'PASS',
      draft.estimated_cost || '$0.00 (Staged)',
      draft.summary,
      JSON.stringify({
        ...(draft.payload || {}),
        canon_verification: draft.preflight || null,
      }),
    ]
  );
  return ins.rows?.[0] || null;
}

export async function onRequestGet() {
  return jsonResponse({
    bridge: 'SOE Market Campaign Launch System (MCLS) Remote Bridge',
    protocol: 'JSON-RPC 2.0 / MCP Streamable HTTP',
    version: '2.5.0',
    status: 'ONLINE',
    safety_invariant:
      'All public publishing, repository PRs, browser submissions, and paid media dispatches pause in mcls_approvals for operator authorization.',
    tools: MCLS_BRIDGE_TOOLS,
  });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();
    const { id = 1, method, params = {} } = body;

    if (method === 'initialize') {
      return jsonResponse({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2025-03-26',
          serverInfo: {
            name: 'soe-mcls-command-bridge',
            version: '2.5.0',
          },
          capabilities: { tools: {} },
        },
      });
    }

    if (method === 'tools/list') {
      return jsonResponse({
        jsonrpc: '2.0',
        id,
        result: { tools: MCLS_BRIDGE_TOOLS },
      });
    }

    if (method === 'tools/call') {
      const toolName = params.name;
      const args = params.arguments || {};

      if (toolName === 'mcls_get_directives') {
        const res = await queryNeon(
          databaseUrl,
          'SELECT directive_key, doc_number, title, category, summary, content FROM mcls_directives ORDER BY doc_number ASC;'
        );
        return mcpTextResponse(id, res.rows);
      }

      if (toolName === 'mcls_list_pending_approvals') {
        const limit = Math.min(25, Number(args.limit || 10));
        const res = await queryNeon(
          databaseUrl,
          `SELECT id, unit_key, action_type, title, channel, delta_alignment, canon_status, estimated_cost, status, summary, created_at
           FROM mcls_approvals WHERE status = 'pending' ORDER BY created_at DESC LIMIT $1;`,
          [limit]
        );
        return mcpTextResponse(id, res.rows);
      }

      if (toolName === 'mcls_verify_canon_copy') {
        const check = verifyCanonCompliance(args.copy_text || '');
        return mcpTextResponse(id, {
          canon_status: check.status,
          passed: check.passed,
          issues: check.violations,
        });
      }

      if (toolName === 'mcls_stage_unit_task') {
        const unitKey = args.unit_key || 'MCLS-PRIME';
        const deltaKey = args.delta_key || 'SCREEN_VS_SENSORY';
        const note = args.directive_note || 'Staged via MCLS Remote Bridge';
        const canon = verifyCanonCompliance(note);

        const row = await insertApprovalDraft(databaseUrl, {
          unit_key: unitKey,
          action_type: 'bridge_staged_task',
          title: `[${unitKey}] ${note.slice(0, 120)}`,
          channel: 'MCLS Remote Bridge',
          target_destination: 'Awaiting Operator Authorization',
          delta_alignment: deltaKey,
          canon_status: canon.status,
          estimated_cost: '$0.00 (Staged)',
          summary: `Staged via MCLS Remote Command Bridge: ${note}`,
          payload: { directive_note: note, canon_audit: canon },
        });
        return mcpTextResponse(id, row);
      }

      if (toolName === 'mcls_forge_ad_bundle') {
        return mcpTextResponse(id, buildAdBundle(args));
      }

      if (toolName === 'mcls_evaluate_rhythm_guardian') {
        return mcpTextResponse(id, evaluateRhythmGuardian(args.ad_metrics || []));
      }

      if (toolName === 'mcls_foreman_compile_goal') {
        const plan = compileForemanPlan(args);
        const shouldStage = args.stage_cards !== false;
        const approvals = [];
        if (shouldStage) {
          for (const task of plan.tasks) {
            const row = await insertApprovalDraft(databaseUrl, task);
            if (row) approvals.push(row);
          }
        }
        return mcpTextResponse(id, { plan, staged_count: approvals.length, approvals });
      }

      if (toolName === 'mcls_trigger_webhook_event') {
        const draft = buildWebhookReactiveDraft(args);
        const approval =
          args.stage_card !== false ? await insertApprovalDraft(databaseUrl, draft) : null;
        return mcpTextResponse(id, { draft, approval });
      }

      if (toolName === 'mcls_stage_browser_takeover') {
        const draft = buildBrowserTakeoverDraft(args);
        const approval = await insertApprovalDraft(databaseUrl, draft);
        return mcpTextResponse(id, { draft, approval });
      }

      return jsonResponse(
        {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown MCLS tool: ${toolName}` },
        },
        400
      );
    }

    return jsonResponse(
      {
        jsonrpc: '2.0',
        id,
        error: { code: -32600, message: 'Unsupported JSON-RPC method' },
      },
      400
    );
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}
