import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminFaqAddButtonProps {
  onClick: () => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function AdminFaqAddButton({
  onClick,
  className,
}: AdminFaqAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full py-12 sm:py-14 rounded-lg border-2 border-dashed border-deep-blue-700/80 hover:border-deep-blue-500 bg-deep-blue-900/30 hover:bg-deep-blue-900/60 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 group select-none font-sans",
        className
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-deep-blue-950/80 border border-deep-blue-700/80 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:scale-105 group-hover:border-deep-blue-500 transition-all shadow-xs">
        <PlusIcon />
      </div>
      <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase group-hover:text-white transition-colors">
        ADD QUESTION
      </span>
    </button>
  );
}
