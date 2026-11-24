/**
 * Personal Center MAX - Local Storage User Store
 * Namespaced keys for privacy-safe client-side data management
 */

export interface UserProfile {
  nickname: string;
  avatar: string; // 'plane' | 'compass' | 'rocket' | 'globe' | 'cloud' | 'shield'
  identity: string;
  createdAt: string;
}

export interface FavoriteBrand {
  brandId: string;
  name: string;
  englishName: string;
  tagline: string;
  minPrice: string;
  nodeRegions: string;
  lineTypes: string;
  protocols: string;
  url: string;
  addedAt: number;
}

export interface BookmarkedArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  url: string;
  readTime: string;
  addedAt: number;
}

export interface HistoryItem {
  url: string;
  title: string;
  type: 'brand' | 'guide' | 'risk' | 'page';
  typeName: string;
  visitedAt: number;
}

export interface ComparisonPlan {
  id: string; // e.g. 'lingdongyun-0'
  brandId: string;
  brandName: string;
  planName: string;
  price: string;
  cycle: string;
  traffic: string;
  devices: string;
  speedLimit: string;
  lineTypes: string;
  nodeRegions: string;
  protocols: string;
  clients: string;
  affUrl: string;
  addedAt: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'standard' | 'medium' | 'large';
  historyEnabled: boolean;
}

export interface UserNotification {
  id: string;
  title: string;
  content: string;
  type: 'brand' | 'price' | 'guide' | 'risk';
  relatedBrandId?: string;
  date: string;
  read: boolean;
}

// Storage keys
export const KEYS = {
  PROFILE: 'airport_journal_profile',
  FAVORITES: 'airport_journal_favorites',
  BOOKMARKS: 'airport_journal_bookmarks',
  HISTORY: 'airport_journal_history',
  COMPARISON: 'airport_journal_comparison',
  PREFERENCES: 'airport_journal_preferences',
  NOTIFICATIONS: 'airport_journal_notifications'
} as const;

// Default Authentic Notifications
export const DEFAULT_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-dalaoyun-added',
    title: '品牌档案新增：大佬云 (DalaoCloud) 正式收录',
    content: '大佬云真实 Markdown 资料已核验完毕，正式归位第 04 展示槽位，包含 8 大套餐规格、节点覆盖与专属 FAQ。',
    type: 'brand',
    relatedBrandId: 'dalaoyun',
    date: '2026-11-24',
    read: false
  },
  {
    id: 'notif-guides-hub-launch',
    title: '知识中心上线：10 篇全平台客户端使用与选购实战教程',
    content: '全新上线 Clash、Windows、macOS、iOS 小火箭、Android、故障排查与套餐避坑独立教程专区。',
    type: 'guide',
    date: '2026-11-24',
    read: false
  },
  {
    id: 'notif-brand-audit-2027',
    title: '全站档案核验：18 家品牌资费与节点状态完成年度复核',
    content: '技术团队已对收录的全部 18 家品牌官方控制台价格、优惠码与协议进行交叉核实，并更新核验标记。',
    type: 'price',
    date: '2026-11-24',
    read: false
  },
  {
    id: 'notif-risk-knowledge-hub',
    title: '安全中心更新：6 大避坑法则与 4 家客观追踪案例',
    content: '风险预警专区完善了跑路识别信号、长期套餐避坑及订阅安全规范，并持续跟进开源社区失联观察名单。',
    type: 'risk',
    date: '2026-11-24',
    read: false
  },
  {
    id: 'notif-weituyun-promo',
    title: '资费变动：唯兔云（V2云）更新限时月付与不限时规格',
    content: '收录唯兔云节假日限时特惠月付套餐，最低门槛月付调整，详情请查阅对应品牌档案。',
    type: 'price',
    relatedBrandId: 'weituyun',
    date: '2026-11-24',
    read: false
  }
];

// In-browser check
const isBrowser = typeof window !== 'undefined';

function safeGet<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[UserStore] Error reading key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, val: T): boolean {
  if (!isBrowser) return false;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('aj-user-store-updated', { detail: { key } }));
    return true;
  } catch (e) {
    console.error(`[UserStore] Error saving key ${key}:`, e);
    return false;
  }
}

export const UserStore = {
  // Profile
  getProfile(): UserProfile {
    return safeGet<UserProfile>(KEYS.PROFILE, {
      nickname: '访客探索者',
      avatar: 'plane',
      identity: '本地专属访客',
      createdAt: '2026-11-24'
    });
  },
  setProfile(profile: Partial<UserProfile>): boolean {
    const current = this.getProfile();
    return safeSet(KEYS.PROFILE, { ...current, ...profile });
  },

  // Favorites (Brands)
  getFavorites(): FavoriteBrand[] {
    return safeGet<FavoriteBrand[]>(KEYS.FAVORITES, []);
  },
  isBrandFavorited(brandId: string): boolean {
    const list = this.getFavorites();
    return list.some(item => item.brandId === brandId);
  },
  toggleFavoriteBrand(brand: Omit<FavoriteBrand, 'addedAt'>): boolean {
    const list = this.getFavorites();
    const idx = list.findIndex(b => b.brandId === brand.brandId);
    let updated: FavoriteBrand[];
    let added = false;
    if (idx >= 0) {
      updated = list.filter(b => b.brandId !== brand.brandId);
      added = false;
    } else {
      updated = [{ ...brand, addedAt: Date.now() }, ...list];
      added = true;
    }
    safeSet(KEYS.FAVORITES, updated);
    return added;
  },
  removeFavoriteBrand(brandId: string): boolean {
    const list = this.getFavorites();
    const updated = list.filter(b => b.brandId !== brandId);
    return safeSet(KEYS.FAVORITES, updated);
  },

  // Bookmarks (Articles & Guides)
  getBookmarks(): BookmarkedArticle[] {
    return safeGet<BookmarkedArticle[]>(KEYS.BOOKMARKS, []);
  },
  isArticleBookmarked(slug: string): boolean {
    const list = this.getBookmarks();
    return list.some(item => item.slug === slug);
  },
  toggleBookmarkArticle(article: Omit<BookmarkedArticle, 'addedAt'>): boolean {
    const list = this.getBookmarks();
    const idx = list.findIndex(a => a.slug === article.slug);
    let updated: BookmarkedArticle[];
    let added = false;
    if (idx >= 0) {
      updated = list.filter(a => a.slug !== article.slug);
      added = false;
    } else {
      updated = [{ ...article, addedAt: Date.now() }, ...list];
      added = true;
    }
    safeSet(KEYS.BOOKMARKS, updated);
    return added;
  },
  removeBookmarkArticle(slug: string): boolean {
    const list = this.getBookmarks();
    const updated = list.filter(a => a.slug !== slug);
    return safeSet(KEYS.BOOKMARKS, updated);
  },

  // History (Max 100 items)
  getHistory(): HistoryItem[] {
    const prefs = this.getPreferences();
    if (!prefs.historyEnabled) return [];
    return safeGet<HistoryItem[]>(KEYS.HISTORY, []);
  },
  recordHistory(item: Omit<HistoryItem, 'visitedAt'>): void {
    const prefs = this.getPreferences();
    if (!prefs.historyEnabled) return;

    const list = safeGet<HistoryItem[]>(KEYS.HISTORY, []);
    const filtered = list.filter(h => h.url !== item.url);
    const updated = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, 100);
    safeSet(KEYS.HISTORY, updated);
  },
  removeHistoryItem(url: string): boolean {
    const list = safeGet<HistoryItem[]>(KEYS.HISTORY, []);
    const updated = list.filter(h => h.url !== url);
    return safeSet(KEYS.HISTORY, updated);
  },
  clearHistory(): boolean {
    return safeSet(KEYS.HISTORY, []);
  },

  // Comparison (2-4 plans)
  getComparison(): ComparisonPlan[] {
    return safeGet<ComparisonPlan[]>(KEYS.COMPARISON, []);
  },
  isPlanInComparison(planId: string): boolean {
    const list = this.getComparison();
    return list.some(p => p.id === planId);
  },
  toggleComparisonPlan(plan: Omit<ComparisonPlan, 'addedAt'>): { added: boolean; count: number; error?: string } {
    const list = this.getComparison();
    const idx = list.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      const updated = list.filter(p => p.id !== plan.id);
      safeSet(KEYS.COMPARISON, updated);
      return { added: false, count: updated.length };
    } else {
      if (list.length >= 4) {
        return { added: false, count: list.length, error: '最多支持同时对比 4 个套餐规格' };
      }
      const updated = [...list, { ...plan, addedAt: Date.now() }];
      safeSet(KEYS.COMPARISON, updated);
      return { added: true, count: updated.length };
    }
  },
  removeComparisonPlan(planId: string): boolean {
    const list = this.getComparison();
    const updated = list.filter(p => p.id !== planId);
    return safeSet(KEYS.COMPARISON, updated);
  },
  clearComparison(): boolean {
    return safeSet(KEYS.COMPARISON, []);
  },

  // Notifications
  getNotifications(): UserNotification[] {
    const stored = safeGet<UserNotification[]>(KEYS.NOTIFICATIONS, null as any);
    if (!stored || stored.length === 0) {
      safeSet(KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      return DEFAULT_NOTIFICATIONS;
    }
    return stored;
  },
  markNotificationRead(id: string): boolean {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    return safeSet(KEYS.NOTIFICATIONS, updated);
  },
  markAllNotificationsRead(): boolean {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    return safeSet(KEYS.NOTIFICATIONS, updated);
  },

  // Preferences
  getPreferences(): UserPreferences {
    return safeGet<UserPreferences>(KEYS.PREFERENCES, {
      theme: 'system',
      fontSize: 'standard',
      historyEnabled: true
    });
  },
  setPreferences(prefs: Partial<UserPreferences>): boolean {
    const current = this.getPreferences();
    return safeSet(KEYS.PREFERENCES, { ...current, ...prefs });
  },

  // Stats for Profile Overview
  getCounts() {
    return {
      favorites: this.getFavorites().length,
      bookmarks: this.getBookmarks().length,
      history: this.getHistory().length,
      comparison: this.getComparison().length,
      unreadNotifs: this.getNotifications().filter(n => !n.read).length
    };
  },

  // Export / Import
  exportData(): string {
    const data = {
      version: '2027.1',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      favorites: this.getFavorites(),
      bookmarks: this.getBookmarks(),
      history: this.getHistory(),
      comparison: this.getComparison(),
      preferences: this.getPreferences()
    };
    return JSON.stringify(data, null, 2);
  },
  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || !parsed) {
        return { success: false, message: '无效的 JSON 格式' };
      }
      if (parsed.profile) safeSet(KEYS.PROFILE, parsed.profile);
      if (Array.isArray(parsed.favorites)) safeSet(KEYS.FAVORITES, parsed.favorites);
      if (Array.isArray(parsed.bookmarks)) safeSet(KEYS.BOOKMARKS, parsed.bookmarks);
      if (Array.isArray(parsed.history)) safeSet(KEYS.HISTORY, parsed.history);
      if (Array.isArray(parsed.comparison)) safeSet(KEYS.COMPARISON, parsed.comparison);
      if (parsed.preferences) safeSet(KEYS.PREFERENCES, parsed.preferences);
      return { success: true, message: '数据导入成功' };
    } catch (e: any) {
      return { success: false, message: `解析错误: ${e.message}` };
    }
  },

  // Clear all
  clearAllData(): void {
    if (!isBrowser) return;
    Object.values(KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    });
    window.dispatchEvent(new CustomEvent('aj-user-store-updated', { detail: { key: 'all' } }));
  }
};
