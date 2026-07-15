import { Category, LinkItem } from "./types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "featured", name: "常用推荐", icon: "Flame", order: 1 },
  { id: "search", name: "搜索引擎", icon: "Search", order: 2 },
  { id: "dev", name: "开发学习", icon: "Code", order: 3 },
  { id: "productivity", name: "效率工具", icon: "Briefcase", order: 4 },
  { id: "life", name: "生活娱乐", icon: "Sparkles", order: 5 }
];

export const DEFAULT_LINKS: LinkItem[] = [
  // 常用推荐
  {
    id: "link-1",
    categoryId: "featured",
    title: "GitHub",
    url: "https://github.com",
    description: "全球最大的开源代码托管与协作平台",
    clickCount: 15,
    isPinned: true
  },
  {
    id: "link-2",
    categoryId: "featured",
    title: "Bilibili",
    url: "https://www.bilibili.com",
    description: "国内知名的视频弹幕社区，涵盖动漫、科技、游戏等",
    clickCount: 12,
    isPinned: true
  },
  {
    id: "link-3",
    categoryId: "featured",
    title: "Notion",
    url: "https://www.notion.so",
    description: "一体化的个人与团队笔记、任务和知识管理工具",
    clickCount: 8,
    isPinned: true
  },
  {
    id: "link-4",
    categoryId: "featured",
    title: "ChatGPT",
    url: "https://chatgpt.com",
    description: "OpenAI 推出的对话式人工智能助手",
    clickCount: 20,
    isPinned: true
  },

  // 搜索引擎
  {
    id: "link-5",
    categoryId: "search",
    title: "Google",
    url: "https://www.google.com",
    description: "全球使用最广泛、结果最精准的搜索引擎",
    clickCount: 25
  },
  {
    id: "link-6",
    categoryId: "search",
    title: "百度",
    url: "https://www.baidu.com",
    description: "国内主流的中文搜索引擎和资讯平台",
    clickCount: 5
  },
  {
    id: "link-7",
    categoryId: "search",
    title: "必应 Bing",
    url: "https://cn.bing.com",
    description: "微软推出的搜索引擎，附带每日精美壁纸与小必应AI",
    clickCount: 10
  },

  // 开发学习
  {
    id: "link-8",
    categoryId: "dev",
    title: "React 官网",
    url: "https://react.dev",
    description: "用于构建用户界面的 JavaScript 库官方文档",
    clickCount: 6
  },
  {
    id: "link-9",
    categoryId: "dev",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "实用优先的原子化 CSS 框架，快速构建精美界面",
    clickCount: 4
  },
  {
    id: "link-10",
    categoryId: "dev",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "最权威的 Web 技术参考文档，涵盖 HTML, CSS 和 JS",
    clickCount: 7
  },
  {
    id: "link-11",
    categoryId: "dev",
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "全球程序员问答与技术交流社区",
    clickCount: 3
  },

  // 效率工具
  {
    id: "link-12",
    categoryId: "productivity",
    title: "DeepL 翻译",
    url: "https://www.deepl.com",
    description: "基于人工智能的超精准多语种在线翻译工具",
    clickCount: 18
  },
  {
    id: "link-13",
    categoryId: "productivity",
    title: "Canva 可画",
    url: "https://www.canva.cn",
    description: "零基础轻松上手的在线平面设计与海报制作工具",
    clickCount: 2
  },
  {
    id: "link-14",
    categoryId: "productivity",
    title: "TinyPNG",
    url: "https://tinypng.com",
    description: "智能有损压缩工具，大幅减小 PNG/JPG 图片体积",
    clickCount: 9
  },

  // 生活娱乐
  {
    id: "link-15",
    categoryId: "life",
    title: "知乎",
    url: "https://www.zhihu.com",
    description: "中文互联网高质量问答社区和创作者聚集地",
    clickCount: 4
  },
  {
    id: "link-16",
    categoryId: "life",
    title: "豆瓣",
    url: "https://www.douban.com",
    description: "提供图书、电影、音乐推荐、评分及社区交流",
    clickCount: 6
  },
  {
    id: "link-17",
    categoryId: "life",
    title: "小红书",
    url: "https://www.xiaohongshu.com",
    description: "生活方式分享社区，涵盖美妆、穿搭、美食与旅行",
    clickCount: 8
  }
];
