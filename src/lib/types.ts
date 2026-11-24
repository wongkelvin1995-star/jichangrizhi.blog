export interface BrandConfig {
  order: number;
  name: string;
  id: string;
  file: string | null;
  missing?: boolean;
  tagline?: string;
  badge?: string;
}

export interface PlanTableRow {
  name: string;
  price: string;
  cycle: string;
  traffic: string;
  devices: string;
  speedLimit: string;
}

export interface BrandMeta {
  order: number;
  id: string;
  brandName: string;
  englishName: string;
  aliases: string;
  website: string;
  registerUrl: string;
  introduction: string;
  positioning: string;
  targetUsers: string;
  nodeRegions: string;
  nodeCount: string;
  lineTypes: string;
  protocols: string;
  speedLimit: string;
  clientSupport: {
    windows: string;
    macos: string;
    android: string;
    ios: string;
    linux: string;
    router: string;
    thirdParty: string;
    importMethod: string;
  };
  services: {
    netflix: string;
    disney: string;
    youtube: string;
    chatgpt: string;
    otherAi: string;
    gaming: string;
    otherFeatures: string;
  };
  support: {
    contact: string;
    techSupport: string;
    refundPolicy: string;
    trialPolicy: string;
    faqText: string;
  };
  links: {
    logo: string;
    screenshot: string;
    official: string;
    purchase: string;
    download: string;
    tutorial: string;
  };
  source: {
    infoSource: string;
    verifyDate: string;
    announcement: string;
    notes: string;
  };
  plans: PlanTableRow[];
  faqList: { question: string; answer: string }[];
  rawMarkdown: string;
  renderedHtml: string;
}

export interface RiskItem {
  id: string;
  name: string;
  reportDate: string;
  category: string;
  categoryBadge: string;
  symptoms: string;
  sourceUrl: string;
  sourceName: string;
  lastVerifiedDate: string;
  status: string;
  notes: string;
}
