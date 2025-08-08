import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG content from givit.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#3b82f6"/>
  <text x="16" y="21" font-size="16" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">G</text>
</svg>`;

// Android icon sizes for different densities
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Create icons for each density
async function generateIcons() {
  const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  
  for (const [folder, size] of Object.entries(iconSizes)) {
    const folderPath = path.join(androidResPath, folder);
    
    // Ensure directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Generate ic_launcher.png
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(folderPath, 'ic_launcher.png'));
    
    // Generate ic_launcher_round.png (same as regular for now)
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(folderPath, 'ic_launcher_round.png'));
    
    // Generate ic_launcher_foreground.png (same as regular for now)
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(path.join(folderPath, 'ic_launcher_foreground.png'));
    
    console.log(`Generated icons for ${folder} (${size}x${size})`);
  }
  
  // Also generate for mipmap-anydpi-v26 (adaptive icons)
  const anydpiPath = path.join(androidResPath, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiPath)) {
    fs.mkdirSync(anydpiPath, { recursive: true });
  }
  
  // Generate adaptive icon files
  await sharp(Buffer.from(svgContent))
    .resize(108, 108)
    .png()
    .toFile(path.join(anydpiPath, 'ic_launcher.png'));
  
  await sharp(Buffer.from(svgContent))
    .resize(108, 108)
    .png()
    .toFile(path.join(anydpiPath, 'ic_launcher_round.png'));
  
  console.log('Generated adaptive icons for mipmap-anydpi-v26');
  
  console.log('All Android app icons generated successfully!');
}

generateIcons().catch(console.error);
