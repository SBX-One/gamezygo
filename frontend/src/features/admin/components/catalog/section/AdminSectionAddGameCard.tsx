import * as React from "react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "./AdminSectionIcons";

export interface AdminSectionAddGameCardProps {
  onClick: () => void;
  className?: string;
}

export function AdminSectionAddGameCard({
  onClick,
  className,
}: AdminSectionAddGameCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-3 w-[175px] sm:w-[190px] h-[245px] sm:h-[260px] shrink-0 rounded-2xl border-2 border-dashed border-deep-blue-700 hover:border-deep-blue-500 bg-deep-blue-950/60 hover:bg-deep-blue-900/40 transition-all cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-deep-blue-500",
        className
      )}
    >
      <div className="p-3 rounded-full bg-deep-blue-900 group-hover:bg-deep-blue-800 group-hover:scale-110 transition-all text-gray-400 group-hover:text-gray-50 border border-deep-blue-700">
        <PlusIcon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold tracking-wider uppercase text-gray-400 group-hover:text-gray-50 transition-colors">
        ADD GAME
      </span>
    </button>
  );
}
