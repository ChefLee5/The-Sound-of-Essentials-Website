#!/usr/bin/env node
/**
 * Compile a curated, tree-shakable subset of Rune Icons & Rune Brands
 * into src/components/ui/soeIcons.generated.js.
 *
 * Avoids bundling the full 1.8MB icon registry and 5.0MB brand registry
 * into the client entry chunk while adapting duotone/fill strokes to
 * inherit SOE theme and Land colors via `currentColor`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconById } from 'runeicons';
import { getBrand } from 'runeicons-react/brands';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, '..');
const OUT_FILE = path.join(WEB_ROOT, 'src', 'components', 'ui', 'soeIcons.generated.js');

const CURATED_ICONS = [
  // Navigation & actions
  'arrows-arrow-down',
  'arrows-arrow-left-right',
  'arrows-arrow-right',
  'arrows-chevron-down',
  'arrows-skip-forward',
  'arrows-step-back',
  // Documents & learning
  'documents-book-bookmark',
  'documents-file-down',
  'documents-file-text',
  'documents-library',
  // Identity & trust
  'identity-lock',
  'identity-shield',
  'identity-shield-check',
  'identity-users',
  // Indicators & feedback
  'indicators-check',
  'indicators-circle-check',
  'indicators-circle-dot',
  'indicators-minus',
  'indicators-plus',
  'indicators-triangle-alert',
  'indicators-x',
  // Layouts & math
  'layouts-columns-3',
  'layouts-grid-3x3',
  // Messaging
  'messaging-mail',
  'messaging-message-circle',
  // Metrics & movement
  'metrics-activity',
  // Nature & lands
  'nature-cloud-rain',
  'nature-earth',
  'nature-moon',
  'nature-sun',
  // Misc & commerce
  'money-gift',
  'other-globe',
  'other-puzzle',
  'other-zap',
  // Playback & senses
  'playback-images',
  'playback-pause',
  'playback-play',
  'playback-volume-2',
  'schedule-clock',
  'schedule-repeat',
  'senses-ear',
  'senses-hand',
  // Tools
  'tools-house',
  'tools-map',
  'tools-pencil',
  'tools-sparkles',
  'tools-star',
  // Glass style variants (scoped gradient/filter IDs)
  'glass-bubble',
  'glass-clock-1',
  'glass-compass-round-2',
  'glass-ear',
  'glass-earth-2',
  'glass-email',
  'glass-file-download',
  'glass-file-text',
  'glass-gift',
  'glass-heart-2-2',
  'glass-home-round-door-2',
  'glass-images-sparkle-2',
  'glass-lock-1',
  'glass-moon-2',
  'glass-people-3',
  'glass-pie-chart-1-2',
  'glass-play-2',
  'glass-rainy-2',
  'glass-shield-check-1',
  'glass-sparkle-3-2',
  'glass-star-4',
  'glass-sunrise-2',
  'glass-volume-full-2',
  'glass-zap-2',
];

const CURATED_BRANDS = [
  'youtube',
  'tiktok',
  'instagram',
  'stripe',
  'spotify',
  'apple-music',
];

const PIXEL_ENABLED_ICONS = new Set([
  'tools-sparkles',
  'tools-star',
  'playback-play',
  'other-zap',
  'money-gift',
]);

function cleanMarkup(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\n+/g, '').trim();
}

/**
 * Adapt hardcoded RuneIcons greys in duotone/fill variants so they inherit
 * `currentColor` cleanly on SOE's warm #FFF8F0 cream and Land-tinted cards.
 */
function adaptDuotoneMarkup(markup) {
  return cleanMarkup(markup)
    .replace(/stroke="#A4A5A6"/gi, 'stroke="currentColor"')
    .replace(/fill="#A4A5A6"/gi, 'fill="currentColor"')
    .replace(/stroke="#DDDDDD"/gi, 'stroke="currentColor" stroke-opacity="0.38"')
    .replace(/fill="#DDDDDD"/gi, 'fill="currentColor" fill-opacity="0.22"');
}

function adaptFillMarkup(markup) {
  return cleanMarkup(markup)
    .replace(/stroke="#1C1F21"/gi, 'stroke="currentColor"')
    .replace(/fill="#1C1F21"/gi, 'fill="currentColor"')
    .replace(/stroke="#DDDDDD"/gi, 'stroke="currentColor" stroke-opacity="0.35"')
    .replace(/fill="#DDDDDD"/gi, 'fill="currentColor" fill-opacity="0.25"');
}

const iconsMap = {};
for (const id of CURATED_ICONS) {
  const entry = getIconById(id);
  if (!entry) {
    throw new Error(`Curated RuneIcon not found: ${id}`);
  }
  const variants = {};
  for (const [type, data] of Object.entries(entry.variants)) {
    if (type === 'pixelated' && !PIXEL_ENABLED_ICONS.has(id)) continue;
    let markup = cleanMarkup(data.markup);
    if (type === 'duotone') markup = adaptDuotoneMarkup(markup);
    if (type === 'fill') markup = adaptFillMarkup(markup);
    variants[type] = {
      viewBox: data.viewBox,
      markup,
    };
  }
  iconsMap[id] = variants;
}

function inlineSvgClassStyles(rawMarkup) {
  let markup = cleanMarkup(rawMarkup).replace(/var\(--hds-color-text-solid\)/g, 'currentColor');
  const styleBlocks = [];
  markup = markup.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, cssText) => {
    styleBlocks.push(cssText);
    return '';
  });
  for (const css of styleBlocks) {
    const ruleRegex = /\.([A-Za-z0-9_-]+)\s*\{\s*([^}]+)\}/g;
    let match;
    while ((match = ruleRegex.exec(css)) !== null) {
      const cls = match[1];
      const decls = match[2];
      const fillMatch = decls.match(/fill\s*:\s*([^;]+)/i);
      if (fillMatch) {
        const fillVal = fillMatch[1].trim();
        const classAttrRegex = new RegExp(`\\bclass="${cls}"`, 'g');
        markup = markup.replace(classAttrRegex, `fill="${fillVal}"`);
      }
    }
  }
  return markup.replace(/<defs>\s*<\/defs>/gi, '');
}

const brandsMap = {};
for (const slug of CURATED_BRANDS) {
  const brand = getBrand(slug);
  if (!brand) {
    throw new Error(`Curated RuneBrand not found: ${slug}`);
  }
  brandsMap[slug] = {
    name: brand.name,
    viewBox: brand.viewBox,
    markup: inlineSvgClassStyles(brand.markup),
  };
}

const output = `// AUTO-GENERATED by scripts/compile-soe-icons.mjs — do not edit manually.
// Source: runeicons & runeicons-brands

export const SOE_ICONS = ${JSON.stringify(iconsMap, null, 2)};

export const SOE_BRANDS = ${JSON.stringify(brandsMap, null, 2)};
`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, output, 'utf8');

const bytes = Buffer.byteLength(output, 'utf8');
console.log(
  `Compiled ${Object.keys(iconsMap).length} icons and ${Object.keys(brandsMap).length} brands -> ${path.relative(WEB_ROOT, OUT_FILE)} (${(bytes / 1024).toFixed(1)} KB)`
);
