/**
 * Shared SOE Market Campaign Launch System (SOE-MCLS) Core Engine.
 * Single source of truth for Helix Gate 1 Canon compliance, Adversarial Pre-Flight,
 * Dual-Horizon Rhythm Guardian, 3-Layer Creative Forge, Foreman Goal Compilation,
 * Webhook-Reactive Task Mapping, and Browser Takeover Handoffs.
 */

export const DEFAULT_NEON_DB_URL =
  'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const CANON_CHECKS = [
  {
    pattern: /\bAges?\s*2\s*[-–—]\s*8\b/i,
    reason: 'Canon age must be strictly Ages 2–7 (Pre-K to Grade 2)',
  },
  {
    pattern: /\bGrade\s*3\b/i,
    reason: 'Canon ceiling is Grade 2',
  },
  {
    pattern: /\b(Marcus|Elena|Reef|Zara|Dara|Sophia|Geometria)\b/i,
    reason: 'Retired character or land name detected',
  },
  {
    pattern: /\bno\s+credit\s+card\s+required\b/i,
    reason: 'Billing canon violation: never claim "no credit card required"',
  },
  {
    pattern: /\bShopify\b/i,
    reason: 'Stack canon violation: Shopify is retired; use direct soelearn.com Stripe funnel',
  },
  {
    pattern: /\blive\s+(instrumentation|instruments?|orchestra|music|acoustic|organic)\b/i,
    reason: 'Canon audio rule: studio-recorded vocals & acoustic arrangements only',
  },
  {
    pattern: /\b4,?232\b/,
    reason: 'Marketing copy rule: never use literal 4,232; uniformly use "4,000+ words"',
  },
];

const VALID_FUNNEL_DESTINATIONS = [
  '/listen',
  '/workbook',
  '/rhythm-ready',
  '/dictionary-sale',
  '/bundle',
  '/institutions',
  '/cloud-academy',
  '/tactile',
  '/qpc',
  'school_pilot',
  'llms.txt',
  'solutionshub',
  'engine a',
  'engine b',
  'engine c',
  'brevo',
  'slant3d',
  'build123d',
  'meta ads',
  'awaiting operator',
];

const DELTA_COPY_LIBRARY = {
  en: {
    SCREEN_VS_SENSORY: {
      headline: 'Stream the Free 19-Track Rhythm Quest Album (Ages 2–7)',
      layer_1_ache:
        'You can see it in their eyes after 20 minutes of algorithmic cartoons—that glazed, overstimulated restlessness that steals the peace right out of your living room.',
      layer_2_solution:
        "Crafted by a father's heart and a mother's love, The Sound of Essentials replaces screen rot with 19 studio-recorded songs, 4,000+ illustrated words, and 400 tactile daily quests for ages 2–7.",
      layer_3_invitation:
        'Press play on a calmer home tonight. Unlock all 19 tracks of the Rhythm Quest album 100% free—no app downloads, no algorithms.',
    },
    ALGORITHM_VS_HANDCRAFTED: {
      headline: 'Handcrafted Music for Ages 2–7 (Free 19-Track Album)',
      layer_1_ache:
        "Silicon Valley engineered their apps to harvest your child's attention span before they even learn to tie their shoes.",
      layer_2_solution:
        'Give them something real to hold, sing, and master: 19 studio-recorded songs, an 8-week Rhythm Ready Workbook, and 4,000+ illustrated words across 7 magical lands.',
      layer_3_invitation:
        'Start with the music. Claim the complete 19-song Rhythm Quest album free right now at soelearn.com/listen.',
    },
    TESTING_VS_ARTS: {
      headline: 'Real Phonics & Rhythm Before Guessing Starts (Ages 2–7)',
      layer_1_ache:
        'Too many early classrooms treat phonics as an optional guessing game while kids fall behind on sound-to-letter decoding.',
      layer_2_solution:
        'Inside the Land of Harmonia, Kenji and Aiko wire accurate phonemes and rhyming cadence through 19 studio-recorded tracks and 400 tactile quests for ages 2–7.',
      layer_3_invitation:
        'Build an unshakeable sound foundation at the kitchen table. Stream all 19 tracks free today at soelearn.com/listen.',
    },
    INSTITUTION_VS_SANCTUARY: {
      headline: 'Build a Tech-Free Early Learning Sanctuary (Ages 2–7)',
      layer_1_ache:
        'A quiet divide is growing between children raised on glowing iPads and children anchored in calm, tactile, musical learning.',
      layer_2_solution:
        'Guided by Seriphia and 14 land heroes across 7 developmental lands, SOE delivers 19 studio-recorded songs, heirloom books, and 10–15 minute classroom extensions.',
      layer_3_invitation:
        'Transform daily transitions without private-school tuition. Explore all 19 tracks free at soelearn.com/listen.',
    },
    CONSUMPTION_VS_QUEST: {
      headline: 'Scrolling Is a Sprint. Reading Is a Marathon.',
      layer_1_ache:
        'Fifteen-second video feeds train young brains to swipe whenever focus gets hard—yet reading asks a child to slow down and listen.',
      layer_2_solution:
        'The Sound of Essentials: Rhythm Quest turns daily living-room moments for ages 2–7 into calm, focused 30-minute adventure blocks with 19 songs and 400 tactile quests.',
      layer_3_invitation:
        'Trade the 15-second scroll for a calmer evening ritual tonight. Stream all 19 tracks free at soelearn.com/listen.',
    },
  },
  es: {
    SCREEN_VS_SENSORY: {
      headline: 'Escucha Gratis el Álbum de 19 Canciones (Edades 2–7)',
      layer_1_ache:
        'Después de 20 minutos frente a pantallas y algoritmos, la sobreestimulación roba la calma de tu hogar.',
      layer_2_solution:
        'Creado con el corazón de un padre y el amor de una madre: 19 canciones grabadas en estudio, 4,000+ palabras ilustradas y 400 misiones táctiles para edades 2–7.',
      layer_3_invitation:
        'Devuelve la calma a tu hogar esta noche. Escucha gratis las 19 canciones en soelearn.com/listen.',
    },
  },
  fr: {
    SCREEN_VS_SENSORY: {
      headline: "Écoutez Gratuitement l'Album de 19 Chansons (2–7 ans)",
      layer_1_ache:
        "Après 20 minutes d'écrans algorithmiques, la surstimulation vole la sérénité de votre foyer.",
      layer_2_solution:
        "Créé avec le cœur d'un père et l'amour d'une mère : 19 chansons enregistrées en studio, 4,000+ mots illustrés et 400 quêtes tactiles pour les 2–7 ans.",
      layer_3_invitation:
        'Retrouvez un rituel apaisant ce soir. Écoutez les 19 chansons gratuitement sur soelearn.com/listen.',
    },
  },
};

const FOREMAN_UNIT_RULES = [
  {
    unit_key: 'MCLS-CONCORD',
    keywords: /\b(school|preschool|head\s*start|doe|district|institutional|b2b|pilot|clinic|educator|teacher|grant)\b/i,
    action_type: 'institutional_pilot_outreach',
    channel: 'Neon CRM (school_pilot) + Brevo Outbound',
    target_destination: 'soelearn.com/institutions (CRM: school_pilot)',
    role_summary: 'Builds Grant Radar + 5-Domain Pre-Call Brief & stages institutional pilot packet.',
  },
  {
    unit_key: 'MCLS-RECON',
    keywords: /\b(seo|aeo|citation|llms\.txt|schema|json-ld|search|google|perplexity|chatgpt|claude|competitor)\b/i,
    action_type: 'geo_citation_audit',
    channel: 'Search & AI Citations (llms.txt + JSON-LD)',
    target_destination: 'public/llms.txt & soelearn.com/solutions',
    role_summary: 'Audits AI answer-engine citations and structured schema coverage for Ages 2–7.',
  },
  {
    unit_key: 'MCLS-FORGE',
    keywords: /\b(pr|pull\s*request|github|code|patch|page|route|meta\s*tag|canonical|deploy|website)\b/i,
    action_type: 'github_canon_pr',
    channel: 'GitHub Repository (@octokit/rest)',
    target_destination: 'soelearn.com/listen (branch: mcls/canon-upgrade)',
    role_summary: 'Stages Helix Gate 1 verified repository patch and canonical schema updates.',
  },
  {
    unit_key: 'MCLS-INTEL-SCOUT',
    keywords: /\b(research|quote|podcast|karpathy|neuroscience|intel|study|evidence|scan|trend)\b/i,
    action_type: 'intel_vault_curation',
    channel: 'Intelligence Vault (docs/soe_ai_parenting_intel_vault.json)',
    target_destination: 'soelearn.com/listen (Creative Forge Feed)',
    role_summary: 'Harvests verified cognitive science & founder receipts with leverage >= 85.',
  },
  {
    unit_key: 'MCLS-STUDIO',
    keywords: /\b(ad|ads|meta|pinterest|creative|video|hook|bundle|campaign|workbook|dictionary|launch|funnel)\b/i,
    action_type: 'meta_ad_bundle',
    channel: 'Meta Ads Manager v21.0 + Visual Production',
    target_destination: 'soelearn.com/listen',
    role_summary: 'Forges 3-Layer Cultural Delta ad array in PAUSED safety state.',
  },
  {
    unit_key: 'MCLS-PULSE',
    keywords: /\b(community|reddit|x\.com|twitter|reply|email|nurture|brevo|parent|homeschool|dispatch|social)\b/i,
    action_type: 'community_reply',
    channel: 'Parent & Homeschool Communities + Sanctuary Dispatch',
    target_destination: 'soelearn.com/listen',
    role_summary: 'Drafts empathetic A/B/C social trio + Sanctuary Dispatch founder outline.',
  },
  {
    unit_key: 'MCLS-AUTOPILOT',
    keywords: /\b(facebook|drip|seed|advertorial|organic\s*post|ledger)\b/i,
    action_type: 'social_seed_drip',
    channel: 'Facebook Page + Theme Accounts',
    target_destination: 'soelearn.com/listen',
    role_summary: 'Queues next deduplicated advertorial drip from published ledger.',
  },
  {
    unit_key: 'MCLS-GUARDIAN',
    keywords: /\b(roas|cpa|budget|scale|pause|stoploss|stop-loss|guardian|stripe|checkout|telemetry|metrics|spend)\b/i,
    action_type: 'rhythm_guardian_audit',
    channel: 'Meta CAPI + Direct Stripe Telemetry',
    target_destination: 'Engine A (/listen) & Engine B (/workbook)',
    role_summary: 'Enforces dual-horizon CPA <= $2.50 & +20% winner scaling guardrails.',
  },
];

/**
 * Execute parameterized SQL against Neon Serverless PostgreSQL HTTP endpoint.
 */
export async function queryNeon(databaseUrl, sql, params = []) {
  const finalUrl = databaseUrl || DEFAULT_NEON_DB_URL;
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

/**
 * SOE Helix Gate 1 Canon Verifier.
 */
export function verifyCanonCompliance(text = '') {
  const violations = [];
  for (const check of CANON_CHECKS) {
    if (check.pattern.test(text || '')) {
      violations.push(check.reason);
    }
  }
  return {
    passed: violations.length === 0,
    status: violations.length === 0 ? 'PASS' : 'BLOCKED',
    violations,
  };
}

/**
 * SOE Helix Gate 1 + Adversarial "Review This" Pre-Flight Gate.
 */
export function runAdversarialPreflightReview(unitKey, draft = {}, options = {}) {
  const combinedText = `${draft.title || ''} ${draft.summary || ''} ${draft.target_destination || ''} ${JSON.stringify(draft.payload || {})}`;
  const canon = verifyCanonCompliance(combinedText);
  const slopWarnings = [];
  const shinyObjectFlags = [];

  if (
    unitKey === 'MCLS-STUDIO' &&
    /\b(stock\s+photo|generic\s+illustration|purple\s+gradient|claymorphism)\b/i.test(combinedText)
  ) {
    slopWarnings.push('Visual slop breach: off-brand generic or purple-gradient styling requested.');
  }

  const destLower = `${draft.target_destination || ''} ${options.customPrompt || ''}`.toLowerCase();
  if (
    draft.target_destination &&
    !VALID_FUNNEL_DESTINATIONS.some((anchor) => destLower.includes(anchor)) &&
    !/^https?:\/\//i.test(draft.target_destination)
  ) {
    shinyObjectFlags.push(
      `Unverified funnel destination '${draft.target_destination}' outside core SOE revenue lanes.`
    );
  }

  if (/\b(crypto|real\s+estate|dropship|linktree|multi-link)\b/i.test(combinedText)) {
    shinyObjectFlags.push('Shiny-Object Drift: off-mission venture or Linktree dilution detected.');
  }

  let verdict = 'PASS';
  if (!canon.passed) verdict = 'BLOCKED';
  else if (shinyObjectFlags.length > 0) verdict = 'SHINY_OBJECT_HOLD';
  else if (slopWarnings.length > 0) verdict = 'CAUTION';

  return {
    passed: verdict === 'PASS',
    status: canon.status,
    verdict,
    violations: canon.violations,
    slop_warnings: slopWarnings,
    shiny_object_flags: shinyObjectFlags,
  };
}

/**
 * Dual-Horizon Rhythm Guardian evaluator (JS parity with tools/soe_mcls/rhythm_guardian.py).
 */
export function evaluateRhythmGuardian(adMetrics = [], config = {}) {
  const maxLeadCpa = Number(config.max_lead_cpa_dollars ?? 2.5);
  const minCtr = Number(config.min_ctr_percent ?? 0.8);
  const minSpend = Number(config.min_spend_for_decision_dollars ?? 10.0);
  const scaleStep = Number(config.scale_step_ratio ?? 1.2);

  const decisions = {};

  for (const row of adMetrics) {
    if (!row || !row.ad_id) continue;
    const adId = String(row.ad_id);
    const engineType = row.engine_type || 'ENGINE_A_VALUE_GATE';
    const spend = Number(row.spend ?? 0);
    const leads = Number(row.leads ?? 0);
    const purchases = Number(row.purchases ?? 0);
    const ctr = Number(row.ctr ?? 0);
    const currentBudget = Number(row.current_budget_cents ?? 3000);

    if (spend < minSpend) {
      decisions[adId] = {
        action: 'HOLD',
        reason: `Spend ($${spend.toFixed(2)}) below learning threshold ($${minSpend.toFixed(2)}).`,
      };
      continue;
    }

    if (engineType === 'ENGINE_A_VALUE_GATE') {
      const leadCpa = leads > 0 ? spend / leads : 999.0;
      if (leads === 0 && spend >= minSpend * 1.5) {
        decisions[adId] = {
          action: 'PAUSE',
          reason: `Engine A Stop-Loss: Spend=$${spend.toFixed(2)} with 0 leads (CTR=${ctr.toFixed(2)}%).`,
        };
      } else if (leadCpa > maxLeadCpa && ctr < minCtr) {
        decisions[adId] = {
          action: 'PAUSE',
          reason: `Engine A Fatigue: Lead CPA=$${leadCpa.toFixed(2)} (target <= $${maxLeadCpa.toFixed(2)}), CTR=${ctr.toFixed(2)}%.`,
        };
      } else if (leads >= 5 && leadCpa <= maxLeadCpa) {
        decisions[adId] = {
          action: 'SCALE_BUDGET',
          new_budget_cents: Math.round(currentBudget * scaleStep),
          reason: `Engine A Winner: Lead CPA=$${leadCpa.toFixed(2)} <= $${maxLeadCpa.toFixed(2)}. Scaling +20%.`,
        };
      } else {
        decisions[adId] = {
          action: 'HOLD',
          reason: `Engine A Active within healthy bounds (CPA=$${leadCpa.toFixed(2)}). Preserving 90-day gestation window.`,
        };
      }
    } else {
      const purchaseCpa = purchases > 0 ? spend / purchases : 999.0;
      if (purchases === 0 && spend >= 35.0) {
        decisions[adId] = {
          action: 'PAUSE',
          reason: `Engine B Stop-Loss: Spent $${spend.toFixed(2)} with 0 sales.`,
        };
      } else if (purchases >= 2 && purchaseCpa <= 25.0) {
        decisions[adId] = {
          action: 'SCALE_BUDGET',
          new_budget_cents: Math.round(currentBudget * scaleStep),
          reason: `Engine B Winner: Purchase CPA=$${purchaseCpa.toFixed(2)}. Scaling +20%.`,
        };
      } else {
        decisions[adId] = {
          action: 'HOLD',
          reason: 'Engine B Learning/Testing.',
        };
      }
    }
  }

  return {
    evaluated_ads_count: Object.keys(decisions).length,
    decisions,
    guardrails_applied: {
      max_lead_cpa: maxLeadCpa,
      min_ctr: minCtr,
      min_spend_for_decision: minSpend,
      scale_step_ratio: scaleStep,
      protect_90_day_gestation: true,
    },
  };
}

/**
 * 3-Layer Cultural Delta Ad Bundle Builder (JS parity with CreativeForge).
 */
export function buildAdBundle(options = {}) {
  const {
    archetype_id = 'ARC-01',
    delta = 'SCREEN_VS_SENSORY',
    campaign = 'THE_ENEMY',
    language = 'en',
    buyer_track = 'D2C',
    engine_type = 'ENGINE_A_VALUE_GATE',
    daily_budget_cents = 2000,
  } = options;

  const langPack = DELTA_COPY_LIBRARY[language] || DELTA_COPY_LIBRARY.en;
  const copy = langPack[delta] || DELTA_COPY_LIBRARY.en[delta] || DELTA_COPY_LIBRARY.en.SCREEN_VS_SENSORY;

  const baseDestination =
    buyer_track === 'B2B'
      ? 'https://soelearn.com/institutions'
      : engine_type === 'ENGINE_B_DIRECT_OFFER'
        ? 'https://soelearn.com/workbook'
        : 'https://soelearn.com/listen';

  const destinationUrl = `${baseDestination}?utm_source=meta&utm_medium=mcls&utm_campaign=${campaign.toLowerCase()}&utm_term=${delta.toLowerCase()}&utm_content=${archetype_id.toLowerCase()}`;
  const fullCopy = `${copy.layer_1_ache}\n\n${copy.layer_2_solution}\n\n${copy.layer_3_invitation}`;
  const canonCheck = verifyCanonCompliance(`${copy.headline} ${fullCopy}`);

  return {
    ad_variant: {
      archetype_id,
      delta,
      campaign,
      language,
      buyer_track,
      engine_type,
      daily_budget_cents: Number(daily_budget_cents),
      status: 'PAUSED',
      headline: copy.headline,
      primary_text: fullCopy,
      layers: copy,
      destination_url: destinationUrl,
      target_age_canon: 'Ages 2–7 (Pre-K to Grade 2)',
    },
    canon_verification: canonCheck,
    security_tier: 'tier_1_staging_sandbox',
    gate_action: 'Stage in Command Approval Gate before live Meta API spend.',
  };
}

/**
 * Rerun-inspired Foreman Goal Compiler:
 * Translates a plain-English campaign or growth goal into canon-verified multi-unit MCLS tasks.
 */
export function compileForemanPlan(options = {}) {
  const {
    goal = '',
    delta_key = 'SCREEN_VS_SENSORY',
    campaign_key = 'THE_ENEMY',
    engine_type = 'ENGINE_A_VALUE_GATE',
    daily_budget = 20,
  } = options;

  const cleanGoal = String(goal || '').trim();
  const matchedRules = FOREMAN_UNIT_RULES.filter((rule) => rule.keywords.test(cleanGoal));

  const selectedRules =
    matchedRules.length > 0
      ? matchedRules.slice(0, 4)
      : FOREMAN_UNIT_RULES.filter((r) =>
          ['MCLS-STUDIO', 'MCLS-PULSE', 'MCLS-GUARDIAN'].includes(r.unit_key)
        );

  const destination =
    engine_type === 'ENGINE_B_DIRECT_OFFER'
      ? 'https://soelearn.com/workbook'
      : 'https://soelearn.com/listen';

  const tasks = selectedRules.map((rule) => {
    const taskDest =
      rule.unit_key === 'MCLS-CONCORD' || rule.unit_key === 'MCLS-RECON'
        ? rule.target_destination
        : destination;

    const draft = {
      unit_key: rule.unit_key,
      action_type: rule.action_type,
      title: `[Foreman Plan] ${rule.unit_key}: ${cleanGoal.slice(0, 72) || `${campaign_key} (${delta_key})`}`,
      channel: rule.channel,
      target_destination: taskDest,
      delta_alignment: rule.unit_key === 'MCLS-CONCORD' ? 'INSTITUTION_VS_SANCTUARY' : delta_key,
      estimated_cost:
        rule.unit_key === 'MCLS-STUDIO' ? `$${Number(daily_budget)}.00/day (Staged Paused)` : '$0.00 (Staged)',
      summary: `${rule.role_summary} Goal: "${cleanGoal || 'Execute Ages 2–7 growth sprint'}"`,
      payload: {
        foreman_goal: cleanGoal,
        campaign_key,
        delta_key,
        engine_type,
        target_age_canon: 'Ages 2–7 (Pre-K to Grade 2)',
      },
    };

    const preflight = runAdversarialPreflightReview(rule.unit_key, draft, {
      customPrompt: cleanGoal,
    });

    return {
      ...draft,
      canon_status: preflight.status,
      preflight,
    };
  });

  return {
    goal: cleanGoal,
    delta_key,
    campaign_key,
    engine_type,
    selected_units: tasks.map((t) => t.unit_key),
    blocked_count: tasks.filter((t) => !t.preflight.passed).length,
    tasks,
  };
}

/**
 * Rerun-inspired Coworker Browser Box Pause & Human Takeover Handoff builder.
 */
export function buildBrowserTakeoverDraft(options = {}) {
  const {
    unit_key = 'MCLS-CONCORD',
    target_url = 'https://soelearn.com/institutions',
    checkpoint_reason = 'FINAL_PORTAL_SUBMIT',
    task_summary = 'Browser worker paused at gated UI checkpoint awaiting human verification.',
    vnc_or_worker_url = '',
    resume_instructions = 'Inspect staged fields, solve any login/2FA prompt, and approve submission.',
    delta_alignment = 'INSTITUTION_VS_SANCTUARY',
  } = options;

  const draft = {
    unit_key,
    action_type: 'browser_takeover_handoff',
    title: `[Browser Takeover] ${unit_key} paused (${checkpoint_reason})`,
    channel: 'Browser Worker Box (Playwright / VNC Takeover)',
    target_destination: target_url,
    delta_alignment,
    estimated_cost: '$0.00 (Human Checkpoint)',
    summary: task_summary,
    payload: {
      security_tier: 'tier_2_human_gated_mutation',
      checkpoint_reason,
      target_url,
      vnc_or_worker_url: vnc_or_worker_url || null,
      resume_instructions,
      requires_human_takeover: true,
    },
  };

  const preflight = runAdversarialPreflightReview(unit_key, draft);
  return {
    ...draft,
    canon_status: preflight.status,
    preflight,
  };
}

/**
 * Event/Webhook -> Reactive MCLS Task Mapper.
 * Converts Stripe, Brevo, Guardian, or Browser Worker webhooks into gated MCLS approval drafts.
 */
export function buildWebhookReactiveDraft(options = {}) {
  const { event_type = '', source = 'webhook', event_data = {} } = options;
  const normalizedEvent = String(event_type || '').toLowerCase().trim();

  if (
    normalizedEvent === 'portal.takeover_needed' ||
    normalizedEvent === 'browser.takeover_needed'
  ) {
    return buildBrowserTakeoverDraft({
      unit_key: event_data.unit_key || 'MCLS-CONCORD',
      target_url: event_data.target_url || 'https://soelearn.com/institutions',
      checkpoint_reason: event_data.checkpoint_reason || 'AUTH_OR_CAPTCHA',
      task_summary:
        event_data.task_summary ||
        'Browser coworker paused for human takeover before external submission.',
      vnc_or_worker_url: event_data.vnc_or_worker_url || '',
      resume_instructions:
        event_data.resume_instructions ||
        'Verify session in worker viewer and authorize continuation.',
    });
  }

  if (
    normalizedEvent === 'stripe.checkout.completed' ||
    normalizedEvent === 'checkout.session.completed'
  ) {
    const orderTotal = Number(
      event_data.order_total ?? (event_data.amount_total ? event_data.amount_total / 100 : 0)
    );
    const skuRef = String(event_data.client_reference_id || event_data.sku || 'SOE-ORDER');
    const isHighTicket = orderTotal >= 35;
    const unitKey = isHighTicket ? 'MCLS-GUARDIAN' : 'MCLS-PULSE';

    const draft = isHighTicket
      ? {
          unit_key: unitKey,
          action_type: 'webhook_roas_signal',
          title: `Engine B Conversion Signal ($${orderTotal.toFixed(2)}) — ${skuRef}`,
          channel: 'Stripe Direct Webhook -> MCLS-Guardian',
          target_destination: 'https://soelearn.com/workbook',
          delta_alignment: 'SCREEN_VS_SENSORY',
          estimated_cost: '$0.00 (Telemetry Evaluation)',
          summary: `Direct Stripe purchase ($${orderTotal.toFixed(2)}) detected for ${skuRef}. Stage +20% Engine B scale check and 90-day cohort attribution sync.`,
          payload: {
            source,
            event_type: normalizedEvent,
            order_total_dollars: orderTotal,
            sku_ref: skuRef,
            recommended_guardian_check: 'VERIFY_ENGINE_B_SCALE_ELIGIBILITY',
          },
        }
      : {
          unit_key: unitKey,
          action_type: 'webhook_nurture_followup',
          title: `Engine A Value-Gate / Bump Signal ($${orderTotal.toFixed(2)}) — ${skuRef}`,
          channel: 'Stripe Direct Webhook -> MCLS-Pulse',
          target_destination: 'https://soelearn.com/listen',
          delta_alignment: 'SCREEN_VS_SENSORY',
          estimated_cost: '$0.00 (Nurture Signal)',
          summary: `Listen-gate or $7 Starter Pack bump ($${orderTotal.toFixed(2)}) logged. Stage Sanctuary Dispatch 5-day onboarding check for Ages 2–7.`,
          payload: {
            source,
            event_type: normalizedEvent,
            order_total_dollars: orderTotal,
            sku_ref: skuRef,
            nurture_lane: 'Brevo 5-Day Sanctuary Welcome',
          },
        };

    const preflight = runAdversarialPreflightReview(unitKey, draft);
    return { ...draft, canon_status: preflight.status, preflight };
  }

  if (
    normalizedEvent === 'stripe.checkout.expired' ||
    normalizedEvent === 'checkout.session.expired'
  ) {
    const draft = {
      unit_key: 'MCLS-GUARDIAN',
      action_type: 'webhook_checkout_recovery',
      title: 'Abandoned Direct Stripe Checkout Audit (/listen -> /workbook)',
      channel: 'Stripe Direct Webhook -> MCLS-Guardian',
      target_destination: 'https://soelearn.com/listen',
      delta_alignment: 'SCREEN_VS_SENSORY',
      estimated_cost: '$0.00 (Recovery Draft)',
      summary:
        'Expired Stripe checkout session detected. Stage friction review and compliant Brevo recovery outline (Ages 2–7).',
      payload: {
        source,
        event_type: normalizedEvent,
        session_id: event_data.session_id || null,
        amount_total_dollars: Number(event_data.order_total || 0),
      },
    };
    const preflight = runAdversarialPreflightReview('MCLS-GUARDIAN', draft);
    return { ...draft, canon_status: preflight.status, preflight };
  }

  if (normalizedEvent === 'brevo.b2b_reply' || normalizedEvent === 'school_pilot.inquiry') {
    const orgName = String(event_data.organization || 'Early Childhood Consortium').trim();
    const draft = {
      unit_key: 'MCLS-CONCORD',
      action_type: 'institutional_pilot_outreach',
      title: `Inbound School Pilot Reply: ${orgName.slice(0, 55)}`,
      channel: 'Brevo B2B Webhook -> MCLS-Concord',
      target_destination: 'soelearn.com/institutions (CRM: school_pilot)',
      delta_alignment: 'INSTITUTION_VS_SANCTUARY',
      estimated_cost: '$0.00 (Staged Reply)',
      summary: `Inbound institutional reply from ${orgName}. Stage 5-Domain Readiness Gap Brief and 30-Day Pilot packet for operator approval.`,
      payload: {
        source,
        event_type: normalizedEvent,
        organization_name: orgName,
        contact_name: event_data.contact_name || 'Curriculum Director',
        recipient_email: event_data.email || 'info@soelearn.com',
        deal_value: Number(event_data.deal_value || 3500),
      },
    };
    const preflight = runAdversarialPreflightReview('MCLS-CONCORD', draft);
    return { ...draft, canon_status: preflight.status, preflight };
  }

  if (normalizedEvent === 'funnel.cpa_spike') {
    const metrics = Array.isArray(event_data.ad_metrics) ? event_data.ad_metrics : [];
    const guardianEval = evaluateRhythmGuardian(metrics);
    const draft = {
      unit_key: 'MCLS-GUARDIAN',
      action_type: 'rhythm_guardian_audit',
      title: `Reactive CPA Spike Guardrail Check (${metrics.length} ads evaluated)`,
      channel: 'Telemetry Webhook -> MCLS-Guardian',
      target_destination: 'https://soelearn.com/listen',
      delta_alignment: 'SCREEN_VS_SENSORY',
      estimated_cost: '$0.00 (Guardrail Check)',
      summary:
        'Automated CPA/CTR threshold alert evaluated against dual-horizon Engine A/B rules. Review pause/hold/scale actions.',
      payload: {
        source,
        event_type: normalizedEvent,
        guardian_evaluation: guardianEval,
      },
    };
    const preflight = runAdversarialPreflightReview('MCLS-GUARDIAN', draft);
    return { ...draft, canon_status: preflight.status, preflight };
  }

  const fallbackUnit = event_data.unit_key || 'MCLS-PRIME';
  const fallbackDraft = {
    unit_key: fallbackUnit,
    action_type: 'webhook_reactive_task',
    title: `[Webhook] ${normalizedEvent || 'external_event'} (${source})`,
    channel: `Webhook (${source}) -> ${fallbackUnit}`,
    target_destination: event_data.target_destination || 'https://soelearn.com/listen',
    delta_alignment: event_data.delta_key || 'SCREEN_VS_SENSORY',
    estimated_cost: '$0.00 (Staged)',
    summary:
      event_data.summary ||
      `Reactive MCLS approval card triggered by ${normalizedEvent || 'webhook'} from ${source}.`,
    payload: {
      source,
      event_type: normalizedEvent || 'custom_event',
      event_data,
    },
  };
  const preflight = runAdversarialPreflightReview(fallbackUnit, fallbackDraft);
  return { ...fallbackDraft, canon_status: preflight.status, preflight };
}
