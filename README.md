# 2027 机场日志 · Airport Journal MAX

> **官方域名：** `https://jichangrizhi.blog/`  
> **视觉设计规范：** `Airport Journal MAX · 机场日志旗舰`  
> **架构技术选型：** Astro 7.4.8 (SSG 纯静态预渲染) + TypeScript + 原生语义化 HTML/CSS  
> **SEO 优化目标：** Bing SEO 深度技术合规、规范级静态渲染、全量正文可抓取、IndexNow 自动化支持

---

## 目录
- [1. 项目概述与核心开发规则](#1-项目概述与核心开发规则)
- [2. 品牌排序与数据导入情况](#2-品牌排序与数据导入情况)
- [3. 页面与架构设计](#3-页面与架构设计)
- [4. Bing SEO 技术实现](#4-bing-seo-技术实现)
- [5. 风险预警专区说明](#5-风险预警专区说明)
- [6. 本地运行与构建指令](#6-本地运行与构建指令)
- [7. 部署方案指引](#7-部署方案指引)
- [8. Bing Webmaster Tools 验证与 IndexNow 配置](#8-bing-webmaster-tools-验证与-indexnow-配置)
- [9. 项目验收结果](#9-项目验收结果)

---

## 1. 项目概述与核心开发规则

本项目严格按照 `PROMPT_FOR_ANTIGRAVITY.md` 规范构建：
1. **单一首页连续展示：** 全部 17 家已导入的机场品牌档案全文直接完整渲染在网站首页（`https://jichangrizhi.blog/`），不拆分为大量碎片化独立 URL，杜绝门页（Doorway Pages）及薄内容问题。
2. **纯静态预渲染（SSG）：** 所有 Markdown 内容、八大章节、完整资费表格、各平台接入教程及专属 FAQ 均在构建时直接输出为静态语义化 HTML。无需任何客户端异步请求（Fetch）、虚拟滚动或正文折叠隐藏，搜索引擎抓取器在抓取 HTML 第一时间即可提取全部文本。
3. **Airport Journal MAX 视觉风格：** 采用皇家蓝（`#285CF0`）、深色标题（`#132344`）、冰川白背景（`#F7FAFF`）、卡片纯白（`#FFFFFF`）与银灰边框（`#E2E8F0`），坚持 Apple 风格克制典雅的技术资讯质感。严禁二次元少女、卡通人物、繁复 3D 模型或赛博霓虹动效。
4. **唯一内容型附加页面：** 全站除首页外，仅设置唯一的独立内容页面 `/airport-alerts/`（风险预警专区），用于收录具备公开开源社区凭据的历史失联报告与异常观察案例。

---

## 2. 品牌排序与数据导入情况

首页品牌严格按照固定顺序排列，前 12 个品牌排序锁死，第 13 位及后续品牌依次排列：

| 序位 | 展示名称 | 锚点 ID | 数据源文件 | 状态与八章保留 |
|---|---|---|---|---|
| **01** | 灵动云 | `#lingdongyun` | `灵动云_机场品牌资料_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **02** | 暮光加速 | `#muguang` | `暮光加速_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **03** | 微风网络 | `#weifeng` | `微风网络_2026-11-23.md` | ✓ 8 章完整，7 档套餐表格，专属 FAQ |
| **04** | 大佬云 | `#dalaoyun` | *尚未提供* | ⏸ **保留固定第4位映射，绝不编造假数据** |
| **05** | FLYV（飞V） | `#flyv` | `飞V_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **06** | 飞猫云 | `#feimaoyun` | `飞猫云_2026-11-23.md` | ✓ 8 章完整，7 档套餐表格，专属 FAQ |
| **07** | 浪网 | `#langwang` | `浪网_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **08** | 隐形人 | `#yinxingren` | `隐形人_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **09** | 梯子云 | `#tiziyun` | `梯子云_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **10** | 无忧连接 | `#wuyoulianjie` | `无忧连接_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **11** | Firefly | `#firefly` | `Firefly_2026-11-23.md` | ✓ 8 章完整，6 档套餐表格，专属 FAQ |
| **12** | 全球云 | `#quanqiuyun` | `全球云_2026-11-23.md` | ✓ 8 章完整，9 档套餐表格，专属 FAQ |
| **13** | 唯兔云（V2云） | `#weituyun` | `唯兔云_V2云_2026-11-23.md` | ✓ 8 章完整，10 档套餐表格，专属 FAQ |
| **14** | U1S1（有一说一） | `#u1s1` | `U1S1_有一说一_2026-11-23.md` | ✓ 8 章完整，6 档套餐表格，专属 FAQ |
| **15** | Sogo云 | `#sogoyun` | `Sogo云_2026-11-23.md` | ✓ 8 章完整，10 档套餐表格，专属 FAQ |
| **16** | 跨界云 | `#kuajieyun` | `跨界云_2026-11-23.md` | ✓ 8 章完整，7 档套餐表格，专属 FAQ |
| **17** | 灵猫网络 | `#lingmaoyun` | `灵猫网络_2026-11-23.md` | ✓ 8 章完整，6 档套餐表格，专属 FAQ |
| **18** | 闪跃 FlashLeap | `#shanyue` | `闪跃_FlashLeap_2026-11-23.md` | ✓ 8 章完整，5 档套餐表格，专属 FAQ |

> **关于第 04 位大佬云的说明：**  
> 规范要求严禁凭空编造假品牌、假资费。因此在 `src/lib/brand-config.ts` 中固定预留了第 4 位的展示序列与索引位，在构建时优雅跳过正文渲染。后续只需将对应 MD 文件放入 `content/airports/raw/` 即可自动落入第 4 位，无需重构页面代码。

---

## 3. 页面与架构设计

### 目录结构
```text
jichangrizhi.blog/
├── content/
│   ├── airports/
│   │   └── raw/                 # 17 份原始 Markdown 文件（原文件名与文本一字未减）
│   ├── articles/
│   │   └── raw/                 # 文章日志存放目录（留空时优雅提示，不生成假文章）
│   └── risk-watchlist.json      # 4 起公开社区风险记录（FCCloud, ACA, 随便云, 红叶机场）
├── src/
│   ├── components/              # UI 组件（Header, Hero, FeaturedCards, Directory, BrandSection, 等）
│   ├── layouts/
│   │   └── BaseLayout.astro     # 全站 SEO Meta、JSON-LD、语义结构
│   ├── lib/
│   │   ├── brand-config.ts      # 品牌固定顺序与展示映射
│   │   ├── brand-parser.ts      # 8 大章节解析、表格格式化、专属 FAQ 生成器
│   │   └── types.ts             # 强类型定义
│   ├── pages/
│   │   ├── index.astro          # 首页（全部 17 份 MD 正文直接内嵌）
│   │   ├── airport-alerts.astro # 唯一独立内容子页：风险预警专区
│   │   ├── 404.astro            # 404 规范友善错误页
│   │   └── sitemap.xml.ts       # 动态 Sitemap 生成器（仅输出可索引 URL，真实 lastmod）
│   └── styles/
│       └── global.css           # Airport Journal MAX 全局设计变量与排版
├── public/
│   ├── favicon.svg              # 品牌矢量 LOGO
│   ├── robots.txt               # 搜索引擎抓取指引
│   └── 4f38b2d187cf4590...txt   # IndexNow 域名所有权验证文件
├── scripts/
│   ├── validate.mjs             # 数据完整性与排序自动化验收脚本
│   ├── seo-audit.mjs            # HTML 源码与 Bing SEO 专项审计工具
│   ├── preview-test.mjs         # 本地 HTTP 路由自动化测试
│   └── indexnow.mjs             # IndexNow 搜索引擎推送脚本
└── PROMPT_FOR_ANTIGRAVITY.md    # 核心设计与执行规范
```

---

## 4. Bing SEO 技术实现

1. **标题层级规范：**
   - 首页全页有且仅有一个真正的 `<h1>`：`2027 机场日志`。
   - 每家品牌的标题转换为 `<h2 id="...">品牌名称 机场资料</h2>`。
   - 品牌内部的 8 大章节标题统一转换为 `<h3>`。
   - FAQ 的具体问题统一使用 `<h4>`。
2. **移动端横向自适应：**
   - 套餐表格全部置于 `.table-container` 容器内，移动端小屏通过容器内部横向平滑滚动（`-webkit-overflow-scrolling: touch`），彻底避免全局页面出现横向横移与 CLS 布局抖动。
3. **推广与链接安全标注：**
   - 所有购买/注册链接均加上安全白名单过滤，并标配 `rel="sponsored noopener noreferrer"` 及明确的视觉标签 `[注册/购买入口]`。
   - 普通外部链接一律配置 `rel="noopener noreferrer" target="_blank"`。
4. **JSON-LD 结构化数据：**
   - 部署了符合 Schema.org 标准的 `WebSite` 与 `Organization` 实体。
   - 首页输出 `ItemList` 结构，将 17 家品牌的标题与锚点完整提供给 Bing / Google 等搜索引擎。
5. **规范 Sitemap 与 Robots：**
   - `sitemap.xml` 严格仅输出真实、可访问的单页面：`/` 与 `/airport-alerts/`。不将 `#` 锚点和外部推广链接写入 Sitemap。
   - `<lastmod>` 采用数据实际核对日期 `2026-11-23`，杜绝每次无变更重新打包就更新日期的欺骗性行为。

---

## 5. 风险预警专区说明

专区地址：`https://jichangrizhi.blog/airport-alerts/`  
收录案例均基于公开第三方社区跟踪记录（GitHub `limbopro/Paolujichang`），严格区分性质：
1. **FCCloud**：2025-02-10 首次报告，社区标签“基本确认停止运营/失联”，属于历史社区记录。
2. **ACA**：2025-01-14 首次报告，社区标签“基本确认停止运营/失联”，历史风险记录。
3. **随便云（SuiBian）**：2026-11-02 报告，社区状态为**服务异常观察中**，绝不断言已经跑路。
4. **红叶机场**：2026-11-22 报告，社区状态为**服务异常观察中**，保留官方澄清通道。
5. **品牌申诉与恢复核验通道：** 页面提供专门的处理指引，如品牌已恢复正常，可通过 `feedback@jichangrizhi.blog` 申请核验更新。

---

## 6. 本地运行与构建指令

```bash
# 1. 启动本地开发服务器（热更新）
npm run dev

# 2. 数据与排序规则预检
npm run validate

# 3. 生产环境纯静态编译（输出至 dist/ 目录）
npm run build

# 4. 执行深度 SEO 与 HTML 源码审计
node scripts/seo-audit.mjs

# 5. 执行本地 HTTP 路由连通性自动化测试
node scripts/preview-test.mjs

# 6. 本地静态预览
npm run preview
```

---

## 7. 部署方案指引

### 推荐：Cloudflare Pages（零成本全球极速 CDN）
1. 将本代码仓库推送至 GitHub。
2. 登录 Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**。
3. 构建配置：
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20.x` 或以上（在环境变量中设置 `NODE_VERSION=20`）
4. 点击 **Save and Deploy**，即可获得全球 Anycast CDN 加速与原生 SSL 证书。
5. 在 Custom domains 中绑定 `https://jichangrizhi.blog/`。

---

## 8. Bing Webmaster Tools 验证与 IndexNow 配置

1. **站长平台添加站点：**
   - 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)，使用微软账户登录。
   - 输入站点 URL：`https://jichangrizhi.blog/`。
2. **所有权验证（三选一）：**
   - **方案 A（Meta 标签）：** 获取站长平台提供的 Meta 标签（如 `<meta name="msvalidate.01" content="XXXXX" />`），填入 `src/layouts/BaseLayout.astro` 的相应位置并重新部署。
   - **方案 B（XML 验证文件）：** 将 Bing 提供的 `BingSiteAuth.xml` 放置于 `public/BingSiteAuth.xml` 重新部署。
   - **方案 C（DNS TXT 记录）：** 在域名 DNS 解析服务商处添加一条 `TXT` 记录。
3. **提交 Sitemap：**
   - 在 Bing 站长后台点击 **Sitemaps** -> **Submit sitemap**，输入：`https://jichangrizhi.blog/sitemap.xml`。
4. **IndexNow 即时推送：**
   - 本项目已自动在 `public/` 目录下生成密钥文件 `4f38b2d187cf45909249e0839e55a82e.txt`。
   - 当内容发生重大更新时，运行以下指令即可即时向 Bing 推送更新通知：
     ```bash
     npm run indexnow
     ```

---

## 9. 项目验收结果

经由全套自动化测试工具与规范审计检查：
- [x] **17 份原始 MD 全量导入**：内容、表格、链接、八大章节无删减。
- [x] **第 4 位大佬云预留位健全**：未生成任何伪造资料，构建完全顺畅。
- [x] **前 12 品牌固定排序**：灵动云、暮光加速、微风网络、大佬云(预留)、FLYV、飞猫云、浪网、隐形人、梯子云、无忧连接、Firefly、全球云严格一致。
- [x] **纯静态 HTML 源代码直出**：首位灵动云与末位闪跃完整段落与表格直接位于初始 HTML 中，满足 Bing SEO 100% 可抓取要求。
- [x] **唯一独立内容子页 `/airport-alerts/`**：包含 4 起开源真实案例及 GitHub Issue 原始链接。
- [x] **HTTP 状态码及 404**：`/` (200), `/airport-alerts/` (200), `/sitemap.xml` (200), `/robots.txt` (200), 不存在路径正确返回 404。
