export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  order: number;
}

export interface LinkItem {
  id: string;
  categoryId: string;
  title: string;
  url: string;
  description: string;
  icon?: string; // Custom icon name or empty for auto-favicon
  clickCount: number;
  isPinned?: boolean; // Pin to top / quick access
}

export interface NavData {
  categories: Category[];
  links: LinkItem[];
}

export type ThemeId = "sage" | "clay" | "wheat" | "slate" | "pine" | "sakura" | "lavender" | "indigo" | "amber";
export type CardSize = "small" | "medium" | "large";
export type GridCols = "auto" | "2" | "3" | "4";

export interface AppPreferences {
  siteTitle: string;
  siteSubtitle: string;
  cardSize: CardSize;
  theme: ThemeId;
  searchBarEnabled: boolean;
  defaultEngineId: string;
  gridCols: GridCols;
}
