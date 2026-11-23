import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminAnnouncementHeaderProps {
  title?: string;
  className?: string;
}

const PanelLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

export function AdminAnnouncementHeader({
  title = "Pengumuman",
  className,
}: AdminAnnouncementHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center w-full pb-4 border-b border-deep-blue-700/80",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <PanelLeftIcon className="w-5 h-5 text-gray-400" />
        <div className="w-[1px] h-4 bg-white/15" />
        <span className="text-sm sm:text-base font-medium text-white/90 tracking-tight">
          {title}
        </span>
      </div>
    </div>
  );
}
