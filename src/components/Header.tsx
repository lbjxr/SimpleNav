import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Database, Keyboard, Globe, Shield, RefreshCw, Settings, Sliders } from "lucide-react";
import { SearchEngine, SEARCH_ENGINES, ThemeConfig } from "../utils";
import { LucideIcon } from "./LucideIcon";
import { AppPreferences } from "../types";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddLink: () => void;
  onAddCategory: () => void;
  onOpenBackup: () => void;
  preferences: AppPreferences;
  activeThemeConfig: ThemeConfig;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
}

export function Header({
  searchQuery,
  setSearchQuery,
  onAddLink,
  onAddCategory,
  onOpenBackup,
  preferences,
  activeThemeConfig,
  isAdminOpen,
  onToggleAdmin
}: HeaderProps) {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync default engine from preferences
  useEffect(() => {
    const defaultEngine = SEARCH_ENGINES.find((e) => e.id === preferences.defaultEngineId);
    if (defaultEngine) {
      setSelectedEngine(defaultEngine);
    }
  }, [preferences.defaultEngineId]);

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
    <header className={`sticky top-0 z-40 w-full border-b ${activeThemeConfig.border} ${activeThemeConfig.bgHeader} bg-opacity-90 backdrop-blur-md transition-all duration-300`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-3.5 sm:flex-row sm:gap-2 md:px-8">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeThemeConfig.accentBg} text-white shadow-lg ${activeThemeConfig.shadow}`}>
            <Globe size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-[#4A4A48] leading-none">
              {preferences.siteTitle}
            </h1>
            <span className="text-[10px] text-[#AAA8A2] font-semibold mt-0.5 block">
              {preferences.siteSubtitle}
            </span>
          </div>
        </div>

        {/* Unified Search Engine Bar */}
        {preferences.searchBarEnabled && (
          <form
            onSubmit={handleSearchSubmit}
            className={`relative flex w-full max-w-xl items-center rounded-2xl border ${activeThemeConfig.border} ${activeThemeConfig.bgSidebar} p-1 transition-all focus-within:border-transparent focus-within:bg-white focus-within:ring-4 focus-within:ring-[#000000]/5`}
          >
            {/* Engine Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
                className={`flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-[#5A5A58] shadow-xs hover:${activeThemeConfig.bgSidebar} transition-all border ${activeThemeConfig.border}`}
              >
                <LucideIcon name={selectedEngine.icon} size={14} className={activeThemeConfig.accentText} />
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
                      className={`absolute left-0 mt-2 z-50 w-36 rounded-xl border ${activeThemeConfig.border} bg-white p-1.5 shadow-xl`}
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
                              ? `${activeThemeConfig.accentLight} ${activeThemeConfig.accentLightText} font-semibold`
                              : `text-[#7C7A74] hover:${activeThemeConfig.bgSidebar}`
                          }`}
                        >
                          <LucideIcon name={engine.icon} size={13} className={selectedEngine.id === engine.id ? activeThemeConfig.accentText : "text-[#AAA8A2]"} />
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
                <span className={`hidden items-center gap-0.5 rounded-md border ${activeThemeConfig.border} bg-white px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#AAA8A2] md:flex`}>
                  <Keyboard size={10} />
                  <span>/</span>
                </span>
              )}

              <button
                type="submit"
                className={`flex h-7 w-7 items-center justify-center rounded-xl ${activeThemeConfig.accentBg} text-white shadow-md ${activeThemeConfig.shadow} ${activeThemeConfig.accentBgHover} transition-colors cursor-pointer`}
                title="回车发起网页搜索"
              >
                <Search size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Admin Toggle button - primary highlight */}
          <button
            onClick={onToggleAdmin}
            className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isAdminOpen 
                ? `bg-white border-transparent ${activeThemeConfig.accentText} hover:${activeThemeConfig.bgSidebar}`
                : `text-white ${activeThemeConfig.accentBg} ${activeThemeConfig.accentBgHover} ${activeThemeConfig.shadow}`
            }`}
            title="进入后台配置管理站点选项"
          >
            <Sliders size={13} />
            <span>{isAdminOpen ? "退出后台" : "后台管理"}</span>
          </button>

          {/* Backup data */}
          {!isAdminOpen && (
            <button
              onClick={onOpenBackup}
              className={`flex items-center justify-center gap-1.5 rounded-xl border ${activeThemeConfig.border} bg-white px-3 py-1.5 text-xs font-semibold text-[#5A5A58] hover:${activeThemeConfig.bgSidebar} hover:text-[#3C3C3B] hover:border-transparent shadow-xs transition-all cursor-pointer`}
              title="备份或管理我的自定义数据"
            >
              <Database size={13} />
              <span className="hidden md:inline">备份配置</span>
            </button>
          )}

          {/* Add Category */}
          {!isAdminOpen && (
            <button
              onClick={onAddCategory}
              className={`flex items-center justify-center gap-1.5 rounded-xl border ${activeThemeConfig.border} bg-white px-3 py-1.5 text-xs font-semibold text-[#5A5A58] hover:${activeThemeConfig.bgSidebar} hover:text-[#3C3C3B] hover:border-transparent shadow-xs transition-all cursor-pointer`}
            >
              <Plus size={13} />
              <span className="hidden md:inline">新分类</span>
            </button>
          )}

          {/* Add Link */}
          {!isAdminOpen && (
            <button
              onClick={onAddLink}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${activeThemeConfig.accentBg} ${activeThemeConfig.accentBgHover} ${activeThemeConfig.shadow}`}
            >
              <Plus size={13} />
              <span>新网址</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
