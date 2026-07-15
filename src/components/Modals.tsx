import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, AlertTriangle, Copy, Trash2, RefreshCw } from "lucide-react";
import { Category, LinkItem } from "../types";
import { AVAILABLE_ICONS, LucideIcon } from "./LucideIcon";
import { isValidUrl } from "../utils";

// ==========================================
// 1. CATEGORY ADD/EDIT MODAL
// ==========================================
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "order">) => void;
  categoryToEdit?: Category | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  categoryToEdit
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Flame");
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSelectedIcon(categoryToEdit.icon);
    } else {
      setName("");
      setSelectedIcon("Flame");
    }
    setError("");
  }, [categoryToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("请输入分类名称");
      return;
    }
    onSave({
      id: categoryToEdit?.id || "",
      name: name.trim(),
      icon: selectedIcon
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A4A48]/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-xl"
            id="category-modal"
          >
            <div className="flex items-center justify-between border-b border-[#F2F0E9] pb-4">
              <h3 className="font-display text-lg font-semibold text-[#4A4A48]">
                {categoryToEdit ? "编辑分类" : "新增分类"}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-2">
                  分类名称 <span className="text-earth-clay">*</span>
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="例如：开发工具, 休闲娱乐..."
                  className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-sm text-[#3C3C3B] placeholder-[#AAA8A2] outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                  autoFocus
                />
                {error && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-earth-clay">
                    <AlertTriangle size={12} /> {error}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-2">
                  选择图标
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1.5 border border-[#E5E2D9] rounded-xl bg-[#F2F0E9]">
                  {AVAILABLE_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`flex aspect-square items-center justify-center rounded-lg transition-all cursor-pointer ${
                        selectedIcon === iconName
                          ? "bg-sage-500 text-white shadow-md shadow-sage-500/20"
                          : "bg-[#FDFCF9] text-[#7C7A74] border border-[#E5E2D9] hover:border-[#AAA8A2] hover:bg-[#F2F0E9]"
                      }`}
                      title={iconName}
                    >
                      <LucideIcon name={iconName} size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#F2F0E9] pt-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#E5E2D9] px-4 py-2 text-sm font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sage-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-600 shadow-md shadow-sage-500/20 transition-colors cursor-pointer"
                >
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 2. LINK ADD/EDIT MODAL
// ==========================================
interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (link: Omit<LinkItem, "clickCount">) => void;
  linkToEdit?: LinkItem | null;
  defaultCategoryId?: string;
}

export function LinkModal({
  isOpen,
  onClose,
  categories,
  onSave,
  linkToEdit,
  defaultCategoryId
}: LinkModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setUrl(linkToEdit.url);
      setDescription(linkToEdit.description);
      setCategoryId(linkToEdit.categoryId);
      setIsPinned(!!linkToEdit.isPinned);
    } else {
      setTitle("");
      setUrl("");
      setDescription("");
      setCategoryId(defaultCategoryId || (categories[0]?.id || ""));
      setIsPinned(false);
    }
    setErrors({});
  }, [linkToEdit, isOpen, categories, defaultCategoryId]);

  // Attempt smart auto-fill based on URL
  const handleAutoFill = () => {
    if (!url.trim()) {
      setErrors((prev) => ({ ...prev, url: "请先输入网址" }));
      return;
    }

    try {
      let cleanUrl = url.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = "https://" + cleanUrl;
      }
      const parsed = new URL(cleanUrl);
      const hostParts = parsed.hostname.replace("www.", "").split(".");
      const candidateTitle = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
      
      if (!title) {
        setTitle(candidateTitle);
      }
      if (!description) {
        setDescription(`便捷访问 ${parsed.hostname}`);
      }
      setErrors((prev) => ({ ...prev, url: "" }));
    } catch (e) {
      setErrors((prev) => ({ ...prev, url: "请输入格式正确的网址" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "请输入网站名称";
    if (!url.trim()) {
      newErrors.url = "请输入网站地址";
    } else if (!isValidUrl(url)) {
      newErrors.url = "请输入有效的网址 (e.g. github.com)";
    }
    if (!categoryId) newErrors.categoryId = "请选择一个分类";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ensure protocol is stored
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    onSave({
      id: linkToEdit?.id || "",
      title: title.trim(),
      url: formattedUrl,
      description: description.trim(),
      categoryId,
      isPinned
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A4A48]/40 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-xl"
            id="link-modal"
          >
            <div className="flex items-center justify-between border-b border-[#F2F0E9] pb-4">
              <h3 className="font-display text-lg font-semibold text-[#4A4A48]">
                {linkToEdit ? "编辑网站链接" : "新增网站链接"}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-1.5">
                  网站地址 <span className="text-earth-clay">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (errors.url) setErrors((prev) => ({ ...prev, url: "" }));
                    }}
                    placeholder="例如：github.com 或 https://react.dev"
                    className="flex-1 rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-sm text-[#3C3C3B] placeholder-[#AAA8A2] outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="rounded-xl border border-[#E5E2D9] bg-[#F2F0E9] px-3 py-2 text-xs font-semibold text-[#5A5A58] hover:bg-[#E5E2D9] hover:text-[#3C3C3B] transition-colors flex items-center gap-1 cursor-pointer"
                    title="根据域名自动生成简单名称和简介"
                  >
                    <RefreshCw size={13} />
                    智能识别
                  </button>
                </div>
                {errors.url && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-earth-clay">
                    <AlertTriangle size={12} /> {errors.url}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-1.5">
                  网站名称 <span className="text-earth-clay">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="请输入书签显示的标题"
                  className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-sm text-[#3C3C3B] placeholder-[#AAA8A2] outline-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                />
                {errors.title && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-earth-clay">
                    <AlertTriangle size={12} /> {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-1.5">
                  选择分类 <span className="text-earth-clay">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: "" }));
                  }}
                  className="w-full rounded-xl border border-[#E5E2D9] px-4 py-2.5 text-sm text-[#3C3C3B] outline-none bg-[#FDFCF9] transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                >
                  <option value="" disabled>-- 请选择分类 --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-earth-clay">
                    <AlertTriangle size={12} /> {errors.categoryId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-1.5">
                  网站描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={100}
                  rows={2}
                  placeholder="选填，简要说明该网站的用途，鼠标悬停时会展示..."
                  className="w-full rounded-xl border border-[#E5E2D9] bg-[#FDFCF9] px-4 py-2.5 text-sm text-[#3C3C3B] placeholder-[#AAA8A2] outline-none resize-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E5E2D9] text-sage-500 focus:ring-sage-500/30 accent-sage-500 cursor-pointer"
                />
                <label htmlFor="isPinned" className="text-sm font-semibold text-[#5A5A58] select-none cursor-pointer">
                  置顶该链接（在置顶推荐区域展示）
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#F2F0E9] pt-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#E5E2D9] px-4 py-2 text-sm font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sage-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sage-600 shadow-md shadow-sage-500/20 transition-colors cursor-pointer"
                >
                  保存
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 3. BACKUP, EXPORT & IMPORT MODAL
// ==========================================
interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  links: LinkItem[];
  onImportData: (data: { categories: Category[]; links: LinkItem[] }) => void;
  onResetToDefault: () => void;
}

export function BackupModal({
  isOpen,
  onClose,
  categories,
  links,
  onImportData,
  onResetToDefault
}: BackupModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentConfigString = JSON.stringify({ categories, links }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentConfigString);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImport = () => {
    setError("");
    setSuccess("");
    if (!jsonText.trim()) {
      setError("请粘贴导出的 JSON 字符串");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.categories || !Array.isArray(parsed.categories)) {
        throw new Error("缺少 categories 分类数组");
      }
      if (!parsed.links || !Array.isArray(parsed.links)) {
        throw new Error("缺少 links 链接列表");
      }

      onImportData({
        categories: parsed.categories,
        links: parsed.links
      });
      setSuccess("数据导入成功！");
      setJsonText("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (e: any) {
      setError(`解析错误: ${e.message || "JSON 格式不正确"}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#4A4A48]/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E5E2D9] bg-white p-6 shadow-xl"
            id="backup-modal"
          >
            <div className="flex items-center justify-between border-b border-[#F2F0E9] pb-4">
              <h3 className="font-display text-lg font-semibold text-[#4A4A48]">
                数据备份与管理
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-[#AAA8A2] hover:bg-[#F2F0E9] hover:text-[#5A5A58] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {/* Reset Option */}
              <div className="rounded-xl border border-earth-clay/20 bg-earth-clay/5 p-4">
                <h4 className="text-sm font-bold text-earth-clay flex items-center gap-1.5">
                  <AlertTriangle size={16} /> 重置出厂设置
                </h4>
                <p className="mt-1 text-xs text-earth-clay/90 leading-relaxed">
                  还原将清空您目前做出的所有修改，恢复为最初的默认书签和分类列表。此操作不可逆，请谨慎操作。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("确定要清空全部自定义数据并恢复默认吗？")) {
                      onResetToDefault();
                      onClose();
                    }
                  }}
                  className="mt-3 rounded-lg bg-earth-clay hover:bg-[#B09590] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  确认恢复默认推荐
                </button>
              </div>

              {/* Export Panel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#7C7A74] uppercase tracking-wider">
                    备份导出配置
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs text-sage-600 font-semibold hover:text-sage-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={12} />
                    {copySuccess ? "已复制配置到剪贴板！" : "点击一键复制"}
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto rounded-lg border border-[#E5E2D9] bg-[#F2F0E9] p-2.5 font-mono text-[10px] text-[#7C7A74]">
                  {currentConfigString}
                </div>
              </div>

              {/* Import Panel */}
              <div className="border-t border-[#F2F0E9] pt-4">
                <label className="block text-xs font-semibold text-[#7C7A74] uppercase tracking-wider mb-2">
                  导入配置 JSON
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  rows={4}
                  placeholder="粘贴之前复制的导航页备份 JSON 字符串于此处..."
                  className="w-full rounded-xl border border-[#E5E2D9] p-3 font-mono text-xs text-[#3C3C3B] outline-none resize-none transition-all focus:border-sage-500 focus:ring-2 focus:ring-sage-100/50 bg-[#FDFCF9]"
                />
                
                {error && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-earth-clay">
                    <AlertTriangle size={12} /> {error}
                  </p>
                )}
                {success && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-sage-600 font-bold">
                    <Check size={12} /> {success}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleImport}
                  className="mt-2.5 w-full rounded-xl bg-[#5C6857] py-2.5 text-sm font-semibold text-white hover:bg-[#4E584A] transition-colors shadow-xs cursor-pointer"
                >
                  解析并导入我的备份
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#F2F0E9] pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#E5E2D9] px-4 py-2 text-sm font-semibold text-[#5A5A58] hover:bg-[#F2F0E9] transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
