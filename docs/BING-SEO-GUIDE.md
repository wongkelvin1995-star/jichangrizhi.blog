# 2027 机场日志 · Bing SEO 专项运维与收录实操指南

> 域名：`https://jichangrizhi.blog/`  
> 适用目标：微软必应（Bing）、Edge 搜索聚合与全球搜索引擎合规抓取

---

## 一、Bing 抓取原理与本项目技术架构优势

很多现代前端框架（如 SPA、纯客户端渲染的 React/Vue/Next.js Client Components）在面对 Bingbot 时容易遭遇抓取不全或延迟渲染问题。

**本项目采取的核心技术优势：**
1. **SSG 预渲染直出：** 首页包含全部 17 份 MD 资料全文（生成 HTML 达 437KB），在 Bingbot 发起 HTTP GET 请求返回的 200 响应中，直接包含完整的 `<h2>`、`<h3>`、`<h4>`、`<p>` 和 `<table>`，无需等待浏览器下载 JS 或执行二次渲染。
2. **规范单一规范主机名：** 全站强制使用带斜杠的规范 URL（`https://jichangrizhi.blog/` 与 `https://jichangrizhi.blog/airport-alerts/`），并在 `<head>` 中配置唯一的 `<link rel="canonical">`。
3. **安全与外链属性合规：** 所有附带分佣或推广代码的注册地址均标配 `rel="sponsored noopener noreferrer"`，完全遵从搜索引擎外链指南，避免被判定为隐形买卖链接。

---

## 二、Bing Webmaster Tools 站点验证步骤

### 步骤 1：添加站点
1. 访问 [Bing Webmaster Tools 官网](https://www.bing.com/webmasters) 并使用微软账户登录。
2. 在左上角站点列表中选择 **Add a site**（添加网站）。
3. 选择 **Manually add your site**（手动添加），输入：`https://jichangrizhi.blog/`。

### 步骤 2：完成所有权验证（推荐方案 A 或方案 B）
* **方案 A（Meta 标签验证 - 最快捷）：**
  1. 在 Bing 页面中选择 **HTML Meta Tag**。
  2. 复制类似 `<meta name="msvalidate.01" content="4F8293B82C..." />` 的代码。
  3. 打开项目文件 `src/layouts/BaseLayout.astro`，找到：
     ```html
     <meta name="msvalidate.01" content="" />
     ```
     将 content 属性替换为您的代码并重新构建部署：
     ```bash
     npm run build
     ```
  4. 回到 Bing 页面点击 **Verify**（验证）。

* **方案 B（XML 文件验证）：**
  1. 下载 Bing 提供的 `BingSiteAuth.xml` 文件。
  2. 放置到本项目根目录的 `public/BingSiteAuth.xml`。
  3. 执行 `npm run build` 并部署，使文件在 `https://jichangrizhi.blog/BingSiteAuth.xml` 可公开访问。
  4. 回到 Bing 页面点击 **Verify**。

* **方案 C（DNS TXT 验证）：**
  1. 在您的域名 DNS 解析商（如 Cloudflare / 腾讯云 / 阿里云）添加一条 TXT 记录，记录值为 Bing 提供的随机字符串。

---

## 三、提交 Sitemap（网站地图）

1. 验证通过后，在 Bing Webmaster 后台左侧菜单点击 **Sitemaps**。
2. 点击右上角 **Submit sitemap** 按钮。
3. 输入完整的 XML 路径：
   ```text
   https://jichangrizhi.blog/sitemap.xml
   ```
4. 点击 **Submit** 提交。
5. **Sitemap 规范说明：**
   - 本项目 Sitemap 严格仅包含两个可索引的主页面：`/` 与 `/airport-alerts/`。
   - 不包含 `#lingdongyun` 等站内锚点，确保不浪费抓取配额。
   - `<lastmod>` 标明真实基准日期 `2026-11-23`，不会导致抓取器被频繁虚假更新误导。

---

## 四、IndexNow 实时推送机制

IndexNow 是由微软必应和 Yandex 联合推出的协议，能在网站内容发生增删改时立即通知搜索引擎，将收录周期从数天缩短至数分钟。

### 1. 验证密钥部署
本项目已自动生成测试密钥：
- 密钥：`4f38b2d187cf45909249e0839e55a82e`
- 对应公钥文件：`public/4f38b2d187cf45909249e0839e55a82e.txt`
- 部署后可通过 `https://jichangrizhi.blog/4f38b2d187cf45909249e0839e55a82e.txt` 验证可访问性。

若需更换为自己的密钥：
```bash
# 在环境变量中指定自定义密钥并重新生成
export INDEXNOW_KEY="your-custom-key-hex"
node scripts/write-indexnow-key.mjs
npm run build
```

### 2. 执行即时推送
当您更新了机场品牌资料或新增了风险案例后，执行：
```bash
npm run indexnow
```
控制台将输出向 `https://api.indexnow.org/indexnow` 发送的请求与返回状态 `200 OK`，表示 Bing 已成功排队抓取。

---

## 五、Bing 抓取诊断与日常监控 Checklist

1. **URL Inspection（网址检查）：**
   - 在 Bing Webmaster 顶部输入 `https://jichangrizhi.blog/`，点击检查。
   - 查看【Live Test】（实时测试）截图与抓取的 HTML，确认能看到 `灵动云 机场资料`、完整表格与 FAQ。
2. **Crawl Errors（抓取错误监控）：**
   - 检查是否有 DNS、404、5xx 错误。
   - 确认 `robots.txt` 状态为【Allowed】。
3. **Search Performance（搜索表现）：**
   - 追踪目标品牌词关键词表现（如 `灵动云`、`暮光加速 官网`、`微风网络 套餐`、`飞猫云 节点`）。
   - 持续观察各关键词展示量与点击率走势。
