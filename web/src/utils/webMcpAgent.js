import landsData from '../data/lands.json';
import tracksData from '../data/tracks.json';
import productsData from '../data/products.json';
import { submitSoeInterest } from '../services/soeSubmissions';
import { isValidEmail, setGateUnlocked } from './gateAuth';

const STANDARDS_MATRIX = {
  elof: {
    framework: 'Head Start Early Learning Outcomes Framework (ELOF)',
    domains: [
      'P-LIT 1 (Phonological Segments via Harmonia Track 03 & Track 15)',
      'P-MATH 1 (Rhythmic Counting & Patterns via Numeria Track 08 & Track 13)',
      'P-PMP 1 & 2 (Gross Motor & Midline Coordination via Vitalis Track 06 & Track 07)',
      'P-ATL 1 & 2 (Autonomic & Emotional Co-Regulation via Aquaria Track 14 & Track 18)',
      'P-SCI 1 (Nature, Weather & Cycles via Terrasol & Celestia)',
    ],
    url: 'https://thesoundofessentials.com/institutions',
  },
  naeyc: {
    framework: 'NAEYC Accreditation Early Learning Program Standards',
    domains: [
      '2.B.01 (Self-Regulation & Calm Transitions)',
      '2.E.04 (Auditory Phonological Awareness Before Print)',
      '2.J.06 (Rhythmic Movement & Aesthetic Integration)',
    ],
    url: 'https://thesoundofessentials.com/institutions',
  },
  'grow-well-sg': {
    framework: 'Singapore MOH / ECDA Grow Well SG Screen-Free Alignment',
    domains: [
      'Zero passive screen exposure for ages 2–7 circle-time & home routines',
      '60–80 BPM acoustic grounding & bilateral movement (Vitalis & Terrasol)',
    ],
    url: 'https://thesoundofessentials.com/global-learn-english',
  },
  who: {
    framework: 'WHO Under-5 Screen & Sedentary Behaviour Alignment',
    domains: [
      'Screen-free active rhythmic play replacing passive screen time',
      '10–15 minute adult-child co-regulated movement and vocal response',
    ],
    url: 'https://thesoundofessentials.com/science',
  },
  ecc: {
    framework: 'Caribbean Early Childhood Commission (ECC) Pillars',
    domains: [
      'Whole-child auditory literacy, motor agility, and rhythmic emotional safety (Ages 2–7)',
      'Zero-screen audio kits accessible via soelearn.com QR links',
    ],
    url: 'https://thesoundofessentials.com/institutions',
  },
};

export function recommendSoePathway({ age = 4, focus = 'phonics' } = {}) {
  const numericAge = Math.min(7, Math.max(2, Number(age) || 4));
  const query = String(focus || 'phonics').toLowerCase();

  let landId = 'harmonia';
  let trackSlug = 'alphabet-song-remix';
  let guideUrl = 'https://thesoundofessentials.com/downloads/SOE_5_Neural_Pathways_Guide.html';

  if (/(sensory|calm|adhd|autism|ot|slp|meltdown|sleep|regulat)/.test(query)) {
    landId = 'aquaria';
    trackSlug = 'the-ocean';
    guideUrl = 'https://thesoundofessentials.com/downloads/SOE_Sensory_Regulation_Guide.html';
  } else if (/(motor|move|stretch|body|bilateral|energy)/.test(query)) {
    landId = 'vitalis';
    trackSlug = 'lets-stretch';
    guideUrl = 'https://thesoundofessentials.com/downloads/SOE_Sensory_Regulation_Guide.html';
  } else if (/(math|count|number|shape|logic)/.test(query)) {
    landId = 'numeria';
    trackSlug = 'numbers';
  } else if (/(science|nature|weather|earth)/.test(query)) {
    landId = 'terrasol';
    trackSlug = 'changes';
  } else if (/(time|day|month|season)/.test(query)) {
    landId = 'celestia';
    trackSlug = 'days-of-the-week';
  } else if (/(bilingual|french|spanish|heritage|vocab|dictionary)/.test(query)) {
    landId = 'luminosity';
    trackSlug = 'le-cheval';
  }

  const land = landsData.find((l) => l.id === landId) || landsData[0];
  const track = tracksData.find((t) => t.slug === trackSlug) || tracksData[0];
  const digitalWorkbook = productsData.find((p) => p.id === 'rhythmready-workbook');

  return {
    guide: 'Seriphia',
    ageGroup: `Age ${numericAge} (within canonical Ages 2–7 Pre-K to Grade 2)`,
    recommendedLand: land.name,
    landFocus: land.focus,
    heroMentors: land.duoLabel,
    recommendedTrack: {
      id: track.id,
      slug: track.slug,
      audioFile: track.audioFile,
    },
    freeSignalUrl: 'https://thesoundofessentials.com/signal',
    printableGuideUrl: guideUrl,
    nextStepWorkbook: digitalWorkbook
      ? {
          name: digitalWorkbook.name,
          digitalPriceUsd: digitalWorkbook.price,
          printPriceUsd: digitalWorkbook.printPrice,
          url: 'https://thesoundofessentials.com/rhythm-ready',
        }
      : null,
  };
}

export function crosswalkSoeStandards({ framework = 'elof' } = {}) {
  const key = String(framework || 'elof').toLowerCase().trim();
  const entry = STANDARDS_MATRIX[key] || STANDARDS_MATRIX.elof;
  return {
    ...entry,
    ageRange: 'Ages 2–7 (Pre-K to Grade 2)',
    alignmentDisclosure:
      'Independent curriculum designed in alignment with publicly published frameworks; does not imply government or intergovernmental endorsement.',
  };
}

export function generateSoeReferralLink({ code = '', destination = '/signal' } = {}) {
  const safeCode = String(code || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 48);
  const safePath = String(destination || '/signal').startsWith('/')
    ? destination
    : '/signal';
  const baseUrl = `https://soelearn.com${safePath}`;
  return {
    referralUrl: safeCode ? `${baseUrl}?ref=${encodeURIComponent(safeCode)}` : baseUrl,
    bountyRange: '30% to 35% (Share the Sound Ambassador Program)',
    canonicalDomain: 'https://thesoundofessentials.com',
    qrResolverDomain: 'https://soelearn.com',
  };
}

export async function unlockFreeSoeSignal({ email = '', name = 'Agent Explorer' } = {}) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return {
      ok: false,
      error: 'A valid parent or educator email address is required to unlock the 19-track Signal.',
    };
  }

  let submitted = false;
  try {
    await submitSoeInterest({
      kind: 'interest',
      email: cleanEmail,
      name: String(name || 'Agent Explorer').slice(0, 120),
      sourcePath: '/signal#webmcp',
    });
    submitted = true;
  } catch {
    submitted = false;
  }

  if (typeof window !== 'undefined') {
    setGateUnlocked(cleanEmail, name, 'parent');
  }

  return {
    ok: true,
    submitted,
    email: cleanEmail,
    unlockedResources: [
      'https://thesoundofessentials.com/player',
      'https://thesoundofessentials.com/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html',
      'https://thesoundofessentials.com/downloads/SOE_5_Neural_Pathways_Guide.html',
      'https://thesoundofessentials.com/downloads/SOE_Sensory_Regulation_Guide.html',
    ],
  };
}

export function getSoeWebMcpTools() {
  return [
    {
      name: 'seriphia_recommend_pathway',
      description:
        'Recommends an Ages 2–7 screen-free Land, Hero Mentors, studio track, and printable guide based on child age (2–7) and developmental focus.',
      inputSchema: {
        type: 'object',
        properties: {
          age: { type: 'number', minimum: 2, maximum: 7 },
          focus: { type: 'string' },
        },
      },
      execute: async (args) => recommendSoePathway(args),
    },
    {
      name: 'seriphia_unlock_free_signal',
      description:
        'Unlocks the free ($0) 19-track studio-recorded album and 3 printable field guides for a verified parent or educator email.',
      inputSchema: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          name: { type: 'string' },
        },
        required: ['email'],
      },
      execute: async (args) => unlockFreeSoeSignal(args),
    },
    {
      name: 'seriphia_crosswalk_standards',
      description:
        'Returns early childhood standards alignment (elof, naeyc, grow-well-sg, who, ecc) for Ages 2–7.',
      inputSchema: {
        type: 'object',
        properties: {
          framework: {
            type: 'string',
            enum: ['elof', 'naeyc', 'grow-well-sg', 'who', 'ecc'],
          },
        },
      },
      execute: async (args) => crosswalkSoeStandards(args),
    },
    {
      name: 'seriphia_generate_referral_link',
      description:
        'Generates a canonical soelearn.com referral link for the 30%–35% Share the Sound Ambassador program.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          destination: { type: 'string' },
        },
      },
      execute: async (args) => generateSoeReferralLink(args),
    },
  ];
}

/**
 * Registers SOE WebMCP tools into navigator.modelContext when supported by the
 * visitor's AI browser, and exposes a deterministic mirror at window.__SOE_WEBMCP__.
 */
export function registerSoeWebMcp() {
  if (typeof window === 'undefined') return [];
  const tools = getSoeWebMcpTools();

  if (!window.__SOE_WEBMCP__) {
    window.__SOE_WEBMCP__ = {
      agent: 'Seriphia — The Sound of Essentials',
      version: '2.0.0',
      tools: tools.map(({ name, description, inputSchema, execute }) => ({
        name,
        description,
        inputSchema,
        execute,
      })),
    };
  }

  const mc = typeof navigator !== 'undefined' ? navigator.modelContext : null;
  if (mc && typeof mc.registerTool === 'function' && !window.__SOE_WEBMCP_REGISTERED__) {
    for (const tool of tools) {
      try {
        mc.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          execute: tool.execute,
        });
      } catch {
        // Ignore duplicate tool registration errors on HMR / strict mode
      }
    }
    window.__SOE_WEBMCP_REGISTERED__ = true;
  }

  return tools;
}
