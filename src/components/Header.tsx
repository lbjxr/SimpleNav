import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Database, Keyboard, Globe, Shield, RefreshCw } from "lucide-react";
import { SearchEngine, SEARCH_ENGINES } from "../utils";
import { LucideIcon } from "./LucideIcon";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddLink: () => void;
  onAddCategory: () => void;
  onOpenBackup: () => void;
}

export function Header({
  searchQuery,
  setSearchQuery,
  onAddLink,
  onAddCategory,
  onOpenBackup
}: HeaderProps) {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on "/" keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Route search to external engine in a new tab
    const searchUrl = `${selectedEngine.url}${encodeURIComponent(searchQuery.trim())}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F2F0E9] bg-[#FDFCF9]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3.5 sm:flex-row sm:gap-2 md:px-8">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-500 text-white shadow-lg shadow-sage-500/20">
            <Globe size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-[#4A4A48] leading-none">
              清新导航页
            </h1>
            <span className="text-[10px] text-[#AAA8A2] font-medium">
              极简个人网址入口
            </span>
          </div>
        </div>

        {/* Unified Search Engine Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex w-full max-w-xl items-center rounded-2xl border border-[#E5E2D9] bg-[#F2F0E9] p-1 transition-all focus-within:border-sage-500 focus-within:bg-[#FDFCF9] focus-within:ring-4 focus-within:ring-sage-100/50"
        >
          {/* Engine Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl bg-[#FDFCF9] px-3 py-1.5 text-xs font-semibold text-[#5A5A58] shadow-xs hover:bg-[#F2F0E9] transition-all border border-[#E5E2D9]"
            >
              <LucideIcon name={selectedEngine.icon} size={14} className="text-sage-500" />
              <span>{selectedEngine.name}</span>
            </button>

            <AnimatePresence>
              {isEngineDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsEngineDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 z-50 w-36 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] p-1.5 shadow-xl"
                  >
                    {SEARCH_ENGINES.map((engine) => (
                      <button
                        key={engine.id}
                        type="button"
                        onClick={() => {
                          setSelectedEngine(engine);
                          setIsEngineDropdownOpen(false);
                          searchInputRef.current?.focus();
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          selectedEngine.id === engine.id
                            ? "bg-sage-50 text-sage-700 font-semibold"
                            : "text-[#7C7A74] hover:bg-[#F2F0E9]"
                        }`}
                      >
                        <LucideIcon name={engine.icon} size={13} className={selectedEngine.id === engine.id ? "text-sage-600" : "text-[#AAA8A2]"} />
                        <span>{engine.name}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedEngine.placeholder}
            className="w-full bg-transparent px-3 text-sm text-[#3C3C3B] placeholder-[#AAA8A2] outline-none"
          />

          {/* Shortcut hint & Clear Action */}
          <div className="flex items-center gap-1.5 pr-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
              >
                <Plus size={14} className="rotate-45" />
              </button>
            ) : (
              <span className="hidden items-center gap-0.5 rounded-md border border-[#E5E2D9] bg-[#FDFCF9] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#AAA8A2] md:flex">
                <Keyboard size={10} />
                <span>/</span>
              </span>
            )}

            <button
              type="submit"
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-sage-500 text-white shadow-md shadow-sage-500/20 hover:bg-sage-600 transition-colors"
              title="回车发起网页搜索"
            >
              <Search size={14} />
            </button>
          </div>
        </form>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Backup data */}
          <button
            onClick={onOpenBackup}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-3 py-1.5 text-xs font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] hover:text-[#3C3C3B] hover:border-[#AAA8A2] shadow-xs transition-all cursor-pointer"
            title="备份或管理我的自定义数据"
          >
            <Database size={13} />
            <span>备份配置</span>
          </button>

          {/* Add Category */}
          <button
            onClick={onAddCategory}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-3 py-1.5 text-xs font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] hover:text-[#3C3C3B] hover:border-[#AAA8A2] shadow-xs transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>新分类</span>
          </button>

          {/* Add Link */}
          <button
            onClick={onAddLink}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-sage-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-sage-600 shadow-md shadow-sage-500/20 transition-all cursor-pointer"
          >
            <Plus size={13} />
            <span>新网址</span>
          </button>
        </div>

      </div>
    </header>
  );
}
