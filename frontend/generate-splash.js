import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG content for splash screen - larger version of the logo
const splashSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#3b82f6"/>
  <text x="16" y="21" font-size="16" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif">G</text>
</svg>`;

async function generateSplash() {
  const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  const drawablePath = path.join(androidResPath, 'drawable');
  
  // Ensure directory exists
  if (!fs.existsSync(drawablePath)) {
    fs.mkdirSync(drawablePath, { recursive: true });
  }
  
  // Generate splash.png
  await sharp(Buffer.from(splashSvgContent))
    .resize(400, 400)
    .png()
    .toFile(path.join(drawablePath, 'splash.png'));
  
  console.log('Generated splash screen with GIVIT logo');
}

generateSplash().catch(console.error);
