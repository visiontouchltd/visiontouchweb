// Vision Touch Ltd — image optimisation
// Converts source JPG/PNG into web-ready WebP (+ JPG fallback) at sensible sizes.
// Run from Z:/claude so it resolves the local `sharp` install.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const SRC = 'Z:/auztec/projs/visontouch constr/wesbite';
const OUT = 'Z:/claude/vision-touch-website/assets/images';
const LOGO_SRC = path.join(SRC, 'logos');
const LOGO_OUT = 'Z:/claude/vision-touch-website/assets/logo';

sharp.cache(false);

// service slug -> [source files relative to SRC]. First file = primary/hero.
const services = {
  'loft-conversions':         ['loft conversions/loft conversions.jpg', 'loft conversions/loft conversions (2).jpg', 'loft conversions/loft conversions (3).jpg'],
  'house-extensions':         ['House Extensions/House Extensions.jpg'],
  'property-renovations':     ['Property Renovations/Property Renovations.jpg', 'Property Renovations/Property Renovations (2).jpg', 'Property Renovations/Property Renovations (3).jpg'],
  'carpentry-joinery':        ['carpentry and joinery/carpentry and joinery.jpg', 'carpentry and joinery/carpentry and joinery (2).jpg'],
  'kitchen-installation':     ['Kitchen Installation/Kitchen Installation.jpg', 'Kitchen Installation/Kitchen Installation (2).jpg'],
  'bathroom-installation':    ['Bathroom Installation/Bathroom Installation.jpg', 'Bathroom Installation/Bathroom Installation (2).jpg'],
  'structural-work':          ['structural work/structural work 1.jpg', 'structural work/structural work 2.jpg'],
  'general-building-services':['general building services/general building services.jpg'],
  // No dedicated source assets — reuse closest-fit imagery (documented in README as placeholders to replace).
  'roofing':                  ['House Extensions/House Extensions.jpg', 'structural work/structural work 2.jpg'],
  'flooring':                 ['Property Renovations/Property Renovations (3).jpg', 'carpentry and joinery/carpentry and joinery (2).jpg'],
  'garage-conversions':       ['general building services/general building services.jpg', 'Property Renovations/Property Renovations (2).jpg'],
};

// homepage / shared imagery
const home = {
  'interior': 'other images and video to use at homepage/4787421-interior-2685521_1920.jpg',
};

async function variants(src, destDir, base) {
  mkdirSync(destDir, { recursive: true });
  const full = path.join(destDir, `${base}.webp`);
  const card = path.join(destDir, `${base}-card.webp`);
  const fb   = path.join(destDir, `${base}.jpg`);
  await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(full);
  await sharp(src).rotate().resize({ width: 800,  withoutEnlargement: true }).webp({ quality: 72 }).toFile(card);
  await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(fb);
  console.log('  ✓', path.relative(OUT, full));
}

for (const [slug, files] of Object.entries(services)) {
  const destDir = path.join(OUT, 'services', slug);
  console.log('SERVICE', slug);
  for (let i = 0; i < files.length; i++) {
    const src = path.join(SRC, files[i]);
    if (!existsSync(src)) { console.warn('  ! missing', files[i]); continue; }
    await variants(src, destDir, i === 0 ? slug : `${slug}-${i + 1}`);
  }
}

console.log('HOME');
for (const [base, rel] of Object.entries(home)) {
  const src = path.join(SRC, rel);
  if (existsSync(src)) await variants(src, path.join(OUT, 'home'), base);
}

// ---- Logos ----
mkdirSync(LOGO_OUT, { recursive: true });
console.log('LOGOS');
// Full horizontal logo (transparent) for dark header
await sharp(path.join(LOGO_SRC, 'vision touch logo 1.png')).resize({ width: 520, withoutEnlargement: true }).webp({ quality: 92 }).toFile(path.join(LOGO_OUT, 'vision-touch-logo.webp'));
await sharp(path.join(LOGO_SRC, 'vision touch logo 1.png')).resize({ width: 520, withoutEnlargement: true }).png().toFile(path.join(LOGO_OUT, 'vision-touch-logo.png'));
// Dark-text logo for light backgrounds (footer is dark, so keep light version primary)
await sharp(path.join(LOGO_SRC, 'vision touch logo.png')).resize({ width: 520, withoutEnlargement: true }).png().toFile(path.join(LOGO_OUT, 'vision-touch-logo-dark.png'));
// Mark / icon only
await sharp(path.join(LOGO_SRC, 'just logo wobackground.png')).resize({ width: 160 }).png().toFile(path.join(LOGO_OUT, 'vision-touch-mark.png'));
await sharp(path.join(LOGO_SRC, 'just logo wobackground.png')).resize({ width: 96 }).png().toFile(path.join(LOGO_OUT, 'apple-touch-icon.png'));
// Favicons from the mark
for (const s of [16, 32, 48, 180, 192, 512]) {
  await sharp(path.join(LOGO_SRC, 'just logo wobackground.png')).resize(s, s, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toFile(path.join(LOGO_OUT, `favicon-${s}.png`));
}
console.log('  ✓ logos done');
console.log('ALL IMAGE WORK COMPLETE');
