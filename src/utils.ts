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
