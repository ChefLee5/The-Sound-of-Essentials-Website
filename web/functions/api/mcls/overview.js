/**
 * Cloudflare Pages Function: /api/mcls/overview
 * Proprietary SOE Market Campaign Launch System (MCLS) — State & Schema Engine.
 * Manages the 5 Master Directives, 6 Autonomous Units, and Command Approval Gate
 * inside Neon Serverless PostgreSQL over HTTP.
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
    throw new Error(`MCLS Neon DB Error: ${err}`);
  }
  return res.json();
}

const INITIAL_DIRECTIVES = [
  {
    directive_key: 'DIR-01-CANON-CONTRACT',
    doc_number: 1,
    title: 'Canonical World Model & Identity Contract',
    category: 'Canon & Guardrails',
    summary: 'Enforces strict Ages 2–7 (Pre-K to Grade 2) bounds, 7 Musical Lands, Seriphia + 14 Land Heroes, and 19 studio recordings.',
    content: `1. TARGET AUDIENCE: Strictly Ages 2–7 (Pre-K to Grade 2). Buyers: Parents, Homeschoolers, Early Childhood Educators, State DOEs, Head Start Consortia.
2. CORE PROOF LINE: "Crafted by a father's heart and a mother's love, born from living the early learning crisis and built with whole-heart devotion. 15 years in the making."
3. 7 CANONICAL LANDS & HERO PAIRS:
   • Harmonia (Kenji & Aiko — Language & Phonological Awareness)
   • Numeria (Kwame & Octavia — Cognitive & Mathematical Reasoning)
   • Vitalis (Felix & Amara — Physical Development & Somatic Movement)
   • Celestia (Elias & Selene — Scientific Exploration & Temporal Inquiry)
   • Luminosity (Athena & Ezra — Social-Emotional Learning & Moral Character)
   • Aquaria (Nerissa & Ronan — Fluid Discovery & Spatial Flow)
   • Terrasol (Vesta & Silas — Ecological Stewardship & Grounded Craft)
   • Featured Guardian: Seriphia (Guardian of the Sound)
4. AUDIO & PRODUCTION INVARIANT: 19 master studio recordings, originally published music recorded live in studio sessions with authentic human vocals and warm acoustic arrangements.`,
  },
  {
    directive_key: 'DIR-02-CULTURAL-DELTAS',
    doc_number: 2,
    title: 'The 5 Cultural Deltas Positioning Matrix',
    category: 'Brand Voice & Messaging',
    summary: 'Governs emotional resonance across every ad, reply, and institutional brief using the 5 Cultural Deltas.',
    content: `Every MCLS unit frames messaging through one of the 5 Cultural Deltas:
• DELTA 1 — Screen vs. Sensory: Tactile, audio-first learning and physical workbooks over overstimulating screen flicker.
• DELTA 2 — Testing vs. Arts: Rhythm, melody, and joyful mastery over standardized drill-and-kill worksheets.
• DELTA 3 — Algorithm vs. Handcrafted: Parent-crafted intentionality (4,232 illustrated words, 400 daily quests) over attention-harvesting feeds.
• DELTA 4 — Institution vs. Sanctuary: Transforming the living room and classroom into a calm developmental sanctuary.
• DELTA 5 — Consumption vs. Quest: Active 30-minute daily adventure blocks over passive media consumption.`,
  },
  {
    directive_key: 'DIR-03-SEARCH-CITATION',
    doc_number: 3,
    title: 'Search & AI Citation Architecture',
    category: 'Organic & Citation Growth',
    summary: 'Ensures frontier AI answer engines and organic search rank SOE as the premier screen-free curriculum for Ages 2–7.',
    content: `1. FRONTIER CRAWLER ACCESS: Explicit Allow directives in public/robots.txt for GPTBot, OAI-SearchBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended, and CCBot.
2. LLM GROUNDING FILES: Maintain fresh public/llms.txt and public/llms-full.txt with canonical pricing ($0 19-track stream on /listen, $21 digital / $35 print Rhythm Ready Workbook, $55 Picture Dictionary).
3. COMPETITOR DISPLACEMENT PAGES: Maintain high-conversion comparison bridges (/abcmouse-alternatives, /reading-eggs-alternatives, /hooked-on-phonics-alternatives, /solutions).
4. STRUCTURED SCHEMA: Enforce rich JSON-LD (EducationalOrganization, Product, FAQPage) across all primary entry points.`,
  },
  {
    directive_key: 'DIR-04-TANDEM-FUNNEL',
    doc_number: 4,
    title: 'Dual-Track Revenue & Tandem Funnel Blueprint',
    category: 'Paid Media & Conversion',
    summary: 'Coordinates Engine A (/listen free gate), Engine B (/workbook & /shop direct), Engine C (90-day retargeting), and QPC B2B.',
    content: `1. ENGINE A (70% Budget — Value Gate): Routes cold parent traffic to soelearn.com/listen for the free 19-track album stream + $7 card-vaulting order bump via Direct Stripe API.
2. ENGINE B (20% Budget — Direct Tactile Showcase): Routes high-intent buyers directly to the $35 Print Rhythm Ready Workbook and $55 Essential Picture Dictionary.
3. ENGINE C (10% Budget — 90-Day Rhythm Guardian Bridge): Multi-touch retargeting across the 14-to-90-day family trust window.
4. TRACK 2 — INSTITUTIONAL QPC & SCHOOL PILOTS: Direct B2B pipeline (/institutions, /qpc) routing Early Childhood Directors, Head Start Consortia, and State DOEs into Neon CRM (school_pilot stage) and Brevo List #12.`,
  },
  {
    directive_key: 'DIR-05-CAMPAIGN-LEDGER',
    doc_number: 5,
    title: '30-Day MCLS Omnichannel Execution Queue',
    category: 'Execution Roadmap',
    summary: 'Synchronized 30-day schedule across Meta 3-Layer Ads, Parent Community Replies, Search Fixes, and School Pilot Outreach.',
    content: `WEEK 1: Deploy Engine A "Screen vs. Sensory" 3-Ad Testing Array; audit llms.txt & FAQ JSON-LD on /workbook and /listen; dispatch 10 School Pilot invitations.
WEEK 2: Deploy "Algorithm vs. Handcrafted" UGC video brief; publish 3 programmatic educator guides under /guides/:slug; engage 15 homeschool & sensory-parenting community threads.
WEEK 3: Launch Engine B Direct Tactile showcase for the $55 Picture Dictionary (4,232 words); follow up with warm Album Explorers in Neon CRM via Brevo.
WEEK 4: Run full 90-day Rhythm Guardian cohort attribution review; refresh top-performing Cultural Delta hooks; expand QPC institutional pilot packet distribution.`,
  },
];

const INITIAL_UNITS = [
  {
    unit_key: 'MCLS-PRIME',
    name: 'MCLS-Prime',
    role: 'Executive Campaign & Telemetry Orchestrator (Chief of Staff)',
    icon: '🧭',
    effort_level: 'high',
    status: 'ready',
    schedule_cron: 'Daily 08:00 EST (0 8 * * *)',
    reports_to: 'human_founder',
    branch: 'executive_orchestration',
    description: 'Synthesizes the 5 Master Directives, audits Neon CRM & 90-day cohort LTV telemetry, and dispatches weekly work orders across all MCLS units.',
    instructions: 'Read all 5 Master Directives and live Neon CRM metrics. Identify the highest-leverage bottleneck across Engine A (/listen), Engine B (/workbook), and Institutional School Pilots, then stage an executive action plan.',
  },
  {
    unit_key: 'MCLS-RECON',
    name: 'MCLS-Recon',
    role: 'Search & AI Citation Intelligence Unit',
    icon: '🔭',
    effort_level: 'high',
    status: 'ready',
    schedule_cron: 'Mon & Thu 06:00 EST (0 6 * * 1,4)',
    reports_to: 'MCLS-PRIME',
    branch: 'intelligence_recon',
    description: 'Audits robots.txt, llms.txt, JSON-LD schemas, and live search/AI citation visibility against incumbent children’s apps.',
    instructions: 'Audit SOE search visibility and AI citation grounding for Ages 2–7 screen-free curriculum queries. Output concrete metadata, FAQ schema, or llms.txt enhancements.',
  },
  {
    unit_key: 'MCLS-INTEL-SCOUT',
    name: 'MCLS-Intel-Scout',
    role: 'Parenting & AI Cognitive Science Intelligence Scanner',
    icon: '🧠',
    effort_level: 'medium',
    status: 'ready',
    schedule_cron: 'Daily 06:00 EST (0 6 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'intelligence_recon',
    description: 'Scans high-leverage statements from AI founders (Karpathy, Ng) and pediatric neuroscientists on early screen harm, cognitive offloading, and phonics.',
    instructions: 'Extract, score (leverage > 85), and export verified quotes with ad hook mappings into the intel vault (docs/soe_ai_parenting_intel_vault.json).',
  },
  {
    unit_key: 'MCLS-STUDIO',
    name: 'MCLS-Studio',
    role: '3-Layer Ad Creative & Visual Unit',
    icon: '🎬',
    effort_level: 'high',
    status: 'ready',
    schedule_cron: 'Tue & Fri 09:00 EST (0 9 * * 2,5)',
    reports_to: 'MCLS-PRIME',
    branch: 'creative_cultural_brand',
    description: 'Produces 3-Layer Meta Ad Bundles (Parent Ache -> Musical/Tactile Solution -> Zero-Risk Invitation) and UGC video briefs with credit cost estimates.',
    instructions: 'Build a 3-Layer Ad Creative bundle and visual production brief aligned with the active Cultural Delta and Tandem Funnel Engine (A, B, or C).',
  },
  {
    unit_key: 'MCLS-PULSE',
    name: 'MCLS-Pulse',
    role: 'Parent & Educator Community Unit',
    icon: '💬',
    effort_level: 'medium',
    status: 'ready',
    schedule_cron: 'Every 6 Hours (0 */6 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'creative_cultural_brand',
    description: 'Monitors parenting, homeschool, Montessori, and screen-fatigue discussions to draft empathetic, value-first Cultural Delta replies.',
    instructions: 'Locate high-signal parent or educator discussions struggling with cartoon overstimulation or reading readiness (Ages 2–7) and draft a helpful, non-spammy response grounded in the 5 Cultural Deltas.',
  },
  {
    unit_key: 'MCLS-GUARDIAN',
    name: 'MCLS-Guardian',
    role: 'Rhythm Guardian & Dual-Horizon Guardrail Sentinel',
    icon: '🛡️',
    effort_level: 'high',
    status: 'ready',
    schedule_cron: 'Hourly Spend (0 * * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'operations_protection',
    description: 'Enforces 2026 battle-tested dual-horizon guardrails: protects Engine A value gate from premature kill during Meta 7-day attribution blindness, enforces strict Engine B ROAS, and scales winners by +20%.',
    instructions: 'Audit Meta and CAPI spend velocity, protect Engine A 90-day gestation window, enforce stop-losses, and stage budget escalations for proven winners.',
  },
  {
    unit_key: 'MCLS-FORGE',
    name: 'MCLS-Forge',
    role: 'Technical Canon & Repository PR Unit',
    icon: '🛠️',
    effort_level: 'xhigh',
    status: 'ready',
    schedule_cron: 'On-Demand / Post-Recon',
    reports_to: 'MCLS-PRIME',
    branch: 'operations_protection',
    description: 'Stages canon-verified code patches, meta tags, canonical links, and JSON-LD structured data for 1-click GitHub Pull Requests.',
    instructions: 'Generate clean, canon-compliant React/HTML metadata and JSON-LD patches that pass SOE Helix Gate 1 without any banned entities or age creep.',
  },
  {
    unit_key: 'MCLS-CONCORD',
    name: 'MCLS-Concord',
    role: 'Institutional QPC & School Pilot Unit',
    icon: '🏫',
    effort_level: 'high',
    status: 'ready',
    schedule_cron: 'Daily 10:00 EST (0 10 * * 1-5)',
    reports_to: 'MCLS-PRIME',
    branch: 'growth_institutional',
    description: 'Identifies early childhood centers, Head Start consortia, and school district prospects, staging Neon CRM deals and Brevo pilot invitations.',
    instructions: 'Prepare a personalized School Licensing Pilot outreach package for early childhood institutions, highlighting the 7 Developmental Lands and neuro-affirming classroom readiness for Ages 2–7.',
  },
  {
    unit_key: 'MCLS-AUTOPILOT',
    name: 'MCLS-Autopilot',
    role: 'Organic Seeding & Ledger Publisher',
    icon: '🚀',
    effort_level: 'medium',
    status: 'ready',
    schedule_cron: 'Daily 11:00 EST (0 11 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'growth_institutional',
    description: 'Orchestrates autonomous scheduled publishing of seed posts and long-form advertorials to Facebook / theme accounts with a ledger preventing duplicates.',
    instructions: 'Select next unpublished high-leverage advertorial or cultural delta seed; verify published ledger and stage publication.',
  },
];

const INITIAL_APPROVALS = [
  {
    unit_key: 'MCLS-RECON',
    action_type: 'geo_schema_patch',
    title: 'Add FAQPage JSON-LD & Citation Table to /workbook for AI Search Grounding',
    channel: 'Search & AI Citations',
    target_destination: 'web/src/pages/RhythmQuestSale.jsx + public/llms.txt',
    delta_alignment: 'SCREEN_VS_SENSORY',
    canon_status: 'PASS',
    estimated_cost: '$0.00 (Organic)',
    status: 'pending',
    summary: 'Enhances citation probability on "best screen-free preschool curriculum ages 2-7" queries by embedding structured comparison facts (19 studio tracks, 40 daily adventure blocks, $21 digital / $35 print).',
    payload: {
      target_route: '/workbook',
      schema_type: 'FAQPage',
      questions_added: [
        'How does The Sound of Essentials teach reading and math without screens for ages 2–7?',
        'What is included in the 8-Week Rhythm Ready Workbook ($21 digital / $35 print) and 19-track album?',
      ],
      llms_txt_verified: true,
    },
  },
  {
    unit_key: 'MCLS-PULSE',
    name: 'Parent Community Reply',
    action_type: 'community_reply',
    title: 'Community Reply: "Replacing post-preschool tablet time for a restless 4-year-old"',
    channel: 'Parent & Homeschool Forums',
    target_destination: 'r/Preschoolers & Homeschool Co-op Thread',
    delta_alignment: 'SCREEN_VS_SENSORY',
    canon_status: 'PASS',
    estimated_cost: '$0.00 (Organic)',
    status: 'pending',
    summary: 'Value-first reply sharing a 15-minute acoustic rhythm & syllable-tapping transition routine before introducing the free 19-track Rhythm Quest stream on /listen.',
    payload: {
      thread_topic: 'How are you handling the 4pmwitching hour after cutting out cartoons?',
      draft_reply: `We went through that exact 4pm crash when we pulled back on fast-paced cartoons. What worked best for our home was replacing visual flicker with an audio-plus-movement transition—putting on warm, studio-recorded rhythm songs and having our little one tap syllable beats on a table or floor mat for 10–15 minutes.\n\nIf you want to try it tonight without buying anything, we built The Sound of Essentials: Rhythm Quest for ages 2–7 and made all 19 songs free to stream at soelearn.com/listen. Track 1 in Harmonia pairs right with simple hand-clapping patterns to help them regulate.`,
      disclosure: 'Included transparent founder sign-off',
    },
  },
  {
    unit_key: 'MCLS-STUDIO',
    action_type: 'meta_ad_bundle',
    title: '3-Ad Testing Array: Engine A (/listen) — "The Enemy (Screen vs. Sensory)"',
    channel: 'Meta Ads Manager (Graph API v21.0)',
    target_destination: 'soelearn.com/listen (Engine A — 70% Budget)',
    delta_alignment: 'SCREEN_VS_SENSORY',
    canon_status: 'PASS',
    estimated_cost: '$20.00/day (Paused on Creation)',
    status: 'pending',
    summary: 'Stages 3 ad archetypes (ARC-01, ARC-02, ARC-03) targeting parents of children ages 2–7 with the 3-Layer Cultural Delta framework and Direct Stripe $7 card-vaulting bump.',
    payload: {
      engine_type: 'ENGINE_A_VALUE_GATE',
      campaign_key: 'THE_ENEMY',
      delta_key: 'SCREEN_VS_SENSORY',
      daily_budget_cents: 2000,
      headline: 'Stream the Free 19-Track Rhythm Quest Album (Ages 2–7)',
      layer_1: 'You can see it in their eyes after 20 minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your home.',
      layer_2: 'Crafted by a father’s heart and a mother’s love, The Sound of Essentials replaces screen rot with 19 studio-recorded songs, 4,232 illustrated words, and 400 tactile daily quests for ages 2–7.',
      layer_3: 'Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no apps, no algorithms.',
    },
  },
  {
    unit_key: 'MCLS-CONCORD',
    action_type: 'institutional_pilot_outreach',
    title: 'School Licensing Pilot Packet: Regional Early Childhood & Head Start Directors',
    channel: 'Neon CRM + Brevo Transactional Outreach',
    target_destination: 'CRM Stage: school_pilot + Brevo Sender #2',
    delta_alignment: 'INSTITUTION_VS_SANCTUARY',
    canon_status: 'PASS',
    estimated_cost: '0 Credits (Brevo + Neon CRM)',
    status: 'pending',
    summary: 'Logs a new Institutional Pilot opportunity in Neon CRM and dispatches the 7-Land Early Learning Music Curriculum Pilot invitation.',
    payload: {
      organization_name: 'Sunbeam Early Learning & Head Start Consortium',
      contact_name: 'Curriculum & Readiness Director',
      recipient_email: 'info@soelearn.com',
      deal_value: 2500,
      subject: 'The Sound of Essentials — Early Learning Music Curriculum Pilot (Ages 2–7)',
      email_body: `Hello Curriculum Director,\n\nWe designed The Sound of Essentials: Rhythm Quest as a neuro-affirming, music-grounded readiness curriculum across 7 developmental lands (Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, and Terrasol) specifically for ages 2–7 (Pre-K to Grade 2).\n\nWe would love to provide a complimentary digital pilot packet for your classrooms, including our 19 studio-recorded tracks, the Rhythm Ready 8-Week Readiness Assessment, and teacher implementation guides.\n\nWarm regards,\nThe Sound of Essentials Institutional Team\nhttps://soelearn.com/institutions`,
    },
  },
];

async function ensureMclsSchemaAndSeed(databaseUrl) {
  await queryNeon(
    databaseUrl,
    `CREATE TABLE IF NOT EXISTS mcls_directives (
      id SERIAL PRIMARY KEY,
      directive_key VARCHAR(80) UNIQUE NOT NULL,
      doc_number INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      category VARCHAR(100) NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`
  );

  await queryNeon(
    databaseUrl,
    `CREATE TABLE IF NOT EXISTS mcls_units (
      id SERIAL PRIMARY KEY,
      unit_key VARCHAR(60) UNIQUE NOT NULL,
      name VARCHAR(120) NOT NULL,
      role VARCHAR(200) NOT NULL,
      icon VARCHAR(20) DEFAULT '⚡',
      effort_level VARCHAR(20) DEFAULT 'high',
      status VARCHAR(40) DEFAULT 'ready',
      schedule_cron VARCHAR(100),
      description TEXT NOT NULL,
      instructions TEXT NOT NULL,
      runs_count INT DEFAULT 1,
      last_run_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`
  );

  await queryNeon(
    databaseUrl,
    `CREATE TABLE IF NOT EXISTS mcls_approvals (
      id SERIAL PRIMARY KEY,
      unit_key VARCHAR(60) NOT NULL,
      action_type VARCHAR(80) NOT NULL,
      title VARCHAR(260) NOT NULL,
      channel VARCHAR(120) NOT NULL,
      target_destination VARCHAR(240),
      delta_alignment VARCHAR(80) DEFAULT 'SCREEN_VS_SENSORY',
      canon_status VARCHAR(20) DEFAULT 'PASS',
      estimated_cost VARCHAR(80) DEFAULT '$0.00',
      status VARCHAR(40) DEFAULT 'pending',
      summary TEXT NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      execution_receipt JSONB DEFAULT null,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      decided_at TIMESTAMPTZ DEFAULT null
    );`
  );

  await queryNeon(
    databaseUrl,
    `CREATE TABLE IF NOT EXISTS mcls_meta_config (
      id INT PRIMARY KEY DEFAULT 1,
      mode VARCHAR(40) DEFAULT 'SANDBOX_DRY_RUN',
      is_configured BOOLEAN DEFAULT FALSE,
      ad_account_id VARCHAR(120) DEFAULT 'Not Connected (Sandbox Default)',
      page_id VARCHAR(120) DEFAULT 'Not Configured',
      pixel_id VARCHAR(120) DEFAULT 'Not Configured',
      token_preview VARCHAR(60) DEFAULT null,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`
  );

  await queryNeon(
    databaseUrl,
    `CREATE TABLE IF NOT EXISTS mcls_memories (
      id SERIAL PRIMARY KEY,
      unit_scope VARCHAR(60) DEFAULT 'ALL_UNITS',
      source_action VARCHAR(80) DEFAULT 'operator_rule',
      rule_text TEXT NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`
  );

  const memCountRes = await queryNeon(databaseUrl, 'SELECT COUNT(*) as count FROM mcls_memories;');
  if (parseInt(memCountRes.rows[0]?.count || '0', 10) === 0) {
    const initialMemories = [
      ['ALL_UNITS', 'canon_invariant', 'Always anchor parent and educator copy in the 19 studio-recorded songs on /listen ($0 stream gate) and the 8-Week Rhythm Ready Workbook ($21 digital / $35 print) for Ages 2–7.'],
      ['MCLS-CONCORD', 'institutional_preference', 'Frame institutional outreach around classroom sensory regulation, phonological readiness, and the 7 Developmental Lands for Pre-K to Grade 2.'],
      ['MCLS-PULSE', 'community_preference', 'Lead community replies with practical 10–15 minute syllable-tapping and movement routines before mentioning the free /listen stream.'],
    ];
    for (const [scope, src, text] of initialMemories) {
      await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_memories (unit_scope, source_action, rule_text) VALUES ($1, $2, $3);`,
        [scope, src, text]
      );
    }
  }

  // Seed directives if empty
  const dirCountRes = await queryNeon(databaseUrl, 'SELECT COUNT(*) as count FROM mcls_directives;');
  if (parseInt(dirCountRes.rows[0]?.count || '0', 10) === 0) {
    for (const d of INITIAL_DIRECTIVES) {
      await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_directives (directive_key, doc_number, title, category, summary, content)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (directive_key) DO NOTHING;`,
        [d.directive_key, d.doc_number, d.title, d.category, d.summary, d.content]
      );
    }
  }

  // Seed or upsert units so new agents from agent-org-chart topology appear
  for (const u of INITIAL_UNITS) {
    await queryNeon(
      databaseUrl,
      `INSERT INTO mcls_units (unit_key, name, role, icon, effort_level, status, schedule_cron, description, instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (unit_key) DO UPDATE
       SET name = EXCLUDED.name,
           role = EXCLUDED.role,
           schedule_cron = EXCLUDED.schedule_cron,
           description = EXCLUDED.description,
           instructions = EXCLUDED.instructions;`,
      [u.unit_key, u.name, u.role, u.icon, u.effort_level, u.status, u.schedule_cron, u.description, u.instructions]
    );
  }

  // Seed initial approval cards if empty
  const appCountRes = await queryNeon(databaseUrl, 'SELECT COUNT(*) as count FROM mcls_approvals;');
  if (parseInt(appCountRes.rows[0]?.count || '0', 10) === 0) {
    for (const a of INITIAL_APPROVALS) {
      await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_approvals (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
        [
          a.unit_key,
          a.action_type,
          a.title,
          a.channel,
          a.target_destination,
          a.delta_alignment,
          a.canon_status,
          a.estimated_cost,
          a.status,
          a.summary,
          JSON.stringify(a.payload),
        ]
      );
    }
  }

  // Ensure singleton meta config row exists
  await queryNeon(
    databaseUrl,
    `INSERT INTO mcls_meta_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`
  );
}

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;

    await ensureMclsSchemaAndSeed(databaseUrl);

    const [directivesRes, unitsRes, approvalsRes, metaRes, memoriesRes, crmStatsRes] = await Promise.all([
      queryNeon(databaseUrl, 'SELECT * FROM mcls_directives ORDER BY doc_number ASC;'),
      queryNeon(databaseUrl, 'SELECT * FROM mcls_units ORDER BY id ASC;'),
      queryNeon(databaseUrl, 'SELECT * FROM mcls_approvals ORDER BY created_at DESC LIMIT 50;'),
      queryNeon(databaseUrl, 'SELECT * FROM mcls_meta_config WHERE id = 1;'),
      queryNeon(databaseUrl, 'SELECT * FROM mcls_memories WHERE active = TRUE ORDER BY created_at DESC LIMIT 30;'),
      queryNeon(
        databaseUrl,
        `SELECT
           (SELECT COUNT(*) FROM crm_contacts) AS total_contacts,
           (SELECT COALESCE(SUM(deal_value), 0) FROM crm_deals WHERE stage NOT IN ('closed_lost')) AS pipeline_value,
           (SELECT COUNT(*) FROM crm_deals WHERE stage = 'school_pilot') AS active_school_pilots;`
      ).catch(() => ({ rows: [{ total_contacts: 0, pipeline_value: 0, active_school_pilots: 0 }] })),
    ]);

    const crmRow = crmStatsRes.rows?.[0] || {};
    const approvals = approvalsRes.rows || [];
    const memories = memoriesRes.rows || [];
    const pendingCount = approvals.filter((a) => a.status === 'pending').length;
    const executedCount = approvals.filter((a) => a.status === 'executed').length;

    return new Response(
      JSON.stringify({
        system: 'SOE Market Campaign Launch System (MCLS)',
        version: '2.5.0-edge',
        directives: directivesRes.rows || [],
        units: unitsRes.rows || [],
        approvals,
        memories,
        metaStatus: metaRes.rows?.[0] || {
          mode: 'SANDBOX_DRY_RUN',
          is_configured: false,
          ad_account_id: 'Not Connected (Sandbox Default)',
          page_id: 'Not Configured',
          pixel_id: 'Not Configured',
        },
        telemetry: {
          pendingApprovals: pendingCount,
          executedActions: executedCount,
          activeMemories: memories.length,
          totalContacts: parseInt(crmRow.total_contacts || '0', 10),
          pipelineValue: parseFloat(crmRow.pipeline_value || '0'),
          activeSchoolPilots: parseInt(crmRow.active_school_pilots || '0', 10),
          canonComplianceScore: 100,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('MCLS Overview GET Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();

    if (body.type === 'directive') {
      const { directive_key, title, summary, content } = body;
      const res = await queryNeon(
        databaseUrl,
        `UPDATE mcls_directives
         SET title = COALESCE($2, title),
             summary = COALESCE($3, summary),
             content = COALESCE($4, content),
             updated_at = CURRENT_TIMESTAMP
         WHERE directive_key = $1
         RETURNING *;`,
        [directive_key, title, summary, content]
      );
      return new Response(JSON.stringify({ success: true, directive: res.rows[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.type === 'unit') {
      const { unit_key, effort_level, instructions, schedule_cron } = body;
      const res = await queryNeon(
        databaseUrl,
        `UPDATE mcls_units
         SET effort_level = COALESCE($2, effort_level),
             instructions = COALESCE($3, instructions),
             schedule_cron = COALESCE($4, schedule_cron)
         WHERE unit_key = $1
         RETURNING *;`,
        [unit_key, effort_level, instructions, schedule_cron]
      );
      return new Response(JSON.stringify({ success: true, unit: res.rows[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.type === 'memory') {
      const { unit_scope = 'ALL_UNITS', rule_text } = body;
      const res = await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_memories (unit_scope, source_action, rule_text)
         VALUES ($1, 'operator_manual_rule', $2)
         RETURNING *;`,
        [unit_scope, rule_text]
      );
      return new Response(JSON.stringify({ success: true, memory: res.rows[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unsupported update type' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

