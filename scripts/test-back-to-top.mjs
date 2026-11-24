import http from 'node:http';

http.get('http://localhost:4327/', (res) => {
  let html = '';
  res.on('data', chunk => { html += chunk; });
  res.on('end', () => {
    if (html.includes('id="backToTopBtn"') && html.includes('window.scrollTo')) {
      console.log('✓ Back to top button and smooth scroll script successfully present in HTML');
      process.exit(0);
    } else {
      console.error('✗ Back to top button or script missing');
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Error connecting to preview server:', err);
  process.exit(1);
});
