import fs from 'fs';
import path from 'path';

const IMAGES = {
  'hero.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Se9438190f9694da68a1e2abf1b086dbck.jpg',
  'angle.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Seb981884abe64fc4990a60e8bc28b2a1j.jpg',
  'detail.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/S0db0d90e9ae04906997c45902c6bfaaee.jpg',
  'cushion.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/S890141828a6b488d925d17e96f2f7b87L.jpg',
  'headband.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/S88acf9d1eda54bf58c745c62cbe65cb6B.jpg',
  'lineup.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Sd42c13361f494b5ca3b52e4ea4bb1bc1y.jpg',
  
  // Color Variants
  'variant-pink-purple.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/S9178c1759e2d461ebc9887d40292de1cF.jpg',
  'variant-white-orange.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Sf745f49b9e80444f9dab9fef8ebbcf47S.jpg',
  'variant-blue-red.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Scb47c78701f048089ff061970f719e61m.jpg',
  'variant-yellow-blue.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/S37d0bd20353643998bb2a51e2a712358E.jpg',
  'variant-green-yellow.jpg': 'https://ae-pic-a1.aliexpress-media.com/kf/Sbed5001cbfe4400bb857cae64d727913P.jpg',
  'variant-ocean-blue.png': 'https://ae-pic-a1.aliexpress-media.com/kf/S389bcfbe3d0e47dda4972b3e5c59ce94P.png',
};

async function downloadAll() {
  const targetDir = path.resolve('public/assets/marketing/headphones');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(IMAGES)) {
    const dest = path.join(targetDir, filename);
    console.log(`Downloading ${filename} from ${url}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(dest, buffer);
      console.log(`✅ Saved: ${dest} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`❌ Failed to download ${filename}:`, err);
    }
  }

  // Also replace / update the main cover image
  const mainCoverPath = path.resolve('public/assets/marketing/sensory-kids-headphones.jpg');
  const heroPath = path.join(targetDir, 'hero.jpg');
  if (fs.existsSync(heroPath)) {
    fs.copyFileSync(heroPath, mainCoverPath);
    console.log(`✅ Updated main cover asset: ${mainCoverPath}`);
  }
}

downloadAll();
