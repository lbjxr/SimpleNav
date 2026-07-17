import { motion } from "motion/react";
import { Edit2, Trash2, ChevronUp, ChevronDown, Flame, Layers } from "lucide-react";
import { Category, LinkItem } from "../types";
import { LucideIcon } from "./LucideIcon";
import { ThemeConfig } from "../utils";

interface SidebarProps {
  categories: Category[];
  links: LinkItem[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onMoveCategory: (id: string, direction: "up" | "down") => void;
  onAddCategory: () => void;
  activeThemeConfig: ThemeConfig;
}

export function Sidebar({
  categories,
  links,
  activeCategory,
  setActiveCategory,
  onEditCategory,
  onDeleteCategory,
  onMoveCategory,
  onAddCategory,
  activeThemeConfig
}: SidebarProps) {
  // Helper to count links per category
  const getLinkCount = (catId: string) => {
    return links.filter((link) => link.categoryId === catId).length;
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <aside className="w-full md:w-64 md:flex-shrink-0">
      <div className="sticky top-[80px] space-y-6">
        
        {/* Category Menu card */}
        <div className={`rounded-2xl border ${activeThemeConfig.border} ${activeThemeConfig.bgSidebar} p-4 shadow-xs`}>
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#9A9892] flex items-center gap-1.5">
              <Layers size={13} />
              <span>分类导航</span>
            </h2>
            <button
              onClick={onAddCategory}
              className={`text-[11px] font-bold ${activeThemeConfig.accentText} hover:opacity-80 cursor-pointer`}
            >
              + 新增分类
            </button>
          </div>

          {/* Desktop Vertical Menu / Mobile Horizontal scroll container */}
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none md:overflow-visible">
            
            {/* "All" Option */}
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-left text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activeCategory === "all"
                  ? `bg-white text-[#5A5A58] shadow-xs border ${activeThemeConfig.border}`
                  : "text-[#7C7A74] hover:bg-white/40 hover:text-[#3C3C3B] border-transparent"
              }`}
            >
              <div className={`flex h-5 w-5 items-center justify-center rounded-md ${
                activeCategory === "all" ? `${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText}` : "bg-black/5 text-[#7C7A74]"
              }`}>
                <Layers size={12} />
              </div>
              <span className="flex-1">全部网址</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeCategory === "all" ? `${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText}` : "bg-black/5 text-[#7C7A74]"
              }`}>
                {links.length}
              </span>
            </button>

            {/* Render categories */}
            {sortedCategories.map((category, index) => {
              const isActive = activeCategory === category.id;
              const linkCount = getLinkCount(category.id);

              return (
                <div
                  key={category.id}
                  className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all text-xs font-bold whitespace-nowrap border ${
                    isActive
                      ? `bg-white text-[#5A5A58] shadow-xs border ${activeThemeConfig.border}`
                      : "text-[#7C7A74] hover:bg-white/40 hover:text-[#3C3C3B] border-transparent"
                  }`}
                >
                  {/* Select Trigger Area */}
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="flex flex-1 items-center gap-3 text-left outline-none cursor-pointer"
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors ${
                      isActive ? `${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText}` : "bg-black/5 text-[#7C7A74]"
                    }`}>
                      <LucideIcon name={category.icon} size={12} />
                    </div>
                    <span className="flex-1 truncate">{category.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                      isActive ? `${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText} font-bold` : "bg-black/5 text-[#7C7A74]"
                    }`}>
                      {linkCount}
                    </span>
                  </button>

                  {/* Hover Controls (Desktop Only) */}
                  <div className={`hidden md:flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2 bg-white p-0.5 rounded-lg border ${activeThemeConfig.border} shadow-sm`}>
                    {/* Move Up */}
                    <button
                      disabled={index === 0}
                      onClick={() => onMoveCategory(category.id, "up")}
                      className={`rounded p-0.5 transition-colors ${
                        index === 0 ? "text-neutral-300 cursor-not-allowed" : "text-[#7C7A74] hover:bg-neutral-100 hover:text-[#3C3C3B]"
                      }`}
                      title="上移"
                    >
                      <ChevronUp size={12} />
                    </button>
                    {/* Move Down */}
                    <button
                      disabled={index === sortedCategories.length - 1}
                      onClick={() => onMoveCategory(category.id, "down")}
                      className={`rounded p-0.5 transition-colors ${
                        index === sortedCategories.length - 1 ? "text-neutral-300 cursor-not-allowed" : "text-[#7C7A74] hover:bg-neutral-100 hover:text-[#3C3C3B]"
                      }`}
                      title="下移"
                    >
                      <ChevronDown size={12} />
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => onEditCategory(category)}
                      className={`rounded p-0.5 text-[#7C7A74] hover:bg-neutral-100 ${activeThemeConfig.accentText} transition-colors`}
                      title="编辑"
                    >
                      <Edit2 size={12} />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`确定要删除分类“${category.name}”吗？其下的书签链接将一并删除。`)) {
                          onDeleteCategory(category.id);
                        }
                      }}
                      className="rounded p-0.5 text-[#7C7A74] hover:bg-neutral-100 hover:text-red-600 transition-colors"
                      title="删除"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Helpful Tips Card */}
        <div className={`hidden md:block rounded-2xl border ${activeThemeConfig.border} ${activeThemeConfig.bgSidebar} p-4.5 text-xs text-[#7C7A74] space-y-2.5`}>
          <div className="font-semibold text-[#4A4A48] flex items-center gap-1.5">
            <Flame size={14} className={`${activeThemeConfig.accentText} animate-bounce`} />
            <span>极速使用指南</span>
          </div>
          <p className="leading-relaxed">
            • 快捷搜索：随时在页面按 <code className={`rounded border ${activeThemeConfig.border} bg-white px-1.5 py-0.5 text-[10px] font-semibold shadow-2xs font-mono`}>/</code> 键可瞬间聚焦搜索框。
          </p>
          <p className="leading-relaxed">
            • 回车搜索：在搜索框输入任意词汇，直接回车可在指定的外部引擎中搜索。
          </p>
          <p className="leading-relaxed">
            • 本地离线：您的分类与网址仅保存在当前浏览器缓存，可点击<b>备份配置</b>导出数据，防止换电脑或清理缓存后丢失。
          </p>
        </div>

      </div>
    </aside>
  );
}
