import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const PRODUCTOS_DIR = 'public/images/productos';

// Marquee images need tiny thumbs (displayed at ~37-40px, thumb at 2× = 80px)
const MARQUEE_IMAGES = ['mewi-1', 'mewi-12', 'mewi-15', 'mewi-16', 'mewi-18', 'mewi-20', 'mewi-21'];

// All showcase product images get -sm.webp (displayed ~130-160px, target 2× = 300px height)
const files = await readdir(PRODUCTOS_DIR);
const productImages = files.filter(f => f.match(/^mewi-\d+-min\.webp$/));

let created = 0;

for (const file of productImages) {
  const base = file.replace('-min.webp', '');
  const input = join(PRODUCTOS_DIR, file);

  // -sm.webp: showcase version — resize height to 400px (2× display of 200px), keep ratio
  const smPath = join(PRODUCTOS_DIR, `${base}-sm.webp`);
  await sharp(input)
    .resize({ height: 400, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82 })
    .toFile(smPath);
  created++;

  // -thumb.webp: marquee version — 80px wide (2× display of ~40px)
  if (MARQUEE_IMAGES.includes(base)) {
    const thumbPath = join(PRODUCTOS_DIR, `${base}-thumb.webp`);
    await sharp(input)
      .resize({ width: 80 })
      .webp({ quality: 80 })
      .toFile(thumbPath);
    created++;
  }
}

console.log(`✓ Created ${created} optimized images`);
