#!/usr/bin/env node
/**
 * ============================================================================
 * SOE ROUTE PRERENDER / STATIC HTML SHELL GENERATOR
 * ============================================================================
 * Runs after `vite build` to generate dist/<route>/index.html for every
 * indexable SPA route so search crawlers and non-JS fetchers receive:
 *   - Unique <title> and <meta name="description">
 *   - Self-referencing <link rel="canonical">
 *   - Accurate Open Graph & Twitter tags
 *   - Route-specific WebPage JSON-LD (replacing the homepage @graph)
 *   - Semantic pre-rendered <div id="root"> HTML before React mounts
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pseoPages } from '../src/data/pseoData.js';
import {
  ALL_RESOURCE_PILLARS,
  RESOURCE_ARTICLES,
  RESOURCE_AUTHOR,
  RESOURCE_PILLARS,
  getArticlesByPillar,
  getPillarById,
} from '../src/data/resourcesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(WEB_ROOT, 'public');
const DIST_DIR = path.resolve(WEB_ROOT, 'dist');
const SITE_URL = 'https://thesoundofessentials.com';

const lands = JSON.parse(fs.readFileSync(path.resolve(WEB_ROOT, 'src/data/lands.json'), 'utf8'));
const heroes = JSON.parse(fs.readFileSync(path.resolve(WEB_ROOT, 'src/data/heroes.json'), 'utf8'));
const tracks = JSON.parse(fs.readFileSync(path.resolve(WEB_ROOT, 'src/data/tracks.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.resolve(WEB_ROOT, 'src/data/products.json'), 'utf8'));

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractPublicMainHtml(filename) {
  const filePath = path.resolve(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prerender source HTML missing: public/${filename}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const mainMatch = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const articleMatch = !mainMatch ? raw.match(/<article[^>]*>([\s\S]*?)<\/article>/i) : null;
  const bodyMatch = !mainMatch && !articleMatch ? raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i) : null;
  const extracted = (mainMatch || articleMatch || bodyMatch)?.[1];
  if (!extracted || extracted.trim().length < 100) {
    throw new Error(`Failed to extract semantic <main> HTML from public/${filename}`);
  }
  return extracted
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/\sdata-testid="[^"]*"/gi, '')
    .trim();
}

function buildComparisonFaqSchema(competitorName) {
  return {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Why are parents and educators seeking screen-free alternatives to ${competitorName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many families and early educators experience behavioral overstimulation, screen fatigue, and passive tap-and-guess mechanics with tablet-based apps. Screen-free alternatives like The Sound of Essentials: Rhythm Quest ground learning in acoustic musical rhythm, fine-motor pencil grip, and sensory tactile exploration for ages 2–7.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does auditory and music-powered learning compare to visual tablet apps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Peer-reviewed research in Nature Scientific Reports demonstrates that rhythm discrimination directly trains the temporal processing networks in the brain responsible for phonemic segmentation—the root foundation of reading proficiency—without inducing dopamine-spiking screen addiction.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much time does each daily Sound of Essentials lesson take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lessons are designed as focused 10 to 15 minute screen-free daily blocks, making them sustainable for busy parents and seamless for preschool circle time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the starting price to begin The Sound of Essentials?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The full 19-track Deluxe album is gifted 100% free ($0). Families and schools can pair the music with the $19 Rhythm Quest companion book and physical print workbooks with zero recurring subscription lock-in.',
        },
      },
    ],
  };
}

function layoutEditorialShell(innerMainHtml) {
  return `
    <header style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 1rem;">
      <nav aria-label="Main Navigation">
        <a href="/" style="font-weight: 700; color: #FF6F00; text-decoration: none; font-size: 1.25rem; display: inline-block; margin-bottom: 0.5rem;">The Sound of Essentials: Rhythm Quest</a>
        <div style="margin-top: 0.5rem; font-size: 0.92rem; display: flex; gap: 0.6rem 1rem; flex-wrap: wrap;">
          <a href="/listen" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">The 19-Track Album</a>
          <a href="/resources" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Learning Library</a>
          <a href="/rhythm-ready" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Rhythm Ready Workbook</a>
          <a href="/workbook" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Picture Dictionary</a>
          <a href="/heroes" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">15 Hero Mentors &amp; 7 Lands</a>
          <a href="/science" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Science of Sound</a>
          <a href="/solutions" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Solutions Directory</a>
          <a href="/mission" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Our Mission</a>
          <a href="/join" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Contact Us</a>
        </div>
      </nav>
    </header>
    <main style="max-width: 960px; margin: 0 auto; padding: 1rem 1.5rem 3rem; line-height: 1.7; color: #2B2016; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      ${innerMainHtml}
    </main>
    <footer style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; border-top: 1px solid #E2E8F0; font-size: 0.88rem; color: #64748B;">
      <p>&copy; 2026 The Sound of Essentials. Designed for Ages 2–7 (Pre-K to Grade 2). <a href="/privacy" style="color: #475569;">Privacy</a> &middot; <a href="/terms" style="color: #475569;">Terms</a> &middot; <a href="/dmca" style="color: #475569;">DMCA</a></p>
    </footer>
  `.trim();
}

function layoutShell({ h1, badge, bodyHtml }) {
  return `
    <header style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 1rem;">
      <nav aria-label="Main Navigation">
        <a href="/" style="font-weight: 700; color: #FF6F00; text-decoration: none; font-size: 1.25rem; display: inline-block; margin-bottom: 0.5rem;">The Sound of Essentials: Rhythm Quest</a>
        <div style="margin-top: 0.5rem; font-size: 0.92rem; display: flex; gap: 0.6rem 1rem; flex-wrap: wrap;">
          <a href="/listen" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">The 19-Track Album</a>
          <a href="/resources" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Learning Library</a>
          <a href="/rhythm-ready" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Rhythm Ready Workbook</a>
          <a href="/workbook" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Picture Dictionary</a>
          <a href="/heroes" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">15 Hero Mentors &amp; 7 Lands</a>
          <a href="/science" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Science of Sound</a>
          <a href="/solutions" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Solutions Directory</a>
          <a href="/mission" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Our Mission</a>
          <a href="/join" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Contact Us</a>
        </div>
      </nav>
    </header>
    <main style="max-width: 960px; margin: 0 auto; padding: 1rem 1.5rem 3rem; line-height: 1.7; color: #2B2016; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <article>
        <header>
          ${badge ? `<p style="font-size: 0.85rem; font-weight: 700; color: #FF6F00; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.25rem;">${escapeHtml(badge)}</p>` : ''}
          <h1 style="font-size: 2.1rem; line-height: 1.2; color: #2B2016; margin-top: 0;">${escapeHtml(h1)}</h1>
        </header>
        ${bodyHtml}
      </article>
    </main>
    <footer style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; border-top: 1px solid #E2E8F0; font-size: 0.88rem; color: #64748B;">
      <p>&copy; 2026 The Sound of Essentials. Designed for Ages 2–7 (Pre-K to Grade 2). <a href="/privacy" style="color: #475569;">Privacy</a> &middot; <a href="/terms" style="color: #475569;">Terms</a> &middot; <a href="/dmca" style="color: #475569;">DMCA</a></p>
    </footer>
  `.trim();
}

const getPseoRoute = (p) => {
  const prefix = p.type === 'for' ? '/for/' : p.type === 'solution' ? '/solutions/' : '/guides/';
  return `${prefix}${p.slug}`;
};

const routes = [
  {
    route: '/listen',
    title: "Rhythm Quest 19-Track Album | Screen-Free Sensory Children's Music & Tactile Rituals for Ages 2–7",
    description: 'Build kindergarten-ready focus, phonics, and calm in 10 minutes a day without glowing screens or tablet battles. Unlock all 19 studio-recorded acoustic tracks (60–80 BPM) and our printable First 10 Minutes Tactile Ritual Card free ($0).',
    bodyHtml: layoutShell({
      badge: 'Education Concord · Screen-Free Learning Advocacy (Ages 2–7)',
      h1: 'Build Kindergarten-Ready Focus, Phonics, and Calm Without Glowing Screens',
      bodyHtml: `
        <p>Stream all 19 original studio-recorded acoustic tracks (60 to 80 BPM) alongside our printable <em>First 10 Minutes</em> Tactile Ritual Card free ($0) as living proof for your home or classroom.</p>
        <h2>Included Tracks Across the 7 Lands</h2>
        <ul>
          ${tracks.map((tr) => `<li><strong>Track ${String(tr.id).padStart(2, '0')}:</strong> ${escapeHtml(tr.slug.replace(/-/g, ' '))} (${escapeHtml(tr.landId)})</li>`).join('\n          ')}
        </ul>
        <p><a href="/rhythm-ready">Explore the 8-Week Rhythm Ready Workbook</a> &middot; <a href="/heroes">Meet the 15 Hero Mentors</a></p>
      `,
    }),
  },
  {
    route: '/signal',
    title: 'The Seriphia Signal | Free 19-Track Screen-Free Acoustic Lifeline & Guides (Ages 2–7)',
    description:
      'Seriphia answers the early learning state of emergency for ages 2–7. Unlock the free 19-track studio-recorded acoustic lifeline, 5 Neural Pathways Guide, and Sensory Regulation Guide.',
    extraSchemas: [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is included free inside The Seriphia Signal for ages 2–7?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Families and educators unlock free streaming for all 19 master studio recordings (60–110 BPM) plus three printable screen-free guides: the First 10 Minutes Tactile Ritual Card, the 5 Neural Pathways Field Guide, and the SOE Sensory & Acoustic Regulation Guide.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does The Sound of Essentials support children ages 2–7 without screens?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Guided by Seriphia and 14 Land Heroes across 7 developmental Lands, the curriculum delivers Sound Before Symbol phonemic songs, bilateral midline movement, and tactile 10-block daily workbook routines for Pre-K through Grade 2.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which print and digital editions follow the free 19-track signal?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Families can add the $7 Quest Starter & Coloring Pack, explore the Rhythm Quest Companion Storybook ($19 Digital / $35 Physical Print), order the 40-day Rhythm Ready Workbook ($21 Digital PDF / $45 Physical Print with Free US Shipping), or reserve their copy of the $55 Essential Picture Dictionary (4,000+ words across 125 scenes).',
            },
          },
        ],
      },
    ],
    bodyHtml: layoutShell({
      badge: 'Staying on the Path, Always Learning · Ages 2–7',
      h1: "Seriphia's Acoustic Signal for Early Learning",
      bodyHtml: `
        <p>Seriphia and 14 Land Heroes answer the early learning state of emergency for ages 2–7 with 19 master studio recordings with authentic human vocals and warm acoustic arrangements (60–110 BPM), paired with three printable screen-free guides.</p>
        <h2>Included Free With Your Signal Unlock ($0)</h2>
        <ul>
          <li><a href="/player"><strong>19-Track Acoustic Streaming Player</strong></a> — Sound Before Symbol songs spanning all 7 Lands</li>
          <li><a href="/assets/SOE_First_10_Minutes_Tactile_Ritual_Card.html"><strong>First 10 Minutes Tactile Ritual Card</strong></a> — Zero-prep circle-time and home routines</li>
          <li><a href="/downloads/SOE_5_Neural_Pathways_Guide.html"><strong>The 5 Neural Pathways Field Guide</strong></a> — Auditory, spatial, midline motor, calming, and Socratic inquiry pathways</li>
          <li><a href="/downloads/SOE_Sensory_Regulation_Guide.html"><strong>The SOE Sensory &amp; Acoustic Regulation Guide</strong></a> — Parent, OT, and SLP rhythmic pacing reference</li>
        </ul>
        <h2>5 Sanctuary Frequencies</h2>
        <p>Explore Neuro-Parenting (<a href="/science">/science</a>), Micro-School Pods &amp; Classrooms (<a href="/institutions">/institutions</a>), Heritage &amp; Bilingual Immersion (<a href="/workbook#dictionary-presale">$55 Picture Dictionary — Reserve your copy</a>), Sensory Regulation (<a href="/sing-along-time">/sing-along-time</a>), and Tactile Print Editions (<a href="/rhythm-ready">$21 Digital / $45 Print Workbook</a>).</p>
      `,
    }),
  },
  {
    route: '/rhythm-ready',
    title: 'Rhythm Ready Workbook | 8-Week Screen-Free Preschool Readiness & Kindergarten Prep Activities (Ages 2–7)',
    description: 'Explore the 40-day Rhythm Ready Workbook (~400 tactile activities) and Essential Picture Dictionary (4,000+ words across 125 illustrated scenes) for ages 2–7.',
    bodyHtml: layoutShell({
      badge: '8-Week Tactile Readiness Quest · Ages 2–7',
      h1: 'Rhythm Ready Workbook & Picture Dictionary',
      bodyHtml: `
        <p>A 40-day, ~400-activity screen-free readiness quest pairing daily 10-block tactile exercises with the 19-track acoustic album across all 7 Lands.</p>
        <h2>Available Editions &amp; Curriculum Companions</h2>
        <ul>
          ${products.map((p) => `<li><strong>${escapeHtml(p.name)}</strong> — $${escapeHtml(p.price)} (${escapeHtml(p.format || p.type)})</li>`).join('\n          ')}
        </ul>
      `,
    }),
  },
  {
    route: '/workbook',
    title: 'Essential Picture Dictionary & Rhythm Ready Workbook | The Sound of Essentials',
    description: 'Reserve your copy of The Essential Picture Dictionary (4,000+ words across 125 illustrated scenes) and explore the 8-week Rhythm Ready Workbook for ages 2–7.',
    bodyHtml: layoutShell({
      badge: '4,000+ Words · 125 Illustrated Scenes',
      h1: 'The Essential Picture Dictionary & Rhythm Ready Workbook',
      bodyHtml: `
        <p>Spanning 4,000+ vocabulary words across 125 illustrated scenes in 7 Learning Lands, The Essential Picture Dictionary pairs spoken rhythm with visual literacy, phonetic guides, and ASL sign descriptions.</p>
        <ul>
          ${lands.map((l) => `<li><strong>${escapeHtml(l.name)}</strong> (${escapeHtml(l.domain || l.subtitle || '')}) — Mentors: ${escapeHtml((l.heroes || []).join(' & '))}</li>`).join('\n          ')}
        </ul>
      `,
    }),
  },
  {
    route: '/heroes',
    title: 'The 15 Hero Mentors & 7 Learning Lands — SOE Rhythm Quest',
    description: 'Meet Seriphia and the 14 hero mentors across the 7 Learning Lands (Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, Terrasol) for ages 2–7.',
    bodyHtml: layoutShell({
      badge: 'World Model · 7 Lands & 15 Heroes',
      h1: 'Meet Seriphia & the 15 Hero Mentors',
      bodyHtml: `
        <p>Every child journeys through seven musical lands guided by Seriphia and 14 developmental mentors.</p>
        <ul>
          ${heroes.map((h) => `<li><strong>${escapeHtml(h.name)}</strong> — ${escapeHtml(h.title)} (${escapeHtml(h.land)}): ${escapeHtml(h.bio)}</li>`).join('\n          ')}
        </ul>
      `,
    }),
  },
  {
    route: '/science',
    title: 'Science of the Sound — SOE Rhythm Quest',
    description: 'Auditory neuroscience, Sound Before Symbol pedagogy, Dalcroze Eurhythmics, Orff Schulwerk, and Kodály foundations for ages 2–7.',
    bodyHtml: layoutShell({
      badge: 'Pedagogy & Auditory Neuroscience',
      h1: 'Science of the Sound: Sound Before Symbol',
      bodyHtml: `
        <p>Children hear, segment, and internalize spoken rhythm before they decode printed letters. The Sound of Essentials unites Dalcroze Eurhythmics, Orff Schulwerk, and the Kodály Method with NAEYC and Head Start ELOF early learning frameworks.</p>
        <ul>
          <li><strong>Dalcroze Eurhythmics:</strong> Whole-body rhythmic movement anchoring meter and coordination.</li>
          <li><strong>Orff Schulwerk:</strong> Speech rhythms, chanting, and acoustic musical call-and-response.</li>
          <li><strong>Kodály Method:</strong> Sequential ear training led by the singing voice.</li>
          <li><strong>NAEYC &amp; Head Start ELOF:</strong> Mapped across Language, Cognitive, Physical, Science, and Social-Emotional domains for ages 2–7.</li>
        </ul>
      `,
    }),
  },
  {
    route: '/mission',
    title: 'Our Mission & Advocacy Stance — SOE Rhythm Quest',
    description: 'Our Education Concord advocacy stance: protecting ages 2–7 from passive screen overstimulation and eliminating educator prep burnout through organic acoustic warmth and tactile learning.',
    bodyHtml: layoutShell({
      badge: 'Education Concord · Our Advocacy Stance',
      h1: 'Advocating for Screen-Free Childhood: Living Proof, Not a Pitch',
      bodyHtml: `
        <p>Founded by L.D. Murray and guided by Seriphia, The Sound of Essentials stands with families and educators to protect ages 2 through 7 from passive screen overload and prep burnout through organic acoustic warmth and analog tactile rituals.</p>
        <p><a href="/listen">Unlock the Free 19-Track Album &amp; Ritual Card</a> &middot; <a href="/science">Read the Pedagogical Science</a></p>
      `,
    }),
  },
  {
    route: '/join',
    title: 'Join the Quest — SOE Rhythm Quest',
    description: 'Stand with the Education Concord screen-free early learning sanctuary for ages 2–7. Built for families, homeschoolers, and early childhood educators.',
    bodyHtml: layoutShell({
      badge: 'Education Concord Advocacy',
      h1: 'Stand With the Screen-Free Sanctuary',
      bodyHtml: `
        <p>Start with the free 19-track acoustic album and printable 10-minute tactile ritual card, or request a Director Review Pass and 50-state standards crosswalk for your classrooms.</p>
        <p><a href="/listen">Unlock the Free Album</a> &middot; <a href="/institutions">Institutional Advocacy</a></p>
      `,
    }),
  },
  {
    route: '/solutions',
    title: 'Educational Solutions & Curriculum Frameworks | The Sound of Essentials',
    description: 'Eliminating teacher prep burnout and passive screen dependency with turnkey 60–80 BPM acoustic and tactile learning aligned to Head Start ELOF, NAEYC, and 50-state standards (ages 2–7).',
    bodyHtml: layoutShell({
      badge: 'Education Concord · Screen-Free Advocacy',
      h1: 'Educational Solutions & Curriculum Frameworks',
      bodyHtml: `
        <p>Zero-prep, screen-free music and tactile frameworks aligned with Head Start ELOF, NAEYC, and 50-state early learning standards for ages 2–7.</p>
        <ul>
          ${pseoPages.map((p) => `<li><a href="${escapeHtml(getPseoRoute(p))}">${escapeHtml(p.h1)}</a> — ${escapeHtml(p.metaDescription)}</li>`).join('\n          ')}
        </ul>
      `,
    }),
  },
  {
    route: '/institutions',
    title: 'Education Concord Institutional Advocacy & Curriculum | The Sound of Essentials',
    description: 'Deliver screen-free multi-sensory learning aligned with Head Start ELOF, NAEYC, state standards, and international early-childhood guidelines across all 5 domains without teacher prep burnout (ages 2–7).',
    bodyHtml: layoutShell({
      badge: 'Education Concord · Institutional Advocacy',
      h1: 'Deliver Screen-Free Learning Aligned With Domestic & Global Early-Childhood Guidelines Across All 5 Domains',
      bodyHtml: `
        <p>Turnkey 10 to 15 minute acoustic rhythm and tactile classroom rituals (60 to 80 BPM) designed in alignment with Head Start ELOF, NAEYC, state early-learning frameworks, and leading international screen-free guidelines (WHO under-5, Singapore Grow Well SG, India IAP, China MOE, and Caribbean ECC), with zero student PII or screen setup required.</p>
        <p><em>Independent Policy Alignment: SOE is an independent curriculum designed in alignment with publicly published frameworks; alignment reflects pedagogical design and does not imply government or intergovernmental endorsement.</em></p>
        <p><a href="/solutions">Browse All Educator Frameworks</a></p>
      `,
    }),
  },
  {
    route: '/headphones',
    title: 'Safe Sensory Headphones (74/85dB) for Ages 2–7 | The Sound of Essentials',
    description: 'Volume-limited 74/85dB kids headphones with braided tangle-free audio cable designed for screen-free acoustic listening sessions.',
    bodyHtml: layoutShell({
      badge: 'Sensory Listening Hardware',
      h1: 'AWATRUE HK05 Safe Sensory Kids Headphones (74/85dB)',
      bodyHtml: `
        <p>Zero-radiation wired 3.5mm stereo headphones with dual 74dB/85dB safe volume limiting and hypoallergenic cushions engineered for sensitive young listeners.</p>
      `,
    }),
  },
  {
    route: '/gallery',
    title: 'Sample Pages — Rhythm Quest Storybook — The Sound of Essentials',
    description: 'Preview illustrated spreads and characters from The Sound of Essentials: Rhythm Quest storybook and picture dictionary.',
    bodyHtml: layoutShell({
      badge: 'Illustrated Preview',
      h1: 'Rhythm Quest Storybook & Art Gallery',
      bodyHtml: `
        <p>Explore sample illustrations from the 7 Lands and 15 Hero Mentors across the Rhythm Quest storybook and Essential Picture Dictionary.</p>
      `,
    }),
  },
  {
    route: '/privacy',
    title: 'Privacy Policy & COPPA Compliance — SOE Rhythm Quest',
    description: 'Privacy Policy and COPPA children’s privacy protections for The Sound of Essentials.',
    bodyHtml: layoutShell({
      badge: 'Legal & Compliance',
      h1: 'Privacy Policy & COPPA Compliance',
      bodyHtml: `<p>Details on how The Sound of Essentials handles parent contact preferences, privacy consent, and COPPA compliance.</p>`,
    }),
  },
  {
    route: '/terms',
    title: 'Terms of Service & Auto-Renewal Policy — SOE Rhythm Quest',
    description: 'Terms of Service, licensing, and subscription disclosure for The Sound of Essentials.',
    bodyHtml: layoutShell({
      badge: 'Legal & Compliance',
      h1: 'Terms of Service',
      bodyHtml: `<p>Terms governing use of The Sound of Essentials website, digital downloads, print products, and optional memberships.</p>`,
    }),
  },
  {
    route: '/dmca',
    title: 'DMCA Copyright & Safe Harbor Policy — SOE Rhythm Quest',
    description: 'DMCA copyright notice and intellectual property policy for The Sound of Essentials.',
    bodyHtml: layoutShell({
      badge: 'Legal & Compliance',
      h1: 'DMCA Copyright Policy',
      bodyHtml: `<p>Intellectual property and DMCA safe harbor contact information for The Sound of Essentials.</p>`,
    }),
  },
  // ── Editorial Story & Sovereign Pre-Sell Bridge Routes ───────────────────
  {
    route: '/story',
    title: 'More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read — and It Starts with Sound, Not Screens | The Sound of Essentials',
    description: 'Leaving behind the frenetic noise of autoplay loops, our quest enters a neuro-affirming sanctuary—anchoring early childhood literacy and math to calm, acoustic rhythms during the brain\'s golden window.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('story.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'More Moms Are Pulling Their Kids Off the Apps for a Quieter Way to Learn to Read — and It Starts with Sound, Not Screens',
        description: 'Leaving behind the frenetic noise of autoplay loops, our quest enters a neuro-affirming sanctuary—anchoring early childhood literacy and math to calm, acoustic rhythms during the brain\'s golden window, completely free from ads, algorithms, and dopamine traps.',
        author: {
          '@type': 'Person',
          name: 'Ivy W.',
          jobTitle: 'Early Literacy & Pediatric Sound Contributor',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        datePublished: '2026-09-13',
        dateModified: '2026-09-14',
        mainEntityOfPage: `${SITE_URL}/story`,
      },
    ],
  },
  {
    route: '/dad-reading-apps-review',
    title: 'I Spent $240 on Top-Rated Reading Apps. Here Are 5 Reasons I Deleted Every Single One. | The Sound of Essentials',
    description: 'A software engineer and father reviews why gamified reading apps fail phonemic decoding and how an acoustic, screen-free rhythm quest rewired his child\'s reading confidence.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('dad-reading-apps-review.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'I Spent $240 on Top-Rated Reading Apps. Here Are 5 Reasons I Deleted Every Single One.',
        description: 'A software engineer and father reviews why gamified reading apps fail phonemic decoding and how acoustic rhythm restored reading confidence.',
        author: {
          '@type': 'Person',
          name: 'David Vance',
          jobTitle: 'Software Engineer & Father',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: `${SITE_URL}/dad-reading-apps-review`,
      },
    ],
  },
  {
    route: '/education-sovereignty',
    title: 'The Sovereign Child: Why the Fall of the Federal Department of Education Is Returning Early Learning to the Living Room Sanctuary | The Sound of Essentials',
    description: 'How early childhood education is decentralizing from standardized institutional screens into living room sanctuaries powered by acoustic rhythm and whole-body phonics.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('education-sovereignty.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'The Sovereign Child: Why the Fall of the Federal Department of Education Is Returning Early Learning to the Living Room Sanctuary',
        author: {
          '@type': 'Person',
          name: 'Sarah Jenkins',
          jobTitle: 'Senior Educational Journalist & Mother',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: `${SITE_URL}/education-sovereignty`,
      },
    ],
  },
  {
    route: '/global-learn-english',
    title: 'Sound Before Symbol: How Natural Acoustic Cadence Teaches English Without Screen Fatigue | The Sound of Essentials',
    description: 'Why global bilingual families are switching from gamified screen apps to natural acoustic cadence for English language acquisition in children ages 2–7.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('global-learn-english.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'Sound Before Symbol: How Natural Acoustic Cadence Teaches English Without Screen Fatigue',
        author: {
          '@type': 'Person',
          name: 'Natalia Rostova',
          jobTitle: 'Multilingual Pedagogy Specialist',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: `${SITE_URL}/global-learn-english`,
      },
    ],
  },
  {
    route: '/sing-along-time',
    title: 'The 90–110 BPM Reset: Why Rhythm Scaffolds Language, Motor Coordination, and Focus | The Sound of Essentials',
    description: 'Pediatric specialists and early educators explore how tempo-regulated acoustic music (90–110 BPM) regulates the parasympathetic nervous system and builds speech fluency in children ages 2–7.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('sing-along-time.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'The 90–110 BPM Reset: Why Rhythm Scaffolds Language, Motor Coordination, and Focus',
        author: {
          '@type': 'Person',
          name: 'Dr. Julian Vance & Early Learning Collective',
          jobTitle: 'Developmental Neuro-Rhythm Researchers',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: `${SITE_URL}/sing-along-time`,
      },
    ],
  },
  // ── Competitor Alternative & Comparison Guides ───────────────────────────
  {
    route: '/alternatives/abcmouse',
    title: 'The 5 Best ABCmouse Alternatives for Screen-Free Early Literacy in 2026 | The Sound of Essentials',
    description: 'Tired of tablet battles, guessing games, and monthly app subscriptions? Explore the 5 best screen-free ABCmouse alternatives for ages 2–7, ranked by phonics decoding retention, calm nervous-system regulation, and genuine reading mastery.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('abcmouse-alternatives.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'The 5 Best ABCmouse Alternatives for Screen-Free Early Literacy in 2026',
        description: 'An objective parent and educator guide reviewing the 5 best screen-free ABCmouse alternatives for children ages 2–7, ranked by phonics decoding retention, sensory nervous-system regulation, and sustainable engagement.',
        url: `${SITE_URL}/alternatives/abcmouse`,
        author: {
          '@type': 'Person',
          name: 'Sarah Jenkins',
          jobTitle: 'Early Childhood Curriculum Specialist',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        datePublished: '2026-10-06',
        dateModified: '2026-10-06',
      },
      {
        '@type': 'ItemList',
        name: 'Top 5 ABCmouse Alternatives for Screen-Free Early Literacy',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'The Sound of Essentials: Rhythm Quest',
            description: 'Complete auditory learning ecosystem featuring 19 master acoustic tracks across 7 lands, teaching sound-before-symbol phonemic awareness with zero screens.',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'The Screen-Free Audio Sanctuary',
            description: 'Safe-volume sensory headphone player and dedicated acoustic listening environment designed to replace bedtime tablet struggles.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'The Rhythm Ready Tactile Workbook',
            description: 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities building fine-motor muscle memory.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'The Essential Picture Dictionary',
            description: '4,000+ word illustrated storybook volume across 125 scenes, anchoring phonics to rich semantic context without gamified cartoon distractions.',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'SOE Educator & Classroom Concord',
            description: 'Turnkey 10-15 minute screen-free classroom lesson extensions aligned with Head Start ELOF and NAEYC early childhood standards.',
          },
        ],
      },
      buildComparisonFaqSchema('ABCmouse'),
    ],
  },
  {
    route: '/alternatives/reading-eggs',
    title: 'The 5 Best Reading Eggs Alternatives for Screen-Free Phonics & Reading (2026 Parent Guide) | The Sound of Essentials',
    description: 'Looking for Reading Eggs alternatives? Discover the 5 best screen-free phonics and reading programs for ages 2–7, ranked by phonemic decoding retention, sensory calm, and real paper reading mastery.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('reading-eggs-alternatives.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'The 5 Best Reading Eggs Alternatives for Screen-Free Phonics & Reading in 2026',
        description: 'An objective parent and educator review evaluating the 5 best screen-free Reading Eggs alternatives for children ages 2–7, ranked by phonics decoding retention, calm sensory nervous-system regulation, and genuine paper book reading skills.',
        url: `${SITE_URL}/alternatives/reading-eggs`,
        author: {
          '@type': 'Person',
          name: 'Sarah Jenkins',
          jobTitle: 'Early Childhood Curriculum Specialist',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        datePublished: '2026-10-06',
        dateModified: '2026-10-06',
      },
      {
        '@type': 'ItemList',
        name: 'Top 5 Reading Eggs Alternatives for Screen-Free Phonics',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'The Sound of Essentials: Rhythm Quest',
            description: 'Premier auditory early literacy ecosystem featuring 19 master acoustic tracks across 7 learning lands, teaching sound-before-symbol phonemic awareness with zero screens.',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'The Rhythm Ready Tactile Workbook',
            description: 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities that build physical handwriting muscle memory.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'The Screen-Free Audio Sanctuary',
            description: 'Safe-volume sensory headphone listening player and acoustic storytelling system designed to replace evening tablet drill fatigue.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'The Essential Picture Dictionary',
            description: '4,000+ word illustrated storybook volume across 125 scenes, anchoring phonics to rich semantic context without gamified cartoon distractions.',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'SOE Educator & Classroom Concord',
            description: 'Turnkey 10-15 minute screen-free classroom lesson extensions aligned with Head Start ELOF and NAEYC early childhood standards.',
          },
        ],
      },
      buildComparisonFaqSchema('Reading Eggs'),
    ],
  },
  {
    route: '/alternatives/hooked-on-phonics',
    title: 'The 5 Best Hooked on Phonics Screen-Free Alternatives in 2026 | The Sound of Essentials',
    description: 'Looking for screen-free Hooked on Phonics alternatives? Discover the top 5 auditory and tactile reading programs for ages 2–7, ranked by phonemic decoding retention, hands-on handwriting, and zero tablet dependency.',
    bodyHtml: layoutEditorialShell(extractPublicMainHtml('hooked-on-phonics-alternatives.html')),
    extraSchemas: [
      {
        '@type': 'Article',
        headline: 'The 5 Best Hooked on Phonics Screen-Free Alternatives in 2026',
        description: 'An objective parent and educator review evaluating the 5 best screen-free Hooked on Phonics alternatives for early literacy (ages 2–7), ranked by phonemic decoding retention, motor handwriting integration, and zero tablet dependency.',
        url: `${SITE_URL}/alternatives/hooked-on-phonics`,
        author: {
          '@type': 'Person',
          name: 'Sarah Jenkins',
          jobTitle: 'Early Childhood Curriculum Specialist',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        datePublished: '2026-10-06',
        dateModified: '2026-10-06',
      },
      {
        '@type': 'ItemList',
        name: 'Top 5 Hooked on Phonics Screen-Free Alternatives',
        numberOfItems: 5,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'The Sound of Essentials: Rhythm Quest',
            description: 'Premier screen-free auditory phonics ecosystem featuring 19 master acoustic tracks across 7 learning lands, teaching sound-before-symbol decoding with zero tablet screens.',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'The Rhythm Ready Tactile Workbook',
            description: 'Physical 8-week readiness quest with 10 structured daily blocks (A–J) and 400 hands-on activities building genuine handwriting muscle memory on paper.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'The Screen-Free Audio Sanctuary',
            description: 'Safe-volume sensory headphone system and offline acoustic player engineered to replace evening app battles with calming nervous-system regulation.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'The Essential Picture Dictionary',
            description: '4,000+ word illustrated heirloom volume across 125 semantic scenes, connecting sounds to rich visual storytelling without cartoon minigames.',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'SOE Educator & Classroom Concord',
            description: 'Turnkey 10-15 minute screen-free classroom lesson extensions aligned with Head Start ELOF and NAEYC early childhood standards.',
          },
        ],
      },
      buildComparisonFaqSchema('Hooked on Phonics'),
    ],
  },
  ...pseoPages.map((p) => {
    const route = getPseoRoute(p);
    const canonicalUrl = `${SITE_URL}${route}`;
    const extraSchemas = [];
    if (p.source === 'mcls-pulse' || p.directAnswer) {
      extraSchemas.push({
        '@type': 'BlogPosting',
        headline: p.h1,
        description: p.metaDescription,
        url: canonicalUrl,
        datePublished: p.datePublished || '2026-11-19',
        dateModified: p.dateModified || p.datePublished || '2026-11-19',
        author: {
          '@type': 'Person',
          name: p.author?.name || 'Seriphia & The Sound of Essentials Early Childhood Research Council',
          jobTitle: p.author?.jobTitle || 'Early Learning Specialists & Pediatric Sound Neuro-Affirming Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: canonicalUrl,
      });
    }
    if (Array.isArray(p.faqs) && p.faqs.length > 0) {
      extraSchemas.push({
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      });
    }
    return {
      route,
      title: p.metaTitle || `${p.h1} | The Sound of Essentials`,
      description: p.metaDescription,
      extraSchemas,
      bodyHtml: layoutShell({
        badge: p.badge,
        h1: p.h1,
        bodyHtml: `
          ${p.author ? `
            <div class="author-byline" itemscope itemtype="https://schema.org/Person">
              <span>Curated &amp; Reviewed by: </span>
              <strong itemprop="name">${escapeHtml(p.author.name)}</strong>
              ${p.author.jobTitle ? ` — <span itemprop="jobTitle">${escapeHtml(p.author.jobTitle)}</span>` : ''}
              ${p.datePublished ? ` · Updated ${escapeHtml(p.dateModified || p.datePublished)}` : ''}
            </div>
          ` : ''}
          ${p.directAnswer ? `
            <section aria-label="Direct Answer">
              <p><strong>Direct Answer:</strong> ${escapeHtml(p.directAnswer)}</p>
            </section>
          ` : `<p>${escapeHtml(p.metaDescription)}</p>`}
          ${Array.isArray(p.factBullets) && p.factBullets.length > 0 ? `
            <section>
              <h2>Core Developmental Specifications (Ages 2–7)</h2>
              <ul>
                ${p.factBullets.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('\n                ')}
              </ul>
            </section>
          ` : ''}
          ${p.deltaSummary ? `
            <section>
              <h2>Challenge &amp; Sound-Before-Symbol Approach</h2>
              <p><strong>Challenge:</strong> ${escapeHtml(p.deltaSummary.problem)}</p>
              <p><strong>Research Principle:</strong> ${escapeHtml(p.deltaSummary.counterTruth)}</p>
              <p><strong>SOE Solution:</strong> ${escapeHtml(p.deltaSummary.soeSolution)}</p>
            </section>
          ` : ''}
          ${Array.isArray(p.benefits) && p.benefits.length > 0 ? `
            <section>
              <h2>Key Benefits</h2>
              <ul>
                ${p.benefits.map((b) => `<li><strong>${escapeHtml(b.title)}:</strong> ${escapeHtml(b.desc)}</li>`).join('\n                ')}
              </ul>
            </section>
          ` : ''}
          ${p.ctaBlock ? `
            <section>
              <h2>${escapeHtml(p.ctaBlock.heading)}</h2>
              <p>${escapeHtml(p.ctaBlock.body)}</p>
              <p><a href="${escapeHtml(p.ctaBlock.buttonUrl)}">${escapeHtml(p.ctaBlock.buttonText)}</a></p>
            </section>
          ` : ''}
          ${Array.isArray(p.internalLinks) && p.internalLinks.length > 0 ? `
            <section>
              <h2>Connected Rhythm Quest Resources</h2>
              <ul>
                ${p.internalLinks.map((lnk) => `<li><strong>${escapeHtml(lnk.category)}:</strong> <a href="${escapeHtml(lnk.url)}">${escapeHtml(lnk.label)}</a></li>`).join('\n                ')}
              </ul>
            </section>
          ` : ''}
          ${Array.isArray(p.faqs) && p.faqs.length > 0 ? `
            <section>
              <h2>Frequently Asked Questions</h2>
              ${p.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('\n              ')}
            </section>
          ` : ''}
        `,
      }),
    };
  }),
  // ── 4-Part SOE Learning Library + 5 Series Pillars + 22 Guides ──────────
  {
    route: '/resources',
    title: 'The Learning Library — 4-Part Screen-Free Guides for Ages 2–7 | SOE',
    description:
      'Practical guides, daily sound-play rituals, kindergarten readiness checklists, and classroom blueprints that extend The Sound of Essentials for ages 2–7.',
    extraSchemas: [
      {
        '@type': 'CollectionPage',
        name: 'The Sound of Essentials Learning Library (Ages 2–7)',
        url: `${SITE_URL}/resources`,
        description:
          'Curated 4-part screen-free early childhood learning library covering Sound Foundations, Play & Daily Practice, Kindergarten Readiness, and Home & Classroom Systems for ages 2–7.',
      },
    ],
    bodyHtml: layoutShell({
      badge: 'Rhythm Quest Library · Ages 2–7',
      h1: 'The Learning Library',
      bodyHtml: `
        <p>Practical guides, daily rituals, and classroom blueprints to deepen your Rhythm Quest journey—organized in four connected stages.</p>
        ${RESOURCE_PILLARS.map((pillar) => {
          const items = getArticlesByPillar(pillar.id).slice(0, 5);
          return `
            <section>
              <h2><a href="${escapeHtml(pillar.path)}">${escapeHtml(pillar.partLabel)}</a></h2>
              <p>${escapeHtml(pillar.description)}</p>
              <ul>
                ${items.map((a) => `<li><a href="/resources/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a> (${a.readTimeMinutes} min read)</li>`).join('\n                ')}
              </ul>
            </section>
          `;
        }).join('\n')}
        <section>
          <h2><a href="/resources/notes">The SOE Sound Notes Archive</a></h2>
          <p>Weekly 5-minute sound-play notes from Seriphia, dual-published for families and early educators of ages 2–7.</p>
        </section>
      `,
    }),
  },
  ...ALL_RESOURCE_PILLARS.map((pillar) => {
    const items = getArticlesByPillar(pillar.id);
    const canonicalUrl = `${SITE_URL}${pillar.path}`;
    return {
      route: pillar.path,
      title: `${pillar.partLabel} — SOE Resources (Ages 2–7)`,
      description: pillar.description,
      extraSchemas: [
        {
          '@type': 'CollectionPage',
          name: pillar.partLabel,
          url: canonicalUrl,
          description: pillar.description,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Resources', item: `${SITE_URL}/resources` },
            { '@type': 'ListItem', position: 2, name: pillar.shortTitle, item: canonicalUrl },
          ],
        },
      ],
      bodyHtml: layoutShell({
        badge: `${pillar.cardKicker} · ${items.length} Guides`,
        h1: pillar.partLabel,
        bodyHtml: `
          <p>${escapeHtml(pillar.description)}</p>
          <ul>
            ${items.map((a) => `<li><a href="/resources/${escapeHtml(a.slug)}"><strong>${escapeHtml(a.title)}</strong></a> (${a.readTimeMinutes} min read) — ${escapeHtml(a.description)}</li>`).join('\n            ')}
          </ul>
          <p><a href="${escapeHtml(pillar.offerBridge.ctaUrl)}">${escapeHtml(pillar.offerBridge.ctaLabel)}</a> &middot; <a href="/resources">Back to Resources Hub</a></p>
        `,
      }),
    };
  }),
  ...RESOURCE_ARTICLES.map((article) => {
    const pillar = getPillarById(article.pillarId);
    const route = `/resources/${article.slug}`;
    const canonicalUrl = `${SITE_URL}${route}`;
    const extraSchemas = [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        url: canonicalUrl,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
          '@type': 'Person',
          name: RESOURCE_AUTHOR.name,
          jobTitle: RESOURCE_AUTHOR.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Sound of Essentials',
          url: SITE_URL,
        },
        mainEntityOfPage: canonicalUrl,
        articleSection: pillar?.partLabel || 'SOE Resources',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Resources', item: `${SITE_URL}/resources` },
          ...(pillar
            ? [{ '@type': 'ListItem', position: 2, name: pillar.shortTitle, item: `${SITE_URL}${pillar.path}` }]
            : []),
          { '@type': 'ListItem', position: pillar ? 3 : 2, name: article.title, item: canonicalUrl },
        ],
      },
    ];
    if (Array.isArray(article.faqs) && article.faqs.length > 0) {
      extraSchemas.push({
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    return {
      route,
      title: article.metaTitle || `${article.title} | SOE Resources`,
      description: article.description,
      extraSchemas,
      bodyHtml: layoutShell({
        badge: `${pillar?.partLabel || 'SOE Resources'} · ${article.readTimeMinutes} min read · Ages 2–7`,
        h1: article.title,
        bodyHtml: `
          <p><strong>Key Takeaway:</strong> ${escapeHtml(article.directAnswer)}</p>
          ${article.sections
            .map(
              (sec) => `
            <section>
              <h2>${escapeHtml(sec.heading)}</h2>
              ${(sec.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n              ')}
              ${Array.isArray(sec.bullets) && sec.bullets.length > 0 ? `<ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>` : ''}
              ${sec.callout ? `<blockquote><strong>${escapeHtml(sec.callout.title)}:</strong> ${escapeHtml(sec.callout.text)}</blockquote>` : ''}
            </section>
          `
            )
            .join('\n')}
          ${Array.isArray(article.faqs) && article.faqs.length > 0 ? `<section><h2>Common Questions</h2>${article.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join('')}</section>` : ''}
          <p><a href="/listen">Experience the 19-Track Album</a> &middot; <a href="/resources">Explore All 4 Parts</a></p>
        `,
      }),
    };
  }),
];

const templatePath = path.resolve(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('ERROR: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(templatePath, 'utf8');
let generatedCount = 0;

for (const item of routes) {
  const canonicalUrl = `${SITE_URL}${item.route}`;
  const webPageNode = {
    '@type': 'WebPage',
    name: item.title,
    description: item.description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'The Sound of Essentials: Rhythm Quest',
      url: `${SITE_URL}/`,
    },
  };
  const pageSchema = JSON.stringify(
    Array.isArray(item.extraSchemas) && item.extraSchemas.length > 0
      ? {
          '@context': 'https://schema.org',
          '@graph': [webPageNode, ...item.extraSchemas],
        }
      : {
          '@context': 'https://schema.org',
          ...webPageNode,
        }
  );

  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(item.title)}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?content="[^"]*"\s*\/>/,
      () => `<meta name="description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      () => `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      () => `<meta property="og:title" content="${escapeHtml(item.title)}" />`
    )
    .replace(
      /<meta property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
      () => `<meta property="og:description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      () => `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      () => `<meta name="twitter:title" content="${escapeHtml(item.title)}" />`
    )
    .replace(
      /<meta name="twitter:description"[\s\S]*?content="[^"]*"\s*\/>/,
      () => `<meta name="twitter:description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      () => `<script type="application/ld+json">${pageSchema}</script>`
    )
    .replace(
      /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>)/,
      () => `<div id="root">\n    ${item.bodyHtml}\n  </div>\n\n`
    );

  if (html.includes('The 5 Core Domains &amp; 7 Lands Curriculum') && item.route !== '/') {
    throw new Error(`Failed to replace #root body for ${item.route}`);
  }

  const outDir = path.join(DIST_DIR, item.route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

// Emit static dist/404.html with explicit noindex so unmapped edge paths return true HTTP 404
const notFoundTitle = 'Page Not Found — The Sound of Essentials: Rhythm Quest';
const notFoundDesc =
  'Return to the Rhythm Quest sanctuary: stream the free 19-track acoustic album, open the Learning Library, or explore the 8-week Rhythm Ready Workbook for ages 2–7.';
const notFoundBody = layoutShell({
  badge: '404 · Off the Beaten Path',
  h1: "Let's Guide You Back to the Sound",
  bodyHtml: `
    <p>That link or QR code path does not match an active page. Choose a destination below to stream the free 19-track album or open classroom and home resources for ages 2–7.</p>
    <ul>
      <li><a href="/listen"><strong>Stream the Free 19-Track Acoustic Album</strong></a></li>
      <li><a href="/resources"><strong>Open the 4-Part Learning Library</strong></a></li>
      <li><a href="/rhythm-ready"><strong>Explore the 8-Week Rhythm Ready Workbook</strong></a></li>
      <li><a href="/institutions"><strong>Educator &amp; Classroom Frameworks</strong></a></li>
    </ul>
  `,
});

const notFoundHtml = baseHtml
  .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(notFoundTitle)}</title>`)
  .replace(
    /<meta name="description"[\s\S]*?content="[^"]*"\s*\/>/,
    () =>
      `<meta name="description"\n    content="${escapeHtml(notFoundDesc)}" />\n  <meta name="robots" content="noindex, nofollow" />`
  )
  .replace(/<link rel="canonical" href="[^"]*"\s*\/>\s*/, () => '')
  .replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    () => `<meta property="og:title" content="${escapeHtml(notFoundTitle)}" />`
  )
  .replace(
    /<meta property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
    () => `<meta property="og:description"\n    content="${escapeHtml(notFoundDesc)}" />`
  )
  .replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    () => ''
  )
  .replace(
    /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>)/,
    () => `<div id="root">\n    ${notFoundBody}\n  </div>\n\n`
  );

fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf8');

console.log(`✔ Prerendered ${generatedCount} route HTML pages in dist/<route>/index.html + dist/404.html`);
