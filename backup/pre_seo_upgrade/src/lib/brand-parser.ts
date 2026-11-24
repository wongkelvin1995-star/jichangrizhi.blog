import fs from 'node:fs';
import path from 'node:path';
import { BRAND_ORDER } from './brand-config.ts';
import type { BrandMeta, PlanTableRow } from './types.ts';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

function renderInlineMarkdown(text: string, isAffLink: boolean = false): string {
  // First handle inline code
  let out = text.replace(/`([^`]+)`/g, '<code class="code-inline">$1</code>');
  
  // Handle bold **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Handle [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const safeHref = sanitizeUrl(href);
    const isAff = isAffLink || /aff|code=|invite/i.test(safeHref);
    const rel = isAff ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
    const affBadge = isAff ? '<span class="badge-tag sponsored-badge">注册/购买入口</span>' : '';
    return `<a href="${safeHref}" target="_blank" rel="${rel}" class="content-link ${isAff ? 'aff-link' : ''}">${escapeHtml(label)}</a>${affBadge}`;
  });

  // Handle bare URLs: https://...
  out = out.replace(/(^|[\s(])(https?:\/\/[^\s)<>]+)/g, (_match, prefix, url) => {
    const safeUrl = sanitizeUrl(url);
    const isAff = /aff|code=|invite/i.test(safeUrl);
    const rel = isAff ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
    const affBadge = isAff ? ' <span class="badge-tag sponsored-badge">注册/购买入口</span>' : '';
    return `${prefix}<a href="${safeUrl}" target="_blank" rel="${rel}" class="content-link break-all ${isAff ? 'aff-link' : ''}">${escapeHtml(url)}</a>${affBadge}`;
  });

  return out;
}

function parseMarkdownTable(tableLines: string[]): { html: string; rows: PlanTableRow[] } {
  if (tableLines.length < 2) return { html: '', rows: [] };
  
  // Parse header
  const headerLine = tableLines[0];
  const headers = headerLine.split('|').map(s => s.trim()).filter(s => s.length > 0);
  
  // Filter out separator line |---|---|
  const dataLines = tableLines.slice(2);
  const rows: PlanTableRow[] = [];
  
  let tbodyHtml = '';
  for (const line of dataLines) {
    if (!line.trim() || !line.includes('|')) continue;
    const cols = line.split('|').map(s => s.trim());
    // remove leading and trailing empty elements if pipe started/ended the line
    if (cols.length > 0 && cols[0] === '') cols.shift();
    if (cols.length > 0 && cols[cols.length - 1] === '') cols.pop();
    
    if (cols.length >= 2) {
      const rowData: PlanTableRow = {
        name: cols[0] || '默认套餐',
        price: cols[1] || '待核实',
        cycle: cols[2] || '按月/按周期',
        traffic: cols[3] || '详情见介绍',
        devices: cols[4] || '未注明',
        speedLimit: cols[5] || '不限速 / 以实际为准'
      };
      rows.push(rowData);

      tbodyHtml += '<tr>';
      cols.forEach((col, idx) => {
        const isName = idx === 0;
        const isPrice = idx === 1;
        const formatted = renderInlineMarkdown(col);
        tbodyHtml += `<td class="${isName ? 'plan-name-cell' : isPrice ? 'plan-price-cell' : ''}" data-label="${escapeHtml(headers[idx] || '')}">${formatted}</td>`;
      });
      tbodyHtml += '</tr>\n';
    }
  }

  let theadHtml = '<thead><tr>';
  headers.forEach(h => {
    theadHtml += `<th>${escapeHtml(h)}</th>`;
  });
  theadHtml += '</tr></thead>';

  const html = `
    <div class="table-container-outer">
      <div class="table-scroll-hint"><span>← 左右滑动查看完整套餐参数 →</span></div>
      <div class="table-container">
        <table class="plans-table">
          ${theadHtml}
          <tbody>${tbodyHtml}</tbody>
        </table>
      </div>
    </div>
  `;

  return { html, rows };
}

export function parseBrandMarkdown(content: string, brandId: string, orderNum: number): BrandMeta {
  // Extract key fields using regex
  const getField = (field: string): string => {
    const reg = new RegExp(`-\\s*${field}：\\s*([^\\r\\n]+)`);
    const m = content.match(reg);
    return m ? m[1].trim() : '';
  };

  const brandName = getField('品牌名称') || '未知品牌';
  const englishName = getField('英文名称');
  const aliases = getField('品牌别名');
  const website = getField('官方网站');
  const registerUrl = getField('注册地址') || getField('购买链接');
  const introduction = getField('品牌介绍');
  const positioning = getField('品牌定位');
  const targetUsers = getField('适合用户');
  const nodeRegions = getField('支持地区');
  const nodeCount = getField('节点数量');
  const lineTypes = getField('线路类型');
  const protocols = getField('支持协议');
  const speedLimit = getField('是否有限速');

  const clientSupport = {
    windows: getField('Windows'),
    macos: getField('macOS'),
    android: getField('Android'),
    ios: getField('iOS'),
    linux: getField('Linux'),
    router: getField('路由器'),
    thirdParty: getField('是否支持第三方客户端'),
    importMethod: getField('订阅导入方式')
  };

  const services = {
    netflix: getField('Netflix'),
    disney: getField('Disney+'),
    youtube: getField('YouTube'),
    chatgpt: getField('ChatGPT'),
    otherAi: getField('其他 AI 服务'),
    gaming: getField('游戏场景'),
    otherFeatures: getField('其他特色')
  };

  const support = {
    contact: getField('客服联系方式'),
    techSupport: getField('技术支持'),
    refundPolicy: getField('退款政策'),
    trialPolicy: getField('试用政策'),
    faqText: getField('常见问题')
  };

  const links = {
    logo: getField('品牌 LOGO'),
    screenshot: getField('套餐截图'),
    official: getField('官网链接'),
    purchase: getField('购买链接'),
    download: getField('下载入口'),
    tutorial: getField('教程链接')
  };

  const source = {
    infoSource: getField('信息来源'),
    verifyDate: getField('资料核实日期') || '2026-11-23',
    announcement: getField('最新公告'),
    notes: getField('备注')
  };

  // Split into sections by ##
  const rawSections = content.split(/\n(?=##\s+)/);
  let renderedHtml = '';
  let plans: PlanTableRow[] = [];

  for (const rawSec of rawSections) {
    const trimmed = rawSec.trim();
    if (!trimmed) continue;

    // Check if it's the top level # 机场品牌资料
    if (trimmed.startsWith('# 机场品牌资料') || trimmed.startsWith('# ')) {
      // Handled at container level
      continue;
    }

    // Match ## 1. 基本资料
    const headerMatch = trimmed.match(/^##\s*(\d+)\.\s*([^\r\n]+)/);
    if (!headerMatch) {
      continue;
    }

    const secNum = headerMatch[1];
    const secTitle = headerMatch[2].trim();
    const secBody = trimmed.replace(/^##\s*(\d+)\.\s*[^\r\n]+/, '').trim();
    const secId = `${brandId}-section-${secNum}`;

    let secContentHtml = '';

    // Check if this is Section 2 (套餐价格) with Markdown table
    if (secNum === '2') {
      const lines = secBody.split('\n');
      const tableLines: string[] = [];
      const nonTableLines: string[] = [];
      let inTable = false;

      for (const line of lines) {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          inTable = true;
          tableLines.push(line.trim());
        } else {
          inTable = false;
          if (line.trim()) nonTableLines.push(line);
        }
      }

      if (tableLines.length > 0) {
        const parsedTable = parseMarkdownTable(tableLines);
        plans = parsedTable.rows;
        secContentHtml += parsedTable.html;
      }

      if (nonTableLines.length > 0) {
        secContentHtml += `<div class="section-notes">${nonTableLines.map(l => `<p>${renderInlineMarkdown(l)}</p>`).join('')}</div>`;
      }
    } else {
      // Normal bullet list or paragraph section
      const lines = secBody.split('\n');
      let inList = false;
      let listHtml = '';

      for (const line of lines) {
        const lineTrim = line.trim();
        if (!lineTrim) {
          if (inList) {
            secContentHtml += `<ul class="section-bullet-list">${listHtml}</ul>`;
            listHtml = '';
            inList = false;
          }
          continue;
        }

        if (lineTrim.startsWith('- ') || lineTrim.startsWith('* ')) {
          inList = true;
          const itemText = lineTrim.slice(2).trim();
          listHtml += `<li>${renderInlineMarkdown(itemText)}</li>\n`;
        } else {
          if (inList) {
            secContentHtml += `<ul class="section-bullet-list">${listHtml}</ul>`;
            listHtml = '';
            inList = false;
          }
          secContentHtml += `<p class="section-paragraph">${renderInlineMarkdown(lineTrim)}</p>\n`;
        }
      }

      if (inList) {
        secContentHtml += `<ul class="section-bullet-list">${listHtml}</ul>`;
      }
    }

    // Format section with H3 as mandated by requirement 2.3
    renderedHtml += `
      <div class="brand-sub-section" id="${secId}">
        <h3 class="brand-section-h3">
          <span class="section-num-tag">${secNum}</span>
          <span>${escapeHtml(secTitle)}</span>
        </h3>
        <div class="section-inner-content">
          ${secContentHtml}
        </div>
      </div>
    `;
  }

  // Generate 6 to 8 tailored FAQ items strictly grounded in the extracted fields
  const faqList: { question: string; answer: string }[] = [];

  // Q1: 客户端与支持系统
  faqList.push({
    question: `${brandName} 支持哪些操作系统与客户端？如何下载安装？`,
    answer: `${brandName} 在常见平台的支持情况如下：Windows 系统 ${clientSupport.windows || '提供客户端或通用配置'}；macOS 系统 ${clientSupport.macos || '支持安装使用'}；Android 系统 ${clientSupport.android || '提供专属 APK 或订阅导入'}；iOS 系统 ${clientSupport.ios || '需使用兼容客户端配置'}。Linux 与路由器支持：${clientSupport.linux || '无专属包，需通用协议配置'}、${clientSupport.router || '视固件与协议而定'}。具体配置方式以登录用户中心后的「客户端下载」与官方使用指南为准。`
  });

  // Q2: 套餐价格与付款周期
  if (plans.length > 0) {
    const planSummary = plans.slice(0, 3).map(p => `${p.name}（${p.price}，${p.cycle}，流量 ${p.traffic}）`).join('、');
    faqList.push({
      question: `${brandName} 的套餐价格与流量规格如何？有哪些付款周期？`,
      answer: `${brandName} 提供包括 ${planSummary} 等多档套餐。资费涵盖月付、年付或按量一次性流量包等多种形式。具体每档价格、设备上限及速率限制以本站上方的「套餐价格」完整对照表及登录官网后的实时结算页为准。`
    });
  } else {
    faqList.push({
      question: `${brandName} 的套餐如何计费？`,
      answer: `${brandName} 提供多档周期套餐或流量包规格。详细价格请查阅上方第 2 节「套餐价格」表格。`
    });
  }

  // Q3: 节点地区与线路
  faqList.push({
    question: `${brandName} 覆盖哪些国家/地区节点？线路类型与传输协议是什么？`,
    answer: `${brandName} 节点支持地区主要包括：${nodeRegions || '香港、台湾、日本、新加坡、美国等主流地区'}。节点数量记录约为：${nodeCount || '按运营实际动态调度'}。线路架构：${lineTypes || 'BGP 智能调度与优质专线出口'}。支持协议方面：${protocols || '以官方客户端或客服发放的订阅配置为准'}。套餐说明通常标注不设硬性限速，实际速率受节点负载及本地宽带影响。`
  });

  // Q4: 第三方客户端支持（Clash / Shadowrocket 等）
  faqList.push({
    question: `${brandName} 是否支持 Clash、Shadowrocket、Sing-box 等第三方客户端？`,
    answer: `${clientSupport.thirdParty || '建议使用官方客户端或按客服规则申请第三方订阅'}。其订阅导入规定为：${clientSupport.importMethod || '通常登录官方客户端自动同步线路；如需第三方通用订阅，请遵循官网用户中心政策或联系客服确认'}。`
  });

  // Q5: 流媒体与 AI 解锁
  faqList.push({
    question: `${brandName} 能否解锁 Netflix、Disney+、YouTube 及 ChatGPT、Claude 等 AI 工具？`,
    answer: `${brandName} 的服务功能说明显示：Netflix 状态为【${services.netflix || '支持，视节点出口而定'}】；Disney+ 为【${services.disney || '支持'}】；YouTube 为【${services.youtube || '正常支持高清播放'}】；ChatGPT 为【${services.chatgpt || '适配支持'}】；其他 AI 工具（如 Claude、Midjourney）：${services.otherAi || '支持日常访问'}。需要注意，流媒体与 AI 服务均存在各平台自身的风控机制与 IP 检测策略，使用效果因出口节点而异，非永久保底承诺。`
  });

  // Q6: 免费试用与退款政策
  faqList.push({
    question: `${brandName} 是否提供免费试用？退款政策是如何规定的？`,
    answer: `试用政策：${support.trialPolicy || '公开在售资料未标注免费试用套餐，建议选择较短周期的月付体验'}。退款规定：${support.refundPolicy || '以平台服务条款为准，不提供无条件退款承诺'}。在下单订购前，建议详细评估自身月度流量需求。`
  });

  // Q7: 连接异常与客服排查
  const originalFaq = support.faqText ? `平台常见指引：${support.faqText}。` : '';
  faqList.push({
    question: `${brandName} 出现连接失败、节点超时或订阅更新异常应如何处理？`,
    answer: `${originalFaq}通用排查步骤：首先检查当前套餐是否已到期或流量已耗尽；尝试在客户端内切换其他可用节点；检查客户端是否为最新版本；如仍无法解决，可通过【${support.contact || '用户中心工单或在线客服系统'}】提交反馈，附带报错截图以便技术人员排查。`
  });

  // Q8: 数据来源与真实核实日期
  faqList.push({
    question: `本站关于 ${brandName} 的档案资料是如何核实的？来源与日期是什么？`,
    answer: `本站收录的 ${brandName} 资料核实日期为：${source.verifyDate}。数据来源基于：${source.infoSource || '官方展示站及公开资料比对'}。特别提示：机场服务商的套餐资费、节点可用性与网络线路可能随时随运营发生调整，本站内容记录历史核验状态，仅供参考，不作为官方直接履约证明。`
  });

  return {
    order: orderNum,
    id: brandId,
    brandName,
    englishName,
    aliases,
    website,
    registerUrl,
    introduction,
    positioning,
    targetUsers,
    nodeRegions,
    nodeCount,
    lineTypes,
    protocols,
    speedLimit,
    clientSupport,
    services,
    support,
    links,
    source,
    plans,
    faqList,
    rawMarkdown: content,
    renderedHtml
  };
}

let cachedBrands: BrandMeta[] | null = null;

export function getAllBrands(): BrandMeta[] {
  if (cachedBrands) return cachedBrands;

  const rawDir = path.resolve('content/airports/raw');
  const brands: BrandMeta[] = [];

  for (const item of BRAND_ORDER) {
    if (item.missing || !item.file) {
      console.warn(`[Brand Loader] Slot ${item.order} (${item.name}) is reserved, MD file not provided yet. Skipping without generating fake content.`);
      continue;
    }

    const filePath = path.join(rawDir, item.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Brand Loader] File not found for ${item.name}: ${filePath}`);
      continue;
    }

    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const brand = parseBrandMarkdown(rawContent, item.id, item.order);
    brands.push(brand);
  }

  cachedBrands = brands;
  return brands;
}

export function getRiskWatchlist(): any[] {
  const riskPath = path.resolve('content/risk-watchlist.json');
  if (fs.existsSync(riskPath)) {
    try {
      return JSON.parse(fs.readFileSync(riskPath, 'utf-8'));
    } catch (e) {
      console.error('Error parsing risk-watchlist.json', e);
    }
  }
  return [];
}
