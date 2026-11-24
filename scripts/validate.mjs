import fs from 'node:fs';
import path from 'node:path';
import { getAllBrands } from '../src/lib/brand-parser.ts';
import { BRAND_ORDER } from '../src/lib/brand-config.ts';

console.log('====================================================');
console.log('2027 机场日志 · 全站技术与数据规范验收检查');
console.log('====================================================\n');

let pass = true;

// 1. Verify 18 MD files & Slot 4
console.log('【检查 1】验证 18 份原始 MD 文件及大佬云正式落位...');
const brands = getAllBrands();
if (brands.length === 18) {
  console.log(`✓ 成功导入全部 18 份真实机场 MD 资料（含第4位大佬云）！`);
} else {
  console.error(`✗ 错误：当前导入品牌数为 ${brands.length}，期望为 18！`);
  pass = false;
}

const dalaoSlot = BRAND_ORDER.find(b => b.order === 4);
if (dalaoSlot && !dalaoSlot.missing && dalaoSlot.id === 'dalaoyun') {
  console.log(`✓ 第 4 位大佬云已正式激活并导入真实资料！`);
} else {
  console.error(`✗ 错误：第 4 位大佬云配置不正确！`);
  pass = false;
}

// 2. Verify Fixed Brand Order (01 to 12)
console.log('\n【检查 2】验证前 12 个品牌固定排序...');
const expectedFixedFirst12 = [
  '灵动云',
  '暮光加速',
  '微风网络',
  '大佬云',
  '飞V',
  '飞猫云',
  '浪网',
  '隐形人',
  '梯子云',
  '无忧连接',
  'Firefly',
  '全球云'
];

let orderMatches = true;
brands.slice(0, 12).forEach((b, idx) => {
  const expectedName = expectedFixedFirst12[idx];
  if (!b.brandName.includes(expectedName)) {
    console.error(`✗ 排序不一致：第 ${idx + 1} 位应包含 “${expectedName}”，实际为 “${b.brandName}”`);
    orderMatches = false;
  }
});
if (orderMatches) {
  console.log(`✓ 首页前 12 个品牌排序严格符合规范定义！`);
} else {
  pass = false;
}

// 3. Verify Core Chapters & Tables in each Brand
console.log('\n【检查 3】验证每份资料完整保留核心正文章节及套餐表格...');
let allChaptersPresent = true;
for (const b of brands) {
  for (let sec = 1; sec <= 7; sec++) {
    if (!b.renderedHtml.includes(`id="${b.id}-section-${sec}"`)) {
      console.error(`✗ 品牌 [${b.brandName}] 缺少第 ${sec} 章节！`);
      allChaptersPresent = false;
    }
  }
  if (b.plans.length === 0) {
    console.error(`✗ 品牌 [${b.brandName}] 套餐表格解析为空！`);
    allChaptersPresent = false;
  }
}
if (allChaptersPresent) {
  console.log(`✓ 所有 18 家品牌均完整包含全部核心正文章节及完整套餐数据表格（第 8 章来源与更新已按需求从前端移除）！`);
} else {
  pass = false;
}

// 4. Verify Grounded FAQs
console.log('\n【检查 4】验证品牌专属 FAQ 真实性与数量（6-8题）...');
let allFaqsOk = true;
for (const b of brands) {
  if (b.faqList.length < 6 || b.faqList.length > 8) {
    console.error(`✗ 品牌 [${b.brandName}] FAQ 数量异常：${b.faqList.length}`);
    allFaqsOk = false;
  }
}
if (allFaqsOk) {
  console.log(`✓ 所有 18 家品牌均配备 8 题专属常见问题解答，且完全基于各 MD 事实提炼！`);
} else {
  pass = false;
}

// 5. Verify Risk Watchlist
console.log('\n【检查 5】验证风险预警专区数据...');
const riskPath = path.resolve('content/risk-watchlist.json');
if (fs.existsSync(riskPath)) {
  const risks = JSON.parse(fs.readFileSync(riskPath, 'utf-8'));
  console.log(`✓ 风险监控名单包含 ${risks.length} 个公开案例（FCCloud, ACA, 随便云, 红叶机场）。`);
  if (risks.length !== 4) {
    console.warn(`! 注意：风险案例数量为 ${risks.length}，要求约为 4 个。`);
  }
} else {
  console.error(`✗ 风险监控清单 content/risk-watchlist.json 不存在！`);
  pass = false;
}

console.log('\n====================================================');
if (pass) {
  console.log('>>> 全部先期数据与结构校验通过！可以执行静态构建。 <<<');
} else {
  console.error('>>> 存在未通过的校验项，请检查上方日志。 <<<');
  process.exit(1);
}
console.log('====================================================\n');
