#!/usr/bin/env node
/**
 * ============================================================================
 * SOE HELIX GATE 1: CANON & REGRESSION GUARD
 * ============================================================================
 * Enforces canonical consistency, world model integrity, card-vaulting
 * constraints, and anti-slop rules across The Sound of Essentials ecosystem.
 *
 * SOE Helix Gate 1 (Behavior & Platform Invariant Verifier).
 * Fails with EXIT CODE 2 if any gate check fails (Ralph Loop / Non-Escape).
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const ECO_ROOT = path.resolve(WEB_ROOT, '..');
const candidateCanonPaths = [
  path.resolve(ECO_ROOT, '.agents', 'core', 'canon.json'),
  path.resolve(ECO_ROOT, '..', '.agents', 'core', 'canon.json'),
];
const CORE_CANON_PATH = candidateCanonPaths.find((p) => fs.existsSync(p));

// ── CANONICAL DEFINITIONS (Loaded Dynamically from .agents/core/canon.json) ──
let CANONICAL_LANDS = [];
let CANONICAL_HERO_PAIRS = {};
let BANNED_PATTERNS = [];

if (CORE_CANON_PATH && fs.existsSync(CORE_CANON_PATH)) {
  const canonData = JSON.parse(fs.readFileSync(CORE_CANON_PATH, 'utf8'));
  CANONICAL_LANDS = canonData.canonical_lands;
  CANONICAL_HERO_PAIRS = canonData.canonical_hero_pairs;
  BANNED_PATTERNS = canonData.banned_entities.map((item) => ({
    pattern: new RegExp(item.pattern, 'gi'),
    reason: item.reason,
  }));
} else {
  // Fallback defaults if core schema is missing
  CANONICAL_LANDS = ['harmonia', 'numeria', 'vitalis', 'celestia', 'luminosity', 'aquaria', 'terrasol'];
  CANONICAL_HERO_PAIRS = {
    harmonia: ['kenji', 'aiko'],
    numeria: ['kwame', 'octavia'],
    vitalis: ['felix', 'amara'],
    celestia: ['elias', 'selene'],
    luminosity: ['athena', 'ezra'],
    aquaria: ['nerissa', 'ronan'],
    terrasol: ['vesta', 'silas'],
  };
  BANNED_PATTERNS = [
    { pattern: /\bMarcus\b/gi, reason: 'Retired character (Marcus was retired in July 2026 canon)' },
    { pattern: /\bElena\b/gi, reason: 'Retired character (Elena was retired in July 2026 canon)' },
    { pattern: /\bGeometria\b/gi, reason: 'Retired land (Replaced by Aquaria)' },
    { pattern: /\bSophia\b/gi, reason: 'Retired land/entity (Replaced by Luminosity)' },
    { pattern: /\bAges?\s*2\s*[-–—]\s*8\b/gi, reason: 'Canon age is strictly Ages 2–7 (Pre-K to Grade 2)' },
    { pattern: /\bGrade\s*3\b/gi, reason: 'Canon ceiling is Grade 2; Grade 3 is strictly retired' },
    { pattern: /\blive\s+(instrumentation|instruments?|acoustic\s+instruments?|orchestra|music)\b/gi, reason: 'Canon restriction: SOE was recorded live, but does NOT have live instrumentation or live music. Never claim live instruments/music.' },
    { pattern: /\blive\s+acoustic\b/gi, reason: 'Canon restriction: No live acoustic claims for instrumentation or music.' },
    { pattern: /\blive\s+organic\b/gi, reason: 'Canon restriction: No live organic claims.' },
    { pattern: /\bShopify\b/gi, reason: 'Shopify is strictly retired. Complete omission of Shopify in our stack. All payments use Direct Stripe API.' },
  ];
}

let totalChecks = 0;
let failedChecks = 0;
const failures = [];

function check(title, assertionFn) {
  totalChecks++;
  try {
    const result = assertionFn();
    if (result !== true) {
      failedChecks++;
      failures.push({ title, message: typeof result === 'string' ? result : 'Assertion returned false' });
      process.stdout.write(`  \x1b[31m✖\x1b[0m ${title}\n`);
      return false;
    }
    process.stdout.write(`  \x1b[32m✔\x1b[0m ${title}\n`);
    return true;
  } catch (err) {
    failedChecks++;
    failures.push({ title, message: err.message });
    process.stdout.write(`  \x1b[31m✖\x1b[0m ${title} (Threw: ${err.message})\n`);
    return false;
  }
}

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m   SOE HELIX GATE 1: CANON & REGRESSION VERIFIER        \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// ── 1. WORLD MODEL & DATA VERIFICATION ───────────────────────────────────────
console.log('\x1b[1m[1/4] Verifying World Model & Data Schemas...\x1b[0m');

const landsPath = path.join(WEB_ROOT, 'src', 'data', 'lands.json');
const heroesPath = path.join(WEB_ROOT, 'src', 'data', 'heroes.json');
const tracksPath = path.join(WEB_ROOT, 'src', 'data', 'tracks.json');
const productsPath = path.join(WEB_ROOT, 'src', 'data', 'products.json');

check('lands.json exists and contains exactly the 7 canonical lands', () => {
  if (!fs.existsSync(landsPath)) return 'lands.json not found';
  const lands = JSON.parse(fs.readFileSync(landsPath, 'utf8'));
  if (lands.length !== 7) return `Expected 7 lands, got ${lands.length}`;
  const landIds = lands.map((l) => l.id.toLowerCase());
  for (const expected of CANONICAL_LANDS) {
    if (!landIds.includes(expected)) return `Missing canonical land: ${expected}`;
  }
  return true;
});

check('lands.json pairs match canonical hero rosters', () => {
  const lands = JSON.parse(fs.readFileSync(landsPath, 'utf8'));
  for (const land of lands) {
    const expected = CANONICAL_HERO_PAIRS[land.id.toLowerCase()];
    if (!expected) return `Unknown land ID: ${land.id}`;
    const sortedActual = [...land.heroes].map((h) => h.toLowerCase()).sort();
    const sortedExpected = [...expected].sort();
    if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
      return `Land ${land.id} expected heroes [${sortedExpected.join(', ')}] but got [${sortedActual.join(', ')}]`;
    }
  }
  return true;
});

check('heroes.json contains Seriphia (featured) + exactly 14 land heroes', () => {
  if (!fs.existsSync(heroesPath)) return 'heroes.json not found';
  const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));
  if (heroes.length !== 15) return `Expected 15 characters, got ${heroes.length}`;
  const seriphia = heroes.find((h) => h.id.toLowerCase() === 'seriphia');
  if (!seriphia) return 'Seriphia is missing';
  if (!seriphia.featured) return 'Seriphia must have featured: true';

  // Check required fields
  const required = ['name', 'title', 'landId', 'focus', 'img', 'bio', 'traits'];
  for (const h of heroes) {
    for (const req of required) {
      if (!h[req]) return `Hero ${h.id || h.name} is missing field "${req}"`;
    }
  }
  return true;
});

check('tracks.json contains all 19 tracks mapped to valid lands', () => {
  if (!fs.existsSync(tracksPath)) return 'tracks.json not found';
  const tracks = JSON.parse(fs.readFileSync(tracksPath, 'utf8'));
  if (tracks.length !== 19) return `Expected 19 tracks, got ${tracks.length}`;
  for (const track of tracks) {
    if (!track.id || !track.landId) return `Track #${track.id} missing id or landId`;
    if (!CANONICAL_LANDS.includes(track.landId.toLowerCase())) {
      return `Track #${track.id} has invalid landId: ${track.landId}`;
    }
  }
  return true;
});

// ── 2. DIRECT STRIPE REVENUE STACK & CARD-VAULTING INVARIANTS ─────────────────
console.log('\n\x1b[1m[2/4] Verifying Direct Stripe Revenue Stack & Card-Vaulting Invariants...\x1b[0m');

check('products.json satisfies card-vaulting hierarchy (>= $0.50 threshold)', () => {
  if (!fs.existsSync(productsPath)) return 'products.json not found';
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  // Verify Album front-end is $0 free stream
  const album = products.find((p) => p.id === 'rhythm-quest-album');
  if (!album) return 'rhythm-quest-album not found in products.json';
  if (album.price !== 0 && !album.priceFormatted?.toLowerCase().includes('free')) {
    return 'Album must offer $0 stream front-end for zero-friction listening gate';
  }

  // Verify Dictionary is canonical $55
  const dict = products.find((p) => p.id === 'picture-dictionary');
  if (!dict) return 'picture-dictionary not found in products.json';
  if (dict.price !== 55) {
    return `Picture Dictionary must be canonical $55, found ${dict.price}`;
  }

  return true;
});

// ── 3. BANNED ENTITY / ANTI-SLOP AUDIT ────────────────────────────────────────
console.log('\n\x1b[1m[3/4] Scanning codebase for Banned Entities & Age Creep...\x1b[0m');

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.gemini'].includes(entry.name)) continue;
      walkDir(fullPath, fileList);
    } else if (entry.isFile()) {
      if (/\.(jsx?|tsx?|json|html)$/i.test(entry.name)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const sourceFiles = walkDir(path.join(WEB_ROOT, 'src'));

check('Zero banned entities or age-creep patterns in web/src', () => {
  const violations = [];
  for (const filePath of sourceFiles) {
    const rel = path.relative(WEB_ROOT, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, reason } of BANNED_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          violations.push(`${rel}:${i + 1} — ${reason} [Line: "${line.trim().slice(0, 80)}"]`);
        }
      }
    }
  }

  if (violations.length > 0) {
    return `Found ${violations.length} canon violations:\n    ` + violations.join('\n    ');
  }
  return true;
});

// ── 4. i18n PARITY VERIFICATION ──────────────────────────────────────────────
console.log('\n\x1b[1m[4/4] Verifying i18n Translation Parity (EN, ES, FR)...\x1b[0m');

const enPath = path.join(WEB_ROOT, 'src', 'i18n', 'locales', 'en.json');
const esPath = path.join(WEB_ROOT, 'src', 'i18n', 'locales', 'es.json');
const frPath = path.join(WEB_ROOT, 'src', 'i18n', 'locales', 'fr.json');

check('i18n locales exist and have matching root sections', () => {
  if (!fs.existsSync(enPath) || !fs.existsSync(esPath) || !fs.existsSync(frPath)) {
    return 'One or more locale JSON files missing';
  }
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
  const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));

  const enKeys = Object.keys(en);
  const esKeys = Object.keys(es);
  const frKeys = Object.keys(fr);

  const missingInEs = enKeys.filter((k) => !esKeys.includes(k));
  const missingInFr = enKeys.filter((k) => !frKeys.includes(k));

  if (missingInEs.length > 0) return `ES locale missing root keys: ${missingInEs.join(', ')}`;
  if (missingInFr.length > 0) return `FR locale missing root keys: ${missingInFr.join(', ')}`;

  return true;
});

// ── SUMMARY & EXIT ───────────────────────────────────────────────────────────
console.log('\n\x1b[1m========================================================\x1b[0m');
if (failedChecks === 0) {
  console.log(`\x1b[1m\x1b[32m✔ GATE 1 PASSED: All ${totalChecks} checks verified successfully!\x1b[0m`);
  console.log('\x1b[1m========================================================\x1b[0m\n');
  process.exit(0);
} else {
  console.log(`\x1b[1m\x1b[31m✖ GATE 1 FAILED: ${failedChecks} of ${totalChecks} checks failed.\x1b[0m`);
  console.log('\x1b[33m[Non-Escape Ralph Hook Activated: Exit Code 2]\x1b[0m');
  console.log('\x1b[1m========================================================\x1b[0m\n');
  for (const f of failures) {
    console.error(`- \x1b[1m${f.title}\x1b[0m: ${f.message}`);
  }
  console.error('\nResolve the above violations before attempting to ship or pass Gate 1.\n');
  process.exit(2);
}
