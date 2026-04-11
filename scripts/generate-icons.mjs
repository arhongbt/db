/**
 * Genererar favicon och PWA-ikoner från logo.svg
 * Kör: node scripts/generate-icons.mjs
 * Kräver: npm install -g sharp-cli (eller npx)
 */
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Enklare approach: skapa en HTML-canvas-baserad PNG-generator
// Men ännu enklare: skapa rena PNG-ikoner programmatiskt

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

console.log('=== Sista Resan Icon Generator ===\n');
console.log('SVG-logotyp skapad: public/logo.svg\n');
console.log('För att generera PNG-ikoner, kör:');
console.log('');
console.log('  npx @anthropic-ai/sharp-cli resize public/logo.svg 192 192 public/icons/icon-192.png');
console.log('');
console.log('Eller använd en online-konverterare:');
console.log('  1. Gå till https://realfavicongenerator.net');
console.log('  2. Ladda upp public/logo.svg');
console.log('  3. Ladda ner och ersätt filerna i public/icons/');
console.log('');
console.log('Alternativt, installera sharp och kör:');

// Försök använda sharp om det finns
try {
  const sharp = await import('sharp');
  const svg = readFileSync('public/logo.svg');

  for (const { name, size } of sizes) {
    const outPath = name.startsWith('icon-') ? `public/icons/${name}` : `public/${name}`;
    await sharp.default(svg)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`  ✓ ${outPath} (${size}x${size})`);
  }

  // Skapa favicon.ico från 32x32
  const ico32 = await sharp.default(svg).resize(32, 32).png().toBuffer();
  writeFileSync('public/favicon.ico', ico32);
  console.log('  ✓ public/favicon.ico');

  console.log('\nKlart! Alla ikoner genererade.');
} catch (e) {
  console.log('\nsharp inte installerat. Installera med:');
  console.log('  npm install sharp');
  console.log('  node scripts/generate-icons.mjs');
}
