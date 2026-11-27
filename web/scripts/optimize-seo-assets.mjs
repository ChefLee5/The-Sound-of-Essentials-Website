#!/usr/bin/env node
/**
 * ============================================================================
 * SOE CORE WEB VITALS & SEO ASSET OPTIMIZER
 * ============================================================================
 * Uses `sharp` to generate right-sized, modern WebP/PNG/JPEG assets so cold
 * homepage & QR landings stay under ~1 MB total transfer and achieve LCP < 2s:
 *   1. favicon-32x32.png (~3 KB) & apple-touch-icon.png (180x180)
 *   2. assets/soe-official-logo-96.webp (~5 KB for 36-44px nav/crest/footer)
 *   3. assets/soe-og-card.jpg (1200x630 < 120 KB for og:image & twitter:image)
 *   4. assets/backgrounds/bg1-blur.webp (~15 KB replacing 1.42 MB bg1.png)
 *   5. assets/dictionary/*.webp (640x640 ~50 KB replacing 700-885 KB PNGs)
 *   6. assets/marketing/soe-album-storybook-cover-600.webp (~80 KB for 400px card)
 *   7. assets/characters/*-320.webp (320x573 ~22 KB replacing 800x1433 portraits)
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function generateFile(label, outPath, builderFn) {
  await builderFn(outPath);
  const stat = fs.statSync(outPath);
  console.log(`  ✔ ${label.padEnd(54)} -> ${kb(stat.size)}`);
}

async function main() {
  console.log('\nOptimizing SOE Core Web Vitals & SEO static assets...\n');

  const logoPng = path.join(PUBLIC_DIR, 'assets/soe-official-logo.png');
  const deluxeCover = path.join(PUBLIC_DIR, 'assets/marketing/soe-deluxe-cover.webp');
  const storybookCover = path.join(PUBLIC_DIR, 'assets/marketing/soe-album-storybook-cover.webp');
  const bg1Png = path.join(PUBLIC_DIR, 'assets/backgrounds/bg1.png');

  // 1. Favicons & small UI crest logo
  await generateFile(
    'public/favicon-32x32.png',
    path.join(PUBLIC_DIR, 'favicon-32x32.png'),
    (out) => sharp(logoPng).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9, palette: true }).toFile(out)
  );

  await generateFile(
    'public/apple-touch-icon.png',
    path.join(PUBLIC_DIR, 'apple-touch-icon.png'),
    (out) => sharp(logoPng).resize(180, 180, { fit: 'contain', background: { r: 255, g: 248, b: 240, alpha: 1 } }).png({ compressionLevel: 9 }).toFile(out)
  );

  await generateFile(
    'public/assets/soe-official-logo-96.webp',
    path.join(PUBLIC_DIR, 'assets/soe-official-logo-96.webp'),
    (out) => sharp(logoPng).resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 82 }).toFile(out)
  );

  // 2. 1200x630 OpenGraph / Twitter social preview card (< 110 KB)
  const coverBuf = await sharp(deluxeCover).resize(540, 540, { fit: 'cover' }).png().toBuffer();
  await generateFile(
    'public/assets/soe-og-card.jpg',
    path.join(PUBLIC_DIR, 'assets/soe-og-card.jpg'),
    (out) =>
      sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 3,
          background: { r: 255, g: 248, b: 240 },
        },
      })
        .composite([{ input: coverBuf, left: 330, top: 45 }])
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(out)
  );

  // 3. Compressed blurred hero background (replaces 1.42 MB bg1.png)
  if (fs.existsSync(bg1Png)) {
    await generateFile(
      'public/assets/backgrounds/bg1-blur.webp',
      path.join(PUBLIC_DIR, 'assets/backgrounds/bg1-blur.webp'),
      (out) => sharp(bg1Png).resize(640, null, { withoutEnlargement: true }).blur(4).webp({ quality: 55 }).toFile(out)
    );
  }

  // 4. Storybook 600x600 WebP (replaces 526 KB 2048x2048 WebP on 400px card)
  if (fs.existsSync(storybookCover)) {
    await generateFile(
      'public/assets/marketing/soe-album-storybook-cover-600.webp',
      path.join(PUBLIC_DIR, 'assets/marketing/soe-album-storybook-cover-600.webp'),
      (out) => sharp(storybookCover).resize(600, 600, { fit: 'cover' }).webp({ quality: 80 }).toFile(out)
    );
  }

  // 5. Dictionary PNGs -> 640x640 WebPs
  const dictDir = path.join(PUBLIC_DIR, 'assets/dictionary');
  if (fs.existsSync(dictDir)) {
    const dictPngs = fs.readdirSync(dictDir).filter((f) => f.endsWith('.png'));
    for (const file of dictPngs) {
      const src = path.join(dictDir, file);
      const outName = file.replace(/\.png$/i, '.webp');
      const out = path.join(dictDir, outName);
      await generateFile(`public/assets/dictionary/${outName}`, out, (dest) =>
        sharp(src).resize(640, 640, { fit: 'cover', withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest)
      );
    }
  }

  // 6. Character portraits -> 320w WebP thumbnails for cylinder & mobile deck
  const charDir = path.join(PUBLIC_DIR, 'assets/characters');
  if (fs.existsSync(charDir)) {
    const charFiles = fs
      .readdirSync(charDir)
      .filter((f) => f.endsWith('.webp') && !f.endsWith('-320.webp'));
    for (const file of charFiles) {
      const src = path.join(charDir, file);
      const outName = file.replace(/\.webp$/i, '-320.webp');
      const out = path.join(charDir, outName);
      await generateFile(`public/assets/characters/${outName}`, out, (dest) =>
        sharp(src).resize(320, 573, { fit: 'cover', withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest)
      );
    }
  }

  console.log('\n✔ All SEO & CWV image assets generated successfully.\n');
}

main().catch((err) => {
  console.error('Asset optimization failed:', err);
  process.exit(1);
});
