import type { SearchItem } from './search-indexer.ts';

export interface SearchResult {
  item: SearchItem;
  score: number;
  highlightedTitle: string;
  highlightedSubtitle: string;
  highlightedSnippet: string;
}

export interface GroupedSearchResults {
  total: number;
  brands: SearchResult[];
  plans: SearchResult[];
  guides: SearchResult[];
  articles: SearchResult[];
  risks: SearchResult[];
  all: SearchResult[];
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(text: string, queryTokens: string[]): string {
  if (!text || queryTokens.length === 0) return text;

  // Filter out empty tokens
  const validTokens = queryTokens
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .sort((a, b) => b.length - a.length);

  if (validTokens.length === 0) return text;

  const pattern = new RegExp(`(${validTokens.map(escapeRegex).join('|')})`, 'gi');
  return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
}

export function searchSite(items: SearchItem[], query: string): GroupedSearchResults {
  const emptyResult: GroupedSearchResults = {
    total: 0,
    brands: [],
    plans: [],
    guides: [],
    articles: [],
    risks: [],
    all: []
  };

  const rawQuery = (query || '').trim();
  if (!rawQuery) {
    return emptyResult;
  }

  // Normalize query and split by space for multi-term query
  const lowerQuery = rawQuery.toLowerCase();
  const tokens = lowerQuery.split(/\s+/).filter(Boolean);

  // Common synonyms / aliases mapping
  const tokenExpansions: string[] = [...tokens];
  tokens.forEach(t => {
    if (t === '飞v') tokenExpansions.push('flyv');
    if (t === 'flyv') tokenExpansions.push('飞v');
    if (t === 'v2云') tokenExpansions.push('唯兔云');
    if (t === 'u1s1') tokenExpansions.push('有一说一');
    if (t === '有一说一') tokenExpansions.push('u1s1');
    if (t === 'vpn') tokenExpansions.push('代理', '机场', '科学上网');
    if (t === '便宜' || t === '平价') tokenExpansions.push('性价比', '便宜机场');
    if (t === '奈飞') tokenExpansions.push('netflix');
    if (t === '油管') tokenExpansions.push('youtube');
    if (t === '小火箭') tokenExpansions.push('shadowrocket');
  });

  const uniqueTokens = Array.from(new Set(tokenExpansions));

  const results: SearchResult[] = [];

  for (const item of items) {
    let score = 0;
    const itemTitleLower = item.title.toLowerCase();
    const itemSubLower = (item.subtitle || '').toLowerCase();
    const itemSnippetLower = item.snippet.toLowerCase();
    const itemContentLower = item.searchContent.toLowerCase();
    const tagsLower = item.tags.map(t => t.toLowerCase()).join(' ');

    // 1. Exact full query match
    if (itemTitleLower === lowerQuery) {
      score += 200;
    } else if (itemTitleLower.includes(lowerQuery)) {
      score += 80;
    }

    if (itemSubLower.includes(lowerQuery)) {
      score += 50;
    }

    if (tagsLower.includes(lowerQuery)) {
      score += 45;
    }

    // 2. Token-based matching
    let allTokensMatched = true;
    for (const token of tokens) {
      const inTitle = itemTitleLower.includes(token);
      const inSub = itemSubLower.includes(token);
      const inTags = tagsLower.includes(token);
      const inSnippet = itemSnippetLower.includes(token);
      const inContent = itemContentLower.includes(token);

      if (inTitle) {
        score += 40;
      } else if (inSub) {
        score += 25;
      } else if (inTags) {
        score += 20;
      } else if (inSnippet) {
        score += 15;
      } else if (inContent) {
        score += 8;
      } else {
        // check synonym expansion
        const expandedMatch = uniqueTokens.some(exp => exp !== token && (itemTitleLower.includes(exp) || tagsLower.includes(exp) || itemContentLower.includes(exp)));
        if (expandedMatch) {
          score += 12;
        } else {
          allTokensMatched = false;
        }
      }
    }

    // If query has multiple tokens, boost items matching all tokens
    if (tokens.length > 1 && allTokensMatched) {
      score += 60;
    }

    // Specific category priority boost for intent
    if (tokens.some(t => ['机场', '云', '加速', '网络', '梯子'].includes(t)) && item.type === 'brand') {
      score += 10;
    }
    if (tokens.some(t => ['套餐', '价格', '元', '¥', 'gb', 'tb', '年付', '月付', '流量', '不限时'].includes(t)) && item.type === 'plan') {
      score += 15;
    }
    if (tokens.some(t => ['教程', '配置', '客户端', '导入', '怎么用', '超时', 'clash'].includes(t)) && item.type === 'guide') {
      score += 15;
    }
    if (tokens.some(t => ['跑路', '停运', '失联', '被抓', '安全', '风险', '退款'].includes(t)) && item.type === 'risk') {
      score += 20;
    }

    if (score > 0) {
      results.push({
        item,
        score,
        highlightedTitle: highlightText(item.title, uniqueTokens),
        highlightedSubtitle: highlightText(item.subtitle, uniqueTokens),
        highlightedSnippet: highlightText(item.snippet, uniqueTokens)
      });
    }
  }

  // Sort descending by relevance score
  results.sort((a, b) => b.score - a.score);

  const grouped: GroupedSearchResults = {
    total: results.length,
    brands: results.filter(r => r.item.type === 'brand'),
    plans: results.filter(r => r.item.type === 'plan'),
    guides: results.filter(r => r.item.type === 'guide'),
    articles: results.filter(r => r.item.type === 'article'),
    risks: results.filter(r => r.item.type === 'risk'),
    all: results
  };

  return grouped;
}
