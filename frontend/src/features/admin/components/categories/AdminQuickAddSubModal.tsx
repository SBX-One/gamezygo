import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminQuickAddSubModalProps {
  isOpen: boolean;
  categoryTitle: string;
  initialValue?: string;
  isEditing?: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
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

export function AdminQuickAddSubModal({
  isOpen,
  categoryTitle,
  initialValue = "",
  isEditing = false,
  onClose,
  onSave,
  className,
}: AdminQuickAddSubModalProps) {
  const [name, setName] = React.useState(initialValue);

  React.useEffect(() => {
    setName(initialValue);
  }, [initialValue, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-sub-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-[440px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 shadow-2xl flex flex-col animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700 mb-5">
          <h3
            id="quick-sub-title"
            className="text-lg font-bold text-white tracking-tight"
          >
            {isEditing
              ? `Edit Sub-Kategori (${categoryTitle})`
              : `Tambah Sub-Kategori ke ${categoryTitle}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              NAMA SUB-KATEGORI
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: News & Update / Action"
              required
              className="w-full h-11 px-4 bg-deep-blue-900 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
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
