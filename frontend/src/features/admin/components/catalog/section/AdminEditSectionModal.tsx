import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CloseXIcon } from "./AdminSectionIcons";
import type { ProductSection } from "../../../types/admin-section.types";

export interface AdminEditSectionModalProps {
  isOpen: boolean;
  section: ProductSection | null;
  onClose: () => void;
  onSave: (updatedSection: ProductSection) => void;
  className?: string;
}

export function AdminEditSectionModal({
  isOpen,
  section,
  onClose,
  onSave,
  className,
}: AdminEditSectionModalProps) {
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");

  React.useEffect(() => {
    if (section) {
      setTitle(section.title);
      setSlug(section.slug);
    }
  }, [section]);

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...section,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          "w-[480px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 shadow-2xl select-none animate-in zoom-in-95 duration-150 overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700 bg-deep-blue-950">
          <h3 className="text-base sm:text-lg font-bold text-gray-50 tracking-tight">
            Edit Section
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-50 hover:bg-deep-blue-900 transition-colors cursor-pointer"
          >
            <CloseXIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tawaran Khusus!"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500"
            />
          </div>

          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Slug Identifier
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tawaran-khusus"
              className="w-full px-4 py-2.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 text-gray-50 text-sm placeholder:text-gray-500 focus:outline-none focus:border-deep-blue-500 font-mono text-label-xs"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Digunakan untuk anchoring atau identifier internal API.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-deep-blue-700">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="cursor-pointer min-w-20 justify-center"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="cursor-pointer min-w-24 justify-center shadow-md"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
