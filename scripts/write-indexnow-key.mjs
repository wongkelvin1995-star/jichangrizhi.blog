import fs from 'node:fs';
import path from 'node:path';

// Default IndexNow key (can be overridden via environment variable INDEXNOW_KEY)
const key = process.env.INDEXNOW_KEY || '4f38b2d187cf45909249e0839e55a82e';
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const keyFilePath = path.join(publicDir, `${key}.txt`);
fs.writeFileSync(keyFilePath, key, 'utf-8');

console.log(`[IndexNow] Key file generated successfully at: public/${key}.txt`);
