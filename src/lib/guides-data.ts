export interface GuideArticle {
  slug: string;
  title: string;
  seoTitle: string;
  h1: string;
  description: string;
  category: string;
  readTime: string;
  updateDate: string;
  tags: string[];
  summary: string;
  sections: {
    title: string;
    content: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  relatedBrandIds: string[];
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: 'beginner-guide',
    title: '机场新手入门全景指南：零基础理解节点、协议、订阅与代理原理',
    seoTitle: '机场新手入门指南｜零基础理解节点、协议与代理原理 - 机场日志',
    h1: '机场新手入门全景指南：零基础理解节点、协议、订阅与代理原理',
    description: '为新手用户梳理机场基础概念，通俗讲解网络代理、机场节点、加密协议与订阅链接的工作机制，帮助您快速入门并规避常见误区。',
    category: '新手入门',
    readTime: '6 分钟',
    updateDate: '2026-11-24',
    tags: ['新手入门', '基础常识', '代理原理', '订阅机制'],
    summary: '本文为第一次接触机场与代理软件的新手朋友编写，不使用晦涩难懂的学术术语，用通俗的比喻解释什么是机场、节点、协议以及如何安全起步。',
    sections: [
      {
        title: '一、什么是「机场」？为什么被称为机场？',
        content: `
<p>在网络技术术语中，「机场」是对提供网络中继加速服务（科学上网/网络代理服务商）的通俗称呼。这个名字起源于早期的开源客户端 Shadowsocks，其图标是一架纸飞机，因此提供该服务节点资源的站点便被形象地称为「机场」，购买服务被称为「买机票」，流量包被称为「登机牌」。</p>
<p>简单来说，机场就是一个由遍布全球各地的服务器（香港、日本、新加坡、美国等）组成的高速中继网络。当您的设备发起访问请求时，数据不再直接走容易被阻断或延迟极高的公网路径，而是先发送到机场的国内入口，通过专线或优化通道加密传输到海外落地服务器，再由落地节点向目标网站（如 Google、GitHub、YouTube）请求内容并原路返回。</p>
        `
      },
      {
        title: '二、核心概念拆解：节点、协议与线路架构',
        content: `
<p>初学者在选购和使用过程中，最常遇到以下三个技术名词：</p>
<ul>
  <li><strong>节点（Node）：</strong>即一台部署在特定物理地区的服务器。例如「香港 01」表示这台服务器位于中国香港。不同地区的节点决定了您最终呈现的出口 IP 与地理位置。</li>
  <li><strong>传输协议（Protocol）：</strong>指您的客户端与服务器之间通信的加密规则。常见协议包括 Shadowsocks (SS)、Trojan、Vless、VMess 及 Hysteria2。不同协议在抗审查性、性能开销和伪装能力上各有千秋。</li>
  <li><strong>线路类型（Line Architecture）：</strong>这是决定连接质量最核心的底层因素。主要分为<strong>直连</strong>（普通公网直连，延迟高易抖动）、<strong>BGP 隧道中转</strong>（国内服务器中转公网出境，性价比高）、以及<strong>IPLC/IEPL 内网专线</strong>（企业级物理点对点内网，不过公网防火墙，零丢包、晚高峰极稳）。</li>
</ul>
        `
      },
      {
        title: '三、什么是「订阅链接」？它是如何工作的？',
        content: `
<p>过去使用代理服务，用户需要手动复制每一台服务器的 IP、端口、密码和加密方式，非常繁琐且一旦节点 IP 更换就全盘失效。而现代机场普遍采用「订阅链接（Subscription URL）」机制：</p>
<p>订阅链接本质上是一个带有唯一个人鉴权 Token 的网络地址。当您把这串链接粘贴进客户端（如 Clash、v2rayN）并点击更新时，客户端会自动从机场服务器下载最新可用的全部节点列表、连接密码和分流规则，并在后台定时自动刷新。只要订阅链接不失效，节点增删和线路切换完全无感。</p>
        `
      },
      {
        title: '四、新手避坑第一法则：坚持「小额月付」',
        content: `
<p>对于初学者，最关键的建议是：<strong>永远不要一上来就购买 1 年或更长时间的套餐</strong>。原因如下：</p>
<ol>
  <li><strong>网络环境动态变化：</strong>某家机场在今天表现优异，但在您所在的本地宽带（电信/联通/移动）下未必契合，必须通过月付进行实际测试。</li>
  <li><strong>资金安全防跑路：</strong>机场行业门槛差异巨大，部分低价年付机场在资金链断裂或政策收紧时容易出现跑路失联风险。选择小额月付（如 ¥15~¥30/月），即使遇到服务异常也能将损失降到最低。</li>
</ol>
        `
      }
    ],
    faqs: [
      {
        q: "机场和传统 VPN 有什么区别？",
        a: "传统商业 VPN 多采用系统全局虚拟网卡接管所有流量，常导致访问国内网站速度极慢甚至无法打开网银；而现代机场配合 Clash 等客户端支持精准的「智能分流规则」，访问百度/微信直接走本地直连，访问海外服务才走代理节点，体验更加无缝。"
      },
      {
        q: "一个人可以用多个设备登录吗？",
        a: "取决于机场套餐的具体限制。绝大多数品牌允许同一订阅链接在您个人的电脑、手机、平板同时在线，部分品牌会限制同时在线设备数（如 2~5 台），请在套餐详情页确认「在线设备限制」。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'weifeng', 'dalaoyun']
  },
  {
    slug: 'clash-tutorial',
    title: 'Clash 客户端完整配置与订阅教程：Clash Verge Rev 从下载到分流规则',
    seoTitle: 'Clash客户端教程｜Clash Verge Rev下载、订阅导入与规则配置 - 机场日志',
    h1: 'Clash 客户端完整配置与订阅教程：Clash Verge Rev 从下载到分流规则',
    description: '详细讲解 Clash 客户端（Clash Verge Rev / Clash Meta）下载安装、节点订阅导入、系统代理开启、规则分流及 TUN 模式高级配置步骤。',
    category: '客户端配置',
    readTime: '8 分钟',
    updateDate: '2026-11-24',
    tags: ['Clash', 'Clash Verge', '订阅配置', '分流规则', 'TUN模式'],
    summary: '随着原版 Clash for Windows 停止维护，基于开源 Clash Meta (Mihomo) 内核打造的 Clash Verge Rev 成为 2026-2027 年桌面端首选客户端。本文详解安装与全套配置。',
    sections: [
      {
        title: '一、为什么推荐 Clash Verge Rev 作为主力客户端？',
        content: `
<p>Clash Verge Rev 是目前社区活跃度最高、界面最现代美观的 Clash 图形客户端。相比旧版软件，它具备以下不可替代的优势：</p>
<ul>
  <li><strong>Mihomo (Clash.Meta) 原生内核：</strong>原生支持 Hysteria2、Vless-Reality、TUIC 等新一代抗封锁协议，性能卓越。</li>
  <li><strong>内置全自动 TUN 虚拟网卡模式：</strong>一键接管游戏、终端命令行及不支持原生代理设置的应用流量。</li>
  <li><strong>无广告、纯开源、跨平台：</strong>支持 Windows、macOS (Intel/Apple Silicon) 与 Linux，配置逻辑高度统一。</li>
</ul>
        `
      },
      {
        title: '二、从官方安全源下载与安装',
        content: `
<p>务必从官方开源仓库下载安装包，谨防第三方搜索引擎篡改的捆绑木马软件：</p>
<ol>
  <li>访问 GitHub 官方 Releases 仓库（<code>clash-verge-rev/clash-verge-rev</code>）。</li>
  <li>Windows 用户下载 <code>.exe</code> 安装包或绿色便携版（例如 <code>Clash.Verge_x64-setup.exe</code>）。</li>
  <li>双击运行安装程序，按照默认向导完成安装并首次启动软件。</li>
</ol>
        `
      },
      {
        title: '三、三步导入机场订阅链接',
        content: `
<p>启动 Clash Verge Rev 后，导入订阅仅需三步：</p>
<ol>
  <li><strong>复制订阅：</strong>登录您购买的机场后台，在用户中心找到「一键导入」或「复制 Clash 订阅链接」。</li>
  <li><strong>添加配置：</strong>打开 Clash Verge Rev，在左侧导航栏点击「订阅 (Profiles)」，在上方输入框粘贴刚刚复制的订阅 URL。</li>
  <li><strong>保存并选中：</strong>点击右侧「导入 (Import)」，软件会自动下载节点配置文件。下载完成后，鼠标单击该配置文件使其高亮，表示当前已生效。</li>
</ol>
        `
      },
      {
        title: '四、分流模式与节点选择技巧',
        content: `
<p>在左侧切换到「代理 (Proxies)」界面：</p>
<ul>
  <li><strong>模式选择：</strong>右上角建议始终保持<strong>「规则 (Rule)」</strong>模式。在该模式下，国内网站自动走 DIRECT（直连），海外受限网站自动走 PROXY（代理），既省机场流量又不影响国内网速。</li>
  <li><strong>节点选择：</strong>在 PROXY 分组中展开节点列表，点击右上角闪电图标可一键批量测试节点延迟（HTTP Ping），挑选延迟在 30ms~120ms 的优质绿色节点（如香港 IPLC 或日本专线）。</li>
  <li><strong>启动系统代理：</strong>在左侧「设置 (Settings)」中，将「系统代理 (System Proxy)」开关切换为开启，此时浏览器即可畅快冲浪。</li>
</ul>
        `
      }
    ],
    faqs: [
      {
        q: "开启代理后浏览器能上网，但 Telegram 或某些游戏连不上？",
        a: "这是因为部分软件不遵循系统 HTTP 代理设置。请在 Clash Verge Rev 设置中安装「服务模式 (Service Mode)」，随后开启「TUN 模式」，即可把整机所有底层网络流量全部接管分流。"
      },
      {
        q: "订阅链接更新失败报错「Network Error」？",
        a: "通常是因为本地网络暂时无法直接解析机场订阅域名。可尝试开启已有节点的系统代理后再点击更新订阅，或联系机场客服获取备用订阅转换节点。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'flyv', 'feimaoyun']
  },
  {
    slug: 'windows-tutorial',
    title: 'Windows 平台机场客户端选型与使用指南：Clash Verge 与 v2rayN 实战',
    seoTitle: 'Windows机场客户端教程｜Clash Verge与v2rayN配置指南 - 机场日志',
    h1: 'Windows 平台机场客户端选型与使用指南：Clash Verge 与 v2rayN 实战',
    description: '针对 Windows 10/11 系统用户的客户端选型与配置指南，对比 Clash Verge Rev 与 v2rayN 的优缺点，详解订阅导入与开机自启设置。',
    category: '系统平台',
    readTime: '7 分钟',
    updateDate: '2026-11-24',
    tags: ['Windows', 'Win11', 'v2rayN', '客户端对比', '开机自启'],
    summary: 'Windows 是最主流的桌面操作系统，拥有最丰富的三方客户端。本文对比主力客户端 Clash Verge Rev 与老牌极客工具 v2rayN 的场景契合度，并讲解无痛使用方案。',
    sections: [
      {
        title: '一、Windows 双雄对比：Clash Verge Rev vs v2rayN',
        content: `
<p>在 Windows 环境下，绝大部分机场用户在两者之间抉择：</p>
<table>
  <thead>
    <tr>
      <th>对比维度</th>
      <th>Clash Verge Rev (推荐)</th>
      <th>v2rayN (经典)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>界面美观度</strong></td>
      <td>现代 macOS 拟物风格，优雅简约</td>
      <td>经典 WinForm/WPF 表格，极客风格</td>
    </tr>
    <tr>
      <td><strong>新手上手难度</strong></td>
      <td>极低，粘贴订阅即可开箱即用</td>
      <td>中等，选项极为丰富繁琐</td>
    </tr>
    <tr>
      <td><strong>分流与规则</strong></td>
      <td>内置强悍规则集，分流无感知</td>
      <td>需手动切换路由规则或自定义</td>
    </tr>
    <tr>
      <td><strong>协议支持</strong></td>
      <td>全协议支持 (Mihomo 内核)</td>
      <td>全协议支持 (Xray/Sing-box 内核)</td>
    </tr>
  </tbody>
</table>
<p><strong>结论：</strong>90% 的普通用户推荐直接使用 <strong>Clash Verge Rev</strong>；如果您需要单独调试单一节点的底层参数或定制高级路由策略，可选用 v2rayN。</p>
        `
      },
      {
        title: '二、v2rayN 极速配置指南',
        content: `
<ol>
  <li>从 GitHub 下载包含 Xray 内核的完整压缩包（<code>v2rayN-With-Core.zip</code>）并解压到非系统盘目录。</li>
  <li>启动 <code>v2rayN.exe</code>，在顶部菜单点击「订阅分组」→「订阅分组设置」。</li>
  <li>点击「添加」，填入备注名称与从机场复制的订阅 URL，点击确定。</li>
  <li>再次点击「订阅分组」→「更新全部订阅（不通过代理）」，节点即刻加载完毕。</li>
  <li>在任务栏托盘右键 v2rayN 图标，将「系统代理」设为「自动配置系统代理」，「路由」设为「绕过大陆(Whitelist)」。</li>
</ol>
        `
      },
      {
        title: '三、开机自启与静默后台运行设置',
        content: `
<p>为避免每次开机都要手动打开客户端并启动代理，建议在设置中开启：</p>
<ul>
  <li>「开机自启 (Launch at Login)」：勾选开启。</li>
  <li>「静默启动 (Silent Start / Minimize on launch)」：启动时直接最小化到任务栏托盘，不弹窗打扰工作。</li>
  <li>「系统代理保持」：确保电脑唤醒后代理状态能够自动恢复正常。</li>
</ul>
        `
      }
    ],
    faqs: [
      {
        q: "Windows 提示安全软件拦截或误报病毒？",
        a: "由于代理软件涉及系统网络堆栈和虚拟网卡操作，Windows Defender 或国内安全管家常有启发式误报。建议将客户端文件夹整体添加到 Windows Defender 的「排除项 (Exclusions)」中。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'weifeng', 'langwang', 'tiziyun']
  },
  {
    slug: 'macos-tutorial',
    title: 'macOS 平台机场客户端使用教程：Clash Verge Rev 与 Surge 配置对比',
    seoTitle: 'macOS机场客户端教程｜苹果电脑Clash与Surge配置指南 - 机场日志',
    h1: 'macOS 平台机场客户端使用教程：Clash Verge Rev 与 Surge 配置对比',
    description: '为 Mac 苹果电脑用户提供清晰的客户端配置步骤，包含 Clash Verge Rev、Surge 及 Loon 的订阅导入、系统权限授予与网络分流设置。',
    category: '系统平台',
    readTime: '7 分钟',
    updateDate: '2026-11-24',
    tags: ['macOS', 'MacBook', 'Surge', 'Clash Verge', 'Apple Silicon'],
    summary: '针对使用 MacBook / Mac mini / iMac 的 macOS 用户，详解 Clash Verge Rev 与高级调试利器 Surge 的配置步骤及系统权限避坑指南。',
    sections: [
      {
        title: '一、macOS 客户端选型与架构区别',
        content: `
<p>在苹果 macOS 生态中，目前有两大主力阵营：</p>
<ul>
  <li><strong>Clash Verge Rev (免费开源)：</strong>支持 Apple Silicon (M1/M2/M3/M4) 与 Intel 芯片原生运行，界面深度适配 macOS 深色模式与毛玻璃特效，功能全面，绝大多数用户的最佳选择。</li>
  <li><strong>Surge for Mac (商业付费顶级利器)：</strong>macOS 上最强大的网络开发与抓包调试工具，接管能力无与伦比，但单授权价格较贵（约 $49.99 起），适合开发者或极客专业用户。</li>
</ul>
        `
      },
      {
        title: '二、Clash Verge Rev for Mac 安装与权限授予',
        content: `
<ol>
  <li>下载适合芯片架构的安装包：Apple Silicon 用户请选择 <code>Clash.Verge_aarch64.dmg</code>，Intel 芯片选择 <code>x64.dmg</code>。</li>
  <li>拖拽 <code>Clash Verge.app</code> 到 <code>Applications</code> 应用程序文件夹。</li>
  <li>首次启动若提示「无法打开，因为无法验证开发者」，请进入 macOS「系统设置」→「隐私与安全性」，在下方点击「仍要打开」。</li>
  <li>在软件内开启「系统代理」时，macOS 会弹出提示要求授权安装辅助工具，输入 Mac 开机密码确认授权即可。</li>
</ol>
        `
      },
      {
        title: '三、解决 Mac 终端命令行代理问题',
        content: `
<p>日常在终端中使用 <code>git clone</code>、<code>brew install</code> 或 <code>npm install</code> 经常遇到卡死，解决办法非常简单：</p>
<p>在 Clash Verge Rev 中开启<strong>「TUN 模式」</strong>，系统级接管所有终端进程；或者在 <code>~/.zshrc</code> 中加入以下别名快速开启终端代理：</p>
<pre><code>alias setproxy="export http_proxy=http://127.0.0.1:7897 https_proxy=http://127.0.0.1:7897"
alias unsetproxy="unset http_proxy https_proxy"</code></pre>
        `
      }
    ],
    faqs: [
      {
        q: "Mac 睡眠唤醒后网络断开或无法上网？",
        a: "进入 Clash Verge Rev 设置，尝试开启「静默重启核心 (Auto-restart Core on Wake)」选项；若仍偶发，关闭系统代理再重新开启即可快速恢复。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'flyv', 'firefly']
  },
  {
    slug: 'android-tutorial',
    title: 'Android 安卓平台机场客户端教程：Clash Meta for Android 与 Sing-box',
    seoTitle: 'Android安卓机场客户端教程｜Clash与Sing-box配置指南 - 机场日志',
    h1: 'Android 安卓平台机场客户端教程：Clash Meta for Android 与 Sing-box',
    description: '安卓手机与平板客户端使用指南，手把手演示 Clash Meta (CMFA) 与 Sing-box 的 APK 安装、节点订阅导入、后台保活与电池优化设置。',
    category: '系统平台',
    readTime: '6 分钟',
    updateDate: '2026-11-24',
    tags: ['Android', '安卓客户端', 'Clash Meta', '后台保活', 'Sing-box'],
    summary: '针对华为、小米、OPPO、vivo 及三星等主流安卓手机用户，系统解析客户端安装与解决系统后台频繁杀进程断连的关键设置。',
    sections: [
      {
        title: '一、安卓端推荐客户端：Clash Meta for Android (CMFA)',
        content: `
<p>目前安卓平台最稳定易用的是 <strong>Clash Meta for Android</strong>。它基于 Meta 内核，具有极高的协议兼容性和分流性能，支持分应用代理（绕过国内银行 App 等敏感软件）。</p>
        `
      },
      {
        title: '二、配置步骤：导入订阅与启动 VPN',
        content: `
<ol>
  <li>下载并安装官方发布版 APK（如 <code>cmfa-universal-release.apk</code>）。</li>
  <li>打开软件，点击「配置 (Profiles)」→ 右上角「+」号 →「URL 从 URL 导入」。</li>
  <li>输入配置名称（如机场名字），粘贴从机场后台复制的 Clash 订阅链接，点击右上角保存并下载。</li>
  <li>返回主界面，点击选中刚刚导入的配置，点击中央的圆形「启动」开关。</li>
  <li>首次启动时系统会弹出「网络连接请求 (VPN 请求)」，点击「确定/允许」即可。</li>
</ol>
        `
      },
      {
        title: '三、至关重要：安卓后台保活与防杀后台设置',
        content: `
<p>国产手机定制系统（HyperOS、OriginOS、ColorOS、EMUI）默认激进清理后台，导致亮屏能用、锁屏 5 分钟断线。必须进行以下四步设置：</p>
<ul>
  <li><strong>在多任务后台加锁：</strong>打开多任务列表，下拉客户端卡片点击「小锁」图标锁定。</li>
  <li><strong>关闭省电策略限制：</strong>长按应用图标进入「应用信息」→「省电策略/电池优化」，设为<strong>「无限制 / 允许后台高耗电」</strong>。</li>
  <li><strong>允许自启动与关联启动：</strong>在应用权限管理中勾选「自启动」权限。</li>
</ul>
        `
      }
    ],
    faqs: [
      {
        q: "如何让某些国内炒股或网银软件不走代理？",
        a: "在 Clash Meta for Android 的「设置」→「网络」中找到「分应用代理 (Access Control)」，选择「仅允许选中应用走代理」或「排除选中应用」，将国内银行和外卖软件勾选排除即可。"
      }
    ],
    relatedBrandIds: ['weifeng', 'dalaoyun', 'feimaoyun', 'yinxingren']
  },
  {
    slug: 'ios-tutorial',
    title: 'iOS 苹果手机机场客户端教程：Shadowrocket (小火箭) 购买与配置',
    seoTitle: 'iOS苹果手机客户端教程｜Shadowrocket小火箭订阅导入配置 - 机场日志',
    h1: 'iOS 苹果手机机场客户端教程：Shadowrocket (小火箭) 购买与配置',
    description: '专为 iPhone 与 iPad 用户整理的客户端指南，详解美区 Apple ID 获取、Shadowrocket (小火箭) 购买安装、节点订阅一键导入与自动化更新。',
    category: '系统平台',
    readTime: '7 分钟',
    updateDate: '2026-11-24',
    tags: ['iOS', 'iPhone', 'Shadowrocket', '小火箭', '美区AppleID'],
    summary: '苹果 iOS 生态由于 App Store 区域政策限制，代理软件无法在国区直接下载。本文手把手指导如何安全获取美区账号并快速配置 Shadowrocket。',
    sections: [
      {
        title: '一、关于 Shadowrocket (小火箭) 的基础常识',
        content: `
<p>Shadowrocket（俗称「小火箭」，图标为蓝色背景白色火箭）是 iOS 平台最流行、价格最亲民（美区售价 $2.99 一次性买断）的代理工具。支持 Shadowsocks、Trojan、Vmess、Vless、Hysteria2 等绝大多数现代协议。</p>
<p><strong>注意：</strong>由于政策要求，该软件不在中国大陆区 App Store 上架，必须使用<strong>海外区 Apple ID</strong>（推荐美区或港区）登录 App Store 进行下载。</p>
        `
      },
      {
        title: '二、获取海外 Apple ID 与下载步骤',
        content: `
<ol>
  <li><strong>获取美区 Apple ID：</strong>可通过苹果官网自行免费注册美区账号，或在可靠渠道获取账号。</li>
  <li><strong>在 App Store 登录：</strong>打开 iPhone「App Store」→ 点击右上角头像 → 滑到最下方退出当前账号 → 输入美区账号密码登录。<strong>切记：严禁在手机「系统设置」主入口登录 iCloud，仅在 App Store 登录即可！</strong></li>
  <li><strong>搜索与购买：</strong>搜索「Shadowrocket」，认准开发者为 <code>Shadow Launch Technology Group Limited</code>，通过美区礼品卡充值兑换后完成购买下载。</li>
  <li>下载完成后退出海外账号，换回您原本的国区主账号，已安装的小火箭可正常永久使用。</li>
</ol>
        `
      },
      {
        title: '三、一键导入机场订阅与节点切换',
        content: `
<ol>
  <li>使用 iPhone 自带 Safari 浏览器打开您注册的机场后台。</li>
  <li>找到「便捷导入」模块，点击「一键导入 Shadowrocket (小火箭)」，系统会自动跳转打开软件并载入全部节点。</li>
  <li>若不支持一键唤起，可复制订阅链接，打开 Shadowrocket 点击右上角「+」号，类型选择「Subscribe」，在 URL 栏粘贴链接并保存。</li>
  <li>在首页全局路由选择「配置 (Config)」，开启最上方连接开关，首次需允许添加 VPN 配置并验证面容 ID。</li>
</ol>
        `
      }
    ],
    faqs: [
      {
        q: "如何保持小火箭的节点订阅自动刷新？",
        a: "在 Shadowrocket 底部点击「设置」→「订阅」→ 勾选「打开应用时更新」与「自动后台更新」，这样每次打开软件都会自动同步机场最新节点状态。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'flyv', 'weituyun']
  },
  {
    slug: 'subscription-import',
    title: '机场订阅链接导入与自动更新全解析：通用格式、转换技巧与防泄密常识',
    seoTitle: '机场订阅链接导入教程｜订阅获取、自动更新与转换防泄密 - 机场日志',
    h1: '机场订阅链接导入与自动更新全解析：通用格式、转换技巧与防泄密常识',
    description: '深入解析机场订阅链接机制，涵盖订阅地址获取、各客户端一键导入、定时自动更新设置、User-Agent 识别及防信息泄露安全规范。',
    category: '订阅技巧',
    readTime: '6 分钟',
    updateDate: '2026-11-24',
    tags: ['订阅导入', '自动更新', '订阅安全', '防泄密', '订阅转换'],
    summary: '订阅链接是连接用户客户端与机场庞大节点集群的核心桥梁。掌握订阅的安全保管与自动化维护，是长期平稳顺畅翻墙的必修课。',
    sections: [
      {
        title: '一、订阅链接的组成结构与鉴权凭证',
        content: `
<p>标准的机场订阅链接通常形如：<code>https://api.yourbrand.com/api/v1/client/subscribe?token=a1b2c3d4e5f6</code>。</p>
<p>其中关键部分是 <code>token=</code> 后的哈希字符串。这个 Token 就是您的<strong>唯一身份凭证</strong>。任何人只要获取了这串链接，无需账号密码就能在任意客户端下载您的节点、消耗您的套餐流量甚至耗尽您的配额。因此：<strong>绝不要把订阅链接发送到公共群聊、贴吧或提交到公开代码仓库！</strong></p>
        `
      },
      {
        title: '二、各客户端如何开启「定时自动更新」？',
        content: `
<p>机场节点会因为上游机房故障、维护或防护策略而动态迁移。如果长期不更新订阅，可能出现大批节点连接超时的假象。配置自动更新非常必要：</p>
<ul>
  <li><strong>Clash Verge Rev：</strong>在「订阅」页面右键点击配置卡片 → 选择「编辑信息」→ 将「更新间隔 (Update Interval)」设为 1440 分钟（即 24 小时）或 720 分钟（12 小时）。</li>
  <li><strong>Shadowrocket：</strong>在「设置」→「订阅」中，勾选「打开应用时自动更新」。</li>
  <li><strong>v2rayN：</strong>在订阅设置中勾选「启用自动更新」，并设置更新周期。</li>
</ul>
        `
      },
      {
        title: '三、警惕第三方在线订阅转换工具的安全陷阱',
        content: `
<p>许多初学者喜欢使用网上随处搜到的「在线订阅转换平台（Subconverter Web）」，这存在极高的隐私与资产安全隐患：</p>
<p>不可信的第三方转换网站可以在后端服务器完整记录您提交的订阅链接，并在几分钟内将您的流量盗用殆尽，甚至在生成的节点列表里插入恶意注入节点。<strong>强烈建议使用客户端内置的解析能力或官方提供的一键转换，拒绝使用无背书的公共在线转换站。</strong></p>
        `
      }
    ],
    faqs: [
      {
        q: "如果发现订阅链接疑似泄露，应该怎么办？",
        a: "立即登录机场官方控制台，进入「个人中心 / 安全设置」，点击「重置订阅链接 (Reset Token)」。重置后旧链接瞬间失效，随后在各客户端重新粘贴导入新链接即可。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'dalaoyun', 'wuyoulianjie', 'quanqiuyun']
  },
  {
    slug: 'node-selection',
    title: '机场节点选择与低延迟测速指南：香港/日本/新加坡/美国节点场景实测',
    seoTitle: '机场节点选择指南｜香港日本新加坡美国节点延迟与场景实测 - 机场日志',
    h1: '机场节点选择与低延迟测速指南：香港/日本/新加坡/美国节点场景实测',
    description: '解密不同地区节点的网络特性，分析香港低延迟、日本稳定性、新加坡多流媒体及美国大带宽的适用场景与测速技巧。',
    category: '选购技巧',
    readTime: '7 分钟',
    updateDate: '2026-11-24',
    tags: ['节点选择', '测速指南', '低延迟', '香港节点', '流媒体解锁'],
    summary: '面对机场列表中数十个甚至上百个节点，该如何精准选择？本文梳理主流国家地区的网络特点与典型适用场景，让您告别盲目测速。',
    sections: [
      {
        title: '一、四大核心主力地区节点深度横评',
        content: `
<table>
  <thead>
    <tr>
      <th>地区</th>
      <th>物理延迟</th>
      <th>主要优势</th>
      <th>推荐使用场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>中国香港 (HK)</strong></td>
      <td>极低 (15~45ms)</td>
      <td>距离大陆最近，网页秒开，晚高峰体验最佳</td>
      <td>日常浏览、即时通讯、网页查资料、玩亚服网游</td>
    </tr>
    <tr>
      <td><strong>日本 (JP)</strong></td>
      <td>中低 (40~80ms)</td>
      <td>机房带宽充沛，抗审查强，日本本土服务适配好</td>
      <td>YouTube 8K 高码率视频、动漫追番 (DMM/Abema)、游戏更新</td>
    </tr>
    <tr>
      <td><strong>新加坡 (SG)</strong></td>
      <td>中等 (50~90ms)</td>
      <td>东南亚枢纽，对 AI 与国际金融服务非常友好</td>
      <td>ChatGPT / Claude 等大模型访问、Netflix / Disney+ 解锁</td>
    </tr>
    <tr>
      <td><strong>美国 (US)</strong></td>
      <td>偏高 (140~220ms)</td>
      <td>国际出口骨干带宽极大，价格实惠不限流</td>
      <td>大文件下载、GitHub 源码拉取、海外学术网站检索</td>
    </tr>
  </tbody>
</table>
        `
      },
      {
        title: '二、看懂测速结果：为什么延迟很低但看视频仍卡顿？',
        content: `
<p>很多用户存在一个认知误区：以为客户端里测出来的「延迟数字越小就代表网速越快」。其实：</p>
<ul>
  <li><strong>Ping 延迟反映的是响应快慢：</strong>如同两个人的对话反应时间。延迟 30ms 意味着发起请求响应极快，非常适合网页点开和在线打字交互。</li>
  <li><strong>带宽与丢包率决定视频流畅度：</strong>即便延迟只有 20ms，如果该节点带宽拥挤或者丢包率达到 10%，播放 4K 视频依然会频繁缓冲转圈。因此，晚高峰的<strong>专线稳定率和零丢包</strong>远比极致数字更重要。</li>
</ul>
        `
      },
      {
        title: '三、流媒体与 AI 服务对节点 IP 的苛刻要求',
        content: `
<p>访问 ChatGPT、Netflix 或 Disney+ 时，如果提示「抱歉，无法在您的国家/地区使用」或「检测到代理」，说明该节点的 IP 属于数据中心机房段（Data Center IP）而非原生家宽 IP（Residential IP）。优先选择机场列表中标注<strong>「原生解锁 / 流媒体 / AI 专线」</strong>字样的专用节点。</p>
        `
      }
    ],
    faqs: [
      {
        q: "应该一直开启「自动选择 (URL Test)」还是手动指定节点？",
        a: "建议手动选择 1~2 个您最常用的主力专线节点（如香港 01 或日本 01）。自动选择有时会在几个节点之间频繁跳变，导致某些需要稳定登录状态的论坛或账号被频繁判定为异地登录。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'weifeng', 'dalaoyun']
  },
  {
    slug: 'troubleshooting',
    title: '机场常见连接故障排查手册：节点超时、连不上、无网络与DNS污染',
    seoTitle: '机场连接故障排查｜连不上、无网络、节点超时与DNS解决 - 机场日志',
    h1: '机场常见连接故障排查手册：节点超时、连不上、无网络与DNS污染',
    description: '系统归纳机场使用过程中最常遇到的网络故障，提供系统时间校准、TUN 模式冲突、订阅更新失败与 DNS 污染的一站式排查方案。',
    category: '故障排查',
    readTime: '8 分钟',
    updateDate: '2026-11-24',
    tags: ['故障排查', '连不上', '节点超时', '系统时间', 'DNS解决'],
    summary: '当网络突然断开、网页提示无法连接或所有节点一片红字超时时，请不要慌张。按照本文给出的「黄金排查四部曲」，95% 的连接问题可在 3 分钟内自助解决。',
    sections: [
      {
        title: '第一步：核查系统时间误差（最隐蔽的高频杀手）',
        content: `
<p>绝大多数现代加密协议（尤其是 VMess、Vless、Trojan 以及带有 TLS 证书验证的通道）都依赖极其严格的时间戳同步机制。如果您的电脑或手机<strong>系统时间与北京时间误差超过 90 秒</strong>，服务器会出于防重放攻击策略直接拒绝握手，导致所有节点全部显示超时！</p>
<p><strong>解决办法：</strong>打开 Windows「日期和时间」设置，关闭再重新打开「自动设置时间」，并点击「立即同步」按钮确保时间精确到秒。</p>
        `
      },
      {
        title: '第二步：排查代理开关与端口残留占用',
        content: `
<p>常见现象：关掉代理软件后，电脑连百度、微信都无法联网；或者开启软件后提示 <code>Listen port 7890 failed</code>。</p>
<ul>
  <li><strong>系统代理未正常恢复：</strong>非正常关机或强制退出软件导致 Windows 注册表中的代理开关依然残留。进入 Windows「设置」→「网络和 Internet」→「代理」，将「使用代理服务器」手动关闭即可恢复。</li>
  <li><strong>端口冲突：</strong>有多个代理软件同时在后台运行或其它软件占用了 7890 端口。打开任务管理器结束多余的 Clash/v2rayN 进程，或在软件设置中修改监听端口为 7892/7895。</li>
</ul>
        `
      },
      {
        title: '第三步：检查套餐状态与流量是否耗尽',
        content: `
<p>有时问题很简单却容易被忽略：登录机场用户中心仪表盘，查看您的账户是否出现：</p>
<ol>
  <li>当月流量额度已用尽（流量条变为 100%）。</li>
  <li>套餐已经到期，未及时续费。</li>
  <li>同时在线设备数超过了套餐限定的最大阀值，导致新设备连接被拒绝。</li>
</ol>
        `
      },
      {
        title: '第四步：DNS 污染与重置 TUN 虚拟网卡',
        content: `
<p>如果能 Ping 通节点但无法打开任何网页，通常是本地 DNS 缓存污染或 TUN 网卡未正确释放。在管理员权限 PowerShell 中运行以下命令刷新网络堆栈：</p>
<pre><code>ipconfig /flushdns
netsh winsock reset</code></pre>
<p>执行完成后重启电脑，重新开启客户端即可满血复活。</p>
        `
      }
    ],
    faqs: [
      {
        q: "测速节点全部显示「Timeout 超时」，但换手机流量热点又能用？",
        a: "这说明您当前的宽带运营商（常见于个别地区的移动宽带或校园网/公司内网）对该机场的国内入口服务器 IP 进行了特定封锁或阻断。可尝试切换机场提供的备用入口节点，或联系机场管理获取中继备用端口。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'dalaoyun', 'weifeng', 'langwang']
  },
  {
    slug: 'plan-selection',
    title: '机场套餐选购技巧与性价比全解析：月付/年付/按量付费对比与避坑',
    seoTitle: '机场套餐选购指南｜月付年付按量付费性价比对比与避坑 - 机场日志',
    h1: '机场套餐选购技巧与性价比全解析：月付/年付/按量付费对比与避坑',
    description: '全面梳理机场计费模式与套餐结构，对比轻度、中度与重度流量用户的成本最优解，传授小额月付防跑路、避开虚标带宽的核心选购技巧。',
    category: '选购技巧',
    readTime: '7 分钟',
    updateDate: '2026-11-24',
    tags: ['套餐选购', '性价比', '月付年付', '按量付费', '避坑指南'],
    summary: '市面上机场套餐五花八门，从几块钱的超低价年付到数百元的高端专线。如何根据自己的实际需求挑选既省钱又稳定顺畅的服务？本篇为您建立清晰的选购逻辑。',
    sections: [
      {
        title: '一、三大计费模式全方位横向对比',
        content: `
<table>
  <thead>
    <tr>
      <th>计费类型</th>
      <th>计费规则</th>
      <th>适用人群</th>
      <th>风险与优劣势</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>周期月付 (推荐)</strong></td>
      <td>按月支付（如 ¥15~¥30/月），每月固定重置流量</td>
      <td>90% 的普通用户、上班族、学生党</td>
      <td><strong>风险最低</strong>，试错成本小，随用随续，体验不佳随时换家</td>
    </tr>
    <tr>
      <td><strong>长期年付</strong></td>
      <td>一次性付清 1 年费用，通常享受 7~8 折优惠</td>
      <td>已被充分验证、长期稳定运营 2 年以上的老牌机场忠实用户</td>
      <td>单次支出较高，<strong>存在跑路和线路变质风险</strong>，初次接触切勿直接年付</td>
    </tr>
    <tr>
      <td><strong>不限时按量付费</strong></td>
      <td>买一次流量（如 100GB/¥30），永久有效直到用完</td>
      <td>备用翻墙、偶尔查资料、差旅轻度用户</td>
      <td>单价略高，但长期不用不会过期浪费，<strong>极其适合作为备用第二梯队</strong></td>
    </tr>
  </tbody>
</table>
        `
      },
      {
        title: '二、根据自身流量消耗选择合理档位',
        content: `
<p>很多用户容易高估自己的实际月消耗流量，盲目买 500GB/1000GB 的大套餐，最终每月浪费大半：</p>
<ul>
  <li><strong>轻度用户（50GB ~ 100GB/月）：</strong>仅用于查阅网页、Google 搜索、GitHub 提交、文字版即时通讯。选择最低门槛基础套餐完全足够。</li>
  <li><strong>中度用户（150GB ~ 300GB/月）：</strong>日常观看 1080P/4K YouTube、追剧 Netflix、频繁使用 ChatGPT / Midjourney。推荐主流中配档位。</li>
  <li><strong>重度用户（500GB+ / 不限流量）：</strong>全天候开启海外流媒体直播、大型设计素材下载、多设备共享局域网家庭路由。建议选配大流量专项包。</li>
</ul>
        `
      },
      {
        title: '三、警惕「一元机场」与「超低价年付」陷阱',
        content: `
<p>市场上常有一些宣称「1元包月」或「20元包年提供 1000G」的所谓超神机场。这类产品背后的真实商业逻辑往往是：</p>
<ol>
  <li><strong>严重超卖：</strong>一台只有 1Gbps 的公网服务器卖给数万名用户，高峰期必定断流、挤爆、网页完全打不开。</li>
  <li><strong>资金盘集资跑路：</strong>用超低价吸引大量贪便宜的用户涌入购买年付，收割一波资金后直接关停站点卷款跑路。</li>
</ol>
<p>理性的认知是：<strong>带宽是有真实物理采购成本的</strong>。优质专线或 BGP 隧道的月均合理价格通常在 15 元至 45 元区间，过分低于成本价的服务必定在可用性或资金安全上埋雷。</p>
        `
      }
    ],
    faqs: [
      {
        q: "建议同时购买两家机场吗？",
        a: "非常建议！老玩家的黄金组合是：<strong>「主力优质月付专线机场 + 便宜不限时按量付费机场作为冷备」</strong>。平时用主力专线保障极致速度与低延迟，一旦主力遇突发维护，备用机场能确保随时应急连通。"
      }
    ],
    relatedBrandIds: ['lingdongyun', 'muguang', 'weifeng', 'dalaoyun', 'flyv']
  }
];
