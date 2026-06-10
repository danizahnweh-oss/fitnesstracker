import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, '.generated');
const outFile = path.join(outDir, 'main.jsx');

const orderedSources = [
  'lib.js',
  'themes.js',
  'tweaks-panel.jsx',
  'app-home.jsx',
  'app-workout.jsx',
  'app-workout-card.jsx',
  'app-workout-rest.jsx',
  'app-stats.jsx',
  'app-settings.jsx',
  'app-plates.jsx',
  'app-recovery.jsx',
  'app-coach-video.jsx',
  'app-coach.jsx',
  'app-mobility.jsx',
  'app-main.jsx',
  'canvas.jsx',
];

const chunks = [
  "import React from 'react';",
  "import { createRoot } from 'react-dom/client';",
  '',
  'window.React = React;',
  'window.ReactDOM = { createRoot };',
  'const ReactDOM = window.ReactDOM;',
  '',
];

for (const file of orderedSources) {
  const source = await readFile(path.join(root, file), 'utf8');
  chunks.push(`// ── ${file} ─────────────────────────────────────────────`);
  chunks.push(source);
  chunks.push('');
}

await mkdir(outDir, { recursive: true });
await writeFile(outFile, `${chunks.join('\n')}\n`);
console.log(`Generated ${path.relative(root, outFile)}`);
