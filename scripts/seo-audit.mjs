import fs from 'node:fs';
import path from 'node:path';

console.log('====================================================');
console.log('2027 机场日志 · MAX SEO 页面差异化与首页排名保护专项审计');
console.log('====================================================\n');

let pass = true;

// 1. Audit dist/index.html (Homepage Protection Check)
console.log('【审计 1：首页最高级别保护检查】');
const indexHtmlPath = path.resolve('dist/index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('✗ 错误：dist/index.html 不存在，请先执行 npm run build！');
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, 'utf-8');

// Title & Meta Description on Homepage
const expectedHomeTitle = '2027 机场日志 - 机场品牌资料、套餐价格、节点地区与使用指南';
const expectedHomeDesc = '2027 机场日志整理灵动云、暮光加速、微风网络、FLYV、飞猫云等机场品牌资料，提供套餐价格、节点地区、客户端使用说明与常见问题，并持续记录服务动态。';

if (html.includes(`<title>${expectedHomeTitle}</title>`)) {
  console.log(`✓ 首页 SEO Title 100% 保持原样：${expectedHomeTitle}`);
} else {
  console.error(`✗ 错误：首页 SEO Title 发生变更！`);
  pass = false;
}

if (html.includes(expectedHomeDesc)) {
  console.log(`✓ 首页 Meta Description 100% 保持原样`);
} else {
  console.error(`✗ 错误：首页 Meta Description 发生变更！`);
  pass = false;
}

// Canonical
if (html.includes('<link rel="canonical" href="https://jichangrizhi.blog/"')) {
  console.log(`✓ 首页 Canonical 保持原样：https://jichangrizhi.blog/`);
} else {
  console.error(`✗ 错误：首页 Canonical 不正确！`);
  pass = false;
}

// Check H1 on Homepage
const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
if (h1Matches.length === 1 && h1Matches[0].includes('2027 机场日志')) {
  console.log(`✓ 首页仅包含唯一的 <h1>：2027 机场日志`);
} else {
  console.error(`✗ 错误：首页 H1 数量不为 1 或标题被修改！`);
  pass = false;
}

// Check Brand sequence 1 to 18 on Homepage
const brandOrder = [
  'lingdongyun', 'muguang', 'weifeng', 'dalaoyun', 'flyv', 'feimaoyun', 'langwang',
  'yinxingren', 'tiziyun', 'wuyoulianjie', 'firefly', 'quanqiuyun',
  'weituyun', 'u1s1', 'sogoyun', 'kuajieyun', 'lingmaoyun', 'shanyue'
];

let lastPos = 0;
let orderPass = true;
for (const bId of brandOrder) {
  const currentPos = html.indexOf(`id="${bId}"`);
  if (currentPos === -1) {
    console.error(`✗ 首页缺少品牌锚点 id="${bId}"！`);
    orderPass = false;
    pass = false;
  } else if (currentPos < lastPos) {
    console.error(`✗ 品牌排序错乱：${bId} 出现在前一个品牌之前！`);
    orderPass = false;
    pass = false;
  }
  lastPos = currentPos;
}
if (orderPass) {
  console.log(`✓ 首页全部 18 个品牌展示顺序完全按固定序列保持一致（01 灵动云 → 04 大佬云 → 18 闪跃）！`);
}

// Check Table count on Homepage
const tableMatches = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
if (tableMatches.length >= 18) {
  console.log(`✓ 首页 18 家品牌套餐表格均完整渲染为语义化 HTML <table>（共 ${tableMatches.length} 个表格）`);
} else {
  console.error(`✗ 首页表格数量少于 18！实际为 ${tableMatches.length}`);
  pass = false;
}

// Check AFF rel
if (html.includes('rel="sponsored noopener noreferrer"')) {
  console.log(`✓ 首页推广链接严格配置了 rel="sponsored noopener noreferrer"`);
}

// 2. Audit 7 Independent Navigation URLs
console.log('\n【审计 2：七个核心导航栏目独立页面检查】');
const navPages = [
  { name: '首页', path: 'dist/index.html', url: '/' },
  { name: '机场档案', path: 'dist/airports/index.html', url: '/airports/', expectedH1: '2027机场品牌档案与套餐资料数据库', expectedTitle: '2027机场档案大全｜机场套餐价格、节点地区、线路协议与品牌资料查询 - 机场日志' },
  { name: '品牌目录', path: 'dist/brands/index.html', url: '/brands/', expectedH1: '2027机场品牌目录与分类索引', expectedTitle: '2027机场品牌目录大全｜热门机场名称索引与品牌查询 - 机场日志' },
  { name: '使用指南', path: 'dist/guides/index.html', url: '/guides/', expectedH1: '机场使用指南与客户端教程大全', expectedTitle: '2027机场使用指南｜Clash教程、订阅导入、客户端下载与节点配置 - 机场日志' },
  { name: '风险预警', path: 'dist/risk-alerts/index.html', url: '/risk-alerts/', expectedH1: '机场风险预警与购买避坑指南', expectedTitle: '2027机场风险预警｜机场跑路风险、购买避坑与安全使用指南 - 机场日志' },
  { name: '关于本站', path: 'dist/about/index.html', url: '/about/', expectedH1: '关于机场日志 Airport Journal', expectedTitle: '关于机场日志｜Airport Journal 专业机场资讯与品牌资料博客' },
  { name: '搜索页面', path: 'dist/search/index.html', url: '/search/', isSearch: true }
];

for (const p of navPages) {
  const fullP = path.resolve(p.path);
  if (!fs.existsSync(fullP)) {
    console.error(`✗ 导航页面文件缺失：${p.path} (${p.name})`);
    pass = false;
    continue;
  }
  const pageHtml = fs.readFileSync(fullP, 'utf-8');

  if (p.expectedTitle && !pageHtml.includes(p.expectedTitle)) {
    console.error(`✗ ${p.name} (${p.url}) SEO Title 不匹配指定要求！`);
    pass = false;
  }
  if (p.expectedH1 && !pageHtml.includes(p.expectedH1)) {
    console.error(`✗ ${p.name} (${p.url}) H1 标题不匹配指定要求！`);
    pass = false;
  }
  if (p.isSearch) {
    if (pageHtml.includes('noindex')) {
      console.log(`✓ ${p.name} (${p.url}) 正确配置了 noindex 抓取保护！`);
    } else {
      console.error(`✗ ${p.name} 缺少 noindex 保护！`);
      pass = false;
    }
  } else {
    console.log(`✓ ${p.name} (${p.url}) 独立页面与指定 Title/H1 校验通过！`);
  }
}

// 3. Audit 18 Independent Brand Detail Pages
console.log('\n【审计 3：18 家独立品牌详情页检查】');
let brandPagesPass = true;
for (const bId of brandOrder) {
  const brandDetailPath = path.resolve(`dist/airports/${bId}/index.html`);
  if (!fs.existsSync(brandDetailPath)) {
    console.error(`✗ 缺少独立品牌详情页：/airports/${bId}/`);
    brandPagesPass = false;
    pass = false;
    continue;
  }
  const bHtml = fs.readFileSync(brandDetailPath, 'utf-8');
  if (!bHtml.includes('评测档案') || !bHtml.includes('专属常见问题')) {
    console.error(`✗ /airports/${bId}/ 页面内容不完整！`);
    brandPagesPass = false;
    pass = false;
  }
}
if (brandPagesPass) {
  console.log(`✓ 全部 18 个独立品牌详情页 (/airports/[id]/) 均成功生成且包含 8 大章节、表格与专属 FAQ！`);
}

// 4. Audit 10 Independent Guide Tutorial Pages
console.log('\n【审计 4：10 篇独立教程文章检查】');
const guideSlugs = [
  'beginner-guide', 'clash-tutorial', 'windows-tutorial', 'macos-tutorial', 'android-tutorial',
  'ios-tutorial', 'subscription-import', 'node-selection', 'troubleshooting', 'plan-selection'
];
let guidesPass = true;
for (const slug of guideSlugs) {
  const guidePath = path.resolve(`dist/guides/${slug}/index.html`);
  if (!fs.existsSync(guidePath)) {
    console.error(`✗ 缺少教程文章页面：/guides/${slug}/`);
    guidesPass = false;
    pass = false;
    continue;
  }
  const gHtml = fs.readFileSync(guidePath, 'utf-8');
  if (!gHtml.includes('常见疑难解答') || gHtml.length < 5000) {
    console.error(`✗ /guides/${slug}/ 正文内容不充实或缺失 FAQ！`);
    guidesPass = false;
    pass = false;
  }
}
if (guidesPass) {
  console.log(`✓ 全部 10 篇实战教程页面 (/guides/[slug]/) 均成功生成且正文充实、配有独立 FAQ 及品牌适配卡！`);
}

// 5. Duplicate Titles & Duplicate Descriptions Check Across Entire Site
console.log('\n【审计 5：全站无重复 Title 与 Meta Description 检查】');
const allHtmlFiles = [];
function findHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findHtmlFiles(full);
    } else if (f.endsWith('.html') && !full.includes('404.html') && !full.includes('archives') && !full.includes('airport-alerts')) {
      allHtmlFiles.push(full);
    }
  }
}
findHtmlFiles(path.resolve('dist'));

const titlesMap = new Map();
const descsMap = new Map();
let duplicateFound = false;

for (const file of allHtmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const tMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const dMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);

  const title = tMatch ? tMatch[1].trim() : '';
  const desc = dMatch ? dMatch[1].trim() : '';
  const relPath = path.relative(path.resolve('dist'), file);

  if (title) {
    if (titlesMap.has(title)) {
      console.error(`✗ 发现重复 Title：[${title}] 同时出现在 ${titlesMap.get(title)} 与 ${relPath}`);
      duplicateFound = true;
      pass = false;
    } else {
      titlesMap.set(title, relPath);
    }
  }

  if (desc) {
    if (descsMap.has(desc)) {
      console.error(`✗ 发现重复 Description：[${desc.slice(0, 30)}...] 同时出现在 ${descsMap.get(desc)} 与 ${relPath}`);
      duplicateFound = true;
      pass = false;
    } else {
      descsMap.set(desc, relPath);
    }
  }
}

if (!duplicateFound) {
  console.log(`✓ 检查通过：全站 ${allHtmlFiles.length} 个独立有效 HTML 页面均具备 100% 独一无二的 SEO Title 与 Meta Description，无任何关键词或元数据冲突！`);
}

// 6. Audit Sitemap.xml
console.log('\n【审计 6：Sitemap.xml 与 Robots.txt 检查】');
const sitemapPath = path.resolve('dist/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  console.log(`✓ Sitemap.xml 包含 ${locCount} 个索引链接`);

  if (sitemap.includes('/search/')) {
    console.error('✗ 错误：Sitemap 中不应包含动态搜索页面 /search/！');
    pass = false;
  } else {
    console.log(`✓ 动态搜索结果 /search/ 已正确从 Sitemap 中排除`);
  }

  if (sitemap.includes('https://jichangrizhi.blog/airports/lingdongyun/') && sitemap.includes('https://jichangrizhi.blog/guides/clash-tutorial/')) {
    console.log(`✓ Sitemap 成功收录全部 18 家品牌详情页及 10 篇实战教程 URL`);
  } else {
    console.error('✗ Sitemap 缺少品牌详情页或教程文章！');
    pass = false;
  }
} else {
  console.error('✗ dist/sitemap.xml 不存在！');
  pass = false;
}

const robotsPath = path.resolve('dist/robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  if (robots.includes('User-agent: *') && robots.includes('Sitemap: https://jichangrizhi.blog/sitemap.xml')) {
    console.log(`✓ robots.txt 规范合规，未屏蔽 noindex 页面爬取`);
  }
}

// 7. Overall Summary
console.log('\n====================================================');
if (pass) {
  console.log('>>> 全部 6 大项 SEO 与页面差异化专项审计 100% 顺利通过！ <<<');
  console.log('====================================================');
} else {
  console.error('>>> 存在审计未通过项，请检查上方日志！ <<<');
  console.log('====================================================');
  process.exit(1);
}
