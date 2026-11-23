import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminHeaderProps } from "./AdminLayout.types";

/**
 * Sidebar Panel Toggle Icon (matching Image 2)
 */
const SidebarToggleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);

export function AdminHeader({
  title = "Main Dashboard",
  onToggleSidebar,
  isSidebarCollapsed,
  headerRight,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        "w-full flex items-center justify-between px-6 py-6 bg-deep-blue-950 border-b border-deep-blue-500 select-none",
        className
      )}
    >
      {/* Left: Sidebar Toggle + Divider + Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500/50"
        >
          <SidebarToggleIcon className="w-5 h-5 text-gray-300 hover:text-white" />
        </button>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-deep-blue-700" />

        {/* Page Title: Ag Body/xs/Emphasized · 12/140 (Figma Image 4) */}
        <h1 className="text-[12px] leading-[1.4] font-semibold text-white tracking-normal">
          {title}
        </h1>
      </div>

      {/* Right: Optional actions */}
      {headerRight && (
        <div className="flex items-center gap-3">
          {headerRight}
        </div>
      )}
    </header>
  );
}
