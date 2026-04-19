import sharp from 'sharp';
import { readdir, mkdir, copyFile } from 'fs/promises';
import { join, resolve } from 'path';

const SRC = 'C:\\Users\\ldmur\\Downloads\\The Sound of Essentials Image Assets';
const WEB_ASSETS = resolve('.', 'public', 'assets');

// Mapping: source filename -> { dir, outName }
const CONVERSIONS = [
  // ── Land Panoramas ──
  { src: 'Celestia.png', dir: 'lands', out: 'celestia-panorama.webp' },
  { src: 'Aquaria.png', dir: 'lands', out: 'aquaria-panorama.webp' },
  { src: 'Numeria.png', dir: 'lands', out: 'numeria-panorama.webp' },
  { src: 'Vitalis.png', dir: 'lands', out: 'vitalis-panorama.webp' },
  { src: 'Luminosity March.png', dir: 'lands', out: 'luminosity-panorama.webp' },
  { src: 'Horse!.png', dir: 'lands', out: 'lexiconia-panorama.webp' },
  { src: 'Letters .png', dir: 'lands', out: 'harmonia-panorama.webp' },

  // ── Scenes (new additions) ──
  { src: 'Animals Terrasol.png', dir: 'scenes', out: 'animals-terrasol.webp' },
  { src: 'Aquaria Shore.png', dir: 'scenes', out: 'aquaria-shore.webp' },
  { src: 'Blanket Amara_Octavia.png', dir: 'scenes', out: 'blanket-amara-octavia.webp' },
  { src: 'Bubbles Vesta_Silas_Seriphia.png', dir: 'scenes', out: 'bubbles-vesta-silas.webp' },
  { src: 'Call to Learn with stones Seriphia.png', dir: 'scenes', out: 'call-to-learn-stones.webp' },
  { src: 'Counting Claps.png', dir: 'scenes', out: 'counting-claps.webp' },
  { src: 'Creek Felix_Elias.png', dir: 'scenes', out: 'creek-felix-elias.webp' },
  { src: 'Cubes Ronan_Nerissa.png', dir: 'scenes', out: 'cubes-ronan-nerissa.webp' },
  { src: 'Dance Harmonia Vitalis.png', dir: 'scenes', out: 'dance-harmonia-vitalis.webp' },
  { src: 'Donkey.png', dir: 'scenes', out: 'donkey-scene.webp' },
  { src: 'Drums.png', dir: 'scenes', out: 'drums-scene.webp' },
  { src: 'Excited to learn.png', dir: 'scenes', out: 'excited-to-learn.webp' },
  { src: 'Floating letters.png', dir: 'scenes', out: 'floating-letters.webp' },
  { src: 'Hard words Aquaria.png', dir: 'scenes', out: 'hard-words-aquaria.webp' },
  { src: 'Hear the days of the week.png', dir: 'scenes', out: 'hear-days-of-week.webp' },
  { src: 'Honeycomb Kwame_Selene.png', dir: 'scenes', out: 'honeycomb-kwame-selene.webp' },
  { src: 'Know yourself.png', dir: 'scenes', out: 'know-yourself.webp' },
  { src: 'Kwame Counting.png', dir: 'scenes', out: 'kwame-counting.webp' },
  { src: 'Living Food.png', dir: 'scenes', out: 'living-food.webp' },
  { src: 'March Luminosity.png', dir: 'scenes', out: 'march-luminosity.webp' },
  { src: 'Math Numeria.png', dir: 'scenes', out: 'math-numeria.webp' },
  { src: 'Path to Terrasol.png', dir: 'scenes', out: 'path-to-terrasol.webp' },
  { src: 'Pond Aiko_Kenji.png', dir: 'scenes', out: 'pond-aiko-kenji.webp' },
  { src: 'Seriphia Valley.png', dir: 'scenes', out: 'seriphia-valley.webp' },
  { src: 'Sundial Weather.png', dir: 'scenes', out: 'sundial-weather.webp' },
  { src: 'Tent Ezra_Athena.png', dir: 'scenes', out: 'tent-ezra-athena.webp' },
  { src: 'Time Celestia.png', dir: 'scenes', out: 'time-celestia.webp' },
  { src: 'Tulip River Path.png', dir: 'scenes', out: 'tulip-river-path.webp' },

  // ── Shapes ──
  { src: 'Circle.png', dir: 'shapes', out: 'circle.webp' },
  { src: 'Rectangle.png', dir: 'shapes', out: 'rectangle.webp' },
  { src: 'Triangle.png', dir: 'shapes', out: 'triangle.webp' },
  { src: 'Star.png', dir: 'shapes', out: 'star.webp' },
  { src: 'Hexagon.png', dir: 'shapes', out: 'hexagon.webp' },
  { src: 'Heptagon.png', dir: 'shapes', out: 'heptagon.webp' },

  // ── Marketing ──
  { src: 'Back Cover SOE.png', dir: 'marketing', out: 'back-cover.webp' },
  { src: 'Quest Collage.png', dir: 'marketing', out: 'quest-collage.webp' },
  { src: 'Quest Complete.png', dir: 'marketing', out: 'quest-complete.webp' },
  { src: 'Quest Congrats.png', dir: 'marketing', out: 'quest-congrats.webp' },
  { src: 'Busy Brain.png', dir: 'marketing', out: 'busy-brain.webp' },
  { src: 'Calm rain.png', dir: 'marketing', out: 'calm-rain.webp' },
  { src: 'Kenji Aiko Harmonia Call.png', dir: 'marketing', out: 'harmonia-call.webp' },
  { src: 'Seriphia The Sound of Essentials.png', dir: 'marketing', out: 'seriphia-title.webp' },
  { src: 'Shapes.png', dir: 'marketing', out: 'shapes-panorama.webp' },
  { src: 'Keep on Learning.png', dir: 'marketing', out: 'keep-on-learning.webp' },
];

async function run() {
  // Create output directories
  const dirs = [...new Set(CONVERSIONS.map(c => c.dir))];
  for (const d of dirs) {
    await mkdir(join(WEB_ASSETS, d), { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const conv of CONVERSIONS) {
    const srcPath = join(SRC, conv.src);
    const outPath = join(WEB_ASSETS, conv.dir, conv.out);

    try {
      await sharp(srcPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);

      const srcStat = (await import('fs')).statSync(srcPath);
      const outStat = (await import('fs')).statSync(outPath);
      const reduction = ((1 - outStat.size / srcStat.size) * 100).toFixed(1);
      console.log(`✓ ${conv.out} (${(outStat.size / 1024).toFixed(0)} KB, -${reduction}%)`);
      success++;
    } catch (err) {
      console.error(`✗ ${conv.src}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} converted, ${failed} failed`);
}

run();
