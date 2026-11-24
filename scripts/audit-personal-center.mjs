import fs from 'node:fs';

const pages = [
  'dist/personal-center/index.html',
  'dist/personal-center/favorites/index.html',
  'dist/personal-center/bookmarks/index.html',
  'dist/personal-center/history/index.html',
  'dist/personal-center/compare/index.html',
  'dist/personal-center/notifications/index.html',
  'dist/personal-center/settings/index.html',
  'dist/personal-center/feedback/index.html'
];

let allGood = true;
for (const p of pages) {
  if (!fs.existsSync(p)) {
    console.error('✗ 缺少页面:', p);
    allGood = false;
    continue;
  }
  const html = fs.readFileSync(p, 'utf-8');
  if (!html.includes('content="noindex, follow"')) {
    console.error('✗ 缺少 noindex, follow:', p);
    allGood = false;
  } else {
    console.log('✓ 验证成功 noindex, follow:', p);
  }
}

// Check sitemap
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf-8');
if (sitemap.includes('personal-center')) {
  console.error('✗ 错误：sitemap.xml 中包含了 personal-center！');
  allGood = false;
} else {
  console.log('✓ 验证成功：personal-center 已按 SEO 要求从 sitemap.xml 中完全排除！');
}

if (allGood) {
  console.log('\n>>> 全部 8 个个人中心独立页面及其 SEO 保护规则 100% 审计通过！<<<');
} else {
  process.exit(1);
}
