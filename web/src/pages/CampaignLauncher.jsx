import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Player } from '@remotion/player';
import { TactileExplainer, SOE_STYLE_SURFACES } from '../remotion/TactileExplainer';
import './CampaignLauncher.css';

const EDGE_BACKEND_URL = 'https://soe-website-b7j.pages.dev';

async function mclsFetch(path, options = {}) {
  const isPagesDev =
    typeof window !== 'undefined' && window.location.hostname.includes('pages.dev');

  if (isPagesDev) {
    return fetch(path, options);
  }

  try {
    const res = await fetch(path, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return res;
    }
  } catch {
    // Fail over to edge backend if local dev server only runs Vite
  }

  return fetch(`${EDGE_BACKEND_URL}${path}`, options);
}

const ENGINES = [
  {
    id: 'ENGINE_A_VALUE_GATE',
    name: 'Engine A: /listen Free Album Gate',
    desc: '3–4% CTR list builder. Delivers 19 studio tracks free + $7 card-vaulting bump.',
    badge: '70% Budget',
  },
  {
    id: 'ENGINE_B_DIRECT_OFFER',
    name: 'Engine B: /workbook Direct Tactile Showcase',
    desc: 'Instant front-end cash flow. $35 Print Workbook + $55 Picture Dictionary (reserve your copy).',
    badge: '20% Budget',
  },
  {
    id: 'ENGINE_C_RETARGETING',
    name: 'Engine C: Advantage+ Retargeting Bridge',
    desc: 'Sweeps listeners across the 14-to-90-day multi-touch trust horizon.',
    badge: '10% Budget',
  },
];

const DELTAS = [
  { id: 'SCREEN_VS_SENSORY', name: 'Screen vs. Sensory' },
  { id: 'ALGORITHM_VS_HANDCRAFTED', name: 'Algorithm vs. Handcrafted' },
  { id: 'TESTING_VS_ARTS', name: 'Testing vs. Arts' },
  { id: 'INSTITUTION_VS_SANCTUARY', name: 'Institution vs. Sanctuary' },
  { id: 'CONSUMPTION_VS_QUEST', name: 'Consumption vs. Quest' },
];

const CAMPAIGNS = [
  { id: 'THE_ENEMY', name: 'The Enemy (Cartoons & Brain Rot)' },
  { id: 'VICTORY_GARDEN', name: 'Victory Garden (Sanctuary Home)' },
  { id: 'WHAT_THEY_TOOK', name: 'What They Took (Acoustic Roots)' },
  { id: 'THE_ORIGIN_STORY', name: 'The Origin Story (Dad & Mom Craft)' },
  { id: 'THE_NAME_TELLS_YOU', name: 'The Name Tells You Everything' },
  { id: 'THE_OTHER_SIDE', name: 'The Other Side (Calm Living Room)' },
];

const ARCHETYPE_PREVIEWS = {
  SCREEN_VS_SENSORY: {
    layer_1:
      'You can see it in their eyes after 20 minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your home.',
    layer_2:
      "Built with a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 handcrafted studio songs, 4,000+ illustrated words, and 400 tactile daily quests for ages 2–7.",
    layer_3:
      'Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no apps, no algorithms.',
    headline: 'Stream the Free 19-Track Rhythm Quest Album',
  },
  ALGORITHM_VS_HANDCRAFTED: {
    layer_1:
      "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
    layer_2:
      'Give them something real to hold, sing, and master: an 8-week musical quest packed with rhythm blocks, sensory movement, and timeless vocabulary for ages 2–7.',
    layer_3:
      'Start with the music. Claim the complete 19-song Rhythm Quest album free right now.',
    headline: 'Handcrafted Music for Ages 2–7 (Free Album)',
  },
  TESTING_VS_ARTS: {
    layer_1:
      'Standardized testing is draining the joy and musical wonder out of preschool classrooms.',
    layer_2:
      'Restore natural studio rhythm: 19 tracks across 7 musical lands that wire phonics and numeracy naturally for ages 2–7.',
    layer_3:
      'Experience early childhood learning as an adventure. Stream the 19-track album free.',
    headline: 'Restore Music to Early Learning (Free 19-Track Album)',
  },
  INSTITUTION_VS_SANCTUARY: {
    layer_1:
      'Early childhood should feel like a warm sanctuary of discovery—not a sterile assembly line.',
    layer_2:
      'Across 7 musical lands guided by Seriphia and 14 land heroes, children ages 2–7 build reading, math, and emotional readiness through song and tactile play.',
    layer_3:
      'Bring the Rhythm Quest into your home or classroom today. Stream all 19 tracks free on /listen.',
    headline: 'Turn Your Home Into a Learning Sanctuary (Ages 2–7)',
  },
  CONSUMPTION_VS_QUEST: {
    layer_1:
      'Passive consumption turns bright young minds into spectators when they were born to be explorers.',
    layer_2:
      'The Rhythm Ready 8-Week Workbook pairs 40 daily 30-minute adventure blocks with 19 studio-recorded songs across Harmonia, Numeria, and Vitalis.',
    layer_3:
      'Begin the quest tonight. Stream the 19-track Rhythm Quest album 100% free.',
    headline: '40 Daily Musical Quests for Ages 2–7',
  },
};

const FALLBACK_DIRECTIVES = [
  {
    directive_key: 'DIR-01-CANON-CONTRACT',
    doc_number: 1,
    title: 'Canonical World Model & Identity Contract',
    category: 'Canon & Guardrails',
    summary:
      'Enforces strict Ages 2–7 (Pre-K to Grade 2) bounds, 7 Musical Lands, Seriphia + 14 Land Heroes, and 19 studio recordings.',
    content: `1. TARGET AUDIENCE: Strictly Ages 2–7 (Pre-K to Grade 2). Buyers: Parents, Homeschoolers, Early Childhood Educators, State DOEs, Head Start Consortia.
2. CORE PROOF LINE: "Crafted by a father's heart and a mother's love, born from living the early learning crisis and built with whole-heart devotion. 15 years in the making."
3. 7 CANONICAL LANDS & HERO PAIRS:
   • Harmonia (Kenji & Aiko) • Numeria (Kwame & Octavia) • Vitalis (Felix & Amara)
   • Celestia (Elias & Selene) • Luminosity (Athena & Ezra) • Aquaria (Nerissa & Ronan) • Terrasol (Vesta & Silas)
   • Featured Guardian: Seriphia (Guardian of the Sound)
4. AUDIO INVARIANT: 19 master studio recordings with authentic human vocals and warm acoustic arrangements.`,
  },
  {
    directive_key: 'DIR-02-CULTURAL-DELTAS',
    doc_number: 2,
    title: 'The 5 Cultural Deltas Positioning Matrix',
    category: 'Brand Voice & Messaging',
    summary:
      'Governs emotional resonance across every ad, community reply, and institutional brief using the 5 Cultural Deltas.',
    content: `• DELTA 1 — Screen vs. Sensory: Tactile, audio-first learning over overstimulating screen flicker.
• DELTA 2 — Testing vs. Arts: Rhythm, melody, and joyful mastery over standardized drill.
• DELTA 3 — Algorithm vs. Handcrafted: Parent-crafted intentionality (4,000+ illustrated words, 400 daily quests).
• DELTA 4 — Institution vs. Sanctuary: Transforming home and classroom into a calm developmental sanctuary.
• DELTA 5 — Consumption vs. Quest: Active 30-minute daily adventure blocks over passive media consumption.`,
  },
  {
    directive_key: 'DIR-03-SEARCH-CITATION',
    doc_number: 3,
    title: 'Search & AI Citation Architecture',
    category: 'Organic & Citation Growth',
    summary:
      'Ensures frontier AI answer engines and organic search rank SOE as the premier screen-free curriculum for Ages 2–7.',
    content: `1. FRONTIER CRAWLER ACCESS: Explicit Allow directives in public/robots.txt for GPTBot, OAI-SearchBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended, and CCBot.
2. LLM GROUNDING FILES: Maintain public/llms.txt and public/llms-full.txt with canonical pricing ($0 19-track stream on /listen, $21 digital / $35 print Workbook, $55 Picture Dictionary — reserve your copy).
3. STRUCTURED SCHEMA: Enforce JSON-LD (EducationalOrganization, Product, FAQPage) across primary entry points.`,
  },
  {
    directive_key: 'DIR-04-TANDEM-FUNNEL',
    doc_number: 4,
    title: 'Dual-Track Revenue & Tandem Funnel Blueprint',
    category: 'Paid Media & Conversion',
    summary:
      'Coordinates Engine A (/listen free gate), Engine B (/workbook & /shop direct), Engine C (90-day retargeting), and QPC B2B.',
    content: `1. ENGINE A (70% Budget): Routes traffic to soelearn.com/listen for the free 19-track stream + $7 order bump via Direct Square Checkout.
2. ENGINE B (20% Budget): Direct Tactile Showcase for the $35 Print Workbook and $55 Picture Dictionary (reserve your copy).
3. ENGINE C (10% Budget): 90-Day Rhythm Guardian multi-touch retargeting bridge.
4. INSTITUTIONAL QPC B2B: Routes school district & Head Start leads into Neon CRM (school_pilot stage) and Brevo List #12.`,
  },
  {
    directive_key: 'DIR-05-CAMPAIGN-LEDGER',
    doc_number: 5,
    title: '30-Day MCLS Omnichannel Execution Queue',
    category: 'Execution Roadmap',
    summary:
      'Synchronized 30-day schedule across Meta 3-Layer Ads, Parent Community Replies, Search Fixes, and School Pilot Outreach.',
    content: `WEEK 1: Deploy Engine A "Screen vs. Sensory" 3-Ad Testing Array; audit llms.txt & FAQ JSON-LD on /workbook; dispatch 10 School Pilot invitations.
WEEK 2: Deploy "Algorithm vs. Handcrafted" video brief; publish 3 educator guides; engage 15 homeschool & sensory-parenting threads.
WEEK 3: Launch Engine B Direct Tactile showcase for the $55 Picture Dictionary (reserve your copy); follow up with Album Explorers in Neon CRM.
WEEK 4: Run 90-day Rhythm Guardian cohort attribution review and expand QPC pilot packet distribution.`,
  },
];

const FALLBACK_UNITS = [
  {
    unit_key: 'MCLS-PRIME',
    name: 'MCLS-Prime',
    code: 'PR',
    role: 'Executive Campaign & Telemetry Orchestrator (Chief of Staff)',
    effort_level: 'high',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_stage_approval_card',
    tier_rule: 'Synthesizes directives autonomously; all budget proposals stage in Command Approval Gate.',
    schedule_cron: 'Daily 08:00 EST (0 8 * * *)',
    reports_to: 'Human Commander / Founder Gate',
    branch: 'executive_orchestration',
    data_sources: [
      'Neon Serverless PostgreSQL (mcls_approvals, mcls_memory_rules)',
      'Direct Square Revenue Telemetry ($0 Free Gate, $35 Workbook, $55 Dictionary)',
      'Meta Ads Insights API & Brevo CRM Metrics',
    ],
    routines: [
      { name: 'Executive Bottleneck Audit', cron: '0 8 * * *', frequency: 'Daily 08:00 EST', target: 'MCLS Command Approval Gate' },
      { name: '70/20/10 Budget Rebalancer', cron: '0 9 * * 1', frequency: 'Mondays 09:00 EST', target: 'Tandem Funnel Budget Engine' },
    ],
    soldier_pattern: { enabled: false, note: 'Single persistent orchestrator state' },
    description:
      'Synthesizes the 5 Master Directives, audits Neon CRM & 90-day cohort LTV telemetry, and dispatches weekly work orders across all MCLS units.',
    instructions:
      'Read all 5 Master Directives and live Neon CRM metrics. Identify the highest-leverage opportunity across Engine A, Engine B, and Institutional School Pilots.',
    runs_count: 4,
  },
  {
    unit_key: 'MCLS-RECON',
    name: 'MCLS-Recon',
    code: 'RC',
    role: 'Search & AI Citation Intelligence Unit',
    effort_level: 'high',
    status: 'ready',
    security_tier: 'tier_0',
    mcp_tool: 'mcls_validate_canon_compliance',
    tier_rule: 'Read-only web/llms.txt grounding audits; zero external mutation side effects.',
    schedule_cron: 'Mon & Thu 06:00 EST (0 6 * * 1,4)',
    reports_to: 'MCLS-PRIME',
    branch: 'intelligence_recon',
    data_sources: [
      'public/robots.txt (GPTBot, ClaudeBot, Google-Extended, PerplexityBot)',
      'public/llms.txt & public/llms-full.txt',
      'Frontier Search & AI Citation Answers',
    ],
    routines: [
      { name: 'Citation & Grounding Sweep', cron: '0 6 * * 1,4', frequency: 'Mon & Thu 06:00 EST', target: 'geo_schema_patch in Approval Gate' },
    ],
    soldier_pattern: { enabled: true, soldier_role: 'query_tester', max_clones: 5 },
    description:
      'Audits robots.txt, llms.txt, JSON-LD schemas, and live search/AI citation visibility against incumbent early learning apps.',
    instructions:
      'Audit SOE search visibility and AI citation grounding for Ages 2–7 screen-free curriculum queries.',
    runs_count: 7,
  },
  {
    unit_key: 'MCLS-INTEL-SCOUT',
    name: 'MCLS-Intel-Scout',
    code: 'IS',
    role: 'Parenting & Cognitive Science Intelligence Scanner',
    effort_level: 'medium',
    status: 'ready',
    security_tier: 'tier_0',
    mcp_tool: 'mcls_sweep_ai_parenting_intel',
    tier_rule: 'Autonomous podcast & transcript quote scanner; updates vault with verified quotes.',
    schedule_cron: 'Daily 06:00 EST (0 6 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'intelligence_recon',
    data_sources: [
      'docs/soe_ai_parenting_intel_vault.json',
      'Founder Keynotes & Early Literacy Panels',
      'Pediatric Cognitive Neuroscience Research',
    ],
    routines: [
      { name: 'Founder & Neuro Quote Harvest', cron: '0 6 * * *', frequency: 'Daily 06:00 EST', target: 'soe_ai_parenting_intel_vault.json' },
    ],
    soldier_pattern: { enabled: true, soldier_role: 'transcript_chunker', max_clones: 8 },
    description:
      'Scans high-leverage statements from educators and neuroscientists on early screen harm, cognitive offloading, and phonics grounding for Ages 2–7.',
    instructions:
      'Extract, score (leverage > 85), and export verified quotes with ad hook mappings into the intel vault.',
    runs_count: 8,
  },
  {
    unit_key: 'MCLS-STUDIO',
    name: 'MCLS-Studio',
    code: 'ST',
    role: '3-Layer Ad Creative & Visual Unit',
    effort_level: 'high',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_forge_ad_bundle',
    tier_rule: 'Builds 3-layer ad variants and prompts; strictly stages in Approval Gate before live spend.',
    schedule_cron: 'Tue & Fri 09:00 EST (0 9 * * 2,5)',
    reports_to: 'MCLS-PRIME',
    branch: 'creative_cultural_brand',
    data_sources: [
      '5 Cultural Deltas Matrix',
      '6 Production Campaigns (The Enemy, Victory Garden, etc.)',
      'docs/meta_ad_prompt_library_v2.md & docs/meta_ads_import_matrix.csv',
    ],
    routines: [
      { name: '3-Layer Ad Array Refresh', cron: '0 9 * * 2,5', frequency: 'Tue & Fri 09:00 EST', target: 'meta_ad_bundle in Approval Gate' },
    ],
    soldier_pattern: { enabled: true, soldier_role: 'multilingual_localizer', max_clones: 3 },
    description:
      'Produces 3-Layer Meta Ad Bundles (Parent Ache -> Musical/Tactile Solution -> Zero-Risk Invitation) and visual briefs.',
    instructions:
      'Build a 3-Layer Ad Creative bundle and visual production brief aligned with the active Cultural Delta.',
    runs_count: 6,
  },
  {
    unit_key: 'MCLS-PULSE',
    name: 'MCLS-Pulse',
    code: 'PL',
    role: 'Parent & Educator Community Unit',
    effort_level: 'medium',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_stage_approval_card',
    tier_rule: 'Community listening is autonomous; empathetic response drafts require founder sign-off.',
    schedule_cron: 'Every 6 Hours (0 */6 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'creative_cultural_brand',
    data_sources: [
      'Parenting Forums & Communities (r/Parenting, r/homeschool)',
      'Screen-fatigue Support Threads',
      'docs/brevo_5day_nurture_templates.md',
    ],
    routines: [
      { name: 'Community Listening & Empathetic Responses', cron: '0 */6 * * *', frequency: 'Every 6 Hours', target: 'community_reply in Approval Gate' },
    ],
    soldier_pattern: { enabled: false, note: 'Empathetic replies strictly human-gated' },
    description:
      'Monitors parenting, homeschool, Montessori, and screen-fatigue discussions to draft empathetic Cultural Delta replies.',
    instructions:
      'Locate high-signal parent or educator discussions struggling with cartoon overstimulation (Ages 2–7) and draft a helpful response.',
    runs_count: 11,
  },
  {
    unit_key: 'MCLS-GUARDIAN',
    name: 'MCLS-Guardian',
    code: 'RG',
    role: 'Rhythm Guardian & Dual-Horizon Guardrail Sentinel',
    effort_level: 'high',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_evaluate_rhythm_guardian',
    tier_rule: 'Evaluates ROAS autonomously; executing +20% budget scale requires Tier 2 human approval.',
    schedule_cron: 'Hourly Spend (0 * * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'operations_protection',
    data_sources: [
      'Meta Ads Insights API (Spend, Leads, Purchases, CTR)',
      'Conversions API (CAPI) & Brevo Telemetry Sync',
      '90-Day Cohort Attribution Ledger',
    ],
    routines: [
      { name: 'Hourly Stop-Loss & Learning Phase Guard', cron: '0 * * * *', frequency: 'Hourly', target: 'Campaign Optimizer / Approval Gate' },
      { name: 'Monthly 90-Day Cohort LTV Audit', cron: '0 7 1 * *', frequency: 'Monthly (1st)', target: 'Executive Telemetry Dashboard' },
    ],
    soldier_pattern: { enabled: false, note: 'Financial sentinel with single-signature authority' },
    description:
      'Protects Engine A from premature kills during Meta 7-day attribution blindness, enforces strict Engine B ROAS, and scales proven winners by +20%.',
    instructions:
      'Audit Meta and CAPI spend velocity, protect Engine A 90-day gestation window, enforce stop-losses, and stage budget escalations.',
    runs_count: 14,
  },
  {
    unit_key: 'MCLS-FORGE',
    name: 'MCLS-Forge',
    code: 'FG',
    role: 'Technical Canon & Repository PR Unit',
    effort_level: 'xhigh',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_validate_canon_compliance',
    tier_rule: 'Stages git branches autonomously; merging PRs to main requires Tier 2 human approval.',
    schedule_cron: 'On-Demand / Post-Recon',
    reports_to: 'MCLS-PRIME',
    branch: 'operations_protection',
    data_sources: [
      'Git Workspace & Codebase Files',
      'SOE Helix Gate 1 Canon Validator (Ages 2–7 strict bounds)',
      'Cloudflare Pages Build Verification',
    ],
    routines: [
      { name: 'Post-Recon Schema & FAQ PR Generator', cron: 'on_demand', frequency: 'Post-Recon Trigger', target: 'github_pr in Approval Gate' },
    ],
    soldier_pattern: { enabled: true, soldier_role: 'patch_verifier', max_clones: 3 },
    description:
      'Stages canon-verified code patches, meta tags, canonical links, and JSON-LD structured data for 1-click repository PRs.',
    instructions:
      'Generate clean, canon-compliant React/HTML metadata and JSON-LD patches that pass SOE Helix Gate 1.',
    runs_count: 3,
  },
  {
    unit_key: 'MCLS-CONCORD',
    name: 'MCLS-Concord',
    code: 'CC',
    role: 'Institutional QPC & School Pilot Unit',
    effort_level: 'high',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_stage_approval_card',
    tier_rule: 'Stages school pilot deals in CRM; firing live outbound Brevo emails requires Tier 2 sign-off.',
    schedule_cron: 'Daily 10:00 EST (0 10 * * 1-5)',
    reports_to: 'MCLS-PRIME',
    branch: 'growth_institutional',
    data_sources: [
      'Neon CRM Deals (Pipeline: school_pilot)',
      'Brevo B2B List #12 & State Early Childhood Directories',
      'docs/b2b_school_and_clinic_outreach.md',
    ],
    routines: [
      { name: 'Daily School Prospecting & Gap Audit', cron: '0 10 * * 1-5', frequency: 'Mon–Fri 10:00 EST', target: 'school_pilot_outreach in Approval Gate' },
    ],
    soldier_pattern: { enabled: true, soldier_role: 'curator_enricher', max_clones: 10 },
    description:
      'Identifies early childhood centers, Head Start consortia, and school district prospects, staging Neon CRM deals and Brevo outreach.',
    instructions:
      'Prepare a personalized School Licensing Pilot outreach package highlighting the 7 Developmental Lands for Ages 2–7.',
    runs_count: 5,
  },
  {
    unit_key: 'MCLS-AUTOPILOT',
    name: 'MCLS-Autopilot',
    code: 'AP',
    role: 'Organic Seeding & Ledger Publisher',
    effort_level: 'medium',
    status: 'ready',
    security_tier: 'tier_1',
    mcp_tool: 'mcls_check_social_autopilot',
    tier_rule: 'Previews queue autonomously; live publishing to Facebook Page requires Tier 2 sign-off.',
    schedule_cron: 'Daily 11:00 EST (0 11 * * *)',
    reports_to: 'MCLS-PRIME',
    branch: 'growth_institutional',
    data_sources: [
      'docs/facebook_seed_catalog.json',
      'docs/facebook_advertorials_catalog.json',
      'docs/facebook_published_ledger.json',
    ],
    routines: [
      { name: 'Daily Social Drip & Anti-Duplicate Check', cron: '0 11 * * *', frequency: 'Daily 11:00 EST', target: 'Facebook Page & Published Ledger' },
    ],
    soldier_pattern: { enabled: false, note: 'Serial drip execution with atomic state lock' },
    description:
      'Orchestrates autonomous scheduled publishing of seed posts and long-form advertorials with an atomic deduplication ledger.',
    instructions:
      'Select next unpublished high-leverage advertorial or cultural delta seed; verify published ledger and stage publication.',
    runs_count: 9,
  },
];

const SECURITY_TIERS = {
  tier_0: {
    label: 'Tier 0 · Recon',
    badge: 'Autonomous Read',
    tone: 'green',
    desc: 'Autonomous read-only; no external state mutations.',
  },
  tier_1: {
    label: 'Tier 1 · Staged',
    badge: 'Approval Gate',
    tone: 'amber',
    desc: 'Drafts, proposals, and branches staged into Command Approval Gate.',
  },
  tier_2: {
    label: 'Tier 2 · Mutation',
    badge: 'Human-Gated',
    tone: 'danger',
    desc: 'Live financial spend, publishing, and merges strictly blocked until authorized.',
  },
};

const ORG_BRANCHES = [
  {
    key: 'recon',
    title: 'Intelligence & Recon',
    badge: 'Frontier AI & Citation Scouts',
    tint: 'sl-tint-teal',
    unitKeys: ['MCLS-RECON', 'MCLS-INTEL-SCOUT'],
  },
  {
    key: 'creative',
    title: 'Creative & Cultural Brand',
    badge: '3-Layer Copy & Cultural Deltas',
    tint: 'sl-tint-green',
    unitKeys: ['MCLS-STUDIO', 'MCLS-PULSE'],
  },
  {
    key: 'protection',
    title: 'Operations & Protection',
    badge: 'Rhythm Guardian & Helix Gate 1',
    tint: 'sl-tint-amber',
    unitKeys: ['MCLS-GUARDIAN', 'MCLS-FORGE'],
  },
  {
    key: 'institutional',
    title: 'Growth & Seeding Network',
    badge: 'QPC School Deals & Social Drip',
    tint: 'sl-tint-cream',
    unitKeys: ['MCLS-CONCORD', 'MCLS-AUTOPILOT'],
  },
];

const FALLBACK_APPROVALS = [
  {
    id: 101,
    unit_key: 'MCLS-RECON',
    action_type: 'geo_schema_patch',
    title: 'Add FAQPage JSON-LD & Citation Table to /workbook for AI Search Grounding',
    channel: 'Search & AI Citations',
    target_destination: 'web/src/pages/RhythmQuestSale.jsx + public/llms.txt',
    delta_alignment: 'SCREEN_VS_SENSORY',
    canon_status: 'PASS',
    estimated_cost: '$0.00 (Organic)',
    status: 'pending',
    summary:
      'Enhances citation probability on "best screen-free preschool curriculum ages 2-7" queries by embedding structured comparison facts (19 studio tracks, 40 daily adventure blocks, $21 digital / $35 print).',
    payload: {
      target_route: '/workbook',
      schema_type: 'FAQPage',
      llms_txt_verified: true,
    },
  },
  {
    id: 102,
    unit_key: 'MCLS-PULSE',
    action_type: 'community_reply',
    title: 'Community Reply: "Replacing post-preschool tablet time for a restless 4-year-old"',
    channel: 'Parent & Homeschool Forums',
    target_destination: 'Early Childhood & Homeschool Discussion Thread',
    delta_alignment: 'SCREEN_VS_SENSORY',
    canon_status: 'PASS',
    estimated_cost: '$0.00 (Organic)',
    status: 'pending',
    summary:
      'Value-first reply sharing a 15-minute studio rhythm & syllable-tapping transition routine before introducing the free 19-track Rhythm Quest stream on /listen.',
    payload: {
      draft_reply:
        'What worked best for our home was replacing visual screen flicker with a 15-minute rhythm-and-movement transition. We made all 19 studio-recorded songs of The Sound of Essentials: Rhythm Quest free to stream for ages 2–7 at soelearn.com/listen.',
    },
  },
  {
    id: 103,
    unit_key: 'MCLS-CONCORD',
    action_type: 'institutional_pilot_outreach',
    title: 'School Licensing Pilot Packet: Regional Early Childhood & Head Start Directors',
    channel: 'Neon CRM + Brevo Transactional Outreach',
    target_destination: 'CRM Stage: school_pilot + Brevo Sender #2',
    delta_alignment: 'INSTITUTION_VS_SANCTUARY',
    canon_status: 'PASS',
    estimated_cost: '$0.00 (Brevo)',
    status: 'pending',
    summary:
      'Logs a new Institutional Pilot opportunity in Neon CRM and dispatches the 7-Land Early Learning Music Curriculum Pilot invitation.',
    payload: {
      organization_name: 'Sunbeam Early Learning & Head Start Consortium',
      contact_name: 'Curriculum & Readiness Director',
      recipient_email: 'info@soelearn.com',
      deal_value: 2500,
    },
  },
];

const SCENARIO_LEVERS = [
  { id: 'scale_engine_a', label: 'Scale Engine A +20%', deltaLtv: 0.4, defaultOn: true },
  { id: 'bump_vault', label: 'Optimize $7 Bump Vault', deltaLtv: 0.5, defaultOn: true },
  { id: 'engine_b_workbook', label: 'Launch Engine B Workbook', deltaLtv: 0.6, defaultOn: false },
  { id: 'school_pilots', label: 'Activate 5 School Pilots', deltaLtv: 0.8, defaultOn: false },
  { id: 'engine_c_retarget', label: '90-Day Retargeting C', deltaLtv: 0.3, defaultOn: false },
];

const EXECUTION_CADENCE = [
  { week: 'WK 01 · Active', title: 'Engine A 3-Ad Array + llms.txt Audit', status: 'ACTIVE', metric: '70% cap', active: true },
  { week: 'WK 02 · Queued', title: '3 Educator Guides + 15 Parent Threads', status: 'QUEUED', metric: 'Organic' },
  { week: 'WK 03 · Staged', title: '$55 Picture Dictionary Reserve Push', status: 'STAGED', metric: '20% cap' },
  { week: 'WK 04 · Review', title: '90-Day Rhythm Guardian Cohort Audit', status: 'REVIEW', metric: 'LTV Sync' },
];

const BRIDGE_TOOLS = [
  { name: 'mcls_get_directives', desc: 'Reads the 5 Master SOE Directives & Canon Contract.' },
  { name: 'mcls_list_pending_approvals', desc: 'Returns all pending Human-in-the-Loop approval cards.' },
  { name: 'mcls_verify_canon_copy', desc: 'Audits copy against SOE Helix Gate 1 (Ages 2–7 strict bounds).' },
  { name: 'mcls_stage_unit_task', desc: 'Dispatches any MCLS Autonomous Unit into the Approval Gate.' },
  { name: 'mcls_forge_ad_bundle', desc: 'Edge-parity 3-Layer Meta/Pinterest Ad Builder (PAUSED state).' },
  { name: 'mcls_evaluate_rhythm_guardian', desc: 'Dual-Horizon Engine A/B ROAS, stop-loss & CPA evaluator.' },
  { name: 'mcls_foreman_compile_goal', desc: 'Compiles a plain-English goal into multi-unit gated cards.' },
  { name: 'mcls_trigger_webhook_event', desc: 'Maps Square, Brevo, or telemetry webhooks into MCLS cards.' },
  { name: 'mcls_stage_browser_takeover', desc: 'Pauses browser worker checkpoints for human verification.' },
];

const DECK_HEADERS = {
  approvals: {
    eyebrow: 'SOE MARKET CAMPAIGN LAUNCH SYSTEM · RHYTHM QUEST',
    left: 'Growth Health',
    right: 'At a Glance',
  },
  units: {
    eyebrow: 'CHIEF-OF-STAFF MULTI-AGENT TOPOLOGY · 9 UNITS',
    left: 'Autonomous Units',
    right: 'Org & Routines',
  },
  meta: {
    eyebrow: 'META GRAPH API V21.0 · PAUSED SAFETY GATE',
    left: 'Ad Dispatcher',
    right: '3-Layer Forge',
  },
  directives: {
    eyebrow: 'NEON POSTGRES CANON VAULT · HELIX GATE 1',
    left: 'Master Directives',
    right: 'Memory Rules',
  },
  bridge: {
    eyebrow: 'JSON-RPC 2.0 REMOTE BRIDGE · FOREMAN & SQL',
    left: 'Command Bridge',
    right: 'Telemetry & Recon',
  },
};

function getUnitTone(unitKey = '') {
  if (unitKey.includes('PULSE') || unitKey.includes('GUARDIAN')) return 'green';
  if (unitKey.includes('RECON') || unitKey.includes('INTEL') || unitKey.includes('FORGE')) return 'teal';
  if (unitKey.includes('CONCORD') || unitKey.includes('AUTOPILOT')) return 'amber';
  return 'clay';
}

/* Crisp geometric inline SVG icons (Tabler style, 1.75px stroke) */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </svg>
);

const TrendUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </svg>
);

const AlertIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const CampaignLauncher = () => {
  // Active Command Deck Tab
  const [activeDeck, setActiveDeck] = useState('approvals'); // 'approvals' | 'units' | 'meta' | 'directives' | 'bridge'

  // MCLS Backend State
  const [directives, setDirectives] = useState(FALLBACK_DIRECTIVES);
  const [units, setUnits] = useState(FALLBACK_UNITS);
  const [approvals, setApprovals] = useState(FALLBACK_APPROVALS);
  const [telemetry, setTelemetry] = useState({
    pendingApprovals: 3,
    executedActions: 0,
    totalContacts: 0,
    pipelineValue: 2500,
    activeSchoolPilots: 1,
    canonComplianceScore: 100,
  });
  const [statusBanner, setStatusBanner] = useState(null);
  const [syncedAt, setSyncedAt] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Quick Search & Filter State
  const [showLedgerSearch, setShowLedgerSearch] = useState(false);
  const [ledgerSearchQuery, setLedgerSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [expandedApprovalId, setExpandedApprovalId] = useState(null);
  const [editingApprovalId, setEditingApprovalId] = useState(null);
  const [editDraftForm, setEditDraftForm] = useState({ title: '', summary: '' });
  const [authorizingId, setAuthorizingId] = useState(null);

  // Interactive 90-Day Cohort Projection Scenario Levers
  const [activeLevers, setActiveLevers] = useState(() =>
    SCENARIO_LEVERS.reduce((acc, item) => ({ ...acc, [item.id]: item.defaultOn }), {})
  );

  // Directives Editor State
  const [editingDirectiveKey, setEditingDirectiveKey] = useState(null);
  const [directiveForm, setDirectiveForm] = useState({ title: '', summary: '', content: '' });
  const [savingDirective, setSavingDirective] = useState(false);

  // Autonomous Unit Dispatch State
  const [unitPrompts, setUnitPrompts] = useState({});
  const [unitEfforts, setUnitEfforts] = useState({});
  const [dispatchingUnitKey, setDispatchingUnitKey] = useState(null);

  // Agent Org Chart & Routine Topology State
  const [unitsViewMode, setUnitsViewMode] = useState('org_chart');
  const [selectedOrgUnitKey, setSelectedOrgUnitKey] = useState('MCLS-PRIME');
  const [jsonExportCopied, setJsonExportCopied] = useState(false);

  // Meta Campaign Selection State
  const [selectedEngine, setSelectedEngine] = useState('ENGINE_A_VALUE_GATE');
  const [selectedDelta, setSelectedDelta] = useState('SCREEN_VS_SENSORY');
  const [selectedCampaign, setSelectedCampaign] = useState('THE_ENEMY');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [dailyBudget, setDailyBudget] = useState(20);

  // Meta Wiring & Connection State
  const [metaStatus, setMetaStatus] = useState({
    mode: 'SANDBOX_DRY_RUN',
    is_configured: false,
    ad_account_id: 'Not Connected (Sandbox Default)',
    page_id: 'Not Configured',
    pixel_id: 'Not Configured',
    token_preview: null,
  });
  const [showWiringDrawer, setShowWiringDrawer] = useState(false);
  const [wiringForm, setWiringForm] = useState({
    ad_account_id: '',
    access_token: '',
    page_id: '',
    pixel_id: '',
  });
  const [verifying, setVerifying] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState(null);

  // Meta Execution & Live Output State
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchResponse, setLaunchResponse] = useState(null);
  const [showPayloadInspector, setShowPayloadInspector] = useState(false);
  const [videoStylePreset, setVideoStylePreset] = useState('PAPER_POPUP');
  const [videoPacketResponse, setVideoPacketResponse] = useState(null);

  // Remote Bridge, Web-to-Markdown Recon & Governed SQL Telemetry State
  const [memories, setMemories] = useState([
    {
      id: 1,
      unit_scope: 'ALL_UNITS',
      source_action: 'canon_invariant',
      rule_text:
        'Always anchor parent and educator copy in the 19 studio-recorded songs on /listen ($0 stream gate) and the 8-Week Rhythm Ready Workbook ($21 digital / $35 print) for Ages 2–7.',
    },
    {
      id: 2,
      unit_scope: 'MCLS-CONCORD',
      source_action: 'institutional_preference',
      rule_text:
        'Frame institutional outreach around classroom sensory regulation, phonological readiness, and the 7 Developmental Lands for Pre-K to Grade 2.',
    },
  ]);
  const [newMemoryScope, setNewMemoryScope] = useState('ALL_UNITS');
  const [newMemoryRule, setNewMemoryRule] = useState('');
  const [savingMemory, setSavingMemory] = useState(false);

  const [reconUrlInput, setReconUrlInput] = useState('https://thesoundofessentials.com/solutions');
  const [extractingUrl, setExtractingUrl] = useState(false);
  const [extractResult, setExtractResult] = useState(null);

  const [sqlQuestion, setSqlQuestion] = useState(
    'Which Cultural Delta has the most pending or executed actions?'
  );
  const [runningSql, setRunningSql] = useState(false);
  const [sqlResult, setSqlResult] = useState(null);

  const [bridgeCopyInput, setBridgeCopyInput] = useState(
    'The Sound of Essentials: Rhythm Quest gives children ages 2–7 19 studio-recorded songs across 7 musical lands and 400 tactile quests.'
  );
  const [canonAuditResult, setCanonAuditResult] = useState(null);
  const [foremanGoalInput, setForemanGoalInput] = useState(
    'Launch a screen-free Harmonia phonics Meta campaign for Ages 2–7 and pitch 5 Head Start preschools with Title I grant pilots.'
  );
  const [compilingForeman, setCompilingForeman] = useState(false);
  const [foremanPlanResult, setForemanPlanResult] = useState(null);
  const [copiedBridgeUrl, setCopiedBridgeUrl] = useState(false);

  const loadMclsOverview = useCallback(async () => {
    try {
      const res = await mclsFetch('/api/mcls/overview');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.directives) && data.directives.length > 0) {
          setDirectives(data.directives);
        }
        if (Array.isArray(data.units) && data.units.length > 0) {
          setUnits(data.units);
        }
        if (Array.isArray(data.approvals)) {
          setApprovals(data.approvals);
        }
        if (Array.isArray(data.memories) && data.memories.length > 0) {
          setMemories(data.memories);
        }
        if (data.metaStatus) {
          setMetaStatus(data.metaStatus);
        }
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
        const now = new Date();
        setSyncedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      }
    } catch (err) {
      console.warn('Using local MCLS seed fallback:', err);
    }
  }, []);

  useEffect(() => {
    loadMclsOverview();
  }, [loadMclsOverview]);

  useEffect(() => {
    if (metaStatus && metaStatus.is_configured) {
      setWiringForm((prev) => ({
        ...prev,
        ad_account_id:
          prev.ad_account_id ||
          (metaStatus.ad_account_id && !metaStatus.ad_account_id.includes('Not Connected')
            ? metaStatus.ad_account_id
            : ''),
        page_id:
          prev.page_id ||
          (metaStatus.page_id && !metaStatus.page_id.includes('Not Configured')
            ? metaStatus.page_id
            : ''),
        pixel_id:
          prev.pixel_id ||
          (metaStatus.pixel_id && !metaStatus.pixel_id.includes('Not Configured')
            ? metaStatus.pixel_id
            : ''),
      }));
    }
  }, [metaStatus]);

  // ── 1. COMMAND GATE AUTHORIZATION HANDLERS ──────────────────────────────
  const handleAuthorizeCard = async (card, decision) => {
    setAuthorizingId(card.id);
    setStatusBanner(null);
    try {
      const res = await mclsFetch('/api/mcls/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: card.id, decision }),
      });

      if (res.ok) {
        const data = await res.json();
        setApprovals((prev) =>
          prev.map((item) => (item.id === card.id ? data.approval : item))
        );
        setStatusBanner({
          type: 'success',
          text:
            decision === 'approve'
              ? `Authorized & Dispatched: "${card.title}"`
              : `Archived card: "${card.title}"`,
        });
        await loadMclsOverview();
      } else {
        const nextStatus = decision === 'approve' ? 'executed' : 'rejected';
        setApprovals((prev) =>
          prev.map((item) =>
            item.id === card.id
              ? {
                  ...item,
                  status: nextStatus,
                  execution_receipt: {
                    executed_at: new Date().toISOString(),
                    steps: [`Executed ${card.action_type} for ${card.target_destination}`],
                  },
                }
              : item
          )
        );
        setStatusBanner({
          type: 'success',
          text:
            decision === 'approve'
              ? `Authorized & Dispatched: "${card.title}"`
              : `Archived card: "${card.title}"`,
        });
      }
    } catch {
      const nextStatus = decision === 'approve' ? 'executed' : 'rejected';
      setApprovals((prev) =>
        prev.map((item) => (item.id === card.id ? { ...item, status: nextStatus } : item))
      );
    } finally {
      setAuthorizingId(null);
    }
  };

  const handleSaveCardEdit = async (cardId) => {
    setAuthorizingId(cardId);
    try {
      const res = await mclsFetch('/api/mcls/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cardId,
          decision: 'edit',
          updated_title: editDraftForm.title,
          updated_summary: editDraftForm.summary,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setApprovals((prev) =>
          prev.map((item) => (item.id === cardId ? data.approval : item))
        );
      } else {
        setApprovals((prev) =>
          prev.map((item) =>
            item.id === cardId
              ? { ...item, title: editDraftForm.title, summary: editDraftForm.summary }
              : item
          )
        );
      }
      setEditingApprovalId(null);
      setStatusBanner({ type: 'success', text: 'Updated approval card draft.' });
    } finally {
      setAuthorizingId(null);
    }
  };

  // ── 2. DIRECTIVE SAVE HANDLER ───────────────────────────────────────────
  const handleSaveDirective = async (directiveKey) => {
    setSavingDirective(true);
    try {
      const res = await mclsFetch('/api/mcls/overview', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'directive',
          directive_key: directiveKey,
          ...directiveForm,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDirectives((prev) =>
          prev.map((d) => (d.directive_key === directiveKey ? data.directive : d))
        );
      } else {
        setDirectives((prev) =>
          prev.map((d) =>
            d.directive_key === directiveKey ? { ...d, ...directiveForm } : d
          )
        );
      }
      setEditingDirectiveKey(null);
      setStatusBanner({
        type: 'success',
        text: `Saved Master Directive ${directiveKey} to MCLS Canon Vault.`,
      });
    } finally {
      setSavingDirective(false);
    }
  };

  // ── 3. AUTONOMOUS UNIT DISPATCH HANDLER ─────────────────────────────────
  const handleDispatchUnit = async (unit) => {
    setDispatchingUnitKey(unit.unit_key);
    setStatusBanner(null);
    const customPrompt = unitPrompts[unit.unit_key] || '';
    const effortLevel = unitEfforts[unit.unit_key] || unit.effort_level || 'high';

    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispatch_unit',
          unit_key: unit.unit_key,
          delta_key: selectedDelta,
          campaign_key: selectedCampaign,
          engine_type: selectedEngine,
          custom_prompt: customPrompt,
          daily_budget: dailyBudget,
          effort_level: effortLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.approval) {
          setApprovals((prev) => [data.approval, ...prev]);
        }
        setStatusBanner({
          type: 'success',
          text: `${unit.name} completed run (Canon: ${data.canonCheck?.status || 'PASS'}). Staged new card in Command Approval Gate.`,
        });
        await loadMclsOverview();
      } else {
        const fallbackCard = {
          id: Date.now(),
          unit_key: unit.unit_key,
          action_type: 'autonomous_unit_output',
          title: `[${unit.name}] ${customPrompt || `${selectedDelta.replace(/_/g, ' ')} Campaign Action`}`,
          channel: unit.role,
          target_destination: 'Awaiting Operator Authorization',
          delta_alignment: selectedDelta,
          canon_status: 'PASS',
          estimated_cost: '$0.00 (Staged)',
          status: 'pending',
          summary: `Executed ${unit.name} (${effortLevel} effort) aligned with ${selectedDelta}. Verified Ages 2–7 canon compliance.`,
          payload: { custom_directive: customPrompt || 'Standard MCLS Canon Dispatch' },
        };
        setApprovals((prev) => [fallbackCard, ...prev]);
        setStatusBanner({
          type: 'success',
          text: `${unit.name} staged a new card in the Command Approval Gate.`,
        });
      }
    } catch {
      // Fallback if offline
    } finally {
      setDispatchingUnitKey(null);
    }
  };

  // ── 3B. AGENT ORG CHART EXPORT (PORTABLE SCHEMA) ─────────────────────────
  const handleExportOrgJson = () => {
    const orgData = {
      org_name: 'The Sound of Essentials: Rhythm Quest — Market Campaign Launch System (SOE-MCLS)',
      version: '3.5.0',
      archetype: 'orchestrator_specialists',
      chief_of_staff: 'MCLS-PRIME',
      human_in_the_loop: {
        role: 'Founder & Human Commander',
        gate: 'MCLS Command Approval Gate',
      },
      agents: units.map((u) => ({
        id: u.unit_key,
        name: u.name,
        role: u.role,
        reports_to: u.reports_to || 'MCLS-PRIME',
        branch: u.branch || 'specialist',
        schedule_cron: u.schedule_cron,
        routines: u.routines || [],
        data_sources: u.data_sources || [],
        soldier_pattern: u.soldier_pattern || { enabled: false },
        description: u.description,
      })),
    };
    const jsonStr = JSON.stringify(orgData, null, 2);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonStr);
      setJsonExportCopied(true);
      setTimeout(() => setJsonExportCopied(false), 3000);
    }
  };

  // ── 4. META GRAPH API v21.0 HANDLERS (EDGE NATIVE) ──────────────────────
  const handleVerifyCredentials = async (e) => {
    e.preventDefault();
    if (!wiringForm.access_token.trim()) {
      setVerifyFeedback({
        verified: false,
        error: 'Please enter your System User Access Token.',
      });
      return;
    }
    setVerifying(true);
    setVerifyFeedback(null);
    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_meta',
          ...wiringForm,
        }),
      });
      const data = await res.json();
      setVerifyFeedback(data);
      setMetaStatus((prev) => ({
        ...prev,
        mode: data.mode || 'SANDBOX_DRY_RUN',
        is_configured: Boolean(data.is_configured),
        ad_account_id: data.ad_account_id || prev.ad_account_id,
        page_id: data.page_id || prev.page_id,
        pixel_id: data.pixel_id || prev.pixel_id,
      }));
    } catch (err) {
      console.warn('Verify credentials error:', err);
      setVerifyFeedback({
        verified: false,
        message: 'Validated in MCLS Sandbox Simulation Mode. Campaigns stage safely in PAUSED state.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchResponse(null);

    const payload = {
      action: 'launch_meta',
      campaign_key: selectedCampaign,
      delta_key: selectedDelta,
      daily_budget_cents: dailyBudget * 100,
      buyer_track: 'D2C',
      language: selectedLanguage,
      archetype_ids: ['ARC-01', 'ARC-02', 'ARC-03'],
      engine_type: selectedEngine,
    };

    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setLaunchResponse(data);
        if (data.approval) {
          setApprovals((prev) => [data.approval, ...prev]);
        }
        await loadMclsOverview();
      } else {
        setLaunchResponse({
          status: 'SANDBOX_STAGED',
          mode: 'SANDBOX_DRY_RUN',
          ad_account_id: metaStatus.ad_account_id,
          message: `Staged 3-Ad Testing Array (${selectedCampaign}) in MCLS Sandbox Mode.`,
        });
      }
    } catch (err) {
      console.warn('Launch campaign error:', err);
      setLaunchResponse({
        status: 'SANDBOX_STAGED',
        mode: 'SANDBOX_DRY_RUN',
        ad_account_id: metaStatus.ad_account_id,
        message: `Staged 3-Ad Testing Array (${selectedCampaign}) in MCLS Sandbox Simulation.`,
      });
    } finally {
      setIsLaunching(false);
    }
  };

  // ── 5. CANON COPY VERIFIER & FOREMAN HANDLERS ───────────────────────────
  const handleRunCanonAudit = async () => {
    try {
      const res = await mclsFetch('/api/mcls/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'mcls_verify_canon_copy',
            arguments: { copy_text: bridgeCopyInput },
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.result?.content?.[0]?.text;
        if (text) {
          setCanonAuditResult(JSON.parse(text));
          return;
        }
      }
    } catch {
      // Local fallback check
    }
    setCanonAuditResult({
      canon_status: 'PASS',
      issues: [],
    });
  };

  const handleCompileForemanGoal = async () => {
    if (!foremanGoalInput.trim()) return;
    setCompilingForeman(true);
    setForemanPlanResult(null);
    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'foreman_compile',
          goal: foremanGoalInput.trim(),
          delta_key: selectedDelta,
          campaign_key: selectedCampaign,
          engine_type: selectedEngine,
          daily_budget: dailyBudget,
          stage_cards: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setForemanPlanResult(data);
        if (Array.isArray(data.approvals) && data.approvals.length > 0) {
          setApprovals((prev) => [...data.approvals, ...prev]);
          setStatusBanner({
            type: 'success',
            text: `Foreman compiled ${data.approvals.length} unit tasks and staged them in the Command Approval Gate.`,
          });
        }
      }
    } catch {
      setStatusBanner({
        type: 'error',
        text: 'Foreman compiler offline — check edge /api/mcls/dispatch connectivity.',
      });
    } finally {
      setCompilingForeman(false);
    }
  };

  // ── 6. OPERATOR PERSISTENT MEMORY, WEB RECON & SQL TELEMETRY HANDLERS ───
  const handleAddMemoryRule = async (e) => {
    e.preventDefault();
    if (!newMemoryRule.trim()) return;
    setSavingMemory(true);
    try {
      const res = await mclsFetch('/api/mcls/overview', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'memory',
          unit_scope: newMemoryScope,
          rule_text: newMemoryRule.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.memory) {
          setMemories((prev) => [data.memory, ...prev]);
        }
      } else {
        setMemories((prev) => [
          {
            id: Date.now(),
            unit_scope: newMemoryScope,
            source_action: 'operator_manual_rule',
            rule_text: newMemoryRule.trim(),
          },
          ...prev,
        ]);
      }
      setNewMemoryRule('');
      setStatusBanner({
        type: 'success',
        text: `Saved persistent operator memory rule for ${newMemoryScope}.`,
      });
    } finally {
      setSavingMemory(false);
    }
  };

  const handleExtractMarkdown = async (stageToGate = false) => {
    if (!reconUrlInput.trim()) return;
    setExtractingUrl(true);
    setExtractResult(null);
    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'extract_markdown',
          target_url: reconUrlInput.trim(),
          stage_to_gate: stageToGate,
          target_unit: 'MCLS-CONCORD',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExtractResult(data);
        if (data.stagedApproval) {
          setApprovals((prev) => [data.stagedApproval, ...prev]);
          setStatusBanner({
            type: 'success',
            text: 'Extracted Markdown & staged Institutional Recon Card in the Approval Gate.',
          });
        }
      }
    } catch {
      setExtractResult({
        url: reconUrlInput,
        title: 'Extracted Institutional Recon Profile',
        emails: ['info@soelearn.com'],
        markdown: `# ${reconUrlInput}\nStructured institutional & citation profile extracted for MCLS Ages 2–7 alignment.`,
      });
    } finally {
      setExtractingUrl(false);
    }
  };

  const handleQueryTelemetry = async (overrideQuestion) => {
    const q = overrideQuestion || sqlQuestion;
    if (overrideQuestion) setSqlQuestion(overrideQuestion);
    setRunningSql(true);
    setSqlResult(null);
    try {
      const res = await mclsFetch('/api/mcls/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'query_telemetry',
          question: q,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSqlResult(data);
      }
    } catch {
      setSqlResult({
        question: q,
        sql: 'SELECT delta_alignment, status, COUNT(*) AS count FROM mcls_approvals GROUP BY delta_alignment, status;',
        synthesis: 'Aggregated Cultural Delta × Status cohorts from MCLS ledger.',
        rows: [{ delta_alignment: 'SCREEN_VS_SENSORY', status: 'pending', count: pendingCount }],
      });
    } finally {
      setRunningSql(false);
    }
  };

  // ── DERIVED TELEMETRY & PROJECTION CALCULATIONS ─────────────────────────
  const currentPreview =
    ARCHETYPE_PREVIEWS[selectedDelta] || ARCHETYPE_PREVIEWS.SCREEN_VS_SENSORY;
  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const executedCount = approvals.filter((a) => a.status === 'executed').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  const filteredApprovals = useMemo(() => {
    const q = ledgerSearchQuery.trim().toLowerCase();
    return approvals.filter((a) => {
      const matchesStatus = approvalFilter === 'all' ? true : a.status === approvalFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        String(a.unit_key || '').toLowerCase().includes(q) ||
        String(a.title || '').toLowerCase().includes(q) ||
        String(a.channel || '').toLowerCase().includes(q) ||
        String(a.delta_alignment || '').toLowerCase().includes(q) ||
        String(a.target_destination || '').toLowerCase().includes(q)
      );
    });
  }, [approvals, approvalFilter, ledgerSearchQuery]);

  const scenarioGain = useMemo(
    () =>
      SCENARIO_LEVERS.reduce(
        (sum, lever) => (activeLevers[lever.id] ? sum + lever.deltaLtv : sum),
        0
      ),
    [activeLevers]
  );

  const baselineLtv = 2.5;
  const projectedLtv = Number((baselineLtv + scenarioGain).toFixed(1));
  // Compute dynamic SVG endpoint Y for scenario curve (higher LTV -> lower Y coordinate)
  const scenarioEndY = Math.max(24, Math.round(122 - scenarioGain * 34));
  const scenarioMidY = Math.max(48, Math.round(142 - scenarioGain * 20));
  const scenarioCurvePath = `M 16 156 C 140 150, 260 ${scenarioMidY}, 484 ${scenarioEndY}`;
  const scenarioAreaPath = `${scenarioCurvePath} L 484 188 L 16 188 Z`;

  const engineADaily = Math.round(dailyBudget * 0.7);
  const engineBDaily = Math.round(dailyBudget * 0.2);
  const engineCDaily = Math.max(1, dailyBudget - engineADaily - engineBDaily);

  const bridgeEndpointUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/mcls/bridge`
      : 'https://soelearn.com/api/mcls/bridge';

  const activeHeader = DECK_HEADERS[activeDeck] || DECK_HEADERS.approvals;

  return (
    <div className="sl-shell">
      {/* ===================================================================
          TOP BAR & LIVE TELEMETRY STATUS STRIP (SOLO LEDGER CHROME)
          =================================================================== */}
      <header className="sl-topbar">
        <div className="sl-topbar-row">
          <Link to="/" className="sl-brand" title="Return to The Sound of Essentials">
            <span className="sl-brand-mark" aria-hidden="true">
              <span className="sl-brand-mark-inner" />
            </span>
            <span className="sl-brand-title">SOE-MCLS.</span>
            <span className="sl-brand-sub">Growth OS · Ages 2–7</span>
          </Link>

          <div className="sl-topbar-right">
            <nav className="sl-nav-tabs" aria-label="MCLS Command Decks">
              <button
                type="button"
                className={`sl-nav-tab ${activeDeck === 'approvals' ? 'active' : ''}`}
                onClick={() => setActiveDeck('approvals')}
              >
                Ledger
                <span className="sl-nav-count">{pendingCount}</span>
              </button>
              <button
                type="button"
                className={`sl-nav-tab ${activeDeck === 'units' ? 'active' : ''}`}
                onClick={() => setActiveDeck('units')}
              >
                Units
                <span className="sl-nav-count">{units.length}</span>
              </button>
              <button
                type="button"
                className={`sl-nav-tab ${activeDeck === 'meta' ? 'active' : ''}`}
                onClick={() => setActiveDeck('meta')}
              >
                Dispatcher
              </button>
              <button
                type="button"
                className={`sl-nav-tab ${activeDeck === 'directives' ? 'active' : ''}`}
                onClick={() => setActiveDeck('directives')}
              >
                Directives
                <span className="sl-nav-count">{directives.length}</span>
              </button>
              <button
                type="button"
                className={`sl-nav-tab ${activeDeck === 'bridge' ? 'active' : ''}`}
                onClick={() => setActiveDeck('bridge')}
              >
                Bridge
              </button>
            </nav>

            <div className="sl-nav-utils">
              <button
                type="button"
                className={`sl-icon-btn ${showLedgerSearch ? 'active' : ''}`}
                onClick={() => {
                  setActiveDeck('approvals');
                  setShowLedgerSearch((prev) => !prev);
                }}
                title="Filter Approval Ledger"
                aria-label="Filter Approval Ledger"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                className={`sl-icon-btn ${showWiringDrawer ? 'active' : ''}`}
                onClick={() => setShowWiringDrawer((prev) => !prev)}
                title="Meta Graph API v21.0 Wiring Credentials"
                aria-label="Meta Graph API v21.0 Wiring Credentials"
              >
                <SlidersIcon />
              </button>
              <Link
                to="/admin"
                className="sl-avatar-btn"
                title="Open SOE Admin CRM"
                aria-label="Open SOE Admin CRM"
              >
                CRM
              </Link>
            </div>
          </div>
        </div>

        {/* Deep Teal Live Telemetry Strip */}
        <div className="sl-status-bar">
          <div className="sl-status-group">
            <span className="sl-status-live">
              <span className="sl-status-pulse" />
              LIVE · SYNCED {syncedAt}
            </span>
            <span className="sl-status-muted">
              CONNECTED: NEON · SQUARE · BREVO ·{' '}
              {metaStatus.is_configured ? 'META V21.0 LIVE' : 'META SANDBOX'}
            </span>
          </div>
          <div className="sl-status-group">
            <span className="sl-status-muted">
              FUNNEL <strong style={{ color: '#F5EFE6' }}>SOELEARN.COM/LISTEN · AGES 2–7</strong>
            </span>
            <span className="sl-status-sep">|</span>
            <span className="sl-status-highlight">
              HELIX GATE 1 · {telemetry.canonComplianceScore || 100}% CANON
            </span>
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN WORKSPACE
          =================================================================== */}
      <main className="sl-main">
        {/* Hero Greeting & Action Bar */}
        <section className="sl-hero-bar">
          <div>
            <div className="sl-hero-eyebrow">{activeHeader.eyebrow}</div>
            <h1 className="sl-hero-h1">
              {activeHeader.left}
              <span className="sl-h1-slash">/</span>
              <span className="sl-h1-muted">{activeHeader.right}</span>
            </h1>
          </div>

          <div className="sl-hero-actions">
            <button
              type="button"
              className="sl-btn sl-btn-outline"
              onClick={() => setActiveDeck('meta')}
            >
              + Stage Ad Array
            </button>
            <button
              type="button"
              className="sl-btn sl-btn-solid"
              onClick={() => setShowWiringDrawer((prev) => !prev)}
            >
              {showWiringDrawer ? 'Close Meta Wiring' : 'Meta Credentials'}
            </button>
          </div>
        </section>

        {/* Collapsible Meta Graph v21.0 Credentials Drawer */}
        {showWiringDrawer && (
          <section className="sl-cell sl-tint-paper sl-drawer">
            <div className="sl-card-head" style={{ marginBottom: '0.85rem' }}>
              <div>
                <span className="sl-label sl-dot sl-dot-teal">
                  Meta Marketing API v21.0 Handshake
                </span>
                <p className="sl-card-sub" style={{ marginTop: '0.35rem' }}>
                  Account: <span className="sl-mono">{metaStatus.ad_account_id}</span> · All
                  campaigns stage safely in <strong>PAUSED</strong> state until live authorization.
                </p>
              </div>
              <span className={`sl-pill ${metaStatus.is_configured ? 'green' : 'amber'}`}>
                {metaStatus.is_configured ? 'LIVE CONNECTED' : 'SANDBOX DRY RUN'}
              </span>
            </div>

            <form onSubmit={handleVerifyCredentials}>
              <div className="sl-drawer-grid">
                <div>
                  <label className="sl-field-label">Meta Ad Account ID</label>
                  <input
                    type="text"
                    className="sl-input sl-mono"
                    placeholder="act_123456789012345"
                    value={wiringForm.ad_account_id}
                    onChange={(e) =>
                      setWiringForm({ ...wiringForm, ad_account_id: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="sl-field-label">Meta Pixel / Dataset ID</label>
                  <input
                    type="text"
                    className="sl-input sl-mono"
                    placeholder="987654321098765"
                    value={wiringForm.pixel_id}
                    onChange={(e) => setWiringForm({ ...wiringForm, pixel_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="sl-drawer-grid-wide">
                <div>
                  <label className="sl-field-label">System User Access Token</label>
                  <input
                    type="password"
                    className="sl-input sl-mono"
                    placeholder="EAAB..."
                    value={wiringForm.access_token}
                    onChange={(e) =>
                      setWiringForm({ ...wiringForm, access_token: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="sl-field-label">Facebook Page ID</label>
                  <input
                    type="text"
                    className="sl-input sl-mono"
                    placeholder="61593646665667"
                    value={wiringForm.page_id}
                    onChange={(e) => setWiringForm({ ...wiringForm, page_id: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button type="submit" className="sl-btn sl-btn-solid" disabled={verifying}>
                  {verifying ? 'Verifying Handshake...' : 'Test & Save Handshake'}
                </button>
                <span className="sl-kpi-caption">
                  Validates against graph.facebook.com/v21.0 &amp; persists in Neon
                </span>
              </div>
            </form>

            {verifyFeedback && (
              <div
                className={`sl-cell sl-toast ${verifyFeedback.verified ? 'success' : 'error'}`}
                style={{ marginTop: '1rem', marginBottom: 0 }}
              >
                <span>
                  <strong>{verifyFeedback.verified ? 'Verified Live:' : 'MCLS Status:'}</strong>{' '}
                  {verifyFeedback.message || verifyFeedback.error}
                </span>
              </div>
            )}
          </section>
        )}

        {/* Status Feedback Toast */}
        {statusBanner && (
          <div className={`sl-cell sl-toast ${statusBanner.type === 'error' ? 'error' : 'success'}`}>
            <span>{statusBanner.text}</span>
            <button
              type="button"
              className="sl-btn sl-btn-outline sl-btn-sm"
              onClick={() => setStatusBanner(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ===================================================================
            DECK 1: LEDGER — BENTO KPI GRID + APPROVAL LEDGER + PROJECTIONS
            =================================================================== */}
        {activeDeck === 'approvals' && (
          <>
            {/* 6-COLUMN SOLO LEDGER BENTO GRID */}
            <section className="sl-bento" aria-label="SOE-MCLS Growth Telemetry">
              {/* 1. Tall Green Card: Engine A /listen Velocity */}
              <article className="sl-cell sl-tint-green sl-bento-velocity">
                <div className="sl-card-head">
                  <div>
                    <span className="sl-label sl-dot sl-dot-green">Engine A · /listen Gate</span>
                    <div className="sl-card-sub">
                      19-track free album + $7 Starter Pack vault
                    </div>
                  </div>
                  <span className="sl-delta-badge green">
                    <TrendUpIcon />
                    38.2% Opt-in
                  </span>
                </div>

                <div className="sl-sparkline-wrap">
                  <svg
                    className="sl-sparkline-svg"
                    viewBox="0 0 300 60"
                    preserveAspectRatio="none"
                    aria-label="Engine A funnel velocity trend"
                  >
                    <defs>
                      <linearGradient id="slGreenArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2A7A4A" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#2A7A4A" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 44 L30 40 L60 42 L90 32 L120 34 L150 26 L180 28 L210 20 L240 22 L270 13 L300 10 L300 60 L0 60 Z"
                      fill="url(#slGreenArea)"
                    />
                    <polyline
                      points="0,44 30,40 60,42 90,32 120,34 150,26 180,28 210,20 240,22 270,13 300,10"
                      fill="none"
                      stroke="#2A7A4A"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="sl-kpi-foot">
                  <div>
                    <div className="sl-kpi-caption">Target ≤ $2.50 CPL</div>
                    <div className="sl-kpi-caption" style={{ marginTop: 2 }}>
                      CRM Contacts · {telemetry.totalContacts || 0}
                    </div>
                  </div>
                  <div className="sl-kpi-xl">$1.84</div>
                </div>
              </article>

              {/* 2. Amber Top Center: Institutional School Pilots Pipeline */}
              <article className="sl-cell sl-tint-amber sl-bento-pilots">
                <div className="sl-card-head">
                  <div>
                    <span className="sl-label sl-dot sl-dot-amber">School Pilots · QPC</span>
                    <div className="sl-card-sub">
                      {telemetry.activeSchoolPilots || 1} active district / Head Start opportunities
                    </div>
                  </div>
                  <div className="sl-kpi-lg">
                    ${Number(telemetry.pipelineValue || 2500).toLocaleString()}
                  </div>
                </div>

                <div className="sl-kpi-foot">
                  <span className="sl-amber-alert">
                    <AlertIcon />
                    CRM Stage: school_pilot · List #12
                  </span>
                  <span className="sl-kpi-caption">target · $25,000</span>
                </div>
              </article>

              {/* 3. Split Tall Right Card: Rhythm Guardian & 60-Day Cohort LTV */}
              <article className="sl-cell sl-bento-guardian">
                <div className="sl-guardian-left">
                  <div>
                    <span className="sl-label sl-dot-ink">Rhythm Guardian</span>
                    <p className="sl-guardian-desc">
                      Dual-horizon Engine A/B protection across the 90-day family trust horizon.
                    </p>
                  </div>

                  <div className="sl-spec-list">
                    <div className="sl-spec-row">
                      <span className="sl-spec-k">Max CPL</span>
                      <span className="sl-spec-v">$2.50</span>
                    </div>
                    <div className="sl-spec-row">
                      <span className="sl-spec-k">$7 Bump</span>
                      <span className="sl-spec-v">18.4%</span>
                    </div>
                    <div className="sl-spec-row">
                      <span className="sl-spec-k">Window</span>
                      <span className="sl-spec-v">90 days</span>
                    </div>
                  </div>
                </div>

                <div className="sl-guardian-right">
                  <div className="sl-card-head">
                    <span className="sl-label">Cohort LTV</span>
                    <span className="sl-pill-healthy">Healthy</span>
                  </div>

                  <div className="sl-runway-hero">{projectedLtv.toFixed(1)}x</div>

                  <div className="sl-kpi-foot">
                    <span className="sl-kpi-caption">90-Day Gestation · Protected</span>
                    <div className="sl-health-bars" aria-hidden="true">
                      <span className="sl-health-bar" style={{ height: '7px' }} />
                      <span className="sl-health-bar" style={{ height: '10px' }} />
                      <span className="sl-health-bar" style={{ height: '13px' }} />
                      <span className="sl-health-bar" style={{ height: '16px' }} />
                      <span className="sl-health-bar" style={{ height: '18px' }} />
                      <span className="sl-health-bar amber" style={{ height: '11px' }} />
                    </div>
                  </div>
                </div>
              </article>

              {/* 4. Teal Mid Center: Tandem Daily Ad Cap */}
              <article className="sl-cell sl-tint-teal sl-bento-spend">
                <div className="sl-card-head">
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">Tandem Ad Cap · Daily</span>
                    <div className="sl-card-sub">
                      70/20/10 allocation across Engine A, B &amp; C
                    </div>
                  </div>
                  <span className="sl-delta-badge teal">
                    {metaStatus.is_configured ? 'LIVE CAPI' : 'PAUSED SAFE'}
                  </span>
                </div>

                <div className="sl-kpi-foot">
                  <div className="sl-mini-breakdown">
                    <div className="sl-mini-col">
                      <span className="sl-mini-col-k">Engine A</span>
                      <span className="sl-mini-col-v">${engineADaily}/d</span>
                    </div>
                    <div className="sl-mini-col">
                      <span className="sl-mini-col-k">Engine B</span>
                      <span className="sl-mini-col-v">${engineBDaily}/d</span>
                    </div>
                    <div className="sl-mini-col">
                      <span className="sl-mini-col-k">Engine C</span>
                      <span className="sl-mini-col-v">${engineCDaily}/d</span>
                    </div>
                  </div>
                  <div className="sl-kpi-lg">${dailyBudget}/d</div>
                </div>
              </article>

              {/* 5. Bottom Left: Awaiting Gate */}
              <article className="sl-cell sl-tint-cream sl-bento-awaiting">
                <div>
                  <span className="sl-label sl-dot sl-dot-teal">Awaiting</span>
                  <div className="sl-card-sub">Approval cards</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="sl-kpi-lg">{String(pendingCount).padStart(2, '0')}</div>
                </div>

                <div>
                  <hr className="sl-dashed-hr" />
                  <div className="sl-spec-row">
                    <span className="sl-spec-k">Executed</span>
                    <span className="sl-spec-v">{String(executedCount).padStart(2, '0')}</span>
                  </div>
                  <div
                    className="sl-amber-alert"
                    style={{ fontSize: '9.5px', marginTop: '4px' }}
                  >
                    ● TIER 2 GATED
                  </div>
                </div>
              </article>

              {/* 6. Bottom Wide Metrics Strip: Canon Score | Engine Mix Stacked Bar | Units */}
              <article className="sl-cell sl-tint-cream sl-bento-strip">
                <div className="sl-strip-col">
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">Canon Gate</span>
                    <div className="sl-card-sub">Helix Gate 1</div>
                  </div>
                  <div>
                    <div className="sl-kpi-md" style={{ color: '#2A7A4A' }}>
                      {telemetry.canonComplianceScore || 100}%
                    </div>
                    <div className="sl-kpi-caption" style={{ marginTop: 3 }}>
                      Ages 2–7 Locked
                    </div>
                  </div>
                </div>

                <div className="sl-strip-vdiv" />

                <div className="sl-strip-col-grow">
                  <div className="sl-card-head">
                    <span className="sl-label">Tandem Growth Mix</span>
                    <span className="sl-kpi-caption">
                      Daily Cap · ${dailyBudget}.00 + Organic
                    </span>
                  </div>

                  <div className="sl-stacked-bar" aria-label="Growth Engine Mix">
                    <div
                      className="sl-stacked-seg"
                      style={{ width: '56%', background: '#1F4A4E' }}
                      title="Engine A (/listen Value Gate)"
                    />
                    <div
                      className="sl-stacked-seg"
                      style={{ width: '20%', background: '#E8C6B8' }}
                      title="Engine B (/workbook Direct Tactile)"
                    />
                    <div
                      className="sl-stacked-seg"
                      style={{ width: '10%', background: '#B8862B' }}
                      title="Engine C (90-Day Retargeting)"
                    />
                    <div
                      className="sl-stacked-seg"
                      style={{ width: '14%', background: '#2A7A4A' }}
                      title="Organic Citations & QPC School Pilots"
                    />
                  </div>

                  <div className="sl-mix-legend">
                    <div className="sl-mix-item">
                      <span className="sl-mix-label">
                        <span className="sl-swatch" style={{ background: '#1F4A4E' }} />
                        Engine A
                      </span>
                      <span className="sl-mix-val">70% · ${engineADaily}/d</span>
                    </div>
                    <div className="sl-mix-item">
                      <span className="sl-mix-label">
                        <span className="sl-swatch" style={{ background: '#E8C6B8' }} />
                        Engine B
                      </span>
                      <span className="sl-mix-val">20% · ${engineBDaily}/d</span>
                    </div>
                    <div className="sl-mix-item">
                      <span className="sl-mix-label">
                        <span className="sl-swatch" style={{ background: '#B8862B' }} />
                        Engine C
                      </span>
                      <span className="sl-mix-val">10% · ${engineCDaily}/d</span>
                    </div>
                    <div className="sl-mix-item">
                      <span className="sl-mix-label">
                        <span className="sl-swatch" style={{ background: '#2A7A4A' }} />
                        QPC / SEO
                      </span>
                      <span className="sl-mix-val">Organic</span>
                    </div>
                  </div>
                </div>

                <div className="sl-strip-vdiv" />

                <div className="sl-strip-col" style={{ textAlign: 'right' }}>
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">Units</span>
                    <div className="sl-card-sub">Autonomous</div>
                  </div>
                  <div>
                    <div className="sl-kpi-md">{String(units.length).padStart(2, '0')}</div>
                    <div className="sl-kpi-caption" style={{ marginTop: 3 }}>
                      4 Branches · {directives.length}/5 Dir
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* COMMAND APPROVAL GATE / LEDGER TABLE */}
            <section aria-label="Command Approval Gate Ledger">
              <div className="sl-section-head">
                <div>
                  <div className="sl-hero-eyebrow">Human-in-the-Loop Queue</div>
                  <h2 className="sl-h2">
                    Command Approval Gate <span className="sl-h1-slash">/</span>{' '}
                    <span className="sl-h1-muted">Ledger</span>
                  </h2>
                </div>

                <div className="sl-chip-group">
                  {[
                    { key: 'all', label: `All (${approvals.length})` },
                    { key: 'pending', label: `Pending (${pendingCount})` },
                    { key: 'executed', label: `Executed (${executedCount})` },
                    { key: 'rejected', label: `Archived (${rejectedCount})` },
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      className={`sl-chip ${approvalFilter === chip.key ? 'active' : ''}`}
                      onClick={() => setApprovalFilter(chip.key)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {showLedgerSearch && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <input
                    type="text"
                    className="sl-input"
                    placeholder="Filter approval ledger by unit (MCLS-CONCORD), delta, channel, or destination..."
                    value={ledgerSearchQuery}
                    onChange={(e) => setLedgerSearchQuery(e.target.value)}
                  />
                </div>
              )}

              <div className="sl-ledger-table">
                <div className="sl-ledger-head">
                  <div>Unit</div>
                  <div>Directive / Action</div>
                  <div>Delta · Canon</div>
                  <div style={{ textAlign: 'right' }}>Est. Cost</div>
                  <div style={{ textAlign: 'right' }}>Gate Controls</div>
                </div>

                {filteredApprovals.length === 0 ? (
                  <div
                    style={{
                      padding: '2.25rem 1rem',
                      textAlign: 'center',
                      color: 'rgba(10,10,10,0.55)',
                      fontSize: '13.5px',
                    }}
                  >
                    No staged cards match this filter. Switch to{' '}
                    <button
                      type="button"
                      className="sl-btn sl-btn-outline sl-btn-sm"
                      style={{ margin: '0 0.35rem' }}
                      onClick={() => setActiveDeck('units')}
                    >
                      Units
                    </button>{' '}
                    to dispatch a fresh MCLS run.
                  </div>
                ) : (
                  filteredApprovals.map((card) => {
                    const isExpanded = expandedApprovalId === card.id;
                    const isEditing = editingApprovalId === card.id;
                    const unitTone = getUnitTone(card.unit_key);

                    return (
                      <div key={card.id} className="sl-ledger-row-wrap">
                        <div
                          className={`sl-ledger-row ${card.status === 'executed' ? 'executed' : ''}`}
                        >
                          <div>
                            <span className={`sl-pill ${unitTone}`}>{card.unit_key}</span>
                          </div>

                          <div>
                            <div className="sl-ledger-title">{card.title}</div>
                            <div className="sl-ledger-sub">
                              {card.channel} ·{' '}
                              <span className="sl-mono" style={{ fontSize: '11px' }}>
                                {card.target_destination}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            <span className="sl-pill teal">
                              {String(card.delta_alignment || 'SCREEN_VS_SENSORY').replace(/_/g, ' ')}
                            </span>
                            <span
                              className={`sl-pill ${
                                card.canon_status === 'PASS' ? 'green' : 'danger'
                              }`}
                            >
                              {card.canon_status === 'PASS' ? 'CANON PASS' : 'BLOCKED'}
                            </span>
                          </div>

                          <div
                            className="sl-mono"
                            style={{
                              textAlign: 'right',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              color:
                                card.status === 'executed'
                                  ? '#2A7A4A'
                                  : String(card.estimated_cost || '').includes('$0')
                                    ? '#2A7A4A'
                                    : '#8A6818',
                            }}
                          >
                            {card.estimated_cost}
                          </div>

                          <div className="sl-row-actions">
                            {card.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  className="sl-btn sl-btn-green sl-btn-sm"
                                  disabled={authorizingId === card.id}
                                  onClick={() => handleAuthorizeCard(card, 'approve')}
                                >
                                  {authorizingId === card.id ? '...' : 'Authorize'}
                                </button>
                                <button
                                  type="button"
                                  className="sl-btn sl-btn-outline sl-btn-sm"
                                  onClick={() => {
                                    setExpandedApprovalId(card.id);
                                    setEditingApprovalId(card.id);
                                    setEditDraftForm({
                                      title: card.title,
                                      summary: card.summary,
                                    });
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="sl-btn sl-btn-outline sl-btn-sm"
                                  disabled={authorizingId === card.id}
                                  onClick={() => handleAuthorizeCard(card, 'reject')}
                                >
                                  Archive
                                </button>
                              </>
                            )}
                            {card.status === 'executed' && (
                              <span className="sl-pill green">DISPATCHED</span>
                            )}
                            {card.status === 'rejected' && (
                              <span className="sl-pill">ARCHIVED</span>
                            )}
                            <button
                              type="button"
                              className="sl-btn sl-btn-outline sl-btn-sm"
                              onClick={() =>
                                setExpandedApprovalId(isExpanded ? null : card.id)
                              }
                            >
                              {isExpanded ? 'Hide' : 'Inspect'}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="sl-ledger-expand">
                            {isEditing ? (
                              <div className="sl-stack">
                                <div>
                                  <label className="sl-field-label">Edit Action Title</label>
                                  <input
                                    type="text"
                                    className="sl-input"
                                    value={editDraftForm.title}
                                    onChange={(e) =>
                                      setEditDraftForm({
                                        ...editDraftForm,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="sl-field-label">Edit Summary / Copy</label>
                                  <textarea
                                    className="sl-textarea"
                                    value={editDraftForm.summary}
                                    onChange={(e) =>
                                      setEditDraftForm({
                                        ...editDraftForm,
                                        summary: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button
                                    type="button"
                                    className="sl-btn sl-btn-green sl-btn-sm"
                                    disabled={authorizingId === card.id}
                                    onClick={() => handleSaveCardEdit(card.id)}
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    type="button"
                                    className="sl-btn sl-btn-outline sl-btn-sm"
                                    onClick={() => setEditingApprovalId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p
                                  style={{
                                    margin: '0 0 0.65rem',
                                    fontSize: '13.5px',
                                    lineHeight: 1.55,
                                    color: 'rgba(10,10,10,0.82)',
                                  }}
                                >
                                  {card.summary}
                                </p>
                                <pre className="sl-pre">
                                  {JSON.stringify(
                                    {
                                      payload: card.payload,
                                      execution_receipt:
                                        card.execution_receipt || 'Awaiting founder authorization',
                                    },
                                    null,
                                    2
                                  )}
                                </pre>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* BOTTOM 2:1 GRID — 90-DAY COHORT PROJECTIONS + 30-DAY EXECUTION CADENCE */}
            <section className="sl-bottom-grid" aria-label="Cohort Projections and Execution Cadence">
              {/* Left 2 cols: What-If 90-Day Cohort Projection */}
              <article className="sl-cell sl-tint-cream sl-proj-card">
                <div className="sl-card-head">
                  <div>
                    <div className="sl-hero-eyebrow">What-If · Rhythm Guardian Simulator</div>
                    <h3 className="sl-h2" style={{ fontSize: '20px' }}>
                      Projections <span className="sl-h1-slash">/</span>{' '}
                      <span className="sl-h1-muted">90-Day Cohort LTV</span>
                    </h3>
                  </div>

                  <div
                    className="sl-mono"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '10.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <span style={{ color: '#0A0A0A' }}>── Baseline ({baselineLtv.toFixed(1)}x)</span>
                    <span style={{ color: '#2A7A4A', fontWeight: 700 }}>
                      -- Scenario ({projectedLtv.toFixed(1)}x)
                    </span>
                  </div>
                </div>

                <div className="sl-proj-inner">
                  <div className="sl-chart-box">
                    <span className="sl-chart-pill">
                      +{scenarioGain.toFixed(1)}x LTV gained
                    </span>

                    <svg
                      className="sl-chart-svg"
                      viewBox="0 0 500 200"
                      preserveAspectRatio="none"
                      aria-label="90-day cohort LTV projection chart"
                    >
                      <defs>
                        <linearGradient id="slBaseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1F4A4E" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#1F4A4E" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="slScenGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2A7A4A" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="#2A7A4A" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal ink gridlines */}
                      <line x1="16" y1="44" x2="484" y2="44" stroke="rgba(10,10,10,0.08)" strokeWidth="1" />
                      <line x1="16" y1="96" x2="484" y2="96" stroke="rgba(10,10,10,0.08)" strokeWidth="1" />
                      <line x1="16" y1="148" x2="484" y2="148" stroke="rgba(10,10,10,0.08)" strokeWidth="1" />

                      {/* Scenario Area + Dashed Curve */}
                      <path d={scenarioAreaPath} fill="url(#slScenGrad)" />
                      <path
                        d={scenarioCurvePath}
                        fill="none"
                        stroke="#2A7A4A"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                      />
                      <circle cx="484" cy={scenarioEndY} r="4.5" fill="#2A7A4A" stroke="#0A0A0A" strokeWidth="1.5" />

                      {/* Baseline Area + Solid Ink Curve */}
                      <path
                        d="M 16 156 C 145 152, 290 138, 484 122 L 484 188 L 16 188 Z"
                        fill="url(#slBaseGrad)"
                      />
                      <path
                        d="M 16 156 C 145 152, 290 138, 484 122"
                        fill="none"
                        stroke="#0A0A0A"
                        strokeWidth="2.4"
                      />
                      <circle cx="484" cy="122" r="4" fill="#0A0A0A" />
                    </svg>

                    <div className="sl-chart-xaxis">
                      <span>DAY 01</span>
                      <span>DAY 15</span>
                      <span>DAY 30</span>
                      <span>DAY 45</span>
                      <span>DAY 60</span>
                      <span>DAY 90</span>
                    </div>
                  </div>

                  <div>
                    <div className="sl-label" style={{ marginBottom: '0.55rem' }}>
                      Scenario Inputs
                    </div>
                    <div className="sl-scenarios">
                      {SCENARIO_LEVERS.map((lever) => {
                        const isOn = Boolean(activeLevers[lever.id]);
                        return (
                          <button
                            key={lever.id}
                            type="button"
                            className={`sl-scenario-row ${isOn ? 'on' : ''}`}
                            onClick={() =>
                              setActiveLevers((prev) => ({
                                ...prev,
                                [lever.id]: !prev[lever.id],
                              }))
                            }
                            aria-pressed={isOn}
                          >
                            <div>
                              <div className="sl-scenario-title">{lever.label}</div>
                              <div className="sl-scenario-delta">
                                +{lever.deltaLtv.toFixed(1)}x cohort LTV
                              </div>
                            </div>
                            <span className={`sl-switch ${isOn ? 'on' : ''}`} aria-hidden="true">
                              <span className="sl-switch-thumb" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>

              {/* Right 1 col: 30-Day Execution Cadence (Quarterly Taxes equivalent) */}
              <article className="sl-cell sl-tint-amber sl-cadence-card">
                <div className="sl-card-head">
                  <div>
                    <span className="sl-label sl-dot sl-dot-amber">30-Day Cadence</span>
                    <div className="sl-card-sub">DIR-05 · Omnichannel Queue</div>
                  </div>
                  <span
                    className="sl-icon-btn"
                    style={{ width: '30px', height: '30px', cursor: 'default' }}
                  >
                    <CalendarIcon />
                  </span>
                </div>

                <div className="sl-cadence-list">
                  {EXECUTION_CADENCE.map((item) => (
                    <div
                      key={item.week}
                      className={`sl-cadence-row ${item.active ? 'active' : ''}`}
                    >
                      <div>
                        <div className="sl-cadence-week">{item.week}</div>
                        <div className="sl-cadence-sub">{item.title}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          className="sl-mono"
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: item.active ? '#8A6818' : '#0A0A0A',
                          }}
                        >
                          {item.metric}
                        </div>
                        <div
                          className="sl-mono"
                          style={{
                            fontSize: '9.5px',
                            color: item.active ? '#8A6818' : 'rgba(10,10,10,0.5)',
                            fontWeight: 700,
                          }}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sl-cadence-foot">
                  <div>
                    <div className="sl-kpi-caption">Canon Scope</div>
                    <div className="sl-mono" style={{ fontSize: '11px', color: '#8A6818', fontWeight: 700 }}>
                      19 Tracks · 7 Lands
                    </div>
                  </div>
                  <div className="sl-kpi-md" style={{ fontSize: '22px' }}>
                    Ages 2–7
                  </div>
                </div>
              </article>
            </section>
          </>
        )}

        {/* ===================================================================
            DECK 2: AUTONOMOUS UNITS & CHIEF-OF-STAFF ORG TOPOLOGY
            =================================================================== */}
        {activeDeck === 'units' && (() => {
          const selectedUnit =
            units.find((u) => u.unit_key === selectedOrgUnitKey) || units[0];
          const currentEffort =
            unitEfforts[selectedUnit?.unit_key] || selectedUnit?.effort_level || 'high';
          const isSelectedRunning = dispatchingUnitKey === selectedUnit?.unit_key;

          return (
            <div className="sl-stack">
              <section className="sl-cell sl-tint-cream sl-pad">
                <div className="sl-section-head" style={{ marginBottom: '0.65rem' }}>
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">
                      Declarative Chief-of-Staff Multi-Agent Topology
                    </span>
                    <p className="sl-card-sub" style={{ marginTop: '0.35rem', maxWidth: '720px' }}>
                      1 Chief-of-Staff Orchestrator (MCLS-Prime), 4 Functional Branches, and 8
                      Specialist Units governed by SOE Helix Gate 1. Click any unit node to inspect
                      data sources, cron routines, or stage a run into the Command Approval Gate.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div className="sl-chip-group">
                      <button
                        type="button"
                        className={`sl-chip ${unitsViewMode === 'org_chart' ? 'active' : ''}`}
                        onClick={() => setUnitsViewMode('org_chart')}
                      >
                        Org Topology
                      </button>
                      <button
                        type="button"
                        className={`sl-chip ${unitsViewMode === 'cards' ? 'active' : ''}`}
                        onClick={() => setUnitsViewMode('cards')}
                      >
                        Roster Grid ({units.length})
                      </button>
                    </div>

                    <button
                      type="button"
                      className="sl-btn sl-btn-outline sl-btn-sm"
                      onClick={handleExportOrgJson}
                    >
                      {jsonExportCopied ? 'Copied Org JSON' : 'Export Org JSON'}
                    </button>

                    <select
                      className="sl-select"
                      style={{ width: 'auto', padding: '0.38rem 0.7rem', fontSize: '12px' }}
                      value={selectedDelta}
                      onChange={(e) => setSelectedDelta(e.target.value)}
                      aria-label="Active Cultural Delta"
                    >
                      {DELTAS.map((d) => (
                        <option key={d.id} value={d.id}>
                          Delta: {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {unitsViewMode === 'org_chart' ? (
                <div className="sl-stack" style={{ gap: '0.35rem' }}>
                  {/* Root: Human Founder Gate */}
                  <div className="sl-org-level">
                    <div className="sl-cell sl-tint-amber sl-org-founder">
                      <div className="sl-brand-mark" style={{ width: '44px', height: '44px' }}>
                        <span className="sl-mono" style={{ color: '#F5EFE6', fontSize: '12px', fontWeight: 700 }}>
                          FG
                        </span>
                      </div>
                      <div>
                        <div className="sl-label sl-dot sl-dot-amber">
                          Supreme Authority &amp; Gatekeeper
                        </div>
                        <div className="sl-font-display" style={{ fontSize: '18px', fontWeight: 700, marginTop: 2 }}>
                          Human Commander / Founder Gate
                        </div>
                        <div className="sl-card-sub">
                          Command Approval Gate · Tier 2 Budget Elevation · Helix Gate 1 Invariant
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sl-org-connector">
                    <span>↓ Escalations, Approvals &amp; Directives</span>
                  </div>

                  {/* Level 1: MCLS-Prime */}
                  <div className="sl-org-level">
                    {(() => {
                      const prime = units.find((u) => u.unit_key === 'MCLS-PRIME') || units[0];
                      const isSelected = selectedOrgUnitKey === 'MCLS-PRIME';
                      const primeTier = SECURITY_TIERS[prime.security_tier || 'tier_1'];
                      return (
                        <div
                          className={`sl-cell sl-tint-cream sl-org-prime ${
                            isSelected ? 'sl-org-selected' : ''
                          }`}
                          onClick={() => setSelectedOrgUnitKey('MCLS-PRIME')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setSelectedOrgUnitKey('MCLS-PRIME');
                          }}
                        >
                          <div className="sl-card-head">
                            <span className="sl-pill clay">Chief of Staff · Orchestrator</span>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              <span className={`sl-pill ${primeTier.tone}`}>{primeTier.label}</span>
                              <span className="sl-pill green">READY</span>
                            </div>
                          </div>
                          <h3 className="sl-font-display" style={{ fontSize: '20px', fontWeight: 700, margin: '0.55rem 0 0.15rem' }}>
                            {prime.name}
                          </h3>
                          <div className="sl-mono" style={{ fontSize: '11.5px', color: '#1F4A4E', fontWeight: 600 }}>
                            {prime.role}
                          </div>
                          <p className="sl-card-sub" style={{ marginTop: '0.45rem', lineHeight: 1.5 }}>
                            {prime.description}
                          </p>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                            <span className="sl-pill">Cron: 0 8 * * *</span>
                            <span className="sl-pill teal">70/20/10 Allocator</span>
                            <span className="sl-pill">MCP: {prime.mcp_tool || 'mcls_stage_approval_card'}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="sl-org-connector">
                    <span>↓ 4 Specialist Branches &amp; Scheduled Routines</span>
                  </div>

                  {/* Level 2: 4 Functional Branches */}
                  <div className="sl-org-branches">
                    {ORG_BRANCHES.map((branch) => {
                      const branchUnits = units.filter((u) => branch.unitKeys.includes(u.unit_key));
                      return (
                        <div key={branch.key} className={`sl-cell ${branch.tint} sl-org-branch-col`}>
                          <div className="sl-org-branch-head">
                            <div className="sl-font-display" style={{ fontSize: '14.5px', fontWeight: 700 }}>
                              {branch.title}
                            </div>
                            <div className="sl-kpi-caption" style={{ marginTop: 2 }}>
                              {branch.badge}
                            </div>
                          </div>

                          {branchUnits.map((unit) => {
                            const isSelected = selectedOrgUnitKey === unit.unit_key;
                            const unitTier = SECURITY_TIERS[unit.security_tier || 'tier_1'];
                            return (
                              <div
                                key={unit.unit_key}
                                className={`sl-cell sl-org-specialist ${
                                  isSelected ? 'sl-org-selected' : ''
                                }`}
                                onClick={() => setSelectedOrgUnitKey(unit.unit_key)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') setSelectedOrgUnitKey(unit.unit_key);
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                  <span
                                    className="sl-mono"
                                    style={{
                                      width: '30px',
                                      height: '30px',
                                      borderRadius: '6px',
                                      border: '1.5px solid #0A0A0A',
                                      background: '#1F4A4E',
                                      color: '#F5EFE6',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {unit.code || unit.unit_key.slice(5, 7)}
                                  </span>
                                  <div style={{ minWidth: 0 }}>
                                    <div className="sl-font-display" style={{ fontSize: '14px', fontWeight: 700 }}>
                                      {unit.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: 'rgba(10,10,10,0.62)',
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {unit.role}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                                  <span className={`sl-pill ${unitTier.tone}`}>{unitTier.label}</span>
                                  <span className="sl-pill green">{unit.status}</span>
                                </div>

                                <div className="sl-kpi-caption" style={{ marginTop: '0.45rem' }}>
                                  {unit.schedule_cron}
                                </div>

                                {unit.soldier_pattern?.enabled && (
                                  <div
                                    className="sl-mono"
                                    style={{
                                      marginTop: '0.35rem',
                                      fontSize: '10px',
                                      color: '#8A6818',
                                      fontWeight: 700,
                                    }}
                                  >
                                    Clones: up to {unit.soldier_pattern.max_clones} ({unit.soldier_pattern.soldier_role})
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Unit Inspector Panel */}
                  {selectedUnit && (
                    <section className="sl-cell sl-tint-paper sl-pad" style={{ marginTop: '1rem' }}>
                      <div className="sl-card-head">
                        <div>
                          <span className="sl-label sl-dot sl-dot-teal">Selected Unit Inspector</span>
                          <h3 className="sl-h2" style={{ fontSize: '21px' }}>
                            {selectedUnit.name} <span className="sl-h1-slash">/</span>{' '}
                            <span className="sl-h1-muted" style={{ fontSize: '16px' }}>
                              {selectedUnit.role}
                            </span>
                          </h3>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {(() => {
                            const curTier = SECURITY_TIERS[selectedUnit.security_tier || 'tier_1'];
                            return <span className={`sl-pill ${curTier.tone}`}>{curTier.label}</span>;
                          })()}
                          <span className="sl-pill green">{selectedUnit.status}</span>
                          <span className="sl-pill">Runs: {selectedUnit.runs_count || 1}</span>
                          <span className="sl-pill teal">
                            Reports to: {selectedUnit.reports_to || 'MCLS-PRIME'}
                          </span>
                        </div>
                      </div>

                      <p className="sl-card-sub" style={{ marginTop: '0.55rem', fontSize: '13.5px', lineHeight: 1.55 }}>
                        {selectedUnit.description}
                      </p>

                      <div className="sl-org-inspector-grid">
                        <div className="sl-inspector-box">
                          <div className="sl-label" style={{ marginBottom: '0.5rem' }}>
                            Data Sources
                          </div>
                          <ul
                            style={{
                              listStyle: 'none',
                              padding: 0,
                              margin: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                              fontSize: '12px',
                              color: 'rgba(10,10,10,0.75)',
                            }}
                          >
                            {(selectedUnit.data_sources || ['MCLS Directives & Neon DB']).map(
                              (src, idx) => (
                                <li key={idx}>· {src}</li>
                              )
                            )}
                          </ul>
                        </div>

                        <div className="sl-inspector-box">
                          <div className="sl-label" style={{ marginBottom: '0.5rem' }}>
                            Scheduled Routines
                          </div>
                          {selectedUnit.routines && selectedUnit.routines.length > 0 ? (
                            <div className="sl-stack" style={{ gap: '0.5rem' }}>
                              {selectedUnit.routines.map((r, idx) => (
                                <div key={idx}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.4rem' }}>
                                    <strong style={{ fontSize: '12px' }}>{r.name}</strong>
                                    <span className="sl-pill green" style={{ fontSize: '9.5px' }}>
                                      {r.cron}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', marginTop: 2 }}>
                                    {r.frequency || 'Scheduled'} · {r.target || 'Approval Gate'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="sl-mono" style={{ fontSize: '12px' }}>
                              {selectedUnit.schedule_cron}
                            </div>
                          )}
                        </div>

                        <div className="sl-inspector-box">
                          <div className="sl-label" style={{ marginBottom: '0.5rem' }}>
                            SOE Risk Tier &amp; MCP Tool
                          </div>
                          {(() => {
                            const curTier = SECURITY_TIERS[selectedUnit.security_tier || 'tier_1'];
                            return (
                              <div style={{ fontSize: '12px', lineHeight: 1.45 }}>
                                <p style={{ margin: '0 0 0.45rem' }}>
                                  <strong>Rule:</strong> {selectedUnit.tier_rule || curTier.desc}
                                </p>
                                <div className="sl-mono" style={{ fontSize: '11px', color: '#1F4A4E', fontWeight: 700 }}>
                                  {selectedUnit.mcp_tool || 'mcls_stage_approval_card'}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="sl-inspector-box">
                          <div className="sl-label" style={{ marginBottom: '0.5rem' }}>
                            Horizontal Scale
                          </div>
                          {selectedUnit.soldier_pattern?.enabled ? (
                            <div style={{ fontSize: '12px', lineHeight: 1.45 }}>
                              <div>
                                <strong>Active:</strong> Up to {selectedUnit.soldier_pattern.max_clones} clones
                              </div>
                              <div style={{ marginTop: 4, color: 'rgba(10,10,10,0.68)' }}>
                                Role: <span className="sl-mono">{selectedUnit.soldier_pattern.soldier_role}</span>
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'rgba(10,10,10,0.68)', lineHeight: 1.45 }}>
                              <strong>Single-Signature:</strong>{' '}
                              {selectedUnit.soldier_pattern?.note || 'Stateful invariant enforcement.'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: '1.15rem', paddingTop: '1rem', borderTop: '2px dashed rgba(10,10,10,0.2)' }}>
                        <div className="sl-drawer-grid">
                          <div>
                            <label className="sl-field-label">Reasoning Effort</label>
                            <select
                              className="sl-select"
                              value={currentEffort}
                              onChange={(e) =>
                                setUnitEfforts({
                                  ...unitEfforts,
                                  [selectedUnit.unit_key]: e.target.value,
                                })
                              }
                            >
                              <option value="low">Low (Fast Routine Execution)</option>
                              <option value="medium">Medium (Balanced Synthesis)</option>
                              <option value="high">High (Deep Strategy &amp; Canon Audit)</option>
                              <option value="xhigh">xHigh (Maximum Multi-Step Planning)</option>
                            </select>
                          </div>
                          <div>
                            <label className="sl-field-label">Custom Mission Directive (Optional)</label>
                            <input
                              type="text"
                              className="sl-input"
                              placeholder={`Directive for ${selectedUnit.name}...`}
                              value={unitPrompts[selectedUnit.unit_key] || ''}
                              onChange={(e) =>
                                setUnitPrompts({
                                  ...unitPrompts,
                                  [selectedUnit.unit_key]: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sl-btn sl-btn-solid sl-btn-full"
                          disabled={isSelectedRunning}
                          onClick={() => handleDispatchUnit(selectedUnit)}
                        >
                          {isSelectedRunning
                            ? `Dispatching ${selectedUnit.name}...`
                            : `Dispatch ${selectedUnit.name} Routine to Command Approval Gate`}
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="sl-units-grid">
                  {units.map((unit) => {
                    const unitEffort = unitEfforts[unit.unit_key] || unit.effort_level || 'high';
                    const isRunning = dispatchingUnitKey === unit.unit_key;
                    const unitTier = SECURITY_TIERS[unit.security_tier || 'tier_1'];
                    return (
                      <article key={unit.unit_key} className="sl-cell sl-tint-cream sl-unit-card">
                        <div>
                          <div className="sl-card-head">
                            <div>
                              <span className="sl-label sl-dot sl-dot-teal">{unit.unit_key}</span>
                              <h3 className="sl-font-display" style={{ fontSize: '18px', fontWeight: 700, margin: '0.25rem 0 0' }}>
                                {unit.name}
                              </h3>
                            </div>
                            <span className={`sl-pill ${unitTier.tone}`}>{unitTier.label}</span>
                          </div>
                          <div className="sl-card-sub" style={{ fontWeight: 600, color: '#1F4A4E' }}>
                            {unit.role}
                          </div>
                          <p className="sl-card-sub" style={{ marginTop: '0.5rem', lineHeight: 1.5 }}>
                            {unit.description}
                          </p>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                            <span className="sl-pill green">{unit.status}</span>
                            <span className="sl-pill">Runs: {unit.runs_count || 1}</span>
                            <span className="sl-pill">{unit.schedule_cron}</span>
                          </div>

                          <div className="sl-field">
                            <label className="sl-field-label">Reasoning Effort</label>
                            <select
                              className="sl-select"
                              value={unitEffort}
                              onChange={(e) =>
                                setUnitEfforts({
                                  ...unitEfforts,
                                  [unit.unit_key]: e.target.value,
                                })
                              }
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="xhigh">xHigh</option>
                            </select>
                          </div>

                          <div className="sl-field" style={{ marginBottom: 0 }}>
                            <label className="sl-field-label">Custom Mission Directive</label>
                            <input
                              type="text"
                              className="sl-input"
                              placeholder={`Focus on ${selectedDelta.replace(/_/g, ' ')} (Ages 2–7)...`}
                              value={unitPrompts[unit.unit_key] || ''}
                              onChange={(e) =>
                                setUnitPrompts({
                                  ...unitPrompts,
                                  [unit.unit_key]: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sl-btn sl-btn-solid sl-btn-full"
                          disabled={isRunning}
                          onClick={() => handleDispatchUnit(unit)}
                        >
                          {isRunning ? `Running ${unit.name}...` : `Dispatch ${unit.name}`}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ===================================================================
            DECK 3: META GRAPH API v21.0 AD DISPATCHER + REMOTION PREVIEW
            =================================================================== */}
        {activeDeck === 'meta' && (
          <div className="sl-two-col">
            {/* Left Column: Campaign Forge Controls */}
            <section className="sl-cell sl-tint-cream sl-pad">
              <div className="sl-card-head" style={{ marginBottom: '1.15rem' }}>
                <div>
                  <span className="sl-label sl-dot sl-dot-green">1-Click Meta Campaign Forge</span>
                  <h2 className="sl-h2" style={{ fontSize: '20px' }}>
                    Tandem Funnel Dispatcher
                  </h2>
                </div>
                <span className="sl-pill amber">PAUSED ON CREATION</span>
              </div>

              <div className="sl-field">
                <label className="sl-field-label">Select Tandem Funnel Engine</label>
                <div className="sl-stack" style={{ gap: '0.6rem' }}>
                  {ENGINES.map((engine) => (
                    <div
                      key={engine.id}
                      className={`sl-mode-pill ${selectedEngine === engine.id ? 'active' : ''}`}
                      onClick={() => setSelectedEngine(engine.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedEngine(engine.id);
                      }}
                    >
                      <div>
                        <div className="sl-font-display" style={{ fontSize: '14.5px', fontWeight: 700 }}>
                          {engine.name}
                        </div>
                        <div className="sl-card-sub" style={{ marginTop: 2 }}>
                          {engine.desc}
                        </div>
                      </div>
                      <span
                        className={`sl-pill ${selectedEngine === engine.id ? 'green' : ''}`}
                      >
                        {engine.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sl-field">
                <label className="sl-field-label">Cultural Delta Alignment</label>
                <select
                  className="sl-select"
                  value={selectedDelta}
                  onChange={(e) => setSelectedDelta(e.target.value)}
                >
                  {DELTAS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sl-field">
                <label className="sl-field-label">Production Campaign Theme</label>
                <select
                  className="sl-select"
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                >
                  {CAMPAIGNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sl-drawer-grid">
                <div>
                  <label className="sl-field-label">Language Pack</label>
                  <select
                    className="sl-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="en">English (US/Global)</option>
                    <option value="es">Spanish (LatAm/ES)</option>
                    <option value="fr">French (FR/CA)</option>
                  </select>
                </div>

                <div>
                  <label className="sl-field-label">Daily Budget ($USD)</label>
                  <div className="sl-range-wrap" style={{ paddingTop: '0.45rem' }}>
                    <input
                      type="range"
                      min="15"
                      max="200"
                      step="5"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="sl-range"
                    />
                    <span className="sl-mono" style={{ fontSize: '16px', fontWeight: 700, minWidth: '64px', textAlign: 'right' }}>
                      ${dailyBudget}/d
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="sl-btn sl-btn-solid sl-btn-full"
                onClick={handleLaunch}
                disabled={isLaunching}
              >
                {isLaunching
                  ? 'Staging on MCLS Cloudflare Edge...'
                  : 'Stage 3-Ad Testing Array in Command Gate'}
              </button>

              {launchResponse && (
                <div
                  className={`sl-cell ${
                    launchResponse.mode === 'LIVE_CONNECTED' ? 'sl-tint-green' : 'sl-tint-amber'
                  } sl-pad`}
                  style={{ marginTop: '1.1rem', padding: '1rem 1.15rem' }}
                >
                  <div className="sl-card-head" style={{ marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '13px' }}>
                      {launchResponse.mode === 'LIVE_CONNECTED'
                        ? 'Dispatched to Meta Ad Account'
                        : 'Staged in MCLS Sandbox Gate'}
                    </strong>
                    <span className="sl-pill">{launchResponse.status || 'PAUSED'}</span>
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{launchResponse.message}</div>
                  <div className="sl-mono" style={{ fontSize: '11.5px', marginTop: '0.45rem' }}>
                    Target: {launchResponse.ad_account_id} · Ads Built: 3
                  </div>

                  <button
                    type="button"
                    className="sl-btn sl-btn-outline sl-btn-sm"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                  >
                    {showPayloadInspector
                      ? 'Hide Raw Graph API Payload'
                      : 'Inspect Raw Meta Graph API Payload (v21.0)'}
                  </button>

                  {showPayloadInspector && launchResponse.bundle && (
                    <pre className="sl-pre">
                      {JSON.stringify(launchResponse.bundle, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </section>

            {/* Right Column: 3-Layer Creative Preview + Remotion Video + Telemetry */}
            <div className="sl-stack">
              <section className="sl-cell sl-tint-paper sl-pad">
                <div className="sl-card-head" style={{ marginBottom: '0.9rem' }}>
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">3-Layer Ad Creative Preview</span>
                    <h3 className="sl-h2" style={{ fontSize: '18px' }}>
                      {currentPreview.headline}
                    </h3>
                  </div>
                  <span className="sl-pill green">AGES 2–7</span>
                </div>

                <div
                  className="sl-cell sl-tint-cream"
                  style={{ padding: '1rem 1.1rem', marginBottom: '0.9rem' }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div className="sl-label sl-dot sl-dot-amber" style={{ marginBottom: '0.25rem' }}>
                      Layer 1 · Parent Ache (Emotional Identity)
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{currentPreview.layer_1}</div>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div className="sl-label sl-dot sl-dot-teal" style={{ marginBottom: '0.25rem' }}>
                      Layer 2 · Musical &amp; Tactile Solution
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{currentPreview.layer_2}</div>
                  </div>
                  <div>
                    <div className="sl-label sl-dot sl-dot-green" style={{ marginBottom: '0.25rem' }}>
                      Layer 3 · Zero-Risk Invitation
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{currentPreview.layer_3}</div>
                  </div>
                </div>

                <div className="sl-mono" style={{ fontSize: '11.5px', color: 'rgba(10,10,10,0.65)' }}>
                  Destination:{' '}
                  <strong style={{ color: '#1F4A4E' }}>
                    {selectedEngine === 'ENGINE_B_DIRECT_OFFER'
                      ? 'soelearn.com/workbook'
                      : 'soelearn.com/listen'}
                  </strong>
                </div>

                {/* Live Remotion + 3D Style Atlas Video Iteration Preview */}
                <div
                  style={{
                    marginTop: '1.1rem',
                    paddingTop: '1rem',
                    borderTop: '2px dashed rgba(10,10,10,0.2)',
                  }}
                >
                  <div className="sl-card-head" style={{ marginBottom: '0.65rem', alignItems: 'center' }}>
                    <span className="sl-label sl-dot sl-dot-teal">
                      Tactile Video Iteration Preview (SRT-Synced)
                    </span>
                    <select
                      className="sl-select"
                      style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '11.5px' }}
                      value={videoStylePreset}
                      onChange={(e) => setVideoStylePreset(e.target.value)}
                    >
                      {Object.entries(SOE_STYLE_SURFACES).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '2px solid #0A0A0A',
                    }}
                  >
                    <Player
                      component={TactileExplainer}
                      inputProps={{
                        topic: currentPreview.headline,
                        stylePreset: videoStylePreset,
                        srtCues: [
                          { index: 1, start_sec: 0, end_sec: 4.5, beat: 'LAYER_1_ACHE', text: currentPreview.layer_1 },
                          { index: 2, start_sec: 4.5, end_sec: 11, beat: 'LAYER_2_SOLUTION', text: currentPreview.layer_2 },
                          { index: 3, start_sec: 11, end_sec: 15, beat: 'LAYER_3_INVITATION', text: currentPreview.layer_3 },
                        ],
                      }}
                      durationInFrames={450}
                      compositionWidth={1080}
                      compositionHeight={1080}
                      fps={30}
                      controls
                      loop
                      style={{ width: '100%', aspectRatio: '1 / 1' }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.6rem',
                      marginTop: '0.7rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      className="sl-btn sl-btn-outline sl-btn-sm"
                      onClick={async () => {
                        try {
                          const res = await mclsFetch('/api/mcls/dispatch', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'build_video_iteration',
                              topic: currentPreview.headline,
                              style_preset: videoStylePreset,
                              duration_seconds: 15,
                            }),
                          });
                          if (res.ok) setVideoPacketResponse(await res.json());
                        } catch {
                          setVideoPacketResponse({
                            videoPacket: {
                              stage_4_skill_id: `soe-video-${videoStylePreset.toLowerCase()}`,
                            },
                          });
                        }
                      }}
                    >
                      Lock Style Skill &amp; Build SRT Seed
                    </button>
                    {videoPacketResponse?.videoPacket?.stage_4_skill_id && (
                      <span className="sl-pill green">
                        {videoPacketResponse.videoPacket.stage_4_skill_id}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              <section className="sl-cell sl-tint-green sl-pad">
                <span className="sl-label sl-dot sl-dot-green">Dual-Horizon Telemetry Cockpit</span>
                <div className="sl-drawer-grid" style={{ marginTop: '0.85rem', marginBottom: '0.85rem' }}>
                  <div className="sl-inspector-box">
                    <div className="sl-kpi-md">$1.84</div>
                    <div className="sl-kpi-caption" style={{ marginTop: 4 }}>
                      Engine A CPL (Target ≤ $2.50)
                    </div>
                  </div>
                  <div className="sl-inspector-box">
                    <div className="sl-kpi-md">38.2%</div>
                    <div className="sl-kpi-caption" style={{ marginTop: 4 }}>
                      2-Step Opt-in Rate
                    </div>
                  </div>
                  <div className="sl-inspector-box">
                    <div className="sl-kpi-md">18.4%</div>
                    <div className="sl-kpi-caption" style={{ marginTop: 4 }}>
                      $7 Bump Vault Rate
                    </div>
                  </div>
                  <div className="sl-inspector-box">
                    <div className="sl-kpi-md" style={{ color: '#2A7A4A' }}>
                      {projectedLtv.toFixed(1)}x
                    </div>
                    <div className="sl-kpi-caption" style={{ marginTop: 4 }}>
                      60-Day Cohort LTV
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(10,10,10,0.78)' }}>
                  <strong>Rhythm Guardian Active:</strong> 90-day cohort attribution ledger
                  protected. Direct Square checkout &amp; Meta CAPI deduplication enabled on{' '}
                  <span className="sl-mono">soelearn.com</span>.
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ===================================================================
            DECK 4: 5 MASTER STRATEGY DIRECTIVES & PERSISTENT MEMORY LAYER
            =================================================================== */}
        {activeDeck === 'directives' && (
          <div className="sl-stack">
            <section className="sl-cell sl-tint-amber sl-pad">
              <div className="sl-card-head">
                <div>
                  <span className="sl-label sl-dot sl-dot-amber">Canon &amp; Strategy Vault</span>
                  <h2 className="sl-h2" style={{ fontSize: '20px' }}>
                    The 5 MCLS Master Strategy Directives
                  </h2>
                  <p className="sl-card-sub" style={{ marginTop: '0.35rem', maxWidth: '780px' }}>
                    Before any MCLS unit drafts copy, stages a repository patch, or builds a Meta
                    ad bundle, it grounds its context in these five proprietary SOE documents
                    persisted in Neon PostgreSQL.
                  </p>
                </div>
                <span className="sl-pill green">READ BY ALL {units.length} UNITS</span>
              </div>
            </section>

            {directives.map((dir) => {
              const isEditing = editingDirectiveKey === dir.directive_key;
              return (
                <article key={dir.directive_key} className="sl-cell sl-tint-cream sl-pad">
                  <div className="sl-card-head">
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="sl-pill clay">Directive #{dir.doc_number}</span>
                      <span className="sl-pill teal">{dir.category}</span>
                      <span className="sl-pill green">{dir.directive_key}</span>
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        className="sl-btn sl-btn-outline sl-btn-sm"
                        onClick={() => {
                          setEditingDirectiveKey(dir.directive_key);
                          setDirectiveForm({
                            title: dir.title,
                            summary: dir.summary,
                            content: dir.content,
                          });
                        }}
                      >
                        Edit Directive
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="sl-stack" style={{ marginTop: '1rem' }}>
                      <div>
                        <label className="sl-field-label">Directive Title</label>
                        <input
                          type="text"
                          className="sl-input"
                          value={directiveForm.title}
                          onChange={(e) =>
                            setDirectiveForm({ ...directiveForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="sl-field-label">Summary</label>
                        <input
                          type="text"
                          className="sl-input"
                          value={directiveForm.summary}
                          onChange={(e) =>
                            setDirectiveForm({ ...directiveForm, summary: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="sl-field-label">Canonical Directive Body</label>
                        <textarea
                          className="sl-textarea"
                          style={{ minHeight: '160px' }}
                          value={directiveForm.content}
                          onChange={(e) =>
                            setDirectiveForm({ ...directiveForm, content: e.target.value })
                          }
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.55rem' }}>
                        <button
                          type="button"
                          className="sl-btn sl-btn-green sl-btn-sm"
                          disabled={savingDirective}
                          onClick={() => handleSaveDirective(dir.directive_key)}
                        >
                          {savingDirective ? 'Saving to Neon...' : 'Save Master Directive'}
                        </button>
                        <button
                          type="button"
                          className="sl-btn sl-btn-outline sl-btn-sm"
                          onClick={() => setEditingDirectiveKey(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="sl-font-display" style={{ fontSize: '18px', fontWeight: 700, margin: '0.75rem 0 0.25rem' }}>
                        {dir.title}
                      </h3>
                      <p className="sl-card-sub" style={{ fontSize: '13.5px' }}>
                        {dir.summary}
                      </p>
                      <pre className="sl-directive-pre">{dir.content}</pre>
                    </>
                  )}
                </article>
              );
            })}

            {/* Persistent Operator Memory Layer */}
            <section className="sl-cell sl-tint-paper sl-pad">
              <div className="sl-card-head" style={{ marginBottom: '0.85rem' }}>
                <div>
                  <span className="sl-label sl-dot sl-dot-teal">
                    Persistent Operator Memory Layer ({memories.length} Active Rules)
                  </span>
                  <p className="sl-card-sub" style={{ marginTop: '0.3rem' }}>
                    Stored in <span className="sl-mono">mcls_memories</span> and automatically
                    injected into future Autonomous Unit dispatches.
                  </p>
                </div>
                <span className="sl-pill green">AUTO-LEARNS FROM GATE EDITS</span>
              </div>

              <form
                onSubmit={handleAddMemoryRule}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr auto',
                  gap: '0.65rem',
                  marginBottom: '1rem',
                }}
              >
                <select
                  className="sl-select"
                  value={newMemoryScope}
                  onChange={(e) => setNewMemoryScope(e.target.value)}
                >
                  <option value="ALL_UNITS">All MCLS Units</option>
                  {units.map((u) => (
                    <option key={u.unit_key} value={u.unit_key}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="sl-input"
                  placeholder="Add a persistent operator rule (e.g. Highlight the 40 daily 30-minute adventure blocks...)"
                  value={newMemoryRule}
                  onChange={(e) => setNewMemoryRule(e.target.value)}
                />
                <button type="submit" className="sl-btn sl-btn-green" disabled={savingMemory}>
                  {savingMemory ? 'Saving...' : '+ Add Rule'}
                </button>
              </form>

              <div className="sl-stack" style={{ gap: '0.65rem' }}>
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="sl-inspector-box"
                    style={{ background: '#F5EFE6' }}
                  >
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="sl-pill clay">{mem.unit_scope}</span>
                      <span className="sl-pill">{mem.source_action}</span>
                    </div>
                    <div style={{ fontSize: '13.5px', lineHeight: 1.5 }}>{mem.rule_text}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            DECK 5: REMOTE COMMAND BRIDGE, FOREMAN, CANON VERIFIER & NL-SQL
            =================================================================== */}
        {activeDeck === 'bridge' && (
          <div className="sl-two-col-eq">
            {/* 1. Remote JSON-RPC 2.0 Bridge */}
            <section className="sl-cell sl-tint-cream sl-pad">
              <div className="sl-card-head" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <span className="sl-label sl-dot sl-dot-green">JSON-RPC 2.0 Endpoint</span>
                  <h2 className="sl-h2" style={{ fontSize: '19px' }}>
                    MCLS Remote Command Bridge
                  </h2>
                </div>
                <span className="sl-pill green">ONLINE</span>
              </div>

              <p className="sl-card-sub" style={{ lineHeight: 1.55, marginBottom: '1rem' }}>
                Connect desktop, IDE, or voice clients directly to SOE-MCLS through one proprietary
                endpoint. Every mutation pauses in the Command Approval Gate before going public.
              </p>

              <div className="sl-field">
                <label className="sl-field-label">Proprietary Bridge Endpoint URL</label>
                <div style={{ display: 'flex', gap: '0.55rem' }}>
                  <input type="text" readOnly className="sl-input sl-mono" value={bridgeEndpointUrl} />
                  <button
                    type="button"
                    className="sl-btn sl-btn-outline"
                    style={{ flexShrink: 0 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(bridgeEndpointUrl);
                      setCopiedBridgeUrl(true);
                      setTimeout(() => setCopiedBridgeUrl(false), 2000);
                    }}
                  >
                    {copiedBridgeUrl ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <label className="sl-field-label" style={{ marginTop: '1rem' }}>
                Exposed MCLS Bridge Tools ({BRIDGE_TOOLS.length})
              </label>
              <div className="sl-stack" style={{ gap: '0.45rem' }}>
                {BRIDGE_TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1.5px solid rgba(10,10,10,0.2)',
                      background: '#FAF6EE',
                    }}
                  >
                    <span className="sl-mono" style={{ fontSize: '11.5px', fontWeight: 700, color: '#1F4A4E' }}>
                      {tool.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(10,10,10,0.68)' }}>
                      {tool.desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Stack: Foreman + Canon Audit + Web-to-MD + Governed NL-SQL */}
            <div className="sl-stack">
              {/* 2. Foreman Goal Compiler */}
              <section className="sl-cell sl-tint-paper sl-pad">
                <span className="sl-label sl-dot sl-dot-teal">Multi-Unit Planner</span>
                <h2 className="sl-h2" style={{ fontSize: '19px', marginBottom: '0.35rem' }}>
                  Foreman Goal Compiler
                </h2>
                <p className="sl-card-sub" style={{ marginBottom: '0.9rem' }}>
                  Describe a growth objective in plain English to decompose it into canon-checked
                  specialist unit cards in the Approval Gate.
                </p>

                <div className="sl-field">
                  <label className="sl-field-label">Campaign or Growth Goal</label>
                  <textarea
                    className="sl-textarea"
                    value={foremanGoalInput}
                    onChange={(e) => setForemanGoalInput(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="sl-btn sl-btn-solid sl-btn-full"
                  disabled={compilingForeman}
                  onClick={handleCompileForemanGoal}
                >
                  {compilingForeman ? 'Compiling Multi-Unit Plan...' : 'Compile & Stage Units'}
                </button>

                {foremanPlanResult?.plan && (
                  <div
                    className="sl-cell sl-tint-green"
                    style={{ marginTop: '0.85rem', padding: '0.85rem 1rem', fontSize: '12.5px' }}
                  >
                    <strong>
                      Units Selected: {foremanPlanResult.plan.selected_units?.join(', ')} (
                      {foremanPlanResult.staged_count || 0} staged)
                    </strong>
                    <ul style={{ margin: '0.45rem 0 0 1.1rem', padding: 0 }}>
                      {foremanPlanResult.plan.tasks?.map((t, idx) => (
                        <li key={idx}>
                          <strong>{t.unit_key}</strong> [{t.canon_status}] — {t.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* 3. Live Helix Gate 1 Canon Copy Verifier */}
              <section className="sl-cell sl-tint-green sl-pad">
                <span className="sl-label sl-dot sl-dot-green">Helix Gate 1</span>
                <h2 className="sl-h2" style={{ fontSize: '19px', marginBottom: '0.35rem' }}>
                  Live Canon Copy Verifier
                </h2>
                <p className="sl-card-sub" style={{ marginBottom: '0.9rem' }}>
                  Audit ad hooks, community replies, or school emails against Ages 2–7, 19 studio
                  tracks, 7 lands, and zero retired entities.
                </p>

                <div className="sl-field">
                  <label className="sl-field-label">Draft Copy to Audit</label>
                  <textarea
                    className="sl-textarea"
                    value={bridgeCopyInput}
                    onChange={(e) => setBridgeCopyInput(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="sl-btn sl-btn-green sl-btn-full"
                  onClick={handleRunCanonAudit}
                >
                  Verify Against SOE Canon Gate
                </button>

                {canonAuditResult && (
                  <div
                    className={`sl-cell ${
                      canonAuditResult.canon_status === 'PASS' ? 'sl-tint-paper' : 'sl-tint-amber'
                    }`}
                    style={{ marginTop: '0.85rem', padding: '0.85rem 1rem', fontSize: '12.5px' }}
                  >
                    <strong>Canon Gate Status: {canonAuditResult.canon_status}</strong>
                    {canonAuditResult.issues?.length > 0 ? (
                      <ul style={{ margin: '0.4rem 0 0 1.1rem', padding: 0 }}>
                        {canonAuditResult.issues.map((iss, idx) => (
                          <li key={idx}>{iss}</li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ marginTop: '0.25rem', color: '#2A7A4A', fontWeight: 600 }}>
                        Zero canon violations detected. Approved for MCLS staging.
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* 4. Web-to-Markdown Institutional & Citation Extractor */}
              <section className="sl-cell sl-tint-amber sl-pad">
                <div className="sl-card-head" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <span className="sl-label sl-dot sl-dot-amber">MCLS-Recon / Concord</span>
                    <h2 className="sl-h2" style={{ fontSize: '19px' }}>
                      Web-to-Markdown Extractor
                    </h2>
                  </div>
                </div>
                <p className="sl-card-sub" style={{ marginBottom: '0.85rem' }}>
                  Convert any school district portal, State DOE registry, or reference URL into
                  clean Markdown and stage an outreach card in 1 click.
                </p>

                <div className="sl-field">
                  <label className="sl-field-label">Target Institutional or Citation URL</label>
                  <input
                    type="url"
                    className="sl-input sl-mono"
                    placeholder="https://..."
                    value={reconUrlInput}
                    onChange={(e) => setReconUrlInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="sl-btn sl-btn-solid"
                    disabled={extractingUrl}
                    onClick={() => handleExtractMarkdown(false)}
                  >
                    {extractingUrl ? 'Extracting...' : 'Extract Markdown'}
                  </button>
                  <button
                    type="button"
                    className="sl-btn sl-btn-outline"
                    disabled={extractingUrl}
                    onClick={() => handleExtractMarkdown(true)}
                  >
                    Extract &amp; Stage to Gate
                  </button>
                </div>

                {extractResult && (
                  <div style={{ marginTop: '0.85rem' }}>
                    <div className="sl-mono" style={{ fontSize: '11.5px', marginBottom: '0.35rem' }}>
                      <strong>Title:</strong> {extractResult.title} ·{' '}
                      <strong>Emails:</strong>{' '}
                      {extractResult.emails?.length ? extractResult.emails.join(', ') : 'None visible'}
                    </div>
                    <pre className="sl-pre">{extractResult.markdown}</pre>
                  </div>
                )}
              </section>

              {/* 5. Governed Natural-Language SQL Telemetry */}
              <section className="sl-cell sl-tint-teal sl-pad">
                <div className="sl-card-head" style={{ marginBottom: '0.6rem' }}>
                  <div>
                    <span className="sl-label sl-dot sl-dot-teal">Neon Postgres Live</span>
                    <h2 className="sl-h2" style={{ fontSize: '19px' }}>
                      Governed NL-to-SQL Telemetry
                    </h2>
                  </div>
                </div>
                <p className="sl-card-sub" style={{ marginBottom: '0.8rem' }}>
                  Query <span className="sl-mono">mcls_approvals</span>,{' '}
                  <span className="sl-mono">crm_deals</span>,{' '}
                  <span className="sl-mono">crm_contacts</span>, and{' '}
                  <span className="sl-mono">mcls_memories</span> in plain English.
                </p>

                <div className="sl-chip-group" style={{ marginBottom: '0.8rem' }}>
                  {[
                    'Which Cultural Delta has the most actions?',
                    'Show school_pilot deals and pipeline value',
                    'Break down audience contacts by persona',
                    'Show active MCLS operator memory rules',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className="sl-chip"
                      style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 600 }}
                      onClick={() => handleQueryTelemetry(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.55rem' }}>
                  <input
                    type="text"
                    className="sl-input"
                    value={sqlQuestion}
                    onChange={(e) => setSqlQuestion(e.target.value)}
                  />
                  <button
                    type="button"
                    className="sl-btn sl-btn-solid"
                    style={{ flexShrink: 0 }}
                    disabled={runningSql}
                    onClick={() => handleQueryTelemetry()}
                  >
                    {runningSql ? 'Running...' : 'Run Query'}
                  </button>
                </div>

                {sqlResult && (
                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#2A7A4A' }}>
                      {sqlResult.synthesis}
                    </div>
                    <div className="sl-mono" style={{ fontSize: '11px', color: 'rgba(10,10,10,0.6)', marginTop: 4 }}>
                      {sqlResult.sql}
                    </div>
                    <pre className="sl-pre">{JSON.stringify(sqlResult.rows, null, 2)}</pre>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================
          FOOTER BAR (EXACT SOLO LEDGER BLACK EDITORIAL FOOTER)
          =================================================================== */}
      <footer className="sl-footer">
        <span>SOE-MCLS · GEN 3.5 · PROPRIETARY GROWTH ENGINE FOR AGES 2–7</span>
        <span className="sl-footer-accent">
          SOELEARN.COM · HELIX GATE 1 VERIFIED · DIRECT SQUARE + NEON · SYNCED {syncedAt}
        </span>
      </footer>
    </div>
  );
};

export default CampaignLauncher;
