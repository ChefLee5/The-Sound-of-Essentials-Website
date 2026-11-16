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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
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

function layoutShell({ h1, badge, bodyHtml }) {
  return `
    <header style="max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 1rem;">
      <nav aria-label="Main Navigation">
        <a href="/" style="font-weight: 700; color: #FF6F00; text-decoration: none; font-size: 1.25rem; display: inline-block; margin-bottom: 0.5rem;">The Sound of Essentials: Rhythm Quest</a>
        <div style="margin-top: 0.5rem; font-size: 0.92rem; display: flex; gap: 0.6rem 1rem; flex-wrap: wrap;">
          <a href="/listen" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Free 19-Track Album</a>
          <a href="/rhythm-ready" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Rhythm Ready Workbook</a>
          <a href="/workbook" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Picture Dictionary</a>
          <a href="/heroes" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">15 Hero Mentors &amp; 7 Lands</a>
          <a href="/science" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Science of Sound</a>
          <a href="/solutions" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Solutions Directory</a>
          <a href="/mission" style="padding: 0.25rem 0.5rem; text-decoration: none; color: #2B2016;">Our Mission</a>
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
    title: "Rhythm Quest 19-Track Album | Screen-Free Sensory Children's Music & Movement Songs for Toddlers & Pre-K",
    description: 'Stream all 19 studio-recorded acoustic early learning songs for free ($0). Calm, neuro-affirming rhythm and phonics music for ages 2–7.',
    bodyHtml: layoutShell({
      badge: 'Free $0 Listening Sanctuary · Ages 2–7',
      h1: 'The Sound of Essentials: 19-Track Acoustic Learning Album',
      bodyHtml: `
        <p>Stream all 19 original studio-recorded acoustic educational tracks designed to build phonemic awareness, counting fluency, somatic movement, science curiosity, and emotional self-regulation without screens.</p>
        <h2>Included Tracks Across the 7 Lands</h2>
        <ul>
          ${tracks.map((tr) => `<li><strong>Track ${String(tr.id).padStart(2, '0')}:</strong> ${escapeHtml(tr.slug.replace(/-/g, ' '))} (${escapeHtml(tr.landId)})</li>`).join('\n          ')}
        </ul>
        <p><a href="/rhythm-ready">Explore the 8-Week Rhythm Ready Workbook</a> &middot; <a href="/heroes">Meet the 15 Hero Mentors</a></p>
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
    title: 'Our Mission — SOE Rhythm Quest',
    description: 'Why The Sound of Essentials is building a screen-free, music-first early childhood learning sanctuary for ages 2–7.',
    bodyHtml: layoutShell({
      badge: 'Staying on the Path, Always Learning',
      h1: 'Our Mission: Designed for the Developing Brain, Not the Algorithm',
      bodyHtml: `
        <p>Founded by L.D. Murray and guided by Seriphia, The Sound of Essentials restores calm, music-driven, tactile learning to homes and early childhood classrooms for ages 2 through 7.</p>
        <p><a href="/listen">Listen to the Free 19-Track Album</a> &middot; <a href="/science">Read the Pedagogical Science</a></p>
      `,
    }),
  },
  {
    route: '/join',
    title: 'Join the Quest — SOE Rhythm Quest',
    description: 'Join families, homeschoolers, and early childhood educators using The Sound of Essentials: Rhythm Quest for ages 2–7.',
    bodyHtml: layoutShell({
      badge: 'Family & Educator Community',
      h1: 'Join the Rhythm Quest Sanctuary',
      bodyHtml: `
        <p>Start with the free 19-track acoustic album and 40-page printable coloring book, or inquire about school and preschool licensing for your classrooms.</p>
        <p><a href="/listen">Unlock the Free Album</a> &middot; <a href="/institutions">Institutional Licensing</a></p>
      `,
    }),
  },
  {
    route: '/solutions',
    title: 'Educational Solutions & Curriculum Frameworks | The Sound of Essentials',
    description: 'Explore The Sound of Essentials sensory-rich, music-driven curriculum solutions for preschools, speech therapy clinics, and conscious home sanctuaries.',
    bodyHtml: layoutShell({
      badge: 'Solutions Directory',
      h1: 'Educational Solutions & Curriculum Frameworks',
      bodyHtml: `
        <p>Role-specific and classroom-ready screen-free music and phonics frameworks for educators, therapists, and families serving ages 2–7.</p>
        <ul>
          ${pseoPages.map((p) => `<li><a href="${escapeHtml(getPseoRoute(p))}">${escapeHtml(p.h1)}</a> — ${escapeHtml(p.metaDescription)}</li>`).join('\n          ')}
        </ul>
      `,
    }),
  },
  {
    route: '/institutions',
    title: 'Institutional & Preschool Curriculum Licensing | The Sound of Essentials',
    description: 'Screen-free tactile rhythm and phonics curriculum licensing for early childhood centers, preschools, and speech therapy clinics (ages 2–7).',
    bodyHtml: layoutShell({
      badge: 'Preschools, Childcare & Clinics',
      h1: 'Institutional & Classroom Curriculum Licensing',
      bodyHtml: `
        <p>Turnkey screen-free daily 15–30 minute acoustic rhythm blocks aligned with Head Start ELOF and NAEYC standards, with zero student PII or tablet setup required.</p>
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
  ...pseoPages.map((p) => {
    const route = getPseoRoute(p);
    return {
      route,
      title: p.metaTitle || `${p.h1} | The Sound of Essentials`,
      description: p.metaDescription,
      bodyHtml: layoutShell({
        badge: p.badge,
        h1: p.h1,
        bodyHtml: `
          <p>${escapeHtml(p.metaDescription)}</p>
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
  const pageSchema = JSON.stringify({
    '@context': 'https://schema.org',
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
  });

  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(item.title)}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?content="[^"]*"\s*\/>/,
      `<meta name="description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeHtml(item.title)}" />`
    )
    .replace(
      /<meta property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
      `<meta property="og:description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/>/,
      `<meta name="twitter:title" content="${escapeHtml(item.title)}" />`
    )
    .replace(
      /<meta name="twitter:description"[\s\S]*?content="[^"]*"\s*\/>/,
      `<meta name="twitter:description"\n    content="${escapeHtml(item.description)}" />`
    )
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${pageSchema}</script>`
    )
    .replace(
      /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>)/,
      `<div id="root">\n    ${item.bodyHtml}\n  </div>\n\n`
    );

  if (html.includes('The 5 Core Domains &amp; 7 Lands Curriculum') && item.route !== '/') {
    throw new Error(`Failed to replace #root body for ${item.route}`);
  }

  const outDir = path.join(DIST_DIR, item.route.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

console.log(`✔ Prerendered ${generatedCount} route HTML pages in dist/<route>/index.html`);
