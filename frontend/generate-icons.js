import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load SVG content from resources/givit.svg so the app icon matches the provided asset
const svgPath = path.join(__dirname, 'resources', 'givit.svg');
if (!fs.existsSync(svgPath)) {
  throw new Error(`SVG not found at: ${svgPath}`);
}
const svgContent = fs.readFileSync(svgPath, 'utf8');

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
  
  // Do NOT write PNGs into mipmap-anydpi-v26 to avoid conflicts with adaptive icon XML
  
  console.log('All Android app icons generated successfully!');
}

generateIcons().catch(console.error);
