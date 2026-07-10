/* Assemble a clean ./publish folder for Cloudflare Pages (static output only).
   Run:  node build/build.mjs && node build/publish.mjs
   Then: drag the ./publish folder into Cloudflare Pages, or  npx wrangler pages deploy publish */
import { cpSync, rmSync, mkdirSync, readdirSync, existsSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'publish');

// Dev-only things we do NOT ship to the live site
const EXCLUDE = new Set([
  'build', '.claude', 'node_modules', 'publish', '.git',
  'docs',                // internal docs (research notes, setup guides)
  'functions',           // Pages Functions deploy from the repo root, not the output dir
  'README.md', 'HANDOFF.md', 'package.json', 'package-lock.json',
  '.htaccess',           // Apache-only; Cloudflare uses _headers instead
  'quote-handler.php',   // PHP won't run on Pages; form uses Web3Forms
]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Folders inside assets/ that are deliverables, not website content
const ASSET_EXCLUDE = path.join(ROOT, 'assets', 'presentation');

let count = 0;
for (const entry of readdirSync(ROOT)) {
  if (EXCLUDE.has(entry)) continue;
  const src = path.join(ROOT, entry);
  cpSync(src, path.join(OUT, entry), {
    recursive: true,
    filter: (s) => !s.startsWith(ASSET_EXCLUDE), // drop the presentation/demo-video folder
  });
  count++;
}

// quick size report
function dirSize(p) {
  let s = 0;
  for (const e of readdirSync(p)) {
    const fp = path.join(p, e); const st = statSync(fp);
    s += st.isDirectory() ? dirSize(fp) : st.size;
  }
  return s;
}
console.log(`publish/ ready — ${count} top-level items, ${(dirSize(OUT) / 1048576).toFixed(1)} MB`);
console.log('Deploy:  npx wrangler pages deploy publish --project-name vision-touch');
