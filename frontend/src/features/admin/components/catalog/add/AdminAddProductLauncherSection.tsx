import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AdminDropdown } from "@/components/admin/AdminDropdown";
import {
  LAUNCHER_CHOICES,
  PROMOTION_SECTION_OPTIONS,
  type AdminAddProductFormData,
} from "../../../types/admin-add-product.types";

export interface AdminAddProductLauncherSectionProps {
  formData: AdminAddProductFormData;
  onChange: (fields: Partial<AdminAddProductFormData>) => void;
  className?: string;
}

const ClearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
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

export function AdminAddProductLauncherSection({
  formData,
  onChange,
  className,
}: AdminAddProductLauncherSectionProps) {
  const [isUrlSaved, setIsUrlSaved] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)}>
      {/* 1. Launcher & Promotion Section Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Launcher selector */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            LAUNCHER
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {LAUNCHER_CHOICES.map((launcher) => {
              const isSelected = formData.launcher === launcher;
              return (
                <Button
                  key={launcher}
                  type="button"
                  variant={isSelected ? "active" : "inactive"}
                  size="sm"
                  onClick={() => onChange({ launcher })}
                  className="cursor-pointer"
                >
                  {launcher}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Promotion section dropdown */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold tracking-wider text-gray-400 uppercase select-none">
            PROMOTION SECTION
          </label>
          <div className="w-full">
            <AdminDropdown
              options={PROMOTION_SECTION_OPTIONS}
              selectedValue={formData.promotionSection}
              onSelect={(value) => onChange({ promotionSection: value })}
              placeholder="Pilih section"
              className="w-full"
              buttonClassName="w-full h-10 px-4 bg-[#15161D] border-deep-blue-700 text-xs sm:text-sm text-gray-300 hover:text-white justify-between rounded-lg"
              menuClassName="w-full bg-deep-blue-950 border-deep-blue-700"
            />
          </div>
        </div>
      </div>

      {/* 2. Store URL Input Card (Matching Image 3) */}
      <div className="w-full rounded-xl border border-deep-blue-700 bg-deep-blue-950 p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
        <label className="text-xs font-medium text-gray-400 select-none">
          URL Input ({formData.launcher})
        </label>

        <div className="flex items-center gap-3 w-full">
          {/* Link store input with clear button */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={formData.storeUrl}
              onChange={(e) => {
                setIsUrlSaved(false);
                onChange({ storeUrl: e.target.value });
              }}
              placeholder="Link store"
              className="w-full h-10 px-4 pr-10 bg-[#15161D] border border-deep-blue-700 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {formData.storeUrl && (
              <button
                type="button"
                onClick={() => onChange({ storeUrl: "" })}
                aria-label="Clear link store"
                className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <ClearIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Done Button */}
          <button
            type="button"
            onClick={() => setIsUrlSaved(true)}
            className={cn(
              "h-10 px-5 rounded-lg border text-xs sm:text-sm font-medium transition-all select-none cursor-pointer shrink-0",
              isUrlSaved
                ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                : "bg-[#252837] hover:bg-[#2F3347] border-deep-blue-700 text-white"
            )}
          >
            {isUrlSaved ? "Saved" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
