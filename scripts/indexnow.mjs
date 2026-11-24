import https from 'node:https';

const host = 'jichangrizhi.blog';
const key = process.env.INDEXNOW_KEY || '4f38b2d187cf45909249e0839e55a82e';
const keyLocation = `https://${host}/${key}.txt`;

// Only real, indexable URLs (no anchor tags)
const urlList = [
  `https://${host}/`,
  `https://${host}/airports/`,
  `https://${host}/brands/`,
  `https://${host}/guides/`,
  `https://${host}/articles/`,
  `https://${host}/articles/airport-brand-guide/`,
  `https://${host}/articles/airport-plan-guide/`,
  `https://${host}/articles/airport-node-regions/`,
  `https://${host}/guides/airport-brand-guide/`,
  `https://${host}/guides/plan-selection/`,
  `https://${host}/guides/node-selection/`,
  `https://${host}/risk-alerts/`,
  `https://${host}/about/`
];

const isDryRun = process.argv.includes('--dry-run');

console.log(`[IndexNow] Preparing to submit ${urlList.length} URLs for host: ${host}`);
console.log(`[IndexNow] Key Location: ${keyLocation}`);
console.log(`[IndexNow] URLs:`, urlList);

if (isDryRun) {
  console.log(`[IndexNow] Dry run complete. No network request made.`);
  process.exit(0);
}

const payload = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  console.log(`[IndexNow] Response Status: ${res.statusCode} ${res.statusMessage}`);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`[IndexNow] Successfully submitted to IndexNow API.`);
    } else {
      console.warn(`[IndexNow] Notice: API returned ${res.statusCode}. Body: ${data}`);
    }
  });
});

req.on('error', (e) => {
  console.error(`[IndexNow] Request failed: ${e.message}`);
});

req.write(payload);
req.end();
