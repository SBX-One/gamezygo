import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminCommunityEmptyStateProps {
  title?: string;
  description?: string;
  onReload?: () => void;
  className?: string;
}

const WifiAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
);

const ReloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

export function AdminCommunityEmptyState({
  title = "Tidak Ada Data Komunitas",
  description = "This page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.",
  onReload,
  className,
}: AdminCommunityEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-14 select-none mx-auto w-full min-h-[380px]",
        className
      )}
    >
      {/* 1. Wifi Alert Icon inside rounded square container matching Image 4 */}
      <div className="w-16 h-16 rounded-2xl bg-[#181A26] border border-white/5 flex items-center justify-center text-gray-200 mb-5 shadow-xs">
        <WifiAlertIcon className="w-7 h-7 text-gray-200" />
      </div>

      {/* 2. Bold Title matching Image 4 */}
      <h4 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h4>

      {/* 3. Description with explicit max-w-[420px] avoiding squished column from Tailwind v4 spacing tokens */}
      <p className="text-xs sm:text-sm text-gray-400 font-normal text-center mb-6 leading-relaxed w-full max-w-[420px] mx-auto">
        {description}
      </p>

      {/* 4. Reload Button using Button variant="inactive" size="sm" as requested */}
      {onReload && (
        <Button
          variant="inactive"
          size="sm"
          onClick={onReload}
          leftIcon={<ReloadIcon className="w-4 h-4" />}
          className="border-gradient-inactive"
        >
          Reload
        </Button>
      )}
    </div>
  );
}
