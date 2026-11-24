import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const siteUrl = 'https://jichangrizhi.blog';
  const lastmod = '2026-11-23';

  // Real valid independent indexable pages
  const pages = [
    { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${siteUrl}/archives/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/airports/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/guides/`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${siteUrl}/risk-alerts/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${siteUrl}/about/`, priority: '0.7', changefreq: 'monthly' }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
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
