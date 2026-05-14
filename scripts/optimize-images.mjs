import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const CONFIG = {
  equipo:      { width: 800,  quality: 78 },
  productos:   { width: 420,  quality: 80 },
  testimonios: { width: 320,  quality: 80 },
  comunidad:   { width: 640,  quality: 80 },
};

for (const [folder, { width, quality }] of Object.entries(CONFIG)) {
  const dir = `public/images/${folder}`;
  if (!existsSync(dir)) continue;
  console.log(`\n── ${folder} (max ${width}px, q${quality}) ──`);

  const files = readdirSync(dir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  for (const file of files) {
    const src = join(dir, file);
    const dst = join(dir, basename(file, extname(file)) + '-min.webp');
    const kb0 = Math.round(statSync(src).size / 1024);

    const buf = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    const kb1 = Math.round(buf.length / 1024);
    if (kb1 < kb0) {
      writeFileSync(dst, buf);
      console.log(`  OK ${file}: ${kb0}KB -> ${kb1}KB (-${Math.round((1 - kb1/kb0)*100)}%)`);
    } else {
      console.log(`  -- ${file}: ${kb0}KB (already optimal)`);
    }
  }
}

console.log('\nDone.');
