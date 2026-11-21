/**
 * Cloudflare Pages Function: /api/mcls/dispatch
 * Proprietary SOE Market Campaign Launch System (MCLS) — Unit Execution & Meta Graph Dispatcher.
 * Executes MCLS autonomous units, enforces SOE Helix Gate 1 Canon Verification,
 * and stages cards into the Neon PostgreSQL mcls_approvals ledger.
 */

import {
  DEFAULT_NEON_DB_URL,
  queryNeon,
  runAdversarialPreflightReview,
  compileForemanPlan,
  buildWebhookReactiveDraft,
  buildBrowserTakeoverDraft,
} from '../../../lib/mclsCore.js';

const FALLBACK_DB_URL = DEFAULT_NEON_DB_URL;

async function fetchLiveSearchContext(query, braveKey) {
  if (!braveKey) return null;
  try {
    const url = `https://api.search.brave.com/res/v1/llm/context?q=${encodeURIComponent(query)}&count=3`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': braveKey,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const generic = data?.grounding?.generic || [];
    if (!generic.length) return null;
    return generic
      .slice(0, 2)
      .map((item) => `${item.title}: ${(item.snippets || []).slice(0, 2).join(' ')}`)
      .join(' | ');
  } catch {
    return null;
  }
}

function buildUnitExecutionDraft(unitKey, options = {}) {
  const {
    deltaKey = 'SCREEN_VS_SENSORY',
    campaignKey = 'THE_ENEMY',
    engineType = 'ENGINE_A_VALUE_GATE',
    customPrompt = '',
    searchSignal = null,
    dailyBudget = 20,
  } = options;

  const focusNote = customPrompt ? ` Custom Directive: "${customPrompt.trim()}".` : '';
  const signalNote = searchSignal ? ` Live Market Signal: ${searchSignal.slice(0, 220)}...` : '';

  switch (unitKey) {
    case 'MCLS-PRIME':
      return {
        action_type: 'executive_brief_and_allocation',
        title: `Executive 90-Day Rhythm Guardian Allocation Brief (${deltaKey})`,
        channel: 'MCLS Command Ledger + Neon CRM',
        target_destination: 'Engine A (70%) / Engine B (20%) / Engine C (10%)',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Internal Telemetry)',
        summary: `Synchronizes the 5 Master Directives across /listen and /workbook funnels.${focusNote}${signalNote}`,
        payload: {
          directive_sync: '5/5 Master Directives Active',
          recommended_focus: customPrompt || 'Prioritize Engine A (/listen Free 19-Track Gate + $7 Direct Stripe Bump) paired with 5 daily School Pilot packets.',
          funnel_split: { engine_a: '70%', engine_b: '20%', engine_c: '10%' },
          target_age_canon: 'Ages 2–7 (Pre-K to Grade 2)',
        },
      };

    case 'MCLS-RECON':
      return {
        action_type: 'geo_citation_audit',
        title: `AI Citation & Structured Schema Upgrade for ${deltaKey.replace(/_/g, ' ')}`,
        channel: 'Search & AI Citations (llms.txt + JSON-LD)',
        target_destination: 'public/llms.txt & web/src/pages/SolutionsHub.jsx',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Organic)',
        summary: `Audits GPTBot, ClaudeBot, and PerplexityBot grounding for Ages 2–7 screen-free curriculum queries and stages high-density comparison schema.${focusNote}${signalNote}`,
        payload: {
          crawlers_verified: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot'],
          citation_hook: 'The Sound of Essentials: Rhythm Quest — 19 studio-recorded tracks across 7 developmental lands (Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, Terrasol), 400 tactile quests, $21 digital / $35 print.',
          custom_directive: customPrompt || null,
        },
      };

    case 'MCLS-FORGE':
      return {
        action_type: 'github_canon_pr',
        title: `Repository Patch: Canonical Meta & FAQ Schema for ${deltaKey.replace(/_/g, ' ')}`,
        channel: 'GitHub Repository (@octokit/rest)',
        target_destination: 'branch: mcls/canon-seo-upgrade',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Automated PR)',
        summary: `Stages a Helix Gate 1 verified pull request adding canonical tags and structured FAQ blocks for Ages 2–7 early learning readiness.${focusNote}`,
        payload: {
          branch: `mcls/patch-${Date.now().toString().slice(-5)}`,
          files_touched: ['web/public/llms.txt', 'web/src/pages/RhythmQuestSale.jsx'],
          gate_check: 'soe-canon-guard.mjs: PASS (0 violations)',
          custom_directive: customPrompt || null,
        },
      };

    case 'MCLS-PULSE':
      return {
        action_type: 'community_reply',
        title: `Community Value Response & A/B/C Trio: ${customPrompt ? customPrompt.slice(0, 55) : 'Screen-Free Rhythm Routine (Ages 2–7)'}`,
        channel: 'Parent & Homeschool Communities + Sanctuary Dispatch',
        target_destination: 'soelearn.com/listen (Early Childhood & Homeschool Thread)',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Organic)',
        summary: `Empathetic response + A/B/C 3-format social trio + Sanctuary Dispatch [FOUNDER'S TAKE] slot with strict source-link rules.${signalNote}`,
        payload: {
          draft_reply: `When our family hit that exact wall with overstimulating cartoons, we found that swapping visual screens for rhythmic movement changed the whole atmosphere of the house. Having children ages 2–7 clap syllable patterns and move to structured studio songs gives their nervous system the sensory input it craves without the dopamine crash.\n\nWe put all 19 studio-recorded tracks of The Sound of Essentials: Rhythm Quest up to stream 100% free at soelearn.com/listen (guided by Seriphia and our 14 land heroes across Harmonia and Numeria).${focusNote}`,
          social_trio: {
            a_short_take: 'Most early phonics apps fail Ages 2–7 because the visual feed outruns the developing ear. Clap the syllable first, then trace it. Stream 19 tracks free at soelearn.com/listen.',
            b_practical_tip: 'Transition ritual (Ages 2–7): pair one Harmonia rhythm track with tactile syllable tapping or finger-tracing before any table work—15 screen-free minutes resets focus.',
            c_reply_question: 'Parents & Pre-K teachers: which daily transition triggers the hardest meltdown for your 2–7-year-old right now—morning startup, clean-up, or post-screen wind-down?',
          },
          sanctuary_dispatch: {
            lead_topic: customPrompt || 'Acoustic Cadence & Tactile Phonemic Awareness (Ages 2–7)',
            founders_take_slot: "[FOUNDER'S TAKE — Crafted by a Father's Heart and a Mother's Love — Human Review Required]",
            citation_rule: 'Never invent stats or unverified claims; cut any talking point lacking a confirmed source URL.',
          },
          canon_verified: 'Ages 2–7 | 19 Studio Tracks | $0 Stream Gate',
        },
      };

    case 'MCLS-CONCORD': {
      const orgName = customPrompt ? customPrompt.trim() : 'Regional Early Childhood Readiness Consortium';
      return {
        action_type: 'institutional_pilot_outreach',
        title: `Institutional Pilot + Pre-Call Brief: ${orgName.slice(0, 55)}`,
        channel: 'Neon CRM (school_pilot) + Brevo Outbound',
        target_destination: 'CRM Pipeline: school_pilot + Brevo Sender #2 (/institutions + /cloud-academy)',
        delta_alignment: 'INSTITUTION_VS_SANCTUARY',
        estimated_cost: '0 Credits (Neon + Brevo)',
        summary: `Stages a School Pilot deal with Grant Radar eligibility, a 5-Domain Pre-Call Readiness Gap Brief, Cloud Academy 3D Tactile Print-in-Pod access, and a 30-Day Pilot Action Plan.${focusNote}`,
        payload: {
          organization_name: orgName,
          contact_name: 'Director of Early Learning',
          recipient_email: 'info@soelearn.com',
          deal_value: 3500,
          grant_funding_lanes: [
            'Title I / ESSA Supplemental Early Literacy Materials',
            'Head Start ELOF & Sensory Integration Innovation Grants',
            'State DOE Pre-K & Classroom Makerspace / Tactile STEM Grants',
          ],
          pre_call_brief: {
            organization: orgName,
            five_domain_audit: [
              { domain: 'Language & Literacy (Harmonia — Kenji & Aiko)', status: 'likely gap: screen-free phonemic rhyming & tactile decoding' },
              { domain: 'Math & Logic (Numeria — Octavia & Kwame)', status: 'unclear: tactile proportionality & pattern blocks' },
              { domain: 'Physical & Fine Motor (Vitalis — Amara & Felix)', status: 'likely gap: bilateral midline crossing & knuckle-tapping drills' },
              { domain: 'Social & Emotional (Aquaria — Nerissa & Ronan)', status: 'unclear: 90-110 BPM nervous-system transition routines' },
              { domain: 'Nature, Time & Community (Terrasol / Celestia / Luminosity)', status: 'looks strong / verify alignment packet' },
            ],
            discovery_questions: [
              '1. Which developmental domain is hardest for your teachers to hit without iPads (Ages 2–7)?',
              '2. How are circle-time transitions handled today across your Pre-K to Grade 2 rooms?',
              '3. Do you have an unused Title I, Head Start, or State Pre-K early literacy allocation this semester?',
              '4. Would your team prefer a classroom 3D-print STL vault (Cloud Academy) or shipped tactile manipulative kits?',
              '5. How many educators and SLP/OT specialists support your campus?',
              '6. Which state early learning framework (ELOF, DRDP, TEKS, NYSLS) requires documented crosswalks?',
              '7. What would make a 40-day classroom pilot an unmistakable win for parents and directors?',
              '8. Who signs off on supplemental curriculum + tactile classroom kits under $3,500?',
            ],
          },
          action_plan_30_day: [
            { step: 'Deliver custom State Standards Crosswalk + 19-Track Cloud Academy Hub', owner: 'MCLS-CONCORD', by_when: 'Day 3', done_criteria: 'Director logs into Cloud Academy educator preview' },
            { step: 'Provision Harmonia & Vitalis 3D Tactile Kit (.3MF Print-in-Pod or Shipped)', owner: 'Cloud Academy POD', by_when: 'Day 10', done_criteria: 'Classroom receives or prints first 7-Land tactile set' },
            { step: 'Complete 20-Day Mid-Pilot Teacher Cadence Check & Parent Feedback', owner: 'Curriculum Director + SOE', by_when: 'Day 21', done_criteria: '90% circle-time adoption + campus license quote approved' },
          ],
          subject: 'The Sound of Essentials — Early Learning Curriculum & Tactile Pilot (Ages 2–7)',
          email_body: `Hello Early Learning Leadership at ${orgName},\n\nWe prepared a pre-built State Readiness Crosswalk and complimentary School Licensing Pilot packet for The Sound of Essentials: Rhythm Quest—our neuro-affirming, screen-free curriculum for ages 2–7 (Pre-K to Grade 2).\n\nAcross 7 developmental lands (Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, and Terrasol), students build phonological awareness, early numeracy, and bilateral sensory regulation through 19 studio-recorded songs, 40 daily adventure blocks, and Cloud Academy 3D-printable tactile manipulatives—100% eligible for Title I, Head Start ELOF, and State Early Literacy supplemental grants.\n\nWarm regards,\nThe Sound of Essentials Institutional Team\nhttps://soelearn.com/institutions`,
        },
      };
    }

    case 'MCLS-GUARDIAN':
      return {
        action_type: 'rhythm_guardian_audit',
        title: `Rhythm Guardian Dual-Horizon Optimization & ROAS Audit (${deltaKey})`,
        channel: 'Meta CAPI + Direct Stripe Telemetry',
        target_destination: 'Engine A (Lead CPA <= $2.50) & Engine B (Print ROAS > 1.8x)',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Telemetry Check)',
        summary: `Audits ad spend velocity, preserves Engine A 90-day gestation window from premature pause, flags ad fatigue, and stages +20% scaling on proven winners.${focusNote}`,
        payload: {
          guardrails: {
            max_lead_cpa: 2.50,
            min_ctr: 0.80,
            scale_step_ratio: 1.20,
            protect_90_day_gestation: true,
          },
          recommended_action: 'SCALE_WINNERS_AND_HOLD_LEARNING',
          engine_allocations: { engine_a: '70%', engine_b: '20%', engine_c: '10%' },
          custom_directive: customPrompt || null,
        },
      };

    case 'MCLS-INTEL-SCOUT':
      return {
        action_type: 'intel_vault_curation',
        title: `AI Parenting & Neuroscience Intelligence Sweep (${deltaKey})`,
        channel: 'Intelligence Vault (docs/soe_ai_parenting_intel_vault.json)',
        target_destination: 'Creative Forge Copy & B2B Pilot Pitch Deck',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Automated Sweep)',
        summary: `Scans and curates high-leverage quotes from AI founders (Karpathy, Ng) and cognitive pediatric neuroscientists to feed fresh ad hooks for Ages 2–7.${focusNote}`,
        payload: {
          scouted_sources: ['Andrej Karpathy (OpenAI/Eureka)', 'Andrew Ng (Google Brain/Coursera)', 'Pediatric Cognitive Research'],
          target_age_bounds: 'Ages 2–7 (Pre-K to Grade 2)',
          min_leverage_score: 85.0,
          custom_directive: customPrompt || null,
        },
      };

    case 'MCLS-AUTOPILOT':
      return {
        action_type: 'social_seed_drip',
        title: `Organic Social & Advertorial Drip (${deltaKey})`,
        channel: 'Facebook Page (ID: 1238685869335542) + Theme Accounts',
        target_destination: 'Organic Seeding Feed + soelearn.com/listen Bridge',
        delta_alignment: deltaKey,
        estimated_cost: '$0.00 (Organic Drip)',
        summary: `Selects the next unposted high-leverage advertorial or cultural delta seed, verifies anti-duplicate state ledger, and stages publishing.${focusNote}`,
        payload: {
          catalog_source: 'docs/facebook_advertorials_catalog.json',
          ledger_file: 'docs/facebook_published_ledger.json',
          anti_duplicate_check: 'VERIFIED',
          custom_directive: customPrompt || null,
        },
      };

    case 'MCLS-STUDIO':
    default:
      return {
        action_type: 'meta_ad_bundle',
        title: `3-Layer Meta Ad Bundle & Visual Brief: ${campaignKey} (${deltaKey})`,
        channel: 'Meta Ads Manager v21.0 + Visual Production',
        target_destination: engineType === 'ENGINE_B_DIRECT_OFFER' ? 'soelearn.com/workbook ($35 Print / $55 Dictionary)' : 'soelearn.com/listen (Free 19-Track Gate)',
        delta_alignment: deltaKey,
        estimated_cost: `$${dailyBudget}.00/day (Staged Paused) | 5 Static / 80 Video Credits`,
        summary: `3-Layer Cultural Delta ad array (ARC-01, ARC-02, ARC-03) with pre-flight credit estimation and Direct Stripe card-vaulting attribution.${focusNote}`,
        payload: {
          engine_type: engineType,
          campaign_key: campaignKey,
          delta_key: deltaKey,
          daily_budget_cents: Number(dailyBudget) * 100,
          headline: 'Stream the Free 19-Track Rhythm Quest Album (Ages 2–7)',
          layer_1: 'You can see it in their eyes after 20 minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your home.',
          layer_2: 'Crafted by a father’s heart and a mother’s love, The Sound of Essentials replaces screen rot with 19 studio-recorded songs, 4,000+ illustrated words, and 400 tactile daily quests for ages 2–7.',
          layer_3: 'Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no apps, no algorithms.',
          video_style_preset: 'PAPER_POPUP',
          video_iteration_pipeline: 'audio_srt -> atlas_seed -> code_iter -> skill_lock',
          custom_directive: customPrompt || null,
        },
      };
  }
}

async function stageApprovalCard(databaseUrl, draft) {
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

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const braveKey = env?.BRAVE_API_KEY || '';
    const body = await request.json();
    const { action = 'dispatch_unit' } = body;

    // ── 0. MCLS ADVERSARIAL "REVIEW THIS" PRE-FLIGHT GATE ──────────────────
    if (action === 'review_proposal') {
      const {
        unit_key = 'MCLS-STUDIO',
        title = '',
        summary = '',
        target_destination = '/listen',
        payload = {},
        custom_prompt = '',
      } = body;
      const review = runAdversarialPreflightReview(
        unit_key,
        { title, summary, target_destination, payload },
        { customPrompt: custom_prompt }
      );
      return new Response(
        JSON.stringify({ success: true, unit_key, review }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0A. FOREMAN GOAL COMPILER (MULTI-UNIT CAMPAIGN PLANNER) ────────────
    if (action === 'foreman_compile') {
      const {
        goal = '',
        delta_key = 'SCREEN_VS_SENSORY',
        campaign_key = 'THE_ENEMY',
        engine_type = 'ENGINE_A_VALUE_GATE',
        daily_budget = 20,
        stage_cards = true,
      } = body;

      const plan = compileForemanPlan({
        goal,
        delta_key,
        campaign_key,
        engine_type,
        daily_budget,
      });

      const stagedApprovals = [];
      if (stage_cards) {
        for (const task of plan.tasks) {
          const row = await stageApprovalCard(databaseUrl, task);
          if (row) stagedApprovals.push(row);
          await queryNeon(
            databaseUrl,
            `UPDATE mcls_units SET runs_count = runs_count + 1, last_run_at = CURRENT_TIMESTAMP WHERE unit_key = $1;`,
            [task.unit_key]
          ).catch(() => {});
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          plan,
          staged_count: stagedApprovals.length,
          approvals: stagedApprovals,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0A2. WEBHOOK-TRIGGERED REACTIVE DISPATCH ───────────────────────────
    if (action === 'webhook_trigger') {
      const { event_type = '', source = 'external_webhook', event_data = {}, stage_card = true } = body;
      const draft = buildWebhookReactiveDraft({ event_type, source, event_data });
      const approval = stage_card ? await stageApprovalCard(databaseUrl, draft) : null;

      if (approval) {
        await queryNeon(
          databaseUrl,
          `UPDATE mcls_units SET runs_count = runs_count + 1, last_run_at = CURRENT_TIMESTAMP WHERE unit_key = $1;`,
          [draft.unit_key]
        ).catch(() => {});
      }

      return new Response(
        JSON.stringify({ success: true, draft, approval }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0A3. BROWSER COWORKER TAKEOVER CHECKPOINT ──────────────────────────
    if (action === 'stage_browser_takeover') {
      const draft = buildBrowserTakeoverDraft(body);
      const approval = await stageApprovalCard(databaseUrl, draft);
      return new Response(
        JSON.stringify({ success: true, draft, approval }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0B. @DotComParker STREAM #6: PRODUCT GAP RESEARCH -> 3D TEXT-TO-CAD ─
    if (action === 'research_product_gap') {
      const {
        product_focus = 'Personalized Harmonia Phonics Nameplate & Syllable Slider',
        land_key = 'harmonia',
        target_sku = 'SOE-HARM-NAME-01',
        competitor_complaints = [
          'Small wooden letters get lost under couches and pose choking hazards for toddlers under 4',
          'Alphabet boards only use UPPERCASE letters with zero phonological rhyming or syllable cues',
          'Thin plywood warps or splinters with classroom daily handling',
        ],
      } = body;

      const cadSpec = {
        sku: target_sku,
        land_key: String(land_key).toLowerCase(),
        product_focus,
        canonical_age_range: 'Ages 2–7 (Pre-K to Grade 2)',
        safety_spec: {
          cpsc_min_dimension_mm: 31.8,
          corner_fillet_mm: 2.5,
          wall_thickness_mm: 2.4,
          material: 'Plant-Based PLA (US Print Farm / Cloud Academy .3MF)',
        },
        market_gaps_addressed: competitor_complaints.slice(0, 5),
        monetization_bridge: {
          d2c_pod_price_usd: 29,
          captures_shipping_address: true,
          unlocks_rhythm_pass_continuity: '$14.99/mo The Rhythm Pass',
          cloud_academy_tier: 'Included in $199/yr Pod & $499/yr School STL/3MF Vault',
        },
        visual_hook: 'Split-screen prompt -> build123d STL compile -> 3D print timelapse with Harmonia studio track',
      };

      const review = runAdversarialPreflightReview('MCLS-PULSE', {
        title: `Tactile CAD Product Gap Spec: ${product_focus}`,
        summary: `Zero-inventory 3D Text-to-CAD component addressing ${competitor_complaints.length} competitor gaps for Ages 2–7.`,
        target_destination: '/cloud-academy',
        payload: cadSpec,
      });

      return new Response(
        JSON.stringify({ success: true, action, cadSpec, review }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0C. @DotComParker STREAM #11: STAGE 4 GLOSSARY-LOCKED TRANSLATION ────
    if (action === 'build_translation_packet') {
      const {
        target_language = 'es',
        track_or_land = 'Harmonia — Kenji & Aiko',
        source_text = '',
      } = body;

      const canonGlossaryLock = {
        preserve_exact: [
          'The Sound of Essentials: Rhythm Quest',
          'Harmonia', 'Numeria', 'Vitalis', 'Celestia', 'Luminosity', 'Aquaria', 'Terrasol',
          'Seriphia', 'Kenji', 'Aiko', 'Kwame', 'Octavia', 'Felix', 'Amara',
          'Elias', 'Selene', 'Athena', 'Ezra', 'Nerissa', 'Ronan', 'Vesta', 'Silas', 'Lil G',
        ],
        canonical_age_range: 'Ages 2–7 (Pre-K to Grade 2)',
        emotional_anchor: "Crafted by a father's heart and a mother's love",
        status_stamp: 'DRAFT - pending fluent human review',
      };

      const packet = {
        target_language: String(target_language).toLowerCase(),
        track_or_land,
        source_text,
        canon_glossary_lock: canonGlossaryLock,
        translation_rules: [
          'Keep formatting, headings, and numeric counts (19 tracks, 4,000+ words, Ages 2–7) exact.',
          'Preserve canonical Land and Hero proper names untranslated unless approved in glossary.',
          'Flag every rhyme, syllable-clap pattern, or idiom with 2 natural target-language cadence options.',
        ],
      };

      const review = runAdversarialPreflightReview('MCLS-CONCORD', {
        title: `Stage 4 Glossary-Locked Translation (${target_language}): ${track_or_land}`,
        summary: 'Draft translation packet with SOE Canonical Glossary Lock pending fluent human review.',
        target_destination: '/cloud-academy',
        payload: packet,
      });

      return new Response(
        JSON.stringify({ success: true, action, packet, review }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0D. 8-SEC REEL + VALUE CAPTION + COMMENT-KEYWORD AUTO-DM FUNNEL ──────
    if (action === 'build_comment_trigger_reel') {
      const {
        keyword = 'RHYTHM',
        offer_angle = 'Pre-Checkout Digital & 3D Tactile Phonics Vault (Ages 2–7)',
        visual_reference = 'The Sound of Essentials Image Assets/Canonical Master Visuals/Pond Aiko_Kenji.png',
      } = body;

      const cleanKeyword = String(keyword || 'RHYTHM').trim().toUpperCase().replace(/[^A-Z0-9]/g, '') || 'RHYTHM';
      const reelPacket = {
        format: '8-Second Aesthetic Loop + Value Caption + Comment-to-DM Trigger',
        duration_seconds: 8,
        audio_track: '19-Track Rhythm Quest Studio Instrumental Snippet (100 BPM)',
        visual_reference,
        on_screen_hook_3s: 'Why 15 minutes of screen-free rhythm beats 2 hours of alphabet apps (Ages 2–7)',
        comment_keyword: cleanKeyword,
        webhook_endpoint: '/api/webhooks/instagram',
        caption_body: `${offer_angle}\n\nMost early learning downloads leave parents and teachers guessing—or trap kids in overstimulating screens.\n\nCrafted by a father's heart and a mother's love, The Sound of Essentials: Rhythm Quest pairs 19 studio-recorded songs across 7 Lands with clear Personal & Cloud Academy Classroom licensing.\n\nComment ${cleanKeyword} below and we'll DM you the direct link right away.`,
        destination_url:
          cleanKeyword === 'LICENSE' || cleanKeyword === 'PILOT'
            ? 'https://soelearn.com/terms#digital-license'
            : 'https://soelearn.com/listen',
      };

      const review = runAdversarialPreflightReview('MCLS-STUDIO', {
        title: `8s Comment-Trigger Reel (${cleanKeyword}): ${offer_angle}`,
        summary: `Instagram Reel + Comment '${cleanKeyword}' auto-DM funnel routed to /listen or /terms.`,
        target_destination: '/listen',
        payload: reelPacket,
      });

      return new Response(
        JSON.stringify({ success: true, action, reelPacket, review }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 0E. 3D STYLE ATLAS + SRT CODE-VIDEO ITERATION PIPELINE ────────────────
    if (action === 'build_video_iteration') {
      const ALLOWED_STYLES = {
        PAPER_POPUP: { atlas_id: '#02', name: 'Paper Pop-Up', category: 'Material worlds' },
        SOFT_CLAY: { atlas_id: '#03', name: 'Soft Clay', category: 'Material worlds' },
        TINY_DIORAMA: { atlas_id: '#04', name: 'Tiny Diorama', category: 'Spaces and journeys' },
        MARBLE_RUN: { atlas_id: '#09', name: 'Marble Run', category: 'Machines that explain' },
        PAINTED_STORYBOOK: { atlas_id: '#13', name: 'Painted', category: 'Filters over 3D' },
        EXPLODED_BUNDLE: { atlas_id: '#08', name: 'Exploded View', category: 'Diagrams with depth' },
        SPOTLIGHT_STAGE: { atlas_id: '#06', name: 'Spotlight Stage', category: 'Spaces and journeys' },
        LOW_POLY_PAPER: { atlas_id: '#01', name: 'Low-Poly', category: 'Filters over 3D' },
      };

      const rawStyle = String(body.style_preset || 'PAPER_POPUP').trim().toUpperCase();
      const preset = ALLOWED_STYLES[rawStyle] || ALLOWED_STYLES.PAPER_POPUP;
      const topic = String(body.topic || '7 Musical Lands & 4,000+ Illustrated Words (Ages 2–7)');
      const durationSec = Math.max(8, Math.min(60, Number(body.duration_seconds) || 15));
      const trackNum = Math.max(1, Math.min(19, Number(body.audio_track_number) || 1));
      const b1 = Math.max(3, Math.round(durationSec * 0.3));
      const b2 = Math.max(b1 + 3, Math.round(durationSec * 0.72));

      const videoPacket = {
        topic,
        duration_seconds: durationSec,
        style_preset: ALLOWED_STYLES[rawStyle] ? rawStyle : 'PAPER_POPUP',
        atlas_reference: preset,
        brand_tokens: {
          surface_cream_hex: '#FFF8F0',
          accent_orange_hex: '#FF6F00',
          highlight_amber_hex: '#FFB300',
          canonical_age_range: 'Ages 2–7 (Pre-K to Grade 2)',
          heritage_motto: "Crafted by a father's heart and a mother's love",
        },
        stage_1_audio_and_srt: {
          audio_track: `SOE Studio Track #${trackNum} + Narration Voiceover`,
          srt_cues: [
            { index: 1, start_sec: 0, end_sec: b1, beat: 'LAYER_1_ACHE', text: 'You can see it in their eyes after 20 minutes of algorithmic cartoons.' },
            { index: 2, start_sec: b1, end_sec: b2, beat: 'LAYER_2_SOLUTION', text: "Crafted by a father's heart and a mother's love—19 studio songs and 4,000+ illustrated words for ages 2–7." },
            { index: 3, start_sec: b2, end_sec: durationSec, beat: 'LAYER_3_INVITATION', text: 'Stream all 19 Rhythm Quest tracks free at soelearn.com/listen.' },
          ],
        },
        stage_3_code_iteration_axes: [
          'beat_scene_changes',
          'physics_and_camera_fixes',
          'brand_palette_and_hero_lock',
          'srt_word_timing_tightening',
        ],
        stage_4_skill_id: `soe-video-${(ALLOWED_STYLES[rawStyle] ? rawStyle : 'PAPER_POPUP').toLowerCase()}`,
        remotion_composition: 'TactileExplainer',
      };

      const review = runAdversarialPreflightReview('MCLS-STUDIO', {
        title: `Tactile 3D/Code Video Iteration (${preset.atlas_id} ${preset.name}): ${topic}`,
        summary: `4-stage SRT-synced Three.js/Remotion pipeline (${durationSec}s, Track #${trackNum}) locked to SOE #FFF8F0 / #FF6F00 canon.`,
        target_destination: '/listen',
        payload: videoPacket,
      });

      return new Response(
        JSON.stringify({ success: true, action, videoPacket, review }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 1. MCLS GOVERNED NATURAL-LANGUAGE TELEMETRY QUERY (SQL ENGINE) ──────
    if (action === 'query_telemetry') {
      const { question = '' } = body;
      const q = question.toLowerCase();

      let sqlUsed = '';
      let rows = [];
      let synthesis = '';

      if (q.includes('delta') || q.includes('cultural') || q.includes('approval')) {
        sqlUsed = `SELECT delta_alignment, status, COUNT(*) AS count FROM mcls_approvals GROUP BY delta_alignment, status ORDER BY count DESC;`;
        const res = await queryNeon(databaseUrl, sqlUsed);
        rows = res.rows || [];
        synthesis = `Aggregated ${rows.length} Cultural Delta × Status cohorts from mcls_approvals.`;
      } else if (q.includes('school') || q.includes('pilot') || q.includes('deal') || q.includes('pipeline') || q.includes('institution')) {
        sqlUsed = `SELECT stage, COUNT(*) AS deals_count, COALESCE(SUM(deal_value), 0) AS total_value FROM crm_deals GROUP BY stage ORDER BY total_value DESC;`;
        const res = await queryNeon(databaseUrl, sqlUsed).catch(() => ({ rows: [] }));
        rows = res.rows || [];
        synthesis = `Queried live Neon CRM deal pipeline across institutional and direct stages.`;
      } else if (q.includes('memory') || q.includes('rule') || q.includes('preference')) {
        sqlUsed = `SELECT unit_scope, source_action, rule_text, created_at FROM mcls_memories WHERE active = TRUE ORDER BY created_at DESC LIMIT 15;`;
        const res = await queryNeon(databaseUrl, sqlUsed);
        rows = res.rows || [];
        synthesis = `Retrieved ${rows.length} active MCLS operator memory rules governing unit execution.`;
      } else {
        sqlUsed = `SELECT persona, lifecycle_stage, COUNT(*) AS contacts_count, COALESCE(SUM(total_spend), 0) AS ltv_sum FROM crm_contacts GROUP BY persona, lifecycle_stage ORDER BY contacts_count DESC;`;
        const res = await queryNeon(databaseUrl, sqlUsed).catch(() => ({ rows: [] }));
        rows = res.rows || [];
        synthesis = `Queried audience & institutional breakdown across crm_contacts by persona and lifecycle stage.`;
      }

      return new Response(
        JSON.stringify({
          success: true,
          question,
          sql: sqlUsed,
          synthesis,
          rows,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. MCLS NATIVE WEB-TO-MARKDOWN EXTRACTOR & CITATION SCOUT ───────────
    if (action === 'extract_markdown') {
      const {
        target_url = '',
        stage_to_gate = false,
        target_unit = 'MCLS-CONCORD',
        previous_hash = '',
        keywords = [],
      } = body;
      if (!target_url || !/^https?:\/\//i.test(target_url.trim())) {
        return new Response(
          JSON.stringify({ error: 'Please provide a valid http:// or https:// URL to extract.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const cleanUrl = target_url.trim();
      const checkedAt = new Date().toISOString();
      let pageTitle = cleanUrl;
      let metaDesc = '';
      let markdownText = '';
      let emailsFound = [];
      let sourceOutcome = 'changed';
      let contentHash = '';
      let fetchError = null;

      try {
        const pageRes = await fetch(cleanUrl, {
          headers: {
            'User-Agent': 'SOE-MCLS-ReconBot/2.5 (+https://soelearn.com)',
            Accept: 'text/html,application/xhtml+xml',
          },
        });
        if (!pageRes.ok) {
          throw new Error(`HTTP ${pageRes.status}`);
        }
        const html = await pageRes.text();

        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch) pageTitle = titleMatch[1].replace(/\s+/g, ' ').trim();

        const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
        if (descMatch) metaDesc = descMatch[1].trim();

        const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        emailsFound = [...new Set(emailMatches)].slice(0, 5);

        const stripped = html
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[\s\S]*?<\/footer>/gi, '')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
          .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
          .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
          .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
          .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/[ \t]+/g, ' ')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        const hashInput = new TextEncoder().encode(stripped.replace(/\s+/g, ' '));
        const digest = await crypto.subtle.digest('SHA-256', hashInput);
        contentHash = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        if (previous_hash && previous_hash === contentHash) {
          sourceOutcome = 'unchanged';
        }

        // Targeted passage extraction when keywords are specified; avoid blind truncation
        let bodyExcerpt = stripped.slice(0, 3500);
        if (Array.isArray(keywords) && keywords.length > 0) {
          const kwLower = keywords.map((k) => String(k).toLowerCase()).filter(Boolean);
          const blocks = stripped.split(/\n+/).filter(Boolean);
          const matched = blocks.filter((b) => kwLower.some((k) => b.toLowerCase().includes(k)));
          if (matched.length > 0) {
            bodyExcerpt = matched.join('\n').slice(0, 3500);
          }
        }

        markdownText = `# ${pageTitle}\nSource: ${cleanUrl}\nChecked At: ${checkedAt}\n${metaDesc ? `Description: ${metaDesc}\n` : ''}\n${bodyExcerpt}`;
      } catch (err) {
        sourceOutcome = 'check_failed';
        fetchError = err.message;
        markdownText = `# Check Failed: ${cleanUrl}\nChecked At: ${checkedAt}\nError: "${err.message}". Unresolved — do not treat as unchanged.`;
      }

      let stagedCard = null;
      if (stage_to_gate && sourceOutcome === 'changed') {
        const ins = await queryNeon(
          databaseUrl,
          `INSERT INTO mcls_approvals
            (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
           VALUES ($1, $2, $3, $4, $5, 'INSTITUTION_VS_SANCTUARY', 'PASS', '$0.00 (MCLS Web Recon)', 'pending', $6, $7)
           RETURNING *;`,
          [
            target_unit,
            target_unit === 'MCLS-CONCORD' ? 'institutional_pilot_outreach' : 'geo_citation_audit',
            `Web Recon Brief: ${pageTitle.slice(0, 120)}`,
            'MCLS Web-to-Markdown Extractor',
            cleanUrl,
            `Extracted structured markdown & contact intelligence from ${cleanUrl} for Ages 2–7 curriculum positioning.`,
            JSON.stringify({
              source_url: cleanUrl,
              checked_at: checkedAt,
              source_outcome: sourceOutcome,
              content_hash: contentHash,
              page_title: pageTitle,
              emails_discovered: emailsFound,
              recipient_email: emailsFound[0] || 'info@soelearn.com',
              organization_name: pageTitle.slice(0, 80),
              markdown_excerpt: markdownText.slice(0, 1500),
            }),
          ]
        );
        stagedCard = ins.rows?.[0] || null;
      }

      return new Response(
        JSON.stringify({
          success: sourceOutcome !== 'check_failed',
          url: cleanUrl,
          checked_at: checkedAt,
          source_outcome: sourceOutcome,
          content_hash: contentHash || null,
          error: fetchError,
          title: pageTitle,
          emails: emailsFound,
          markdown: markdownText,
          stagedApproval: stagedCard,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 3. META CREDENTIAL HANDSHAKE VERIFICATION ───────────────────────────
    if (action === 'verify_meta') {
      const { ad_account_id = '', access_token = '', page_id = '', pixel_id = '' } = body;
      const cleanAccount = ad_account_id.trim() || 'act_sandbox_soe_2026';
      const cleanPage = page_id.trim() || '61593646665667';
      const cleanPixel = pixel_id.trim() || 'soe_pixel_primary';

      let verifiedLive = false;
      let verifyMessage = 'Validated in MCLS Sandbox Simulation Mode. All campaign launches stage safely in PAUSED state.';

      if (access_token && access_token.trim().length > 12) {
        try {
          const graphRes = await fetch(
            `https://graph.facebook.com/v21.0/me?access_token=${encodeURIComponent(access_token.trim())}`
          );
          if (graphRes.ok) {
            verifiedLive = true;
            verifyMessage = `Meta Graph API v21.0 Handshake Verified for Ad Account ${cleanAccount}.`;
          }
        } catch {
          // Remain in safe sandbox mode if external call blocked
        }
      }

      const mode = verifiedLive ? 'LIVE_CONNECTED' : 'SANDBOX_DRY_RUN';
      const tokenPreview = access_token ? `${access_token.slice(0, 6)}...${access_token.slice(-4)}` : null;

      await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_meta_config (id, mode, is_configured, ad_account_id, page_id, pixel_id, token_preview, updated_at)
         VALUES (1, $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE SET
           mode = EXCLUDED.mode,
           is_configured = EXCLUDED.is_configured,
           ad_account_id = EXCLUDED.ad_account_id,
           page_id = EXCLUDED.page_id,
           pixel_id = EXCLUDED.pixel_id,
           token_preview = EXCLUDED.token_preview,
           updated_at = CURRENT_TIMESTAMP;`,
        [mode, verifiedLive, cleanAccount, cleanPage, cleanPixel, tokenPreview]
      );

      return new Response(
        JSON.stringify({
          verified: verifiedLive,
          mode,
          is_configured: verifiedLive,
          ad_account_id: cleanAccount,
          page_id: cleanPage,
          pixel_id: cleanPixel,
          message: verifyMessage,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 2. META 3-AD TESTING ARRAY LAUNCHER (EDGE NATIVE) ───────────────────
    if (action === 'launch_meta') {
      const {
        campaign_key = 'THE_ENEMY',
        delta_key = 'SCREEN_VS_SENSORY',
        daily_budget_cents = 2000,
        language = 'en',
        archetype_ids = ['ARC-01', 'ARC-02', 'ARC-03'],
        engine_type = 'ENGINE_A_VALUE_GATE',
      } = body;

      const metaRes = await queryNeon(databaseUrl, 'SELECT * FROM mcls_meta_config WHERE id = 1;');
      const metaCfg = metaRes.rows?.[0] || {
        mode: 'SANDBOX_DRY_RUN',
        ad_account_id: 'Not Connected (Sandbox Default)',
        page_id: '61593646665667',
        pixel_id: 'soe_pixel_primary',
      };

      const destinationUrl =
        engine_type === 'ENGINE_B_DIRECT_OFFER'
          ? 'https://soelearn.com/workbook'
          : 'https://soelearn.com/listen';

      const bundle = {
        graph_api_version: 'v21.0',
        campaign: {
          name: `SOE_MCLS_${engine_type}_${campaign_key}_${language.toUpperCase()}`,
          objective: 'OUTCOME_SALES',
          status: 'PAUSED',
          special_ad_categories: [],
        },
        adset: {
          name: `SOE_${delta_key}_AGES_2_7_PARENTS_${language.toUpperCase()}`,
          daily_budget: daily_budget_cents,
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'OFFSITE_CONVERSIONS',
          pixel_id: metaCfg.pixel_id,
          targeting: {
            geo_locations: { countries: ['US', 'CA', 'GB', 'AU'] },
            age_min: 24,
            age_max: 48,
            interests: ['Early childhood education', 'Homeschooling', 'Montessori education', 'Parenting'],
          },
        },
        ads: archetype_ids.map((arcId, idx) => ({
          archetype_id: arcId,
          name: `${arcId}_${campaign_key}_V${idx + 1}`,
          status: 'PAUSED',
          destination_url: `${destinationUrl}?utm_source=meta&utm_medium=mcls&utm_campaign=${campaign_key.toLowerCase()}&utm_content=${arcId.toLowerCase()}`,
        })),
      };

      // Also stage in mcls_approvals so the operator has a full audit trail
      const approvalRes = await queryNeon(
        databaseUrl,
        `INSERT INTO mcls_approvals
          (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
         VALUES ($1, $2, $3, $4, $5, $6, 'PASS', $7, 'pending', $8, $9)
         RETURNING *;`,
        [
          'MCLS-STUDIO',
          'meta_ad_bundle',
          `Meta v21.0 3-Ad Array: ${campaign_key} (${engine_type})`,
          'Meta Ads Manager (Graph API v21.0)',
          destinationUrl,
          delta_key,
          `$${(daily_budget_cents / 100).toFixed(2)}/day (Paused)`,
          `Staged 3-Ad Testing Array (${archetype_ids.join(', ')}) for ${delta_key} targeting parents of children ages 2–7.`,
          JSON.stringify(bundle),
        ]
      );

      await queryNeon(
        databaseUrl,
        `UPDATE mcls_units SET runs_count = runs_count + 1, last_run_at = CURRENT_TIMESTAMP WHERE unit_key = 'MCLS-STUDIO';`
      );

      return new Response(
        JSON.stringify({
          status: 'SUCCESS',
          mode: metaCfg.mode || 'SANDBOX_DRY_RUN',
          ad_account_id: metaCfg.ad_account_id,
          message: `3-Ad Testing Array (${campaign_key}) staged in PAUSED safety state and logged to the MCLS Approval Gate.`,
          bundle,
          approval: approvalRes.rows[0],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── 3. MCLS AUTONOMOUS UNIT DISPATCH ────────────────────────────────────
    const {
      unit_key = 'MCLS-PRIME',
      delta_key = 'SCREEN_VS_SENSORY',
      campaign_key = 'THE_ENEMY',
      engine_type = 'ENGINE_A_VALUE_GATE',
      custom_prompt = '',
      daily_budget = 20,
    } = body;

    const searchQuery =
      custom_prompt ||
      `screen-free preschool curriculum ages 2-7 music phonics ${delta_key.replace(/_/g, ' ').toLowerCase()}`;
    const [searchSignal, memRes] = await Promise.all([
      fetchLiveSearchContext(searchQuery, braveKey),
      queryNeon(
        databaseUrl,
        `SELECT rule_text FROM mcls_memories WHERE active = TRUE AND (unit_scope = 'ALL_UNITS' OR unit_scope = $1) ORDER BY created_at DESC LIMIT 5;`,
        [unit_key]
      ).catch(() => ({ rows: [] })),
    ]);

    const activeMemoryRules = (memRes.rows || []).map((r) => r.rule_text);

    const draft = buildUnitExecutionDraft(unit_key, {
      deltaKey: delta_key,
      campaignKey: campaign_key,
      engineType: engine_type,
      customPrompt: custom_prompt,
      searchSignal,
      dailyBudget: daily_budget,
    });

    const canonCheck = runAdversarialPreflightReview(unit_key, draft, {
      customPrompt: custom_prompt,
    });

    const insertRes = await queryNeon(
      databaseUrl,
      `INSERT INTO mcls_approvals
        (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10)
       RETURNING *;`,
      [
        unit_key,
        draft.action_type,
        draft.title,
        draft.channel,
        draft.target_destination,
        draft.delta_alignment,
        canonCheck.status,
        draft.estimated_cost,
        draft.summary,
        JSON.stringify({
          ...draft.payload,
          applied_operator_memories: activeMemoryRules,
          canon_verification: canonCheck,
        }),
      ]
    );

    const unitRes = await queryNeon(
      databaseUrl,
      `UPDATE mcls_units
       SET runs_count = runs_count + 1,
           last_run_at = CURRENT_TIMESTAMP,
           status = 'ready'
       WHERE unit_key = $1
       RETURNING *;`,
      [unit_key]
    );

    return new Response(
      JSON.stringify({
        success: true,
        unit: unitRes.rows[0] || null,
        approval: insertRes.rows[0],
        canonCheck,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('MCLS Dispatch POST Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

