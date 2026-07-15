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
