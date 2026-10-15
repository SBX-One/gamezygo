import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { InstructionTemplate } from "../../types/admin-instruction.types";

export interface AdminInstructionCardProps {
  template: InstructionTemplate;
  isSelected?: boolean;
  onEdit: (template: InstructionTemplate) => void;
  onDelete: (template: InstructionTemplate) => void;
  className?: string;
}

export function AdminInstructionCard({
  template,
  isSelected = false,
  onEdit,
  onDelete,
  className,
}: AdminInstructionCardProps) {
  return (
    <div
      onClick={() => onEdit(template)}
      className={cn(
        "w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 hover:border-deep-blue-600 shadow-xs select-none font-sans cursor-pointer",
        isSelected && "border-deep-blue-500 ring-1 ring-deep-blue-500/40",
        className
      )}
    >
      {/* Left: Red Vertical Accent + Title, Badge, and Created At (Matching Gambar 2) */}
      <div className="flex items-center min-w-0">
        {/* Red accent strip */}
        <div className="w-1 h-7 rounded-sm bg-[#DF3848] shrink-0 mr-3.5" />

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
              {template.title}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#132c1e] text-[#22c55e] border border-[#22c55e]/30 shrink-0">
              {template.badge}
            </span>
          </div>

          <span className="text-xs text-gray-400 font-normal mt-0.5">
            Created at : {template.createdAt}
          </span>
        </div>
      </div>

      {/* Right: Last edit timestamp + [ Edit ] & [ Delete ] Buttons (Matching Gambar 2 & Figma specs) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-deep-blue-700/60">
        <span className="text-xs text-gray-400 font-normal mr-1">
          {template.lastEdit}
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
            className="min-w-[80px]"
          >
            Edit
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template);
            }}
            className="min-w-[80px]"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
