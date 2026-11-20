#!/usr/bin/env node
/**
 * ============================================================================
 * SOE-MCLS GEO GUIDES SYNC (`sync-geo-guides.mjs`)
 * ============================================================================
 * Reads `src/data/geoGuides.json` (emitted by `tools/soe_mcls/geo_guide_emitter.py`)
 * and deterministically syncs:
 *   1. `public/sitemap.xml` (managed MCLS GEO GUIDES block)
 *   2. `public/llms.txt` (managed MCLS GEO GUIDES links block)
 *
 * Safe to run repeatedly (100% idempotent).
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const GUIDES_PATH = path.resolve(WEB_ROOT, 'src', 'data', 'geoGuides.json');
const SITEMAP_PATH = path.resolve(WEB_ROOT, 'public', 'sitemap.xml');
const LLMS_PATH = path.resolve(WEB_ROOT, 'public', 'llms.txt');
const SITE_URL = 'https://thesoundofessentials.com';

const BEGIN_MARKER = '<!-- BEGIN MCLS GEO GUIDES -->';
const END_MARKER = '<!-- END MCLS GEO GUIDES -->';

const guides = fs.existsSync(GUIDES_PATH)
  ? JSON.parse(fs.readFileSync(GUIDES_PATH, 'utf8'))
  : [];

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 1. Sync public/sitemap.xml ───────────────────────────────────────────
if (fs.existsSync(SITEMAP_PATH)) {
  const sitemapRaw = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const guideEntries = guides
    .map(
      (g) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/guides/${g.slug}`)}</loc>
    <lastmod>${escapeXml(g.dateModified || g.datePublished || '2026-11-20')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    )
    .join('\n');

  const managedBlock = `${BEGIN_MARKER}\n${guideEntries}\n  ${END_MARKER}`;
  const blockRegex = new RegExp(`${BEGIN_MARKER}[\\s\\S]*?${END_MARKER}`, 'm');

  let updatedSitemap;
  if (blockRegex.test(sitemapRaw)) {
    updatedSitemap = sitemapRaw.replace(blockRegex, () => managedBlock);
  } else {
    updatedSitemap = sitemapRaw.replace(
      /<\/urlset>/i,
      () => `\n  ${managedBlock}\n</urlset>`
    );
  }

  fs.writeFileSync(SITEMAP_PATH, updatedSitemap, 'utf8');
  console.log(`✔ Synced ${guides.length} MCLS GEO guide(s) into public/sitemap.xml`);
}

// ── 2. Sync public/llms.txt ──────────────────────────────────────────────
if (fs.existsSync(LLMS_PATH)) {
  const llmsRaw = fs.readFileSync(LLMS_PATH, 'utf8');
  const llmsLines = guides
    .map(
      (g) =>
        `- [${g.h1}](${SITE_URL}/guides/${g.slug}): ${g.metaDescription} (Published ${g.datePublished || '2026-11-20'} · Land of ${g.land})`
    )
    .join('\n');

  const managedLlmsBlock = `${BEGIN_MARKER}\n## Latest MCLS Research Field Guides (Sovereign GEO)\n${llmsLines}\n${END_MARKER}`;
  const blockRegex = new RegExp(`${BEGIN_MARKER}[\\s\\S]*?${END_MARKER}`, 'm');

  let updatedLlms;
  if (blockRegex.test(llmsRaw)) {
    updatedLlms = llmsRaw.replace(blockRegex, () => managedLlmsBlock);
  } else if (llmsRaw.includes('## Official Entity Profiles')) {
    updatedLlms = llmsRaw.replace(
      '## Official Entity Profiles',
      () => `${managedLlmsBlock}\n\n## Official Entity Profiles`
    );
  } else {
    updatedLlms = `${llmsRaw.trimEnd()}\n\n${managedLlmsBlock}\n`;
  }

  fs.writeFileSync(LLMS_PATH, updatedLlms, 'utf8');
  console.log(`✔ Synced ${guides.length} MCLS GEO guide(s) into public/llms.txt`);
}
