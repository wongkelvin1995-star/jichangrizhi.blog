import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const previewDir = path.resolve('docs/previews');
if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempProfile = 'C:\\Users\\USERR\\AppData\\Local\\Temp\\chrome_headless_test';
const flags = `--headless=new --no-sandbox --disable-gpu --user-data-dir="${tempProfile}" --disable-crash-reporter --hide-scrollbars`;

const targets = [
  { name: '01-homepage-1440.png', url: 'http://localhost:4327/', size: '1440,1100' },
  { name: '02-airports-archive-1440.png', url: 'http://localhost:4327/airports/', size: '1440,1100' },
  { name: '03-brands-directory-1440.png', url: 'http://localhost:4327/brands/', size: '1440,1100' },
  { name: '04-guides-hub-1440.png', url: 'http://localhost:4327/guides/', size: '1440,1100' },
  { name: '05-brand-detail-dalaoyun-1440.png', url: 'http://localhost:4327/airports/dalaoyun/', size: '1440,1100' },
  { name: '06-guide-clash-1440.png', url: 'http://localhost:4327/guides/clash-tutorial/', size: '1440,1100' },
  { name: '07-risk-alerts-1440.png', url: 'http://localhost:4327/risk-alerts/', size: '1440,1100' },
  { name: '08-mobile-homepage-390.png', url: 'http://localhost:4327/', size: '390,844' },
  { name: '09-personal-center-overview-1440.png', url: 'http://localhost:4327/personal-center/', size: '1440,1100' },
  { name: '10-personal-center-favorites-1440.png', url: 'http://localhost:4327/personal-center/favorites/', size: '1440,1100' },
  { name: '11-personal-center-compare-1440.png', url: 'http://localhost:4327/personal-center/compare/', size: '1440,1100' },
  { name: '12-personal-center-notifications-1440.png', url: 'http://localhost:4327/personal-center/notifications/', size: '1440,1100' },
  { name: '13-personal-center-settings-1440.png', url: 'http://localhost:4327/personal-center/settings/', size: '1440,1100' },
  { name: '14-personal-center-feedback-1440.png', url: 'http://localhost:4327/personal-center/feedback/', size: '1440,1100' },
  { name: '15-personal-center-mobile-390.png', url: 'http://localhost:4327/personal-center/', size: '390,844' }
];

console.log('[Take Screenshots] Capturing high-res screenshots with Chrome headless...');

for (const t of targets) {
  const outPath = path.join(previewDir, t.name);
  try {
    execSync(`"${chromePath}" ${flags} --window-size=${t.size} --screenshot="${outPath}" "${t.url}"`, { stdio: 'ignore', timeout: 15000 });
    const stat = fs.statSync(outPath);
    console.log(`✓ [Screenshot Saved] ${t.name} (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`✗ [Screenshot Failed] ${t.name}:`, err.message);
  }
}

console.log('[Take Screenshots] All preview screenshots successfully generated in docs/previews/');
