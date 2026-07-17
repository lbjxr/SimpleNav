import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Layers, AlertCircle, Sparkles, Pin } from "lucide-react";
import { Category, LinkItem, AppPreferences } from "./types";
import { DEFAULT_CATEGORIES, DEFAULT_LINKS } from "./data";
import { generateId, THEMES, DEFAULT_PREFERENCES } from "./utils";

// Component imports
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LinkGrid } from "./components/LinkGrid";
import { AdminPanel } from "./components/AdminPanel";
import { CategoryModal, LinkModal, BackupModal } from "./components/Modals";

// Cache Keys for Browser Local Storage
const STORAGE_CATEGORIES_KEY = "nav_categories_cache";
const STORAGE_LINKS_KEY = "nav_links_cache";
const STORAGE_PREFERENCES_KEY = "nav_preferences_cache";

export default function App() {
  // -------------------------------------------------------------
  // STATE DEFINITIONS
  // -------------------------------------------------------------
  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Modal display states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);
  const [defaultLinkCategoryId, setDefaultLinkCategoryId] = useState("");

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // -------------------------------------------------------------
  // INITIALIZATION & CACHE LOAD
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Load Categories
    const cachedCats = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (cachedCats) {
      try {
        setCategories(JSON.parse(cachedCats));
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }

    // 2. Load Links
    const cachedLinks = localStorage.getItem(STORAGE_LINKS_KEY);
    if (cachedLinks) {
      try {
        setLinks(JSON.parse(cachedLinks));
      } catch (e) {
        setLinks(DEFAULT_LINKS);
      }
    } else {
      setLinks(DEFAULT_LINKS);
    }

    // 3. Load Preferences
    const cachedPrefs = localStorage.getItem(STORAGE_PREFERENCES_KEY);
    if (cachedPrefs) {
      try {
        setPreferences(JSON.parse(cachedPrefs));
      } catch (e) {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  // -------------------------------------------------------------
  // AUTOMATIC CACHE RE-SYNC
  // -------------------------------------------------------------
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
    }
  }, [links]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // -------------------------------------------------------------
  // CATEGORY ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Omit<Category, "order">) => {
    if (categoryData.id) {
      // Editing existing
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryData.id
            ? { ...c, name: categoryData.name, icon: categoryData.icon }
            : c
        )
      );
    } else {
      // Create new
      const maxOrder = categories.reduce((max, c) => (c.order > max ? c.order : max), 0);
      const newCategory: Category = {
        id: "cat-" + generateId(),
        name: categoryData.name,
        icon: categoryData.icon,
        order: maxOrder + 1
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleDeleteCategory = (id: string) => {
    // Remove the category
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Remove any links that were classified under this category
    setLinks((prev) => prev.filter((l) => l.categoryId !== id));

    // Reset active category filter to all if the deleted one was selected
    if (activeCategory === id) {
      setActiveCategory("all");
    }
  };

  // Reordering categories (swaps sorting priority order integers)
  const handleMoveCategory = (id: string, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((c) => c.id === id);
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

    setCategories(sorted);
  };

  // -------------------------------------------------------------
  // BOOKMARK LINKS ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddLink = () => {
    setLinkToEdit(null);
    setDefaultLinkCategoryId(activeCategory !== "all" ? activeCategory : "");
    setIsLinkModalOpen(true);
  };

  const handleOpenAddLinkWithCategory = (catId: string) => {
    setLinkToEdit(null);
    setDefaultLinkCategoryId(catId);
    setIsLinkModalOpen(true);
  };

  const handleOpenEditLink = (link: LinkItem) => {
    setLinkToEdit(link);
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (linkData: Omit<LinkItem, "clickCount">) => {
    if (linkData.id) {
      // Editing existing link
      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkData.id
            ? {
                ...l,
                title: linkData.title,
                url: linkData.url,
                description: linkData.description,
                categoryId: linkData.categoryId,
                isPinned: linkData.isPinned
              }
            : l
        )
      );
    } else {
      // Create new link
      const newLink: LinkItem = {
        id: "link-" + generateId(),
        categoryId: linkData.categoryId,
        title: linkData.title,
        url: linkData.url,
        description: linkData.description,
        isPinned: linkData.isPinned,
        clickCount: 0
      };
      setLinks((prev) => [...prev, newLink]);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  // Toggle bookmarked link pins
  const handlePinLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPinned: !l.isPinned } : l))
    );
  };

  // Increase visit clicks for sorting analytics
  const handleIncrementClicks = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, clickCount: l.clickCount + 1 } : l))
    );
  };

  // -------------------------------------------------------------
  // BACKUP, IMPORT & RESTORE SETTINGS
  // -------------------------------------------------------------
  const handleSavePreferences = (newPrefs: Partial<AppPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const handleImportData = (imported: { categories: Category[]; links: LinkItem[]; preferences?: AppPreferences }) => {
    // Wipe local cache first
    localStorage.removeItem(STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(STORAGE_LINKS_KEY);
    localStorage.removeItem(STORAGE_PREFERENCES_KEY);

    // Save and load
    setCategories(imported.categories);
    setLinks(imported.links);
    if (imported.preferences) {
      setPreferences(imported.preferences);
      localStorage.setItem(STORAGE_PREFERENCES_KEY, JSON.stringify(imported.preferences));
    }
    
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(imported.categories));
    localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(imported.links));
  };

  const handleResetToDefault = () => {
    localStorage.removeItem(STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(STORAGE_LINKS_KEY);
    localStorage.removeItem(STORAGE_PREFERENCES_KEY);
    setCategories(DEFAULT_CATEGORIES);
    setLinks(DEFAULT_LINKS);
    setPreferences(DEFAULT_PREFERENCES);
    setIsAdminOpen(false);
  };

  // Determine active theme configuration values
  const activeThemeConfig = THEMES.find((t) => t.id === preferences.theme) || THEMES[0];

  // -------------------------------------------------------------
  // RENDER COMPONENT
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen flex flex-col ${activeThemeConfig.bgPage} transition-colors duration-300`}>
      
      {/* 1. Header with integrated fast-search bar and preferences support */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddLink={handleOpenAddLink}
        onAddCategory={handleOpenAddCategory}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        preferences={preferences}
        activeThemeConfig={activeThemeConfig}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
      />

      {/* 2. Main Layout - Conditional render with beautiful transitions */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">
        <AnimatePresence mode="wait">
          {isAdminOpen ? (
            <motion.div
              key="admin-settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AdminPanel
                preferences={preferences}
                activeThemeConfig={activeThemeConfig}
                onUpdatePreferences={handleSavePreferences}
                categories={categories}
                links={links}
                onUpdateCategories={setCategories}
                onUpdateLinks={setLinks}
                onClose={() => setIsAdminOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 md:flex-row"
            >
              {/* Categories Sidebar navigation panel */}
              <Sidebar
                categories={categories}
                links={links}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onEditCategory={handleOpenEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onMoveCategory={handleMoveCategory}
                onAddCategory={handleOpenAddCategory}
                activeThemeConfig={activeThemeConfig}
              />

              {/* Bookmarks link container */}
              <LinkGrid
                categories={categories}
                links={links}
                activeCategoryId={activeCategory}
                searchQuery={searchQuery}
                onEditLink={handleOpenEditLink}
                onDeleteLink={handleDeleteLink}
                onPinLink={handlePinLink}
                onAddLinkWithCategory={handleOpenAddLinkWithCategory}
                onIncrementClicks={handleIncrementClicks}
                preferences={preferences}
                activeThemeConfig={activeThemeConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Footer credit block styled with the current theme */}
      <footer className={`border-t ${activeThemeConfig.border} bg-[#F2F0E9]/30 py-6 mt-12 text-center text-xs text-[#AAA8A2] font-semibold`}>
        <p className="flex items-center justify-center gap-1.5">
          <span>© 2026 {preferences.siteTitle}</span>
          <span className="text-[#E5E2D9]">|</span>
          <span className="flex items-center gap-0.5 text-sage-600">
            <Sparkles size={11} className={activeThemeConfig.accentText} />
            <span className={activeThemeConfig.accentText}>无后台零侵入设计</span>
          </span>
          <span className="text-[#E5E2D9]">|</span>
          <span>纯本地浏览器缓存存储</span>
        </p>
      </footer>

      {/* -------------------------------------------------------------
          MODALS & OVERLAYS PORTALS
         ------------------------------------------------------------- */}
      
      {/* Category Editor Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      {/* Bookmark Editor Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        categories={categories}
        onSave={handleSaveLink}
        linkToEdit={linkToEdit}
        defaultCategoryId={defaultLinkCategoryId}
      />

      {/* Backup, Import and Reset Settings Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        categories={categories}
        links={links}
        onImportData={handleImportData}
        onResetToDefault={handleResetToDefault}
      />

    </div>
  );
}
