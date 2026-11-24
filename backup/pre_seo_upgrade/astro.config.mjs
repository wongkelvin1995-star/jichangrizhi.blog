// @ts-check
import { defineConfig } from 'astro/config';

/**
 * 2027 机场日志 · Airport Journal MAX
 * - 纯静态预渲染 (SSG)，满足可部署于 Cloudflare Pages / Vercel / 静态主机的要求
 * - 规范站点根路径 https://jichangrizhi.blog/
 * - 目录式 URL + 尾部斜杠 (/airport-alerts/)
 */
export default defineConfig({
  site: 'https://jichangrizhi.blog',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    assets: '_astro',
    inlineStylesheets: 'auto'
  },
  image: {
    responsiveStyles: true
  },
  devToolbar: {
    enabled: false
  },
  server: {
    host: true,
    port: 4321
  }
});
