const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generate() {
  const svgPath = path.join(__dirname, 'public', 'logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // PWA icons — dove on blue rounded background
  // Read the logo SVG content and embed it on a blue bg
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  // Extract just the paths (everything between <svg> and </svg>)
  const pathsMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const paths = pathsMatch ? pathsMatch[1] : '';

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#365E85"/>
        <stop offset="100%" stop-color="#2C4A6E"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <g transform="translate(0, -20) scale(${512/858})">
      ${paths}
    </g>
  </svg>`;

  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'public', 'icons', 'icon-512.png'));
  console.log('✓ icon-512.png');

  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, 'public', 'icons', 'icon-192.png'));
  console.log('✓ icon-192.png');

  // Favicons from the standalone dove SVG
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon-32x32.png'));
  console.log('✓ favicon-32x32.png');

  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon-16x16.png'));
  console.log('✓ favicon-16x16.png');

  console.log('\\nAll icons generated!');
}

generate().catch(console.error);
