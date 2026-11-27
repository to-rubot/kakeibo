// Kakeibo — a household budget site for a Japanese home, handed in by this program.
// The site lives in app/ as plain static files (no build step, no network requests):
// it opens in desktop Chrome and on a phone from its own files alone. This program
// copies app/ and screenshots/ into the output directory and writes dossier.json
// with buildDossier from vendor/makefun-frontend.ts, exactly as the scorer expects.
// The vendored library file must stay byte-for-byte the kit's copy, or the dossier
// the scorer rebuilds will not match the one written here.
//
// Local check:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Local view:   node serve.ts   (then open http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const entryRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(entryRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(entryRoot, 'screenshots'))) {
  cpSync(join(entryRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots of 256 KiB each, at most
// 993 files/directories and 16 MiB under app/, dossier text capped at 160 KiB.
const dossierOptions = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};
writeFileSync(join(outputDir, 'dossier.json'), buildDossier(outputDir, dossierOptions));
console.log(`Kakeibo: app and screenshots copied to ${outputDir}; dossier.json written.`);
