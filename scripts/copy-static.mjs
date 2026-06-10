import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

await mkdir(dist, { recursive: true });
await cp(path.join(root, 'poses'), path.join(dist, 'poses'), { recursive: true });
await cp(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json'));

console.log('Copied static assets to dist/');
