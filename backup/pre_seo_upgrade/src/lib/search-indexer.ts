import fs from 'node:fs';
import path from 'node:path';
import { getAllBrands, getRiskWatchlist } from './brand-parser.ts';
import { BRAND_ORDER } from './brand-config.ts';

export interface SearchItem {
  id: string;
  type: 'brand' | 'plan' | 'guide' | 'article' | 'risk';
  typeName: string;
  title: string;
  subtitle: string;
  badge?: string;
  price?: string;
  traffic?: string;
  cycle?: string;
  snippet: string;
  tags: string[];
  url: string;
  searchContent: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  const brands = getAllBrands();
  const risks = getRiskWatchlist();

  // 1. Index All Brands (including slot 4 大佬云 reserved)
  for (const config of BRAND_ORDER) {
    const brand = brands.find(b => b.id === config.id);

    if (config.missing || !brand) {
      items.push({
        id: `brand-${config.id}`,
        type: 'brand',
        typeName: '机场品牌',
        title: config.name,
        subtitle: '资料整理中 · 保留官方固定第4展示位',
        badge: '待收录',
        snippet: '大佬云品牌原始资料正在整理核验中。本站坚持真实性原则，未提供用户原始MD文件前绝不编造虚假参数或价格。',
        tags: ['大佬云', 'dalaoyun', '待收录', '机场品牌', '机场推荐'],
        url: `/#directory`,
        searchContent: `大佬云 dalaoyun 待收录 机场品牌 机场推荐 品牌资料`
      });
      continue;
    }

    const aliasesArr = brand.aliases ? brand.aliases.split(/[、,，\s]+/) : [];
    const regionArr = brand.nodeRegions ? brand.nodeRegions.split(/[、,，\s]+/) : [];
    const protocolArr = brand.protocols ? brand.protocols.split(/[、,，\s/]+/) : [];
    const lineArr = brand.lineTypes ? brand.lineTypes.split(/[、,，\s/]+/) : [];

    const brandTags = [
      brand.brandName,
      brand.englishName,
      ...aliasesArr,
      ...regionArr,
      ...protocolArr,
      ...lineArr,
      '机场品牌',
      '机场推荐'
    ].filter(Boolean);

    // AI & Streaming keywords if supported
    if (/支持|适配/i.test(brand.services.netflix)) brandTags.push('Netflix', '奈飞', '流媒体');
    if (/支持|适配/i.test(brand.services.disney)) brandTags.push('Disney+', '迪士尼');
    if (/支持|适配/i.test(brand.services.youtube)) brandTags.push('YouTube', '油管', '4K');
    if (/支持|适配/i.test(brand.services.chatgpt)) brandTags.push('ChatGPT', 'OpenAI', 'AI工具');
    if (/Claude/i.test(brand.services.otherAi)) brandTags.push('Claude');

    // Client compatibility keywords
    if (/Windows/i.test(brand.clientSupport.windows)) brandTags.push('Windows');
    if (/macOS/i.test(brand.clientSupport.macos)) brandTags.push('macOS', 'Mac');
    if (/Android/i.test(brand.clientSupport.android)) brandTags.push('Android', '安卓');
    if (/iOS|Nextin/i.test(brand.clientSupport.ios)) brandTags.push('iOS', 'iPhone', 'Nextin');
    if (/Clash|申请|第三方/i.test(brand.clientSupport.thirdParty) || /Clash/i.test(brand.clientSupport.importMethod)) {
      brandTags.push('Clash', 'Shadowrocket', '小火箭', '第三方订阅');
    }

    // Check if budget friendly
    const hasLowPrice = brand.plans.some(p => {
      const num = parseInt(p.price.replace(/[^\d]/g, ''), 10);
      return !isNaN(num) && num <= 25;
    });
    if (hasLowPrice) {
      brandTags.push('便宜机场', '平价机场', '性价比');
    }

    // Coupon codes & promo keywords
    const promoMatches = brand.rawMarkdown.match(/(?:优惠码|优惠券代码|折扣码)\s*[`“"']?([a-zA-Z0-9_-]+)[`”"']?/g);
    if (promoMatches) {
      promoMatches.forEach(m => {
        const code = m.replace(/优惠码|优惠券代码|折扣码|[`“"'\s]/g, '');
        if (code && code.length >= 3) {
          brandTags.push(code, `${code}优惠券`, `${code}优惠码`);
        }
      });
    }

    const fullText = [
      brand.brandName,
      brand.englishName,
      brand.aliases,
      brand.introduction,
      brand.positioning,
      brand.targetUsers,
      brand.nodeRegions,
      brand.lineTypes,
      brand.protocols,
      brand.clientSupport.windows,
      brand.clientSupport.macos,
      brand.clientSupport.android,
      brand.clientSupport.ios,
      brand.clientSupport.thirdParty,
      brand.clientSupport.importMethod,
      brand.services.netflix,
      brand.services.chatgpt,
      brand.services.otherAi,
      brand.support.contact,
      brand.support.refundPolicy,
      brand.support.trialPolicy,
      ...brandTags
    ].join(' ');

    items.push({
      id: `brand-${brand.id}`,
      type: 'brand',
      typeName: '机场品牌',
      title: `${brand.brandName} ${brand.englishName ? `(${brand.englishName})` : ''}`,
      subtitle: `${brand.lineTypes || '优质网络连接'} · 覆盖 ${brand.nodeRegions || '主流地区'}`,
      badge: brand.order <= 3 ? '热门推荐' : '已收录',
      snippet: brand.introduction || `${brand.brandName} 机场品牌档案，包含套餐价格、节点分布、客户端教程与常见问题。`,
      tags: Array.from(new Set(brandTags)),
      url: `/#${brand.id}`,
      searchContent: fullText
    });

    // 2. Index All Plans of This Brand
    brand.plans.forEach((plan, planIdx) => {
      const planTags = [
        brand.brandName,
        plan.name,
        plan.price,
        plan.cycle,
        plan.traffic,
        '机场套餐',
        '套餐价格',
        '流量'
      ];

      if (/年付/i.test(plan.cycle) || /年付/i.test(plan.name)) planTags.push('年付', '年付套餐');
      if (/月付/i.test(plan.cycle) || /月付/i.test(plan.name)) planTags.push('月付', '月付套餐');
      if (/季付/i.test(plan.cycle)) planTags.push('季付');
      if (/一次性|不限时|流量包/i.test(plan.cycle) || /一次性|不限时|流量包/i.test(plan.name)) {
        planTags.push('不限时', '一次性', '流量包', '按量计费');
      }

      // Extract specific numbers like 100GB, 500GB, 1.5TB
      const trafficMatch = plan.traffic.match(/(\d+(?:\.\d+)?)\s*(GB|TB)/i);
      if (trafficMatch) {
        planTags.push(trafficMatch[0].toUpperCase(), `${trafficMatch[1]}${trafficMatch[2].toUpperCase()}`);
      }

      // Check price level
      const priceNum = parseInt(plan.price.replace(/[^\d]/g, ''), 10);
      if (!isNaN(priceNum) && priceNum <= 25 && /月付/i.test(plan.cycle)) {
        planTags.push('便宜机场', '平价套餐', '性价比');
      }

      items.push({
        id: `plan-${brand.id}-${planIdx}`,
        type: 'plan',
        typeName: '机场套餐',
        title: `${brand.brandName} · ${plan.name}`,
        subtitle: `${plan.cycle} · 流量 ${plan.traffic}`,
        price: plan.price,
        traffic: plan.traffic,
        cycle: plan.cycle,
        badge: plan.cycle.split('/')[0],
        snippet: `${brand.brandName} 套餐详情：价格 ${plan.price}，付款周期 ${plan.cycle}，流量规格 ${plan.traffic}，设备数量：${plan.devices}，速率限制：${plan.speedLimit}。`,
        tags: Array.from(new Set(planTags)),
        url: `/#${brand.id}`,
        searchContent: `${brand.brandName} ${plan.name} ${plan.price} ${plan.cycle} ${plan.traffic} ${plan.devices} ${plan.speedLimit} ${planTags.join(' ')}`
      });
    });
  }

  // 3. Index Practical Guides
  const guidesData = [
    {
      id: 'guide-clients-setup',
      title: '客户端配置与订阅导入完整教程',
      subtitle: 'Windows / macOS / Android / iOS / Linux / 路由器',
      snippet: '系统讲解官方专属客户端安装、iOS Nextin 配置、Clash Verge、Shadowrocket 小火箭、Sing-box 等第三方客户端的通用订阅导入流程及分流规则设置。',
      tags: ['使用指南', '客户端', '教程', 'Clash', 'Shadowrocket', '小火箭', 'Nextin', 'Sing-box', 'Windows', 'Mac', 'Android', 'iOS', 'VPN', '订阅导入'],
      url: '/guides/#guide-clients',
      searchContent: '客户端使用指南 客户端配置 订阅导入 教程 Clash Shadowrocket 小火箭 Nextin Sing-box Windows macOS Android iOS Linux 路由器 VPN'
    },
    {
      id: 'guide-troubleshoot-timeout',
      title: '节点超时、连接失败与订阅更新故障排查',
      subtitle: '常见网络异常三步快速排查指南',
      snippet: '针对节点出现红字超时、无法连接国外网站、403 Forbidden、订阅拉取失败或 DNS 污染问题的标准化排查步骤与解决方案。',
      tags: ['使用指南', '故障排查', '超时', '连接失败', '订阅更新', '节点红字', '无法连接', 'DNS污染', '403'],
      url: '/guides/#guide-troubleshoot',
      searchContent: '故障排查 异常排查 节点超时 连接失败 订阅拉取失败 403 节点红字 无法打开 无法连接 客服工单'
    },
    {
      id: 'guide-selection-principles',
      title: '机场选购避坑指南：坚持月付与备用双活原则',
      subtitle: '如何选择适合自己的高性价比稳定机场',
      snippet: '详解为什么新手应当优先选择月付套餐，如何评估晚高峰网络拥塞、识别不限速宣传话术，以及针对跨境办公与学术检索的多线路冗余备用策略。',
      tags: ['选购建议', '使用指南', '便宜机场', '性价比', '月付', '年付避坑', '不限速', '备用机场', '机场推荐'],
      url: '/guides/#guide-selection',
      searchContent: '选购建议 选购指南 便宜机场 机场推荐 避坑指南 坚持月付 年付套路 性价比 备用冗余 不限速'
    },
    {
      id: 'guide-protocols-lines',
      title: '机场线路类型与传输协议深度科普',
      subtitle: 'BGP 智能调度、IEPL / IPLC 专线与 Shadowsocks / VLESS',
      snippet: '深入剖析公网中转、BGP 隧道调度与内网专线（IEPL/IPLC）的延迟与成本区别，以及主流协议 Shadowsocks、VLESS、Trojan 的连接表现。',
      tags: ['线路类型', '传输协议', 'BGP', 'IEPL', 'IPLC', '专线', 'Shadowsocks', 'SS', 'VLESS', 'Trojan', '低延迟'],
      url: '/guides/#guide-protocols',
      searchContent: '线路类型 传输协议 BGP IEPL IPLC 专线 Shadowsocks SS VLESS Trojan 内网专线 中转 低延迟'
    },
    {
      id: 'guide-streaming-ai',
      title: 'Netflix、Disney+ 与 ChatGPT、Claude 访问配置',
      subtitle: '流媒体解锁与 AI 大模型出口节点选择策略',
      snippet: '解析主流流媒体（Netflix 奈飞、Disney+ 迪士尼、YouTube 4K）及生成式 AI（ChatGPT、Claude、Midjourney）的出口 IP 风控检测机制与节点地区推荐。',
      tags: ['流媒体', 'AI工具', 'Netflix', '奈飞', 'Disney+', '迪士尼', 'YouTube', 'ChatGPT', 'OpenAI', 'Claude', 'Midjourney', '解锁'],
      url: '/guides/#guide-streaming-ai',
      searchContent: '流媒体解锁 AI工具 访问配置 Netflix 奈飞 Disney+ 迪士尼 YouTube 油管 ChatGPT OpenAI Claude Midjourney 风控 IP检测'
    }
  ];

  guidesData.forEach(g => {
    items.push({
      id: g.id,
      type: 'guide',
      typeName: '使用指南',
      title: g.title,
      subtitle: g.subtitle,
      badge: '实战教程',
      snippet: g.snippet,
      tags: g.tags,
      url: g.url,
      searchContent: `${g.title} ${g.subtitle} ${g.snippet} ${g.searchContent}`
    });
  });

  // 4. Index Featured Articles
  const articlesData = [
    {
      id: 'article-mainstream-brands-review',
      title: '主流机场品牌盘点：特色、定位与适用人群深度解析',
      subtitle: '机场档案精选深度专题',
      snippet: '全面梳理当前主流机场服务商的线路风格、核心特色与目标受众，从重度生产力办公、流媒体观看、游戏联机到日常备用全景对比。',
      tags: ['专题文章', '机场推荐', '品牌盘点', '主流机场', '特色定位', '适用人群', '灵动云', '暮光加速', '微风网络'],
      url: '/archives/#featured-brands',
      searchContent: '主流机场品牌盘点 特色 定位 适用人群 机场推荐 机场评测 灵动云 暮光加速 微风网络 专题文章'
    },
    {
      id: 'article-plans-selection-cost',
      title: '机场套餐如何选择？价格、流量与性价比全解析',
      subtitle: '套餐信息与选购专题',
      snippet: '从轻量年付、常规月付、大容量带宽到不限时一次性流量包，全面解析如何根据自身实际月消耗量选择最具性价比的套餐方案。',
      tags: ['专题文章', '套餐对比', '便宜机场', '性价比', '流量', '价格', '月付', '年付', '不限时流量包'],
      url: '/archives/#featured-plans',
      searchContent: '机场套餐如何选择 价格 流量 性价比全解析 便宜机场 平价套餐 月付 年付 不限时流量包 选购技巧 专题文章'
    },
    {
      id: 'article-nodes-regions-latency',
      title: '机场节点地区详解：常见地区、延迟表现与使用建议',
      subtitle: '节点地区与全球骨干专题',
      snippet: '系统介绍中国香港、中国台湾、日本、新加坡、美国、欧洲等核心落地地区的网络延迟表现、带宽承载能力与应用场景选线建议。',
      tags: ['专题文章', '节点地区', '延迟表现', '香港', '日本', '新加坡', '美国', '台湾', '德国', '英国', '选线建议'],
      url: '/archives/#featured-nodes',
      searchContent: '机场节点地区详解 常见地区 延迟表现 使用建议 香港 台湾 日本 新加坡 美国 韩国 欧洲 低延迟 骨干网 专题文章'
    }
  ];

  articlesData.forEach(a => {
    items.push({
      id: a.id,
      type: 'article',
      typeName: '专题文章',
      title: a.title,
      subtitle: a.subtitle,
      badge: '深度专题',
      snippet: a.snippet,
      tags: a.tags,
      url: a.url,
      searchContent: `${a.title} ${a.subtitle} ${a.snippet} ${a.searchContent}`
    });
  });

  // 5. Index Risk Alerts Cases
  risks.forEach(r => {
    const isHistory = r.categoryBadge === 'history-shutdown';
    items.push({
      id: `risk-${r.id}`,
      type: 'risk',
      typeName: '风险预警',
      title: `${r.name} · ${r.category}`,
      subtitle: `首次报告：${r.reportDate} · ${r.status}`,
      badge: isHistory ? '已确认失联' : '持续观察中',
      snippet: `${r.name} 风险记录：${r.symptoms} 来源依据：${r.sourceName}。建议：${r.notes}`,
      tags: [r.name, r.category, r.status, '风险预警', '停运', '跑路', '失联', '异常观察', '开源社区记录'],
      url: `/risk-alerts/#${r.id}`,
      searchContent: `${r.name} ${r.category} ${r.status} ${r.symptoms} ${r.notes} 风险预警 停运 跑路 失联 异常观察 GitHub Issue`
    });
  });

  return items;
}

export function saveSearchIndexToPublic(): void {
  const items = buildSearchIndex();
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const outputPath = path.join(publicDir, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');
  console.log(`[Search Indexer] Successfully generated search index with ${items.length} items at: ${outputPath}`);
}
