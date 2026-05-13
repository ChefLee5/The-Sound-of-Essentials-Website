/**
 * convert-assets.mjs
 * Batch-converts new PNG assets → optimized WebP
 * Run: node scripts/convert-assets.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, basename } from 'path';

const SRC = 'C:\\Users\\ldmur\\Downloads\\The Sound of Essentials Image Assets\\Site Photos';
const PUBLIC = join(import.meta.dirname, '..', 'public', 'assets');

/* ── Category definitions ── */

// Solo character images → public/assets/characters/
const SOLOS = [
  'Aiko solo.png', 'Amara Solo.png', 'Athena solo.png', 'Elias Solo.png',
  'Ezra solo.png', 'Felix Solo.png', 'Kenji solo.png', 'Kwame Solo.png',
  'Nerissa Solo.png', 'Octavia solo.png', 'Ronan solo.png', 'Selene solo.png',
  'Seriphia solo.png', 'Silas solo.png', 'Vesta Solo.png',
];

// Selfie images → public/assets/heroes/
const SELFIES = [
  'Aiko selfie.png', 'Amara selfie.png', 'Athena selfie.png', 'Elias selfie.png',
  'Ezra selfie.png', 'Felix selfie.png', 'Kenji selfie.png', 'Kwame selfie.png',
  'Nerissa selfie.png', 'Octavia selfie.png', 'Ronan selfie.png', 'Selene selfie.png',
  'Seriphia selfie.png', 'Silas selfie.png', 'Vesta selfie.png',
];

// Land portraits → public/assets/lands/
const LANDS = [
  { src: 'Aquaria (1).png',     out: 'aquaria.webp' },
  { src: 'Celestia.png',        out: 'celestia.webp' },
  { src: 'Harmonia.png',        out: 'harmonia.webp' },
  { src: 'Luminosity.png',      out: 'luminosity.webp' },
  { src: 'Luminosity Hall.png', out: 'luminosity-hall.webp' },
  { src: 'Numeria.png',         out: 'numeria.webp' },
  { src: 'Terrasol.png',        out: 'terrasol.webp' },
  { src: 'Vitalis.png',         out: 'vitalis.webp' },
  { src: 'Valley.png',          out: 'valley.webp' },
  { src: 'Skyview Harmonia.png',out: 'skyview-harmonia.webp' },
];

// Track thumbnails → public/assets/track-art/
const TRACKS = [
  { src: 'Changes.png',              out: 'changes.webp' },
  { src: 'Days of the Week.png',     out: 'days-of-the-week.webp' },
  { src: 'Drill Time.png',           out: 'drill-time.webp' },
  { src: 'Hard Words.png',           out: 'hard-words.webp' },
  { src: "Let_s Stretch.png",        out: 'lets-stretch.webp' },
  { src: 'Manners.png',              out: 'manners.webp' },
  { src: 'Months of the Year.png',   out: 'months-of-the-year.webp' },
  { src: 'My Body.png',              out: 'my-body-new.webp' },  // keep old my-body.png, save new as backup
  { src: 'Numbers.png',              out: 'numbers.webp' },
  { src: 'One Hundred.png',          out: 'one-hundred.webp' },
  { src: 'Rain.png',                 out: 'rain.webp' },
  { src: 'The Ocean.png',            out: 'the-ocean.webp' },
];

/* ── Conversion helpers ── */

async function convertFile(srcPath, destPath, maxWidth) {
  try {
    await sharp(srcPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(destPath);
    const name = basename(destPath);
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${basename(srcPath)}: ${err.message}`);
  }
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/* ── Main ── */
async function main() {
  console.log('═══ SOE Asset Conversion ═══\n');

  // 1. Solos → characters/
  const charsDir = join(PUBLIC, 'characters');
  await ensureDir(charsDir);
  console.log('▸ Converting solos → characters/');
  for (const file of SOLOS) {
    const name = file.split(/\s+(solo|Solo)/i)[0].toUpperCase();
    await convertFile(join(SRC, file), join(charsDir, `${name}.webp`), 800);
  }

  // 2. Selfies → heroes/
  const heroesDir = join(PUBLIC, 'heroes');
  await ensureDir(heroesDir);
  console.log('\n▸ Converting selfies → heroes/');
  for (const file of SELFIES) {
    const name = file.split(/\s+selfie/i)[0].toLowerCase();
    await convertFile(join(SRC, file), join(heroesDir, `${name}-selfie.webp`), 800);
  }

  // 3. Lands → lands/
  const landsDir = join(PUBLIC, 'lands');
  await ensureDir(landsDir);
  console.log('\n▸ Converting land portraits → lands/');
  for (const { src, out } of LANDS) {
    await convertFile(join(SRC, src), join(landsDir, out), 1920);
  }

  // 4. Track art → track-art/
  const trackDir = join(PUBLIC, 'track-art');
  await ensureDir(trackDir);
  console.log('\n▸ Converting track thumbnails → track-art/');
  for (const { src, out } of TRACKS) {
    await convertFile(join(SRC, src), join(trackDir, out), 1200);
  }

  console.log('\n═══ Done! ═══');
}

main();
