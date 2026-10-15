import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminInstructionHeaderProps {
  title?: string;
  className?: string;
}

const PanelSidebarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-300"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

export function AdminInstructionHeader({
  title = "Instruksi",
  className,
}: AdminInstructionHeaderProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 px-6 py-4.5 flex items-center gap-3.5 select-none shadow-xs font-sans",
        className
      )}
    >
      <PanelSidebarIcon className="w-4.5 h-4.5 text-slate-300 shrink-0" />
      <span className="text-slate-600 font-light select-none">|</span>
      <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
        {title}
      </h1>
    </div>
  );
}
