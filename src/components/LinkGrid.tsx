import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, Trash2, Pin, PinOff, ExternalLink, Plus, Eye, Flame } from "lucide-react";
import { Category, LinkItem } from "../types";
import { getFaviconUrl } from "../utils";
import { LucideIcon } from "./LucideIcon";

// Individual Link Card with safe image handling and hover animations
function LinkCard({
  link,
  onEdit,
  onDelete,
  onPin,
  onClicked
}: {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onClicked: () => void;
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E2D9] bg-white p-4.5 shadow-xs transition-all hover:border-sage-500 hover:shadow-md hover:shadow-sage-100"
    >
      <div className="flex items-start gap-3.5">
        {/* Favicon or Initial Avatar */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCardClick}
          className="flex-shrink-0"
        >
          {!imgError && link.url ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDFCF9] border border-[#E5E2D9] p-2 transition-transform group-hover:scale-105">
              <img
                src={getFaviconUrl(link.url)}
                alt={link.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-contain rounded"
              />
            </div>
          ) : (
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold uppercase ${getAvatarBg(link.title)}`}>
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
              className="font-display text-sm font-semibold text-[#4A4A48] hover:text-sage-600 transition-colors truncate block"
              title={link.title}
            >
              {link.title}
            </a>
            <ExternalLink size={11} className="text-[#AAA8A2] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p
            className="mt-1 text-xs text-[#9A9892] line-clamp-2 leading-relaxed"
            title={link.description || link.url}
          >
            {link.description || "暂无该网站的详细描述"}
          </p>
        </div>
      </div>

      {/* Footer statistics & Card action panel */}
      <div className="mt-3.5 flex items-center justify-between border-t border-[#F2F0E9] pt-2.5">
        {/* Visit stats */}
        <div className="flex items-center gap-2 text-[10px] font-medium text-[#9A9892]">
          <span className="flex items-center gap-0.5" title="累计访问次数">
            <Eye size={12} className="text-[#AAA8A2]" />
            <span>{link.clickCount} 次</span>
          </span>
          {link.clickCount >= 10 && (
            <span className="flex items-center gap-0.5 rounded-full bg-earth-clay/10 px-1.5 py-0.5 text-[9px] font-bold text-earth-clay">
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
                ? "text-earth-wheat hover:bg-[#F2F0E9]"
                : "text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-earth-wheat"
            }`}
            title={link.isPinned ? "取消置顶" : "置顶推荐"}
          >
            {link.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-earth-taupe transition-colors cursor-pointer"
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
            className="rounded-lg p-1 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-earth-clay transition-colors cursor-pointer"
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
  onIncrementClicks
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

  return (
    <div className="flex-1 space-y-8">
      {/* 1. PINNED RECOMMENDED HIGHLIGHTS AREA */}
      {pinnedLinks.length > 0 && activeCategoryId === "all" && !query && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-earth-wheat/10 text-earth-wheat">
              <Pin size={11} className="rotate-45" />
            </span>
            <h2 className="font-display text-sm font-bold text-[#4A4A48]">置顶推荐</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedLinks.map((link) => (
              <LinkCard
                key={`pinned-${link.id}`}
                link={link}
                onEdit={() => onEditLink(link)}
                onDelete={() => onDeleteLink(link.id)}
                onPin={() => onPinLink(link.id)}
                onClicked={() => onIncrementClicks(link.id)}
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
              className="mt-4 rounded-xl bg-sage-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sage-600 shadow-xs cursor-pointer"
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
                    className="text-[11px] font-semibold text-sage-600 hover:text-sage-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>添加网址</span>
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={() => onEditLink(link)}
                      onDelete={() => onDeleteLink(link.id)}
                      onPin={() => onPinLink(link.id)}
                      onClicked={() => onIncrementClicks(link.id)}
                    />
                  ))}

                  {/* Dashed Quick Add Card at the end of each category list */}
                  <button
                    onClick={() => onAddLinkWithCategory(cat.id)}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#E5E2D9] bg-[#FDFCF9]/50 p-4.5 hover:border-sage-300 hover:bg-sage-50/10 hover:shadow-xs transition-all text-[#AAA8A2] hover:text-sage-600 h-[104px] cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E2D9] group-hover:border-sage-200 bg-white group-hover:bg-sage-50 transition-colors">
                      <Plus size={15} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold">新增网址</div>
                      <div className="text-[10px] text-[#AAA8A2] group-hover:text-sage-600/80 mt-0.5">预填到 {cat.name}</div>
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
