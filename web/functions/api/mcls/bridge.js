/**
 * Cloudflare Pages Function: /api/mcls/bridge
 * Proprietary SOE Market Campaign Launch System (MCLS) — Remote Command Bridge (JSON-RPC 2.0 / MCP).
 * Allows authorized voice, IDE, or chat clients to query MCLS directives,
 * verify SOE Canon compliance, and stage autonomous unit runs into the Approval Gate.
 */

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function queryNeon(databaseUrl, sql, params = []) {
  const finalUrl = databaseUrl || FALLBACK_DB_URL;
  const urlObj = new URL(finalUrl);
  const neonHttpEndpoint = `https://${urlObj.host}/sql`;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': finalUrl,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MCLS Bridge DB Error: ${err}`);
  }
  return res.json();
}

const MCLS_BRIDGE_TOOLS = [
  {
    name: 'mcls_get_directives',
    description: 'Returns the 5 SOE MCLS Master Strategy Directives and Canonical World Contract (Ages 2–7, 7 Lands, 5 Cultural Deltas).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'mcls_list_pending_approvals',
    description: 'Lists all pending Human-in-the-Loop approval cards staged by MCLS Autonomous Units.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max number of pending cards to return (default 10)' },
      },
    },
  },
  {
    name: 'mcls_verify_canon_copy',
    description: 'Audits draft marketing, curriculum, or ad copy against SOE Helix Gate 1 Canon rules (Ages 2–7, zero banned entities).',
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
    description: 'Stages a new task for an MCLS Autonomous Unit (MCLS-PRIME, MCLS-RECON, MCLS-FORGE, MCLS-PULSE, MCLS-STUDIO, MCLS-CONCORD). Always pauses in the Approval Gate before going live.',
    inputSchema: {
      type: 'object',
      properties: {
        unit_key: {
          type: 'string',
          enum: ['MCLS-PRIME', 'MCLS-RECON', 'MCLS-FORGE', 'MCLS-PULSE', 'MCLS-STUDIO', 'MCLS-CONCORD'],
        },
        delta_key: {
          type: 'string',
          enum: ['SCREEN_VS_SENSORY', 'ALGORITHM_VS_HANDCRAFTED', 'TESTING_VS_ARTS', 'INSTITUTION_VS_SANCTUARY', 'CONSUMPTION_VS_QUEST'],
        },
        directive_note: { type: 'string', description: 'Specific campaign or objective instructions' },
      },
      required: ['unit_key', 'directive_note'],
    },
  },
];

function auditCanonCopy(text = '') {
  const issues = [];
  if (/\bAges?\s*2\s*[-–—]\s*8\b/i.test(text)) {
    issues.push('Age creep detected: must be strictly Ages 2–7 (Pre-K to Grade 2).');
  }
  if (/\bGrade\s*3\b/i.test(text)) {
    issues.push('Grade ceiling violation: Grade 2 is the canonical ceiling.');
  }
  if (/\blive\s+(instrumentation|instruments?|orchestra|music|acoustic|organic)\b/i.test(text)) {
    issues.push('Audio production canon violation: describe as 19 master studio recordings with authentic human vocals and warm acoustic arrangements.');
  }
  return {
    canon_status: issues.length === 0 ? 'PASS' : 'BLOCKED',
    issues,
  };
}

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      bridge: 'SOE Market Campaign Launch System (MCLS) Remote Bridge',
      protocol: 'JSON-RPC 2.0 / MCP Streamable HTTP',
      status: 'ONLINE',
      safety_invariant: 'All public publishing, repository PRs, and paid media dispatches pause in mcls_approvals for operator authorization.',
      tools: MCLS_BRIDGE_TOOLS,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();
    const { id = 1, method, params = {} } = body;

    if (method === 'initialize') {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2025-03-26',
            serverInfo: {
              name: 'soe-mcls-command-bridge',
              version: '2.4.0',
            },
            capabilities: { tools: {} },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'tools/list') {
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          result: { tools: MCLS_BRIDGE_TOOLS },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (method === 'tools/call') {
      const toolName = params.name;
      const args = params.arguments || {};

      if (toolName === 'mcls_get_directives') {
        const res = await queryNeon(databaseUrl, 'SELECT directive_key, doc_number, title, category, summary, content FROM mcls_directives ORDER BY doc_number ASC;');
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(res.rows, null, 2) }],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (toolName === 'mcls_list_pending_approvals') {
        const limit = Math.min(25, Number(args.limit || 10));
        const res = await queryNeon(
          databaseUrl,
          `SELECT id, unit_key, action_type, title, channel, delta_alignment, canon_status, estimated_cost, status, summary, created_at
           FROM mcls_approvals WHERE status = 'pending' ORDER BY created_at DESC LIMIT $1;`,
          [limit]
        );
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(res.rows, null, 2) }],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (toolName === 'mcls_verify_canon_copy') {
        const check = auditCanonCopy(args.copy_text || '');
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(check, null, 2) }],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (toolName === 'mcls_stage_unit_task') {
        const unitKey = args.unit_key || 'MCLS-PRIME';
        const deltaKey = args.delta_key || 'SCREEN_VS_SENSORY';
        const note = args.directive_note || 'Staged via MCLS Remote Bridge';
        const canon = auditCanonCopy(note);

        const ins = await queryNeon(
          databaseUrl,
          `INSERT INTO mcls_approvals
            (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
           VALUES ($1, 'bridge_staged_task', $2, 'MCLS Remote Bridge', 'Awaiting Operator Authorization', $3, $4, '$0.00 (Staged)', 'pending', $5, $6)
           RETURNING *;`,
          [
            unitKey,
            `[${unitKey}] ${note.slice(0, 120)}`,
            deltaKey,
            canon.canon_status,
            `Staged via MCLS Remote Command Bridge: ${note}`,
            JSON.stringify({ directive_note: note, canon_audit: canon }),
          ]
        );

        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(ins.rows[0], null, 2) }],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Unknown MCLS tool: ${toolName}` },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: { code: -32600, message: 'Unsupported JSON-RPC method' },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

