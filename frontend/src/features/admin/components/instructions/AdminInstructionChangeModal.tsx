import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { InstructionTemplate } from "../../types/admin-instruction.types";

export interface AdminInstructionChangeModalProps {
  isOpen: boolean;
  templates: InstructionTemplate[];
  activeTemplateId: string;
  onClose: () => void;
  onSelect: (template: InstructionTemplate) => void;
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

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export function AdminInstructionChangeModal({
  isOpen,
  templates,
  activeTemplateId,
  onClose,
  onSelect,
  className,
}: AdminInstructionChangeModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!isOpen) return null;

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-template-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={cn(
          "relative z-10 w-140 max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150",
          className
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-deep-blue-700">
          <h3
            id="change-template-modal-title"
            className="text-lg font-bold text-white tracking-tight"
          >
            Change Template
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full flex items-center">
          <SearchIcon className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template instruksi..."
            className="w-full h-10 pl-10 pr-4 bg-deep-blue-950 border border-deep-blue-700 rounded-lg text-label-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500"
          />
        </div>

        {/* Templates list */}
        <div className="flex flex-col gap-2.5 max-h-85 overflow-y-auto pr-1">
          {filtered.map((t) => {
            const isCurrent = t.id === activeTemplateId;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelect(t);
                  onClose();
                }}
                className={cn(
                  "p-3.5 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all",
                  isCurrent
                    ? "bg-deep-blue-900 border-deep-blue-500 ring-1 ring-deep-blue-500/40"
                    : "bg-deep-blue-950 border-deep-blue-700 hover:border-gray-500 hover:bg-deep-blue-900/40"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1 h-7 rounded-sm bg-[#DF3848] shrink-0" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {t.steps.length} Langkah • {t.createdAt}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isCurrent ? "active" : "outline"}
                  size="xs"
                >
                  {isCurrent ? "Active" : "Pilih"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
