import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, Trash2, Pin, PinOff, ExternalLink, Plus, Eye, Flame } from "lucide-react";
import { Category, LinkItem, AppPreferences } from "../types";
import { getFaviconUrl, ThemeConfig } from "../utils";
import { LucideIcon } from "./LucideIcon";

// Individual Link Card with safe image handling, hover animations, and dynamic sizing
function LinkCard({
  link,
  onEdit,
  onDelete,
  onPin,
  onClicked,
  preferences,
  activeThemeConfig
}: {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onClicked: () => void;
  preferences: AppPreferences;
  activeThemeConfig: ThemeConfig;
  key?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    onClicked();
  };

  // Generate background color based on name for fallback avatar
  const getAvatarBg = (title: string) => {
    const code = title.charCodeAt(0) || 0;
    const colors = [
      "bg-[#CBDEC4] text-[#5C6857] border-[#B6C9AF]",
      "bg-[#E2D4C9] text-[#7A6455] border-[#D1BEB0]",
      "bg-[#D9E3E5] text-[#5C6B73] border-[#C2CFD1]",
      "bg-[#E5D7D5] text-[#8C6D68] border-[#D9C4C1]",
      "bg-[#E5DFD5] text-[#7C7467] border-[#D1C9BD]"
    ];
    return colors[code % colors.length];
  };

  // Dynamic cardSize parameters
  const cardPaddingClass = 
    preferences.cardSize === "small" ? "p-3" : 
    preferences.cardSize === "large" ? "p-6" : "p-4.5";

  const avatarSizeClass = 
    preferences.cardSize === "small" ? "h-8 w-8 p-1.5 rounded-lg" : 
    preferences.cardSize === "large" ? "h-14 w-14 p-2.5 rounded-2xl" : "h-11 w-11 p-2 rounded-xl";

  const avatarTextSizeClass = 
    preferences.cardSize === "small" ? "text-xs h-8 w-8 rounded-lg" : 
    preferences.cardSize === "large" ? "text-lg h-14 w-14 rounded-2xl" : "text-sm font-bold rounded-xl";

  const titleSizeClass = 
    preferences.cardSize === "small" ? "text-xs" : 
    preferences.cardSize === "large" ? "text-base font-bold" : "text-sm font-semibold";

  const descSizeClass = 
    preferences.cardSize === "small" ? "mt-0.5 text-[10px] line-clamp-1" : 
    preferences.cardSize === "large" ? "mt-1.5 text-xs text-[#9A9892] line-clamp-3 leading-relaxed" : "mt-1 text-xs line-clamp-2 leading-relaxed";

  const footerClass = 
    preferences.cardSize === "small" ? "mt-2 pt-1.5 border-t border-[#F2F0E9] flex items-center justify-between" : 
    preferences.cardSize === "large" ? "mt-4.5 pt-3 border-t border-[#F2F0E9] flex items-center justify-between" : "mt-3.5 pt-2.5 border-t border-[#F2F0E9] flex items-center justify-between";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white shadow-xs transition-all ${cardPaddingClass} hover:${activeThemeConfig.border} hover:${activeThemeConfig.shadow}`}
    >
      <div className="flex items-start gap-3">
        {/* Favicon or Initial Avatar */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCardClick}
          className="flex-shrink-0"
        >
          {!imgError && link.url ? (
            <div className={`flex items-center justify-center bg-[#FDFCF9] border border-[#E5E2D9] transition-transform group-hover:scale-105 ${avatarSizeClass}`}>
              <img
                src={getFaviconUrl(link.url)}
                alt={link.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-contain rounded"
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center border uppercase ${avatarTextSizeClass} ${getAvatarBg(link.title)}`}>
              {link.title.charAt(0)}
            </div>
          )}
        </a>

        {/* Site Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCardClick}
              className={`font-display text-[#4A4A48] hover:${activeThemeConfig.accentText} transition-colors truncate block`}
              title={link.title}
            >
              {link.title}
            </a>
            <ExternalLink size={11} className="text-[#AAA8A2] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p
            className={`text-[#9A9892] ${descSizeClass}`}
            title={link.description || link.url}
          >
            {link.description || "暂无该网站的详细描述"}
          </p>
        </div>
      </div>

      {/* Footer statistics & Card action panel */}
      <div className={footerClass}>
        {/* Visit stats */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-[#9A9892]">
          <span className="flex items-center gap-0.5" title="累计访问次数">
            <Eye size={12} className="text-[#AAA8A2]" />
            <span>{link.clickCount} 次</span>
          </span>
          {link.clickCount >= 10 && (
            <span className={`flex items-center gap-0.5 rounded-full ${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText} px-1.5 py-0.5 text-[9px] font-bold`}>
              <Flame size={10} />
              <span>热门</span>
            </span>
          )}
        </div>

        {/* Floating actions (Edit, Pin, Delete) */}
        <div className="flex items-center gap-1">
          {/* Pin trigger */}
          <button
            onClick={onPin}
            className={`rounded-lg p-1 transition-colors cursor-pointer ${
              link.isPinned
                ? `${activeThemeConfig.accentText} hover:bg-[#F2F0E9]`
                : `text-[#AAA8A2] hover:bg-[#F2F0E9] hover:${activeThemeConfig.accentText}`
            }`}
            title={link.isPinned ? "取消置顶" : "置顶推荐"}
          >
            {link.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer"
            title="编辑"
          >
            <Edit2 size={13} />
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              if (window.confirm(`确定要删除网址“${link.title}”吗？`)) {
                onDelete();
              }
            }}
            className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-red-500 transition-colors cursor-pointer"
            title="删除"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MAIN LINK GRID CONTAINER
// ==========================================
interface LinkGridProps {
  categories: Category[];
  links: LinkItem[];
  activeCategoryId: string;
  searchQuery: string;
  onEditLink: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onPinLink: (id: string) => void;
  onAddLinkWithCategory: (categoryId: string) => void;
  onIncrementClicks: (id: string) => void;
  preferences: AppPreferences;
  activeThemeConfig: ThemeConfig;
}

export function LinkGrid({
  categories,
  links,
  activeCategoryId,
  searchQuery,
  onEditLink,
  onDeleteLink,
  onPinLink,
  onAddLinkWithCategory,
  onIncrementClicks,
  preferences,
  activeThemeConfig
}: LinkGridProps) {
  const query = searchQuery.toLowerCase().trim();

  // Filter links based on active tab & search query
  const filteredLinks = links.filter((link) => {
    // 1. Filter by search query
    const matchesQuery =
      !query ||
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query);

    // 2. Filter by category
    const matchesCategory =
      activeCategoryId === "all" || link.categoryId === activeCategoryId;

    return matchesQuery && matchesCategory;
  });

  // Get pinned links matching current search criteria
  const pinnedLinks = filteredLinks.filter((link) => link.isPinned);

  // Group filtered links by category for structured layout
  const categoriesToRender = categories
    .filter((cat) => activeCategoryId === "all" || cat.id === activeCategoryId)
    .sort((a, b) => a.order - b.order);

  // Checks if we should display an empty illustration
  const isEmpty = filteredLinks.length === 0;

  // Grid columns class based on preferences.gridCols
  const gridLayoutClass = 
    preferences.gridCols === "2" 
      ? "grid grid-cols-1 gap-5 md:grid-cols-2" 
      : preferences.gridCols === "4" 
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
      : preferences.gridCols === "auto"
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"; // "3" (normal) default

  const quickAddCardHeight = 
    preferences.cardSize === "small" ? "h-[80px]" : 
    preferences.cardSize === "large" ? "h-[128px]" : "h-[104px]";

  return (
    <div className="flex-1 space-y-8">
      {/* 1. PINNED RECOMMENDED HIGHLIGHTS AREA */}
      {pinnedLinks.length > 0 && activeCategoryId === "all" && !query && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className={`flex h-5 w-5 items-center justify-center rounded-md ${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText}`}>
              <Pin size={11} className="rotate-45" />
            </span>
            <h2 className="font-display text-sm font-bold text-[#4A4A48]">置顶推荐</h2>
          </div>
          <div className={gridLayoutClass}>
            {pinnedLinks.map((link) => (
              <LinkCard
                key={`pinned-${link.id}`}
                link={link}
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
                onPin={() => onPinLink(link.id)}
                onClicked={() => onIncrementClicks(link.id)}
                preferences={preferences}
                activeThemeConfig={activeThemeConfig}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN CATEGORY GRIDS */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E2D9] bg-white p-12 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F0E9] text-[#AAA8A2]">
            <LucideIcon name="Search" size={24} />
          </div>
          <h3 className="mt-4 text-sm font-bold text-[#4A4A48]">没有找到相关网址</h3>
          <p className="mt-1 text-xs text-[#9A9892] max-w-xs leading-relaxed">
            {searchQuery
              ? `未匹配到包含“${searchQuery}”的网址。您可以直接在顶部选择引擎，按下回车直接去网页检索。`
              : "您当前还没有在这个分类下添加过网址。快来添加一个吧！"}
          </p>
          {!searchQuery && activeCategoryId !== "all" && (
            <button
              onClick={() => onAddLinkWithCategory(activeCategoryId)}
              className={`mt-4 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer ${activeThemeConfig.accentBg} ${activeThemeConfig.accentBgHover}`}
            >
              立即新增网址
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {categoriesToRender.map((cat) => {
            // Get links belonging to this category
            const catLinks = filteredLinks.filter((l) => l.categoryId === cat.id);

            // Skip rendering empty categories in "All" view to keep it clean, unless there's a search query
            if (activeCategoryId === "all" && catLinks.length === 0 && !query) {
              return null;
            }

            return (
              <div key={cat.id} className="space-y-3.5 scroll-mt-24" id={`cat-sec-${cat.id}`}>
                {/* Category Header Title */}
                <div className="flex items-center justify-between border-b border-[#EBE8DF] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F2F0E9] text-[#7C7A74]">
                      <LucideIcon name={cat.icon} size={13} />
                    </div>
                    <h3 className="font-display text-sm font-bold text-[#4A4A48]">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-medium text-[#AAA8A2]">
                      ({catLinks.length})
                    </span>
                  </div>

                  <button
                    onClick={() => onAddLinkWithCategory(cat.id)}
                    className={`text-[11px] font-bold ${activeThemeConfig.accentText} hover:opacity-80 flex items-center gap-0.5 cursor-pointer`}
                  >
                    <Plus size={12} />
                    <span>添加网址</span>
                  </button>
                </div>

                {/* Grid */}
                <div className={gridLayoutClass}>
                  {catLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={() => onEditLink(link)}
                      onDelete={() => onDeleteLink(link.id)}
                      onPin={() => onPinLink(link.id)}
                      onClicked={() => onIncrementClicks(link.id)}
                      preferences={preferences}
                      activeThemeConfig={activeThemeConfig}
                    />
                  ))}

                  {/* Dashed Quick Add Card at the end of each category list */}
                  <button
                    onClick={() => onAddLinkWithCategory(cat.id)}
                    className={`group flex items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#E5E2D9] bg-[#FDFCF9]/50 p-4.5 hover:border-sage-300 hover:${activeThemeConfig.accentLight} hover:shadow-xs transition-all text-[#AAA8A2] hover:${activeThemeConfig.accentText} ${quickAddCardHeight} cursor-pointer`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E2D9] group-hover:border-sage-200 bg-white group-hover:bg-white transition-colors">
                      <Plus size={15} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">新增网址</div>
                      <div className="text-[10px] text-[#AAA8A2] group-hover:opacity-90 mt-0.5">预填到 {cat.name}</div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
