import type { APIRoute } from 'astro';
import { getAllBrands } from '../lib/brand-parser.ts';
import { GUIDE_ARTICLES } from '../lib/guides-data.ts';

export const GET: APIRoute = () => {
  const siteUrl = 'https://jichangrizhi.blog';
  const lastmod = '2026-11-24';

  const brands = getAllBrands();

  // Core navigation pages
  const corePages = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteUrl}/airports/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/brands/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/guides/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/articles/`, priority: '0.85', changefreq: 'weekly' },
    { loc: `${siteUrl}/risk-alerts/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/about/`, priority: '0.7', changefreq: 'monthly' }
  ];

  // 18 Independent brand detail pages
  const brandPages = brands.map(b => ({
    loc: `${siteUrl}/airports/${b.id}/`,
    priority: '0.85',
    changefreq: 'weekly'
  }));

  // Independent tutorial guide pages
  const guidePages = GUIDE_ARTICLES.map(g => ({
    loc: `${siteUrl}/guides/${g.slug}/`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  // 3 Featured deep-dive article pages
  const articlePages = [
    { loc: `${siteUrl}/articles/airport-brand-guide/`, priority: '0.85', changefreq: 'weekly' },
    { loc: `${siteUrl}/articles/airport-plan-guide/`, priority: '0.85', changefreq: 'weekly' },
    { loc: `${siteUrl}/articles/airport-node-regions/`, priority: '0.85', changefreq: 'weekly' }
  ];

  const allPages = [...corePages, ...brandPages, ...guidePages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
