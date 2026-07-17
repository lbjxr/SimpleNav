export function getFaviconUrl(url: string): string {
  try {
    const cleanUrl = url.trim();
    if (!cleanUrl) return "";
    
    // Add protocol if missing to allow valid URL parsing
    let parsedUrlStr = cleanUrl;
    if (!/^https?:\/\//i.test(cleanUrl)) {
      parsedUrlStr = "https://" + cleanUrl;
    }
    
    const domain = new URL(parsedUrlStr).hostname;
    // High-resolution Google favicon service
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch (e) {
    return "";
  }
}

export function generateId(): string {
  return "id-" + Math.random().toString(36).substring(2, 11);
}

export function isValidUrl(url: string): boolean {
  try {
    let testUrl = url.trim();
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = "https://" + testUrl;
    }
    new URL(testUrl);
    return true;
  } catch (e) {
    return false;
  }
}

export interface SearchEngine {
  id: string;
  name: string;
  placeholder: string;
  url: string;
  icon: string;
}

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    placeholder: "搜索 Google，或直接输入网址跳转...",
    url: "https://www.google.com/search?q=",
    icon: "Globe"
  },
  {
    id: "bing",
    name: "Bing",
    placeholder: "搜索必应 Bing...",
    url: "https://cn.bing.com/search?q=",
    icon: "Search"
  },
  {
    id: "baidu",
    name: "百度",
    placeholder: "搜索百度...",
    url: "https://www.baidu.com/s?wd=",
    icon: "Compass"
  },
  {
    id: "github",
    name: "GitHub",
    placeholder: "在 GitHub 上搜索开源项目...",
    url: "https://github.com/search?q=",
    icon: "Terminal"
  }
];

import { ThemeId } from "./types";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgPage: string;
  bgCard: string;
  border: string;
  borderHover: string;
  textPrimary: string;
  textMuted: string;
  accentBg: string;
  accentBgHover: string;
  accentText: string;
  accentLight: string;
  accentLightText: string;
  shadow: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "sage",
    name: "雅致鼠尾草 (Sage Green)",
    bgPage: "bg-[#FDFCF9]",
    bgCard: "bg-white",
    border: "border-[#E5E2D9]",
    borderHover: "group-hover:border-sage-500 hover:border-sage-500",
    textPrimary: "text-[#3C3C3B]",
    textMuted: "text-[#9A9892]",
    accentBg: "bg-sage-500",
    accentBgHover: "hover:bg-sage-600",
    accentText: "text-sage-600",
    accentLight: "bg-sage-50",
    accentLightText: "text-sage-700",
    shadow: "shadow-sage-500/10"
  },
  {
    id: "clay",
    name: "温暖陶土 (Warm Clay)",
    bgPage: "bg-[#FCF9F8]",
    bgCard: "bg-white",
    border: "border-[#EADECE]",
    borderHover: "group-hover:border-[#C2A7A2] hover:border-[#C2A7A2]",
    textPrimary: "text-[#453F3E]",
    textMuted: "text-[#9F9391]",
    accentBg: "bg-[#C2A7A2]",
    accentBgHover: "hover:bg-[#B09590]",
    accentText: "text-[#C2A7A2]",
    accentLight: "bg-[#F7EFEF]",
    accentLightText: "text-[#9E7A75]",
    shadow: "shadow-[#C2A7A2]/10"
  },
  {
    id: "wheat",
    name: "澄澈秋麦 (Earthy Wheat)",
    bgPage: "bg-[#FAF8F5]",
    bgCard: "bg-white",
    border: "border-[#EBE2D5]",
    borderHover: "group-hover:border-[#D1B894] hover:border-[#D1B894]",
    textPrimary: "text-[#47433B]",
    textMuted: "text-[#A39988]",
    accentBg: "bg-[#D1B894]",
    accentBgHover: "hover:bg-[#C0A783]",
    accentText: "text-[#A1855F]",
    accentLight: "bg-[#FAF3E8]",
    accentLightText: "text-[#8E714B]",
    shadow: "shadow-[#D1B894]/10"
  },
  {
    id: "slate",
    name: "静谧海岩 (Ocean Slate)",
    bgPage: "bg-[#F5F8FA]",
    bgCard: "bg-white",
    border: "border-[#DFE5E8]",
    borderHover: "group-hover:border-[#9EABB3] hover:border-[#9EABB3]",
    textPrimary: "text-[#3B4247]",
    textMuted: "text-[#88949E]",
    accentBg: "bg-[#9EABB3]",
    accentBgHover: "hover:bg-[#8CA2AD]",
    accentText: "text-[#6A7F8C]",
    accentLight: "bg-[#EFF5F8]",
    accentLightText: "text-[#516F80]",
    shadow: "shadow-[#9EABB3]/10"
  },
  {
    id: "pine",
    name: "森林深处 (Forest Pine)",
    bgPage: "bg-[#F8FAF6]",
    bgCard: "bg-white",
    border: "border-[#E0E8DC]",
    borderHover: "group-hover:border-[#5C6857] hover:border-[#5C6857]",
    textPrimary: "text-[#353C33]",
    textMuted: "text-[#8C9888]",
    accentBg: "bg-[#5C6857]",
    accentBgHover: "hover:bg-[#4E584A]",
    accentText: "text-[#5C6857]",
    accentLight: "bg-[#F0F5EE]",
    accentLightText: "text-[#414E3C]",
    shadow: "shadow-[#5C6857]/10"
  },
  {
    id: "sakura",
    name: "樱落粉黛 (Sakura Blush)",
    bgPage: "bg-[#FCF7F9]",
    bgCard: "bg-white",
    border: "border-[#F2DFE4]",
    borderHover: "group-hover:border-[#E8B0BE] hover:border-[#E8B0BE]",
    textPrimary: "text-[#4A3D40]",
    textMuted: "text-[#A8989C]",
    accentBg: "bg-[#E8B0BE]",
    accentBgHover: "hover:bg-[#DB9AA9]",
    accentText: "text-[#D48596]",
    accentLight: "bg-[#FDF3F5]",
    accentLightText: "text-[#C0697B]",
    shadow: "shadow-[#E8B0BE]/10"
  },
  {
    id: "lavender",
    name: "静谧薰衣 (Lavender Purple)",
    bgPage: "bg-[#F7F6FB]",
    bgCard: "bg-white",
    border: "border-[#E6E2F5]",
    borderHover: "group-hover:border-[#B3ACDE] hover:border-[#B3ACDE]",
    textPrimary: "text-[#3E3A4B]",
    textMuted: "text-[#9E99B3]",
    accentBg: "bg-[#B3ACDE]",
    accentBgHover: "hover:bg-[#9D95CE]",
    accentText: "text-[#857BB8]",
    accentLight: "bg-[#F1EFFB]",
    accentLightText: "text-[#6D629E]",
    shadow: "shadow-[#B3ACDE]/10"
  },
  {
    id: "indigo",
    name: "深海墨蓝 (Midnight Indigo)",
    bgPage: "bg-[#F4F6F9]",
    bgCard: "bg-white",
    border: "border-[#E1E6EE]",
    borderHover: "group-hover:border-[#6C85AC] hover:border-[#6C85AC]",
    textPrimary: "text-[#313945]",
    textMuted: "text-[#848E9C]",
    accentBg: "bg-[#6C85AC]",
    accentBgHover: "hover:bg-[#587299]",
    accentText: "text-[#4E678E]",
    accentLight: "bg-[#EEF2F7]",
    accentLightText: "text-[#384F72]",
    shadow: "shadow-[#6C85AC]/10"
  },
  {
    id: "amber",
    name: "晨光琥珀 (Warm Amber)",
    bgPage: "bg-[#FAF8F3]",
    bgCard: "bg-white",
    border: "border-[#F4EDE0]",
    borderHover: "group-hover:border-[#E3C188] hover:border-[#E3C188]",
    textPrimary: "text-[#453F35]",
    textMuted: "text-[#9E9382]",
    accentBg: "bg-[#E3C188]",
    accentBgHover: "hover:bg-[#CFA86D]",
    accentText: "text-[#C6964D]",
    accentLight: "bg-[#FBF8F1]",
    accentLightText: "text-[#AA7A34]",
    shadow: "shadow-[#E3C188]/10"
  }
];

export const DEFAULT_PREFERENCES = {
  siteTitle: "清新导航页",
  siteSubtitle: "极简个人网址入口",
  cardSize: "medium" as const,
  theme: "sage" as const,
  searchBarEnabled: true,
  defaultEngineId: "google",
  gridCols: "auto" as const
};
