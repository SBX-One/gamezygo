import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type {
  AdminCategoryGroup,
  CategoryScope,
} from "../../types/admin-category.types";

export interface AdminCategoryDrawerProps {
  isOpen: boolean;
  category?: AdminCategoryGroup | null;
  defaultScope?: CategoryScope;
  onClose: () => void;
  onSave: (data: {
    title: string;
    scope: CategoryScope;
    subCategories: string[];
  }) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const GripVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="5" r="1.5" fill="currentColor" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    <circle cx="9" cy="19" r="1.5" fill="currentColor" />
    <circle cx="15" cy="5" r="1.5" fill="currentColor" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

const XSmallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function AdminCategoryDrawer({
  isOpen,
  category,
  defaultScope = "article",
  onClose,
  onSave,
  className,
}: AdminCategoryDrawerProps) {
  const [title, setTitle] = React.useState("");
  const [scope, setScope] = React.useState<CategoryScope>(defaultScope);
  const [subCategories, setSubCategories] = React.useState<string[]>([""]);

  // Drag and drop state for sub-categories (matching Image 3)
  const [draggedSubIdx, setDraggedSubIdx] = React.useState<number | null>(null);
  const [dragOverSubIdx, setDragOverSubIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (category) {
      setTitle(category.title || "");
      setScope(category.scope || defaultScope);
      const names = category.subCategories.map((s) => s.name);
      setSubCategories(names.length > 0 ? names : [""]);
    } else {
      setTitle(defaultScope === "article" ? "General" : "Genre");
      setScope(defaultScope);
      setSubCategories(
        defaultScope === "article"
          ? [
              "News & Update",
              "Game Guides",
              "Review & Reccomendation",
              "Tutorials",
            ]
          : ["Action & Adventure", "RPG", "Sports & Racing", "Fighting"]
      );
    }
  }, [category, defaultScope, isOpen]);

  // Handle ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubChange = (index: number, value: string) => {
    const updated = [...subCategories];
    updated[index] = value;
    setSubCategories(updated);
  };

  const handleAddSubField = () => {
    setSubCategories([...subCategories, ""]);
  };

  const handleRemoveSubField = (index: number) => {
    if (subCategories.length <= 1) {
      setSubCategories([""]);
      return;
    }
    const updated = subCategories.filter((_, i) => i !== index);
    setSubCategories(updated);
  };

  // Drag & drop handlers for reordering / swapping sub-categories
  const handleSubDragStart = (index: number, e: React.DragEvent) => {
    setDraggedSubIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleSubDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedSubIdx !== null && draggedSubIdx !== index) {
      setDragOverSubIdx(index);
    }
  };

  const handleSubDragLeave = (index: number, e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(related)) {
      if (dragOverSubIdx === index) {
        setDragOverSubIdx(null);
      }
    }
  };

  const handleSubDrop = (targetIdx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedSubIdx === null || draggedSubIdx === targetIdx) {
      setDraggedSubIdx(null);
      setDragOverSubIdx(null);
      return;
    }

    const next = [...subCategories];
    const [moved] = next.splice(draggedSubIdx, 1);
    next.splice(targetIdx, 0, moved);
    setSubCategories(next);

    setDraggedSubIdx(null);
    setDragOverSubIdx(null);
  };

  const handleSubDragEnd = () => {
    setDraggedSubIdx(null);
    setDragOverSubIdx(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedSubs = subCategories
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      title: title.trim() || "Kategori Baru",
      scope,
      subCategories: cleanedSubs.length > 0 ? cleanedSubs : ["Sub-kategori 1"],
    });
  };

  const isEditing = Boolean(category);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[480px] max-w-[95vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 shadow-2xl flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-deep-blue-700">
          <h3
            id="category-drawer-title"
            className="text-lg sm:text-xl font-bold text-white tracking-tight"
          >
            {isEditing ? "Edit Category" : "New Category"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {/* CATEGORY TITLE */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              CATEGORY TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul kategori"
              required
              className="w-full h-11 px-4 bg-[#181A26] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* ADD SUB with Drag & Drop Reordering (Matching Image 3) */}
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              ADD SUB
            </label>

            <div className="flex flex-col gap-2.5">
              {subCategories.map((sub, idx) => {
                const isDragging = draggedSubIdx === idx;
                const isOver = dragOverSubIdx === idx;

                return (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => {
                      const target = e.target as HTMLElement;
                      // Don't drag if user is clicking input or delete button
                      if (target.tagName === "INPUT" || target.closest("button")) {
                        return;
                      }
                      handleSubDragStart(idx, e);
                    }}
                    onDragOver={(e) => handleSubDragOver(idx, e)}
                    onDragLeave={(e) => handleSubDragLeave(idx, e)}
                    onDrop={(e) => handleSubDrop(idx, e)}
                    onDragEnd={handleSubDragEnd}
                    className={cn(
                      "relative flex items-center bg-[#15161E] border border-white/10 rounded-lg px-4 py-3 gap-3 transition-all select-none group cursor-grab active:cursor-grabbing",
                      isDragging &&
                        "opacity-35 border-dashed border-indigo-500 scale-[0.99] bg-[#1a1c29]",
                      isOver &&
                        !isDragging &&
                        "border-indigo-500 bg-[#1e2235] ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20"
                    )}
                  >
                    {/* 6-dot drag icon ::: (Matching Image 3) */}
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleSubDragStart(idx, e);
                      }}
                      onDragEnd={handleSubDragEnd}
                      className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing p-1 -ml-1 rounded transition-colors shrink-0"
                      title="Tarik untuk menukar posisi sub-kategori"
                      aria-label="Tarik untuk menukar posisi"
                    >
                      <GripVerticalIcon />
                    </div>

                    {/* Sub-category Title Input (Matching Image 3) */}
                    <input
                      type="text"
                      value={sub}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onChange={(e) => handleSubChange(idx, e.target.value)}
                      placeholder="Tambah sub-kategori"
                      className="flex-1 bg-transparent text-sm font-medium text-white placeholder-gray-500 focus:outline-none cursor-text"
                    />

                    {/* Remove Icon ✕ (Matching Image 3) */}
                    <button
                      type="button"
                      draggable={false}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSubField(idx);
                      }}
                      className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Hapus sub-kategori"
                      aria-label="Hapus sub-kategori"
                    >
                      <XSmallIcon />
                    </button>
                  </div>
                );
              })}

              {/* Dashed button: [ + TAMBAH SUB ] */}
              <div
                onClick={handleAddSubField}
                className="w-full h-12 rounded-lg border border-dashed border-white/15 bg-[#181A26]/40 hover:bg-[#181A26]/70 hover:border-white/30 flex items-center justify-center gap-2 cursor-pointer transition-all text-label-xs font-semibold text-gray-400 hover:text-white uppercase tracking-wider select-none mt-1"
              >
                <PlusIcon />
                <span>TAMBAH SUB</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: [ Batalkan ] & [ Simpan ] */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="inactive"
              size="sm"
              onClick={onClose}
              className="px-5 py-2.5"
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
