import { copyFileSync, existsSync } from 'node:fs';

const index = 'dist/public/index.html';
const error = 'dist/public/404.html';

if (!existsSync(index)) {
  console.error('index.html not found at dist/public — did the build run?');
  process.exit(1);
}

copyFileSync(index, error);
console.log('404.html generated (SPA fallback for GitHub Pages deep links)');