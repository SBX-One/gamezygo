import * as React from "react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "./AdminSectionIcons";

export interface AdminAddSectionDashedBoxProps {
  onClick: () => void;
  className?: string;
}

export function AdminAddSectionDashedBox({
  onClick,
  className,
}: AdminAddSectionDashedBoxProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full h-32 sm:h-36 rounded-lg border-2 border-dashed border-deep-blue-700 hover:border-deep-blue-500 bg-deep-blue-950/60 hover:bg-deep-blue-900/40 transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-3 focus:outline-none focus:ring-1 focus:ring-deep-blue-500",
        className
      )}
    >
      <div className="p-3 rounded-full bg-deep-blue-900 group-hover:bg-deep-blue-800 group-hover:scale-110 transition-all text-gray-400 group-hover:text-gray-50 border border-deep-blue-700">
        <PlusIcon className="w-6 h-6" />
      </div>
      <span className="text-label-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-400 group-hover:text-gray-50 transition-colors">
        ADD NEW SECTION
      </span>
    </button>
  );
}
