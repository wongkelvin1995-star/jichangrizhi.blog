import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const port = 43882;

const mimeMap = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(distDir, reqPath, 'index.html'))) {
    filePath = path.join(distDir, reqPath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    const notFoundPage = path.join(distDir, '404.html');
    if (fs.existsSync(notFoundPage)) {
      fs.createReadStream(notFoundPage).pipe(res);
    } else {
      res.end('Not Found');
    }
  }
});

server.listen(port, async () => {
  console.log(`[Preview Test] Static server running on http://127.0.0.1:${port}`);

  async function testUrl(pathname, expectedStatus = 200) {
    return new Promise((resolve) => {
      http.get(`http://127.0.0.1:${port}${pathname}`, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          const ok = res.statusCode === expectedStatus;
          console.log(`[GET ${pathname}] Status: ${res.statusCode} (Expected: ${expectedStatus}) | Length: ${body.length} bytes -> ${ok ? 'PASSED' : 'FAILED'}`);
          resolve(ok);
        });
      }).on('error', (err) => {
        console.error(`[GET ${pathname}] Error:`, err);
        resolve(false);
      });
    });
  }

  const results = [];
  results.push(await testUrl('/'));
  results.push(await testUrl('/airports/'));
  results.push(await testUrl('/brands/'));
  results.push(await testUrl('/guides/'));
  results.push(await testUrl('/risk-alerts/'));
  results.push(await testUrl('/about/'));
  results.push(await testUrl('/search/'));
  results.push(await testUrl('/airports/lingdongyun/'));
  results.push(await testUrl('/airports/dalaoyun/'));
  results.push(await testUrl('/guides/beginner-guide/'));
  results.push(await testUrl('/guides/clash-tutorial/'));
  results.push(await testUrl('/sitemap.xml'));
  results.push(await testUrl('/robots.txt'));
  results.push(await testUrl('/some-non-existent-url-test/', 404));

  // Personal Center MAX Subroutes
  results.push(await testUrl('/personal-center/'));
  results.push(await testUrl('/personal-center/favorites/'));
  results.push(await testUrl('/personal-center/bookmarks/'));
  results.push(await testUrl('/personal-center/history/'));
  results.push(await testUrl('/personal-center/compare/'));
  results.push(await testUrl('/personal-center/notifications/'));
  results.push(await testUrl('/personal-center/settings/'));
  results.push(await testUrl('/personal-center/feedback/'));

  const allPassed = results.every(Boolean);
  console.log(`\n======================================================`);
  console.log(`[Preview Test] All URL responses verified: ${allPassed ? 'ALL 14 CHECKS PASSED ✓' : 'SOME CHECKS FAILED ✗'}`);
  console.log(`======================================================`);

  server.close(() => {
    process.exit(allPassed ? 0 : 1);
  });
});
