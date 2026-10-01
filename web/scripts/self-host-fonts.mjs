import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontsDir = path.resolve(__dirname, '../public/assets/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const cssUrl = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Dancing+Script:wght@500;700&family=Fredoka:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap';

async function downloadFonts() {
  console.log('Fetching Google Fonts stylesheet with Chrome modern User-Agent...');
  const res = await fetch(cssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch fonts CSS: ${res.statusText}`);
  }

  const css = await res.text();
  console.log(`Fetched CSS length: ${css.length}`);

  // Regex to match font-face blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  let localCss = '';
  let counter = 0;

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    
    // Extract font-family, style, weight, display, unicode-range, src
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+);/);
    const srcMatch = block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)\s*format\(['"]woff2['"]\)/);

    if (familyMatch && srcMatch) {
      const familyName = familyMatch[1].replace(/['"]/g, '').trim();
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const weight = weightMatch ? weightMatch[1].trim().replace(/\s+/g, '') : '400';
      const url = srcMatch[1];
      const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : '';

      const safeFamily = familyName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${safeFamily}-${weight}-${style}-${counter++}.woff2`;
      const filepath = path.join(fontsDir, filename);

      console.log(`Downloading ${filename} from ${url}...`);
      const fontRes = await fetch(url);
      const buffer = Buffer.from(await fontRes.arrayBuffer());
      fs.writeFileSync(filepath, buffer);

      localCss += `@font-face {
  font-family: '${familyName}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('/assets/fonts/${filename}') format('woff2');
${unicodeRange ? `  unicode-range: ${unicodeRange};\n` : ''}}\n\n`;
    }
  }

  const outputCssPath = path.resolve(__dirname, '../src/styles/self-hosted-fonts.css');
  fs.mkdirSync(path.dirname(outputCssPath), { recursive: true });
  fs.writeFileSync(outputCssPath, localCss);
  console.log(`Successfully generated ${outputCssPath} with ${counter} font files downloaded!`);
}

downloadFonts().catch(err => {
  console.error('Error downloading fonts:', err);
  process.exit(1);
});
