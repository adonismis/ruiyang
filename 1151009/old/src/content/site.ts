/**
 * 睿洋機電官網內容來源。
 *
 * 文案與版型分離：更新公司正式資料時，優先修改本檔。
 * pending 為待公司提供或確認的內容，不可當作已確認的營業項目、
 * 工程實績、政策成果或招募資訊發布。
 */

export type PublicationStatus = "pending" | "published";

export type SiteImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  usage: "company" | "illustrative";
  credit?: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  englishLabel: string;
  href: `/${string}`;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string[];
  image: SiteImage | null;
  relatedProjectIds: string[];
  status: PublicationStatus;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
  scope: string[];
  summary: string;
  description: string[];
  coverImage: SiteImage;
  images: SiteImage[];
  relatedProjectIds: string[];
  featured: boolean;
  status: PublicationStatus;
};

export type SustainabilityPolicy = {
  id: string;
  title: string;
  englishTitle: string;
  summary: string;
  description: string[];
  status: PublicationStatus;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  category: "最新消息" | "工程動態";
  summary: string;
  coverImage: SiteImage | null;
  content: string[];
  images: SiteImage[];
  status: PublicationStatus;
};

export type Job = {
  id: string;
  title: string;
  location: string;
  description: string[];
  requirements: string[];
  applicationUrl: string | null;
  applicationInstructions: string;
  status: PublicationStatus;
};

export type Office = {
  id: string;
  name: string;
  englishName: string;
  address: string;
  confirmationStatus: "pending" | "confirmed";
};

export const company = {
  name: "睿洋機電工程有限公司",
  shortName: "睿洋機電",
  englishName: "Ruiyang Electromechanical",
  brief:
    "睿洋機電工程有限公司追求企業永續經營及成長，以良好工程品質與專業服務態度作為企業發展方向。",
  foundedYear: 2020,
  registration: {
    taxId: "83305696",
    representative: "黃國庭",
    capitalTwd: 10_000_000,
    confirmationStatus: "pending" as const,
  },
  // 登記業別並非經公司確認的完整營業項目，不用於 services。
  registeredIndustries: ["冷凍通風空調系統裝修業", "保溫保冷安裝業"],
};

// 全站主要導覽；各分類都有獨立網址。
export const navigation: NavigationItem[] = [
  { id: "home", label: "首頁", englishLabel: "Home", href: "/" },
  { id: "about", label: "關於我們", englishLabel: "About Us", href: "/about" },
  {
    id: "services",
    label: "營業項目",
    englishLabel: "Services",
    href: "/services",
  },
  {
    id: "projects",
    label: "營業實績",
    englishLabel: "Projects",
    href: "/projects",
  },
  {
    id: "sustainability",
    label: "企業永續與品質工安",
    englishLabel: "ESG & ESH",
    href: "/sustainability",
  },
  { id: "news", label: "新聞中心", englishLabel: "News Center", href: "/news" },
  {
    id: "careers",
    label: "加入我們",
    englishLabel: "Careers",
    href: "/careers",
  },
  {
    id: "contact",
    label: "聯絡我們",
    englishLabel: "Contact Us",
    href: "/contact",
  },
];

export const homepage = {
  hero: {
    title: ["專業機電工程", "成就卓越建築"],
    englishTitle: "PROFESSIONAL ELECTROMECHANICAL ENGINEERING",
    description: "以專業技術與嚴謹工程管理，打造安全、穩定且高效的建築環境。",
    primaryAction: { label: "探索營業項目", href: "/services" },
    secondaryAction: { label: "查看營業實績", href: "/projects" },
    copyStatus: "pending" as const,
  },
  about: {
    title: ["專業為本", "品質為先"],
    englishTitle: "ABOUT RUIYANG",
    description: company.brief,
  },
  services: {
    title: "專業工程服務",
    englishTitle: "OUR SERVICES",
    emptyMessage: "正式營業項目與服務內容，待公司確認後更新。",
  },
  projects: {
    title: ["以專業實力", "實現每一項工程"],
    englishTitle: "PROJECT PORTFOLIO",
    emptyTitle: "工程實績，待新增",
    emptyMessage: "工程資料與實際案例照片尚待提供，確認後將於此呈現。",
  },
  sustainability: {
    title: ["重視品質", "落實安全", "邁向永續"],
    englishTitle: "QUALITY, SAFETY & SUSTAINABILITY",
  },
  news: {
    title: "最新消息",
    englishTitle: "LATEST NEWS",
    emptyTitle: "目前尚無公開消息",
    emptyMessage: "公司消息與工程動態將於確認後更新，敬請關注。",
  },
  careers: {
    title: ["與睿洋一起", "打造更多可能"],
    englishTitle: "JOIN OUR TEAM",
  },
  contact: {
    title: "期待與您合作",
    englishTitle: "CONTACT US",
  },
};

// 以下三筆僅供首頁展示待補版位。請以正式資料取代後再標記 published。
export const services: Service[] = [1, 2, 3].map<Service>((number) => ({
  id: `pending-service-${number}`,
  slug: `pending-service-${number}`,
  title: `服務項目 ${String(number).padStart(2, "0")}`,
  summary: "服務分類與介紹待公司提供。",
  description: [],
  image: null,
  relatedProjectIds: [],
  status: "pending",
}));

// 僅新增經公司確認且具使用授權的真實工程與照片。
export const projects: Project[] = [];

export const sustainability: SustainabilityPolicy[] = [
  {
    id: "safety",
    title: "工安衛政策",
    englishTitle: "HEALTH & SAFETY",
    summary: "職業安全衛生理念與現場管理制度，待公司提供正式內容。",
    description: [],
    status: "pending",
  },
  {
    id: "quality",
    title: "品質政策與管理",
    englishTitle: "QUALITY MANAGEMENT",
    summary: "品質管理流程、材料檢驗與自主檢查制度，待公司提供。",
    description: [],
    status: "pending",
  },
  {
    id: "responsibility",
    title: "企業社會責任",
    englishTitle: "SOCIAL RESPONSIBILITY",
    summary: "永續理念與相關實際措施，待公司確認後完整呈現。",
    description: [],
    status: "pending",
  },
];

export const news: NewsArticle[] = [];
export const jobs: Job[] = [];

export const careers = {
  description: "追求企業永續經營，重視同仁成長。",
  developmentNote: "人才培育與訓練制度待公司補充。",
  benefitsNote: "薪酬與員工福利內容待公司確認。",
  emptyJobsMessage: "目前尚無公開職缺。",
  applicationUrl: null as string | null,
};

export const offices: Office[] = [
  {
    id: "hsinchu",
    name: "新竹總公司",
    englishName: "HSINCHU HEAD OFFICE",
    address: "新竹縣竹東鎮頭重里頭重埔48-11號",
    confirmationStatus: "pending",
  },
  {
    id: "taichung",
    name: "台中辦公處",
    englishName: "TAICHUNG OFFICE",
    address: "台中市西屯區大容東街88號4樓之3",
    confirmationStatus: "pending",
  },
];

export const contact = {
  offices,
  phone: null as string | null,
  email: null as string | null,
  lineUrl: null as string | null,
  addressNote: "地址待公司確認，正式公開前將再次核對。",
  availabilityNote: "電話、電子郵件及 LINE 聯絡資訊待公司提供。",
  formEnabled: false,
};

export const missingContent = [
  "確認公司負責人、資本額、登記資料與兩處地址",
  "正式營業項目分類、服務說明與代表照片",
  "真實工程案例、分類、地點、年度與使用授權照片",
  "工安衛政策、品質管理制度與企業社會責任內容",
  "正式新聞文章與工程動態",
  "公司及團隊照片、人才培育制度、福利與職缺資料",
  "公司電話、電子郵件、LINE 及正式諮詢收件方式",
  "首頁形象標語與暫定文案確認",
];
