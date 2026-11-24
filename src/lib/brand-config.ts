import type { BrandConfig } from './types';

/**
 * 首页固定品牌顺序配置表
 * 严格按照 PROMPT_FOR_ANTIGRAVITY.md 规范：
 * 01 灵动云
 * 02 暮光加速
 * 03 微风网络
 * 04 大佬云 (尚未提供，保留位置，不编造假数据)
 * 05 FLYV（飞V）
 * 06 飞猫云
 * 07 浪网
 * 08 隐形人
 * 09 梯子云
 * 10 无忧连接
 * 11 Firefly
 * 12 全球云
 * 其余已提供品牌排在第 12 位之后。
 */
export const BRAND_ORDER: BrandConfig[] = [
  {
    order: 1,
    name: '灵动云',
    id: 'lingdongyun',
    file: '灵动云_机场品牌资料_2026-11-23.md',
    tagline: 'IEPL/IPLC 优化线路与 BGP 智能调度，支持官方与定制客户端',
    badge: 'IEPL/IPLC 专线'
  },
  {
    order: 2,
    name: '暮光加速',
    id: 'muguang',
    file: '暮光加速_2026-11-23.md',
    tagline: '月付专线出口与 BGP 多线调度，轻量年付 IPLC 线路',
    badge: 'BGP 智能调度'
  },
  {
    order: 3,
    name: '微风网络',
    id: 'weifeng',
    file: '微风网络_2026-11-23.md',
    tagline: '平价月付、年付 IPLC 及不限时流量包，覆盖主流流媒体',
    badge: '平价灵活'
  },
  {
    order: 4,
    name: '大佬云',
    id: 'dalaoyun',
    file: '大佬云_2026-11-23.md',
    missing: false,
    tagline: 'VLESS 协议节点与 IPLC/IEPL 专线出口，提供多周期订阅与不限时流量包',
    badge: 'IPLC/IEPL 专线'
  },
  {
    order: 5,
    name: 'FLYV（飞V）',
    id: 'flyv',
    file: '飞V_2026-11-23.md',
    tagline: '多档月付、季付与年付套餐，提供多地区基础与提速节点',
    badge: '多档周期'
  },
  {
    order: 6,
    name: '飞猫云',
    id: 'feimaoyun',
    file: '飞猫云_2026-11-23.md',
    tagline: '主打高性价比月付流量，覆盖亚太及欧美常用出口',
    badge: '高性价比'
  },
  {
    order: 7,
    name: '浪网',
    id: 'langwang',
    file: '浪网_2026-11-23.md',
    tagline: '平价月付与一次性流量包设计，支持多平台通用代理配置',
    badge: '通用代理'
  },
  {
    order: 8,
    name: '隐形人',
    id: 'yinxingren',
    file: '隐形人_2026-11-23.md',
    tagline: '隐私保护与多节点智能冗余切换，支持流媒体及 AI 工具访问',
    badge: '隐私冗余'
  },
  {
    order: 9,
    name: '梯子云',
    id: 'tiziyun',
    file: '梯子云_2026-11-23.md',
    tagline: '面向大流量下载与轻办公的多规格套餐，全节点均衡调度',
    badge: '大流量'
  },
  {
    order: 10,
    name: '无忧连接',
    id: 'wuyoulianjie',
    file: '无忧连接_2026-11-23.md',
    tagline: '稳定长周期年付与月度周期套餐，提供客服工单支持',
    badge: '长周期年付'
  },
  {
    order: 11,
    name: 'Firefly',
    id: 'firefly',
    file: 'Firefly_2026-11-23.md',
    tagline: '轻量快速出海体验，主打流媒体观看与低延迟网页浏览',
    badge: '流媒体优化'
  },
  {
    order: 12,
    name: '全球云',
    id: 'quanqiuyun',
    file: '全球云_2026-11-23.md',
    tagline: '覆盖全球主要骨干节点，支持跨境电商、流媒体与跨平台协同',
    badge: '全球骨干'
  },
  {
    order: 13,
    name: '唯兔云（V2云）',
    id: 'weituyun',
    file: '唯兔云_V2云_2026-11-23.md',
    tagline: '多协议兼容节点与弹性流量包，适合多设备日常备用',
    badge: '多协议兼容'
  },
  {
    order: 14,
    name: 'U1S1（有一说一）',
    id: 'u1s1',
    file: 'U1S1_有一说一_2026-11-23.md',
    tagline: '透明计费与实测节点标注，提供直观的套餐与流量选项',
    badge: '实测透明'
  },
  {
    order: 15,
    name: 'Sogo云',
    id: 'sogoyun',
    file: 'Sogo云_2026-11-23.md',
    tagline: '注重稳定与客服响应的跨境网络接入服务',
    badge: '稳定服务'
  },
  {
    order: 16,
    name: '跨界云',
    id: 'kuajieyun',
    file: '跨界云_2026-11-23.md',
    tagline: '跨境办公与学术检索专用线路，保障主流科研与学习平台连接',
    badge: '学术办公'
  },
  {
    order: 17,
    name: '灵猫网络',
    id: 'lingmaoyun',
    file: '灵猫网络_2026-11-23.md',
    tagline: '灵动轻便的个人加速方案，简单易用的多系统快速导入',
    badge: '简单易用'
  },
  {
    order: 18,
    name: '闪跃 FlashLeap',
    id: 'shanyue',
    file: '闪跃_FlashLeap_2026-11-23.md',
    tagline: '低延迟线路优化，适配移动端与桌面端游戏及实时通信场景',
    badge: '低延迟优化'
  }
];
