import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Settings, 
  Palette, 
  Layers, 
  Link, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Pin, 
  Eye, 
  SlidersHorizontal,
  Sparkles,
  HelpCircle,
  Undo
} from "lucide-react";
import { Category, LinkItem, AppPreferences, ThemeId, CardSize, GridCols } from "../types";
import { SEARCH_ENGINES, THEMES, ThemeConfig } from "../utils";
import { LucideIcon } from "./LucideIcon";

// Simple Lucide Icon dynamic renderer for Categories
const DynamicLucideIcon = ({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) => {
  return <LucideIcon name={name} size={size} className={className} />;
};

// Available icons list for Categories (predefined set matching our modals selector)
const AVAILABLE_ICONS = [
  "Flame", "Search", "Code", "Briefcase", "Sparkles", "Globe", "Layers", 
  "BookOpen", "Compass", "Terminal", "Music", "Video", "Image", 
  "Gamepad2", "ShoppingBag", "Heart", "Coffee", "Cloud", "Settings", "MapPin"
];

interface AdminPanelProps {
  categories: Category[];
  links: LinkItem[];
  preferences: AppPreferences;
  activeThemeConfig: ThemeConfig;
  onUpdateCategories: (cats: Category[]) => void;
  onUpdateLinks: (links: LinkItem[]) => void;
  onUpdatePreferences: (prefs: AppPreferences) => void;
  onClose: () => void;
}

type AdminTab = "general" | "theme" | "categories" | "links";

export const AdminPanel: React.FC<AdminPanelProps> = ({
  categories,
  links,
  preferences,
  activeThemeConfig,
  onUpdateCategories,
  onUpdateLinks,
  onUpdatePreferences,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("general");

  // Temporary local states for unsaved/draft values before applying
  const [siteTitle, setSiteTitle] = useState(preferences.siteTitle);
  const [siteSubtitle, setSiteSubtitle] = useState(preferences.siteSubtitle);
  const [defaultEngineId, setDefaultEngineId] = useState(preferences.defaultEngineId);
  const [searchBarEnabled, setSearchBarEnabled] = useState(preferences.searchBarEnabled);
  const [cardSize, setCardSize] = useState<CardSize>(preferences.cardSize);
  const [theme, setTheme] = useState<ThemeId>(preferences.theme);
  const [gridCols, setGridCols] = useState<GridCols>(preferences.gridCols);

  // Notifications or Save indications
  const [saveMessage, setSaveMessage] = useState("");

  // Categories editing state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatIcon, setEditingCatIcon] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Layers");

  // Links editing state
  const [linkSearchQuery, setLinkSearchQuery] = useState("");
  const [linkCategoryFilter, setLinkCategoryFilter] = useState<string>("all");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkTitle, setEditingLinkTitle] = useState("");
  const [editingLinkUrl, setEditingLinkUrl] = useState("");
  const [editingLinkDesc, setEditingLinkDesc] = useState("");
  const [editingLinkCatId, setEditingLinkCatId] = useState("");
  const [editingLinkPinned, setEditingLinkPinned] = useState(false);

  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");
  const [newLinkCatId, setNewLinkCatId] = useState(categories[0]?.id || "");
  const [newLinkPinned, setNewLinkPinned] = useState(false);

  // Theme Config wrapper colors for UI
  const themeAccent = activeThemeConfig.accentBg;
  const themeText = activeThemeConfig.accentText;
  const themeBorder = activeThemeConfig.border;
  const themeBgPage = activeThemeConfig.bgPage;

  // -------------------------------------------------------------
  // SAVE PREFERENCES ACTION
  // -------------------------------------------------------------
  const handleSavePreferences = (updatedPrefs: Partial<AppPreferences>) => {
    const newPrefs = { ...preferences, ...updatedPrefs };
    onUpdatePreferences(newPrefs);
    setSaveMessage("配置已实时保存并更新！");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  // -------------------------------------------------------------
  // CATEGORIES ACTIONS
  // -------------------------------------------------------------
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
    const newCat: Category = {
      id: "cat-" + Math.random().toString(36).substring(2, 9),
      name: newCatName.trim(),
      icon: newCatIcon,
      order: newOrder
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName("");
    setSaveMessage("新增分类成功！");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
    setEditingCatIcon(cat.icon);
  };

  const handleSaveCategory = (id: string) => {
    if (!editingCatName.trim()) return;
    const updated = categories.map(c => 
      c.id === id ? { ...c, name: editingCatName.trim(), icon: editingCatIcon } : c
    );
    onUpdateCategories(updated);
    setEditingCatId(null);
    setSaveMessage("分类已更新！");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("删除分类将会连带删除该分类下的所有书签链接，确定删除吗？")) {
      const updatedCats = categories.filter(c => c.id !== id);
      const updatedLinks = links.filter(l => l.categoryId !== id);
      onUpdateCategories(updatedCats);
      onUpdateLinks(updatedLinks);
      setSaveMessage("分类及下属书签已成功删除！");
      setTimeout(() => setSaveMessage(""), 2500);
    }
  };

  const handleMoveCategory = (id: string, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(c => c.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === "down" && index < sorted.length - 1) {
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    }
    onUpdateCategories(sorted);
  };

  // -------------------------------------------------------------
  // LINKS ACTIONS
  // -------------------------------------------------------------
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !newLinkCatId) return;
    
    let cleanUrl = newLinkUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    const newLink: LinkItem = {
      id: "link-" + Math.random().toString(36).substring(2, 9),
      categoryId: newLinkCatId,
      title: newLinkTitle.trim(),
      url: cleanUrl,
      description: newLinkDesc.trim(),
      clickCount: 0,
      isPinned: newLinkPinned
    };

    onUpdateLinks([...links, newLink]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkDesc("");
    setNewLinkPinned(false);
    setSaveMessage("新增书签成功！");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleStartEditLink = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setEditingLinkTitle(link.title);
    setEditingLinkUrl(link.url);
    setEditingLinkDesc(link.description);
    setEditingLinkCatId(link.categoryId);
    setEditingLinkPinned(!!link.isPinned);
  };

  const handleSaveLink = (id: string) => {
    if (!editingLinkTitle.trim() || !editingLinkUrl.trim() || !editingLinkCatId) return;
    
    let cleanUrl = editingLinkUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    const updated = links.map(l => 
      l.id === id ? { 
        ...l, 
        title: editingLinkTitle.trim(), 
        url: cleanUrl, 
        description: editingLinkDesc.trim(),
        categoryId: editingLinkCatId,
        isPinned: editingLinkPinned
      } : l
    );
    onUpdateLinks(updated);
    setEditingLinkId(null);
    setSaveMessage("书签链接已更新！");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm("确定要删除这个网站链接吗？")) {
      onUpdateLinks(links.filter(l => l.id !== id));
      setSaveMessage("书签已删除！");
      setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  // Filter links for Admin list view
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(linkSearchQuery.toLowerCase()) || 
                          link.url.toLowerCase().includes(linkSearchQuery.toLowerCase()) ||
                          link.description.toLowerCase().includes(linkSearchQuery.toLowerCase());
    const matchesCat = linkCategoryFilter === "all" || link.categoryId === linkCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      {/* Admin Title Banner */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5E2D9] pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${themeAccent} text-white`}>
              <Settings size={14} className="animate-spin-slow" />
            </span>
            <h2 className="font-display text-xl font-bold text-[#4A4A48]">极简后台管理中心</h2>
          </div>
          <p className="mt-1 text-xs text-[#9A9892]">
            在此全局自定义您的导航站点：修改标题、调整卡片密度尺寸、切换主题色系、高效增删改分类与网址书签。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 animate-pulse">
              {saveMessage}
            </span>
          )}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E2D9] bg-white px-4 py-2 text-xs font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] transition-all cursor-pointer shadow-xs"
          >
            <Undo size={14} />
            <span>返回主页</span>
          </button>
        </div>
      </div>

      {/* Admin Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        
        {/* Left Side Tab Selectors */}
        <div className="space-y-2 lg:col-span-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "general"
                ? `bg-white ${themeText} ${themeBorder} shadow-xs`
                : "text-[#7C7A74] hover:bg-[#F2F0E9] border-transparent"
            }`}
          >
            <Settings size={15} />
            <span>⚙️ 站点基本配置</span>
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "theme"
                ? `bg-white ${themeText} ${themeBorder} shadow-xs`
                : "text-[#7C7A74] hover:bg-[#F2F0E9] border-transparent"
            }`}
          >
            <Palette size={15} />
            <span>🎨 主题与卡片样式</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "categories"
                ? `bg-white ${themeText} ${themeBorder} shadow-xs`
                : "text-[#7C7A74] hover:bg-[#F2F0E9] border-transparent"
            }`}
          >
            <Layers size={15} />
            <span>📁 分类架构管理</span>
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "links"
                ? `bg-white ${themeText} ${themeBorder} shadow-xs`
                : "text-[#7C7A74] hover:bg-[#F2F0E9] border-transparent"
            }`}
          >
            <Link size={15} />
            <span>🔗 网址书签管理</span>
          </button>

          {/* Quick Stats Card */}
          <div className="rounded-xl border border-[#E5E2D9] bg-[#F2F0E9]/50 p-4 mt-6">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#9A9892] flex items-center gap-1">
              <Sparkles size={12} />
              <span>数据概览</span>
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-white p-2 border border-[#E5E2D9]/60">
                <div className="text-lg font-bold text-[#4A4A48]">{categories.length}</div>
                <div className="text-[10px] text-[#9A9892]">分类总数</div>
              </div>
              <div className="rounded-lg bg-white p-2 border border-[#E5E2D9]/60">
                <div className="text-lg font-bold text-[#4A4A48]">{links.length}</div>
                <div className="text-[10px] text-[#9A9892]">书签总数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Working Area */}
        <div className="rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-xs lg:col-span-3 min-h-[480px]">
          
          <AnimatePresence mode="wait">
            
            {/* 1. GENERAL SITE PREFERENCES */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#4A4A48]">站点基本配置</h3>
                  <p className="text-xs text-[#9A9892]">自定义站点名称、展示的副标题以及顶部的默认搜索设置。</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-1.5 uppercase tracking-wide">
                      网站大标题
                    </label>
                    <input
                      type="text"
                      value={siteTitle}
                      onChange={(e) => {
                        setSiteTitle(e.target.value);
                        handleSavePreferences({ siteTitle: e.target.value });
                      }}
                      placeholder="例如：清新导航页"
                      className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-xs text-[#3C3C3B] outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-1.5 uppercase tracking-wide">
                      网站副标题 / 描述
                    </label>
                    <input
                      type="text"
                      value={siteSubtitle}
                      onChange={(e) => {
                        setSiteSubtitle(e.target.value);
                        handleSavePreferences({ siteSubtitle: e.target.value });
                      }}
                      placeholder="例如：极简个人网址入口"
                      className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-xs text-[#3C3C3B] outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-1.5 uppercase tracking-wide">
                      默认搜索引擎
                    </label>
                    <select
                      value={defaultEngineId}
                      onChange={(e) => {
                        setDefaultEngineId(e.target.value);
                        handleSavePreferences({ defaultEngineId: e.target.value });
                      }}
                      className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-xs text-[#3C3C3B] outline-none transition-all focus:border-sage-500"
                    >
                      {SEARCH_ENGINES.map(engine => (
                        <option key={engine.id} value={engine.id}>
                          {engine.name} ({engine.placeholder.slice(0, 10)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-1.5 uppercase tracking-wide">
                      搜索栏展示状态
                    </label>
                    <div className="flex h-10 items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchBarEnabled}
                          onChange={(e) => {
                            setSearchBarEnabled(e.target.checked);
                            handleSavePreferences({ searchBarEnabled: e.target.checked });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
                        <span className="ml-3 text-xs font-semibold text-[#5A5A58]">
                          {searchBarEnabled ? "启用搜索栏" : "隐藏搜索栏"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-700 leading-relaxed">
                  <h4 className="font-bold flex items-center gap-1 mb-1 text-amber-800">
                    <HelpCircle size={14} />
                    <span>提示说明</span>
                  </h4>
                  上述配置已即时注入至本页面顶部的 React 状态中，并同步记录至浏览器的 <code>localStorage</code>，重刷网页依然有效。
                </div>
              </motion.div>
            )}

            {/* 2. THEME AND LAYOUT CONFIG */}
            {activeTab === "theme" && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#4A4A48]">主题色系与卡片样式</h3>
                  <p className="text-xs text-[#9A9892]">更改网站色调风格、网址卡片的尺寸密度和排列列数。</p>
                </div>

                {/* Theme Selector Presets */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#7C7A74] uppercase tracking-wide">
                    选择主题色系 (Nature-Inspired)
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {THEMES.map(t => {
                      const isActive = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            handleSavePreferences({ theme: t.id });
                          }}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                            isActive 
                              ? `border-[#5A5A58] bg-white shadow-xs` 
                              : "border-[#E5E2D9] hover:bg-[#F2F0E9] bg-[#FDFCF9]/30"
                          }`}
                        >
                          {/* Colored dot indicator */}
                          <div className={`h-6 w-6 rounded-full ${t.accentBg} flex items-center justify-center text-white border border-black/5`}>
                            {isActive && <Check size={12} />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#3C3C3B]">{t.name.split(" ")[0]}</div>
                            <div className="text-[10px] text-[#9A9892]">
                              {t.id === "sage" ? "自然护眼" : t.id === "clay" ? "复古温暖" : t.id === "wheat" ? "儒雅秋麦" : t.id === "slate" ? "海天静谧" : "浓绿深林"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Layout Density & Grid size */}
                <div className="grid grid-cols-1 gap-5 border-t border-[#F2F0E9] pt-5 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-2 uppercase tracking-wide">
                      网址卡片密度 (Size)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["small", "medium", "large"] as CardSize[]).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => {
                            setCardSize(sz);
                            handleSavePreferences({ cardSize: sz });
                          }}
                          className={`rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                            cardSize === sz
                              ? `bg-white border-[#5A5A58] ${themeText}`
                              : "border-[#E5E2D9] hover:bg-[#F2F0E9] text-[#7C7A74]"
                          }`}
                        >
                          {sz === "small" ? "紧凑 (小)" : sz === "medium" ? "默认 (中)" : "宽松 (大)"}
                        </button>
                      ))}
                    </div>
                    <span className="mt-1.5 block text-[10px] text-[#9A9892]">
                      改变书签卡片内边距、图标大小与文字的排列密度。
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7C7A74] mb-2 uppercase tracking-wide">
                      栅格展现列数
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(["auto", "2", "3", "4"] as GridCols[]).map((col) => (
                        <button
                          key={col}
                          onClick={() => {
                            setGridCols(col);
                            handleSavePreferences({ gridCols: col });
                          }}
                          className={`rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                            gridCols === col
                              ? `bg-white border-[#5A5A58] ${themeText}`
                              : "border-[#E5E2D9] hover:bg-[#F2F0E9] text-[#7C7A74]"
                          }`}
                        >
                          {col === "auto" ? "自动" : `${col}列`}
                        </button>
                      ))}
                    </div>
                    <span className="mt-1.5 block text-[10px] text-[#9A9892]">
                      强制指定大屏电脑下的网址排布列数，默认自适应排布。
                    </span>
                  </div>
                </div>

                {/* Interactive Demo Block */}
                <div className="rounded-2xl border border-[#E5E2D9] bg-[#F2F0E9]/40 p-4.5">
                  <h4 className="text-xs font-bold text-[#4A4A48] flex items-center gap-1 mb-2">
                    <SlidersHorizontal size={14} />
                    <span>卡片密度实时渲染预览:</span>
                  </h4>
                  <div className={`grid gap-4 ${
                    gridCols === "2" ? "grid-cols-2" : gridCols === "3" ? "grid-cols-3" : gridCols === "4" ? "grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                  }`}>
                    <div className={`rounded-xl border border-[#E5E2D9] bg-white transition-all ${
                      cardSize === "small" ? "p-3" : cardSize === "large" ? "p-6" : "p-4.5"
                    } hover:border-[#8C9A86] hover:shadow-xs`}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg bg-sage-500 text-white flex items-center justify-center ${
                          cardSize === "small" ? "h-8 w-8 text-xs" : cardSize === "large" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm"
                        }`}>
                          🔍
                        </div>
                        <div className="overflow-hidden">
                          <h5 className={`font-bold text-[#4A4A48] truncate ${
                            cardSize === "small" ? "text-xs" : cardSize === "large" ? "text-base" : "text-sm"
                          }`}>示例网站卡片</h5>
                          <p className={`text-[#9A9892] truncate mt-0.5 ${
                            cardSize === "small" ? "text-[10px]" : "text-xs"
                          }`}>
                            这里展示的是 {cardSize === "small" ? "紧凑" : cardSize === "large" ? "宽松" : "标准"} 卡片渲染。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CATEGORIES ARCHITECTURE */}
            {activeTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#4A4A48]">分类架构管理</h3>
                  <p className="text-xs text-[#9A9892]">定义并重新排列左侧的导航分类目录，自定义它的专属展示图标。</p>
                </div>

                {/* Add Category Form inline */}
                <form onSubmit={handleAddCategory} className="flex flex-col gap-3 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] p-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-[#7C7A74] mb-1.5 uppercase">
                      新分类名称
                    </label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="如：学习科研、游戏常用..."
                      className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none focus:border-sage-500"
                    />
                  </div>

                  <div className="w-full sm:w-44">
                    <label className="block text-[11px] font-bold text-[#7C7A74] mb-1.5 uppercase">
                      选择图标
                    </label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none"
                    >
                      {AVAILABLE_ICONS.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-sage-500 px-4 py-2 text-xs font-bold text-white hover:bg-sage-600 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>添 加</span>
                  </button>
                </form>

                {/* Categories Table/List */}
                <div className="overflow-hidden rounded-xl border border-[#E5E2D9]">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-[#F2F0E9] text-[#7C7A74] font-bold">
                      <tr>
                        <th className="px-4 py-3">排序 / 挪动</th>
                        <th className="px-4 py-3">分类图标</th>
                        <th className="px-4 py-3">分类名称</th>
                        <th className="px-4 py-3 text-right">管理操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E9]">
                      {[...categories].sort((a,b) => a.order - b.order).map((cat, index) => {
                        const isEditing = editingCatId === cat.id;
                        return (
                          <tr key={cat.id} className="hover:bg-[#FAF8F5] transition-colors">
                            {/* Reorder Buttons */}
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveCategory(cat.id, "up")}
                                  className={`rounded p-1 transition-colors border ${
                                    index === 0 
                                      ? "text-gray-200 border-transparent cursor-not-allowed" 
                                      : "text-[#7C7A74] border-[#E5E2D9] hover:bg-[#F2F0E9] cursor-pointer"
                                  }`}
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === categories.length - 1}
                                  onClick={() => handleMoveCategory(cat.id, "down")}
                                  className={`rounded p-1 transition-colors border ${
                                    index === categories.length - 1 
                                      ? "text-gray-200 border-transparent cursor-not-allowed" 
                                      : "text-[#7C7A74] border-[#E5E2D9] hover:bg-[#F2F0E9] cursor-pointer"
                                  }`}
                                >
                                  <ArrowDown size={12} />
                                </button>
                              </div>
                            </td>

                            {/* Category Icon */}
                            <td className="px-4 py-3 font-medium text-[#4A4A48]">
                              {isEditing ? (
                                <select
                                  value={editingCatIcon}
                                  onChange={(e) => setEditingCatIcon(e.target.value)}
                                  className="rounded border border-[#E5E2D9] p-1 text-xs outline-none"
                                >
                                  {AVAILABLE_ICONS.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="inline-flex items-center gap-2.5 rounded-lg bg-[#F2F0E9] px-2.5 py-1 text-[11px] font-semibold text-[#5A5A58]">
                                  <DynamicLucideIcon name={cat.icon} size={13} className="text-sage-600" />
                                  <span>{cat.icon}</span>
                                </span>
                              )}
                            </td>

                            {/* Category Name */}
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingCatName}
                                  onChange={(e) => setEditingCatName(e.target.value)}
                                  className="w-full max-w-xs rounded border border-[#E5E2D9] px-2 py-1 outline-none focus:border-sage-500"
                                />
                              ) : (
                                <span className="font-bold text-[#4A4A48]">{cat.name}</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleSaveCategory(cat.id)}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-600 cursor-pointer"
                                  >
                                    <Check size={11} /> 保存
                                  </button>
                                  <button
                                    onClick={() => setEditingCatId(null)}
                                    className="rounded-lg border border-[#E5E2D9] px-2.5 py-1 text-[10px] text-[#7C7A74] hover:bg-[#F2F0E9] cursor-pointer"
                                  >
                                    取消
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEditCategory(cat)}
                                    className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer border border-[#E5E2D9]/40"
                                    title="编辑"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="rounded-lg p-1 text-[#AAA8A2] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-[#E5E2D9]/40"
                                    title="删除分类"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 4. BOOKMARKS / LINKS MANAGEMENT */}
            {activeTab === "links" && (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-base font-bold text-[#4A4A48]">网址书签管理</h3>
                  <p className="text-xs text-[#9A9892]">在这里添加、编辑、检索、置顶或者清理您收藏的网址链接。</p>
                </div>

                {/* Inline Add Link Form */}
                <form onSubmit={handleAddLink} className="space-y-3.5 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] p-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7C7A74]">✨ 快捷录入新网站</h4>
                  
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="网站显示名称 (必填)"
                        className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none focus:border-sage-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="网站链接地址，如: react.dev (必填)"
                        className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none focus:border-sage-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <select
                        value={newLinkCatId}
                        onChange={(e) => setNewLinkCatId(e.target.value)}
                        className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={newLinkDesc}
                        onChange={(e) => setNewLinkDesc(e.target.value)}
                        placeholder="一句话介绍该网站（选填，悬停时会展示）"
                        className="w-full rounded-lg border border-[#E5E2D9] bg-white px-3 py-2 text-xs text-[#3C3C3B] outline-none focus:border-sage-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-1.5 select-none cursor-pointer text-xs text-[#5A5A58]">
                      <input
                        type="checkbox"
                        checked={newLinkPinned}
                        onChange={(e) => setNewLinkPinned(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-[#E5E2D9] text-sage-500 focus:ring-0 accent-sage-500"
                      />
                      <span>置顶至“常用推荐”推荐区域</span>
                    </label>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-sage-500 px-5 py-2 text-xs font-bold text-white hover:bg-sage-600 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>添加书签</span>
                    </button>
                  </div>
                </form>

                {/* Filter and Search actions */}
                <div className="flex flex-col justify-between gap-3 border-t border-[#F2F0E9] pt-4 sm:flex-row sm:items-center">
                  <div className="relative flex w-full max-w-sm items-center rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-3 py-1.5 text-xs">
                    <Search size={14} className="text-[#AAA8A2] mr-2" />
                    <input
                      type="text"
                      value={linkSearchQuery}
                      onChange={(e) => setLinkSearchQuery(e.target.value)}
                      placeholder="搜索书签标题、链接或描述..."
                      className="w-full bg-transparent outline-none placeholder-[#AAA8A2] text-[#3C3C3B]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#9A9892]">筛选分类:</span>
                    <select
                      value={linkCategoryFilter}
                      onChange={(e) => setLinkCategoryFilter(e.target.value)}
                      className="rounded-lg border border-[#E5E2D9] bg-white px-2 py-1 text-xs text-[#3C3C3B]"
                    >
                      <option value="all">显示全部 ({links.length})</option>
                      {categories.map(c => {
                        const count = links.filter(l => l.categoryId === c.id).length;
                        return (
                          <option key={c.id} value={c.id}>{c.name} ({count})</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Bookmarks list table */}
                <div className="overflow-hidden rounded-xl border border-[#E5E2D9] max-h-96 overflow-y-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-[#F2F0E9] text-[#7C7A74] font-bold">
                      <tr>
                        <th className="px-4 py-3">标题</th>
                        <th className="px-4 py-3">分类</th>
                        <th className="px-4 py-3">网络地址</th>
                        <th className="px-4 py-3">点击次数</th>
                        <th className="px-4 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F0E9]">
                      {filteredLinks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-[#AAA8A2]">
                            暂未搜索到符合条件的书签，换个搜索词试试吧。
                          </td>
                        </tr>
                      ) : (
                        filteredLinks.map((link) => {
                          const isEditing = editingLinkId === link.id;
                          const parentCat = categories.find(c => c.id === link.categoryId);
                          
                          return (
                            <tr key={link.id} className="hover:bg-[#FAF8F5] transition-colors">
                              {/* Title */}
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editingLinkTitle}
                                    onChange={(e) => setEditingLinkTitle(e.target.value)}
                                    className="rounded border border-[#E5E2D9] px-2 py-1 text-xs outline-none focus:border-sage-500 w-32"
                                  />
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    {link.isPinned && (
                                      <span className="rounded bg-amber-50 p-0.5 text-[9px] font-bold text-amber-600" title="常用推荐已置顶">
                                        <Pin size={10} className="rotate-45" />
                                      </span>
                                    )}
                                    <span className="font-bold text-[#4A4A48]">{link.title}</span>
                                  </div>
                                )}
                              </td>

                              {/* Category */}
                              <td className="px-4 py-3">
                                {isEditing ? (
                                  <select
                                    value={editingLinkCatId}
                                    onChange={(e) => setEditingLinkCatId(e.target.value)}
                                    className="rounded border border-[#E5E2D9] p-1 text-xs outline-none"
                                  >
                                    {categories.map(c => (
                                      <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-[11px] text-[#7C7A74] font-semibold bg-[#F2F0E9] px-2 py-0.5 rounded-md">
                                    {parentCat?.name || "未知分类"}
                                  </span>
                                )}
                              </td>

                              {/* URL / Description */}
                              <td className="px-4 py-3 max-w-xs truncate">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={editingLinkUrl}
                                      onChange={(e) => setEditingLinkUrl(e.target.value)}
                                      className="rounded border border-[#E5E2D9] px-2 py-1 text-xs outline-none focus:border-sage-500 w-full"
                                      placeholder="链接"
                                    />
                                    <input
                                      type="text"
                                      value={editingLinkDesc}
                                      onChange={(e) => setEditingLinkDesc(e.target.value)}
                                      className="rounded border border-[#E5E2D9] px-2 py-0.5 text-[10px] outline-none focus:border-sage-500 w-full"
                                      placeholder="描述"
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <div className="font-mono text-xs text-[#7C7A74] truncate" title={link.url}>{link.url}</div>
                                    {link.description && (
                                      <div className="text-[10px] text-[#AAA8A2] truncate" title={link.description}>{link.description}</div>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Visits count */}
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 text-[11px] text-[#AAA8A2]">
                                  <Eye size={12} />
                                  <span>{link.clickCount}次</span>
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3 text-right">
                                {isEditing ? (
                                  <div className="flex flex-col gap-1 items-end sm:flex-row sm:justify-end">
                                    <button
                                      onClick={() => handleSaveLink(link.id)}
                                      className="rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-emerald-600 cursor-pointer"
                                    >
                                      确认
                                    </button>
                                    <button
                                      onClick={() => setEditingLinkId(null)}
                                      className="rounded border border-[#E5E2D9] px-2 py-0.5 text-[10px] text-[#7C7A74] hover:bg-[#F2F0E9] cursor-pointer"
                                    >
                                      取消
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Inline pin toggle */}
                                    <button
                                      onClick={() => {
                                        const updated = links.map(l => l.id === link.id ? { ...l, isPinned: !l.isPinned } : l);
                                        onUpdateLinks(updated);
                                        setSaveMessage(link.isPinned ? "已取消置顶！" : "已设为置顶推荐！");
                                        setTimeout(() => setSaveMessage(""), 2000);
                                      }}
                                      className={`rounded p-1 transition-colors border border-[#E5E2D9]/40 ${
                                        link.isPinned 
                                          ? "text-amber-500 bg-amber-50" 
                                          : "text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-amber-500"
                                      } cursor-pointer`}
                                      title={link.isPinned ? "取消置顶" : "置顶至首页"}
                                    >
                                      <Pin size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleStartEditLink(link)}
                                      className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer border border-[#E5E2D9]/40"
                                      title="编辑"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLink(link.id)}
                                      className="rounded-lg p-1 text-[#AAA8A2] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer border border-[#E5E2D9]/40"
                                      title="删除"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
