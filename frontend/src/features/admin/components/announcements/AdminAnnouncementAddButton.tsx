import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminAnnouncementAddButtonProps {
  onClick: () => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export function AdminAnnouncementAddButton({
  onClick,
  className,
}: AdminAnnouncementAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border-2 border-dashed border-deep-blue-700/80 hover:border-white/25 bg-deep-blue-900/10 hover:bg-deep-blue-900/20 h-52 sm:h-60 md:h-64 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all group focus:outline-none",
        className
      )}
      aria-label="Add Announcement"
    >
      <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
      <span className="text-label-xs font-semibold text-gray-400 group-hover:text-white uppercase tracking-wider transition-colors">
        ADD ANNOUNCEMENT
      </span>
    </button>
  );
}
