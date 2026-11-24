import fs from 'node:fs';
import path from 'node:path';

const brandConfig = [
  { order: 1, name: '灵动云', id: 'lingdongyun', file: '灵动云_机场品牌资料_2026-11-23.md' },
  { order: 2, name: '暮光加速', id: 'muguang', file: '暮光加速_2026-11-23.md' },
  { order: 3, name: '微风网络', id: 'weifeng', file: '微风网络_2026-11-23.md' },
  { order: 4, name: '大佬云', id: 'dalaoyun', file: null, missing: true },
  { order: 5, name: 'FLYV（飞V）', id: 'flyv', file: '飞V_2026-11-23.md' },
  { order: 6, name: '飞猫云', id: 'feimaoyun', file: '飞猫云_2026-11-23.md' },
  { order: 7, name: '浪网', id: 'langwang', file: '浪网_2026-11-23.md' },
  { order: 8, name: '隐形人', id: 'yinxingren', file: '隐形人_2026-11-23.md' },
  { order: 9, name: '梯子云', id: 'tiziyun', file: '梯子云_2026-11-23.md' },
  { order: 10, name: '无忧连接', id: 'wuyoulianjie', file: '无忧连接_2026-11-23.md' },
  { order: 11, name: 'Firefly', id: 'firefly', file: 'Firefly_2026-11-23.md' },
  { order: 12, name: '全球云', id: 'quanqiuyun', file: '全球云_2026-11-23.md' },
  { order: 13, name: '唯兔云（V2云）', id: 'weituyun', file: '唯兔云_V2云_2026-11-23.md' },
  { order: 14, name: 'U1S1（有一说一）', id: 'u1s1', file: 'U1S1_有一说一_2026-11-23.md' },
  { order: 15, name: 'Sogo云', id: 'sogoyun', file: 'Sogo云_2026-11-23.md' },
  { order: 16, name: '跨界云', id: 'kuajieyun', file: '跨界云_2026-11-23.md' },
  { order: 17, name: '灵猫网络', id: 'lingmaoyun', file: '灵猫网络_2026-11-23.md' },
  { order: 18, name: '闪跃 FlashLeap', id: 'shanyue', file: '闪跃_FlashLeap_2026-11-23.md' },
];

const rawDir = path.resolve('content/airports/raw');

console.log('Testing raw MD files parsing:');
let missingCount = 0;
let validCount = 0;

for (const b of brandConfig) {
  if (b.missing || !b.file) {
    console.log(`[Slot ${b.order}] ${b.name} -> Reserved, file not provided yet.`);
    missingCount++;
    continue;
  }
  const filePath = path.join(rawDir, b.file);
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: File not found: ${filePath}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check sections 1 to 8
  const sections = [];
  for (let i = 1; i <= 8; i++) {
    const regex = new RegExp(`##\\s*${i}\\.\\s*([^\\r\\n]+)`);
    const match = content.match(regex);
    if (match) {
      sections.push(`${i}.${match[1].trim()}`);
    }
  }
  
  // Check table in section 2
  const hasTable = content.includes('|---|') || content.includes('|:---|');
  
  // Extract buy/register link
  const regMatch = content.match(/-(?:\s*购买链接|\s*注册地址)：\s*(https?:\/\/[^\s\r\n]+)/);
  const regLink = regMatch ? regMatch[1] : 'None';
  
  // Extract date
  const dateMatch = content.match(/-(?:\s*资料核实日期)：\s*([^\r\n]+)/);
  const verifyDate = dateMatch ? dateMatch[1].trim() : 'Unknown';

  console.log(`[Slot ${b.order}] ${b.name} (ID: ${b.id}) -> Sections: ${sections.length}/8 | Table: ${hasTable ? 'YES' : 'NO'} | Date: ${verifyDate}`);
  validCount++;
}

console.log(`\nSummary: ${validCount} valid brand files imported, ${missingCount} slot reserved (大佬云). Total brand slots: ${brandConfig.length}.`);
