import { buildSearchIndex } from '../src/lib/search-indexer.ts';
import { searchSite } from '../src/lib/search-engine.ts';

const items = buildSearchIndex();
console.log(`[Search Test] Built search index with ${items.length} items.`);

const testQueries = [
  '灵动云',
  '灵动',
  '暮光',
  '微风',
  '飞猫',
  'FLYV',
  '飞V',
  '浪网',
  '大佬云',
  '便宜机场',
  '机场推荐',
  'Clash',
  'VPN',
  'ChatGPT',
  'Netflix',
  '香港',
  '日本',
  '年付',
  '月付',
  '100GB',
  '500GB',
  '不限时'
];

console.log('\n======================================================');
console.log('Testing 21 Core Keywords matching:');
console.log('======================================================\n');

let allPassed = true;

testQueries.forEach((q, idx) => {
  const result = searchSite(items, q);
  const ok = result.total > 0;
  if (!ok) allPassed = false;

  console.log(`${String(idx + 1).padStart(2, '0')}. Query: [${q}] -> Found ${result.total} results | Brands: ${result.brands.length}, Plans: ${result.plans.length}, Guides: ${result.guides.length}, Articles: ${result.articles.length}, Risks: ${result.risks.length} | Status: ${ok ? '✓ PASS' : '✗ FAIL'}`);
  if (result.total > 0) {
    const top = result.all[0];
    console.log(`    Top Match: [${top.item.typeName}] ${top.item.title} (Score: ${top.score})`);
  }
});

console.log('\n======================================================');
if (allPassed) {
  console.log('>>> 全部 21 个关键词搜索测试 100% 成功匹配！ <<<');
} else {
  console.error('>>> 存在未命中关键词，请检查索引数据！ <<<');
  process.exit(1);
}
console.log('======================================================\n');
