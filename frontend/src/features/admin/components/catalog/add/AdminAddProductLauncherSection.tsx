import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AdminDropdown } from "@/components/admin/AdminDropdown";
import { useAdminSections } from "@/hooks/use-admin-sections";
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

  // Dynamically load sections from Product Section Management
  const { data: serverSections } = useAdminSections();
  const promotionOptions = React.useMemo(() => {
    if (serverSections && serverSections.length > 0) {
      const customOptions = serverSections.map((s) => ({
        label: s.title,
        value: s.title,
      }));
      return [
        { label: "Pilih section", value: "" },
        ...customOptions,
      ];
    }
    return PROMOTION_SECTION_OPTIONS;
  }, [serverSections]);

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)}>
      {/* 1. Launcher & Promotion Section Row (Berdampingan) */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full items-start relative z-20 has-[[aria-expanded='true']]:z-30">
        {/* Launcher selector (kiri, shrink-0) */}
        <div className="flex flex-col gap-2.5 shrink-0">
          <label className="text-label-xs text-gray-400 uppercase">
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

        {/* Promotion section dropdown (kanan, flex-1 membentang panjang memenuhi sisa ruang) */}
        <div className="flex flex-col gap-2.5 flex-1 w-full min-w-0">
          <label className="text-label-xs text-gray-400 uppercase">
            PROMOTION SECTION
          </label>
          <div className="w-full">
            <AdminDropdown
              options={promotionOptions}
              selectedValue={formData.promotionSection || "Pilih section"}
              onSelect={(value) => onChange({ promotionSection: value })}
              placeholder="Pilih section"
              fullWidth
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 2. Store URL Input Card (Matching Image 3) */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 sm:p-6 flex flex-col gap-3 shadow-sm">
        <label className="text-body-xs text-gray-400 select-none">
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
              className="w-full h-10 px-4 pr-10 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs sm:text-body-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
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

          {/* Done Button (Matching Image 3) */}
          <Button
          variant={"primary"}
          size={"sm"}
            disabled={!formData.storeUrl}
          
            type="button"
            onClick={() => setIsUrlSaved(true)}
            >
            {isUrlSaved ? "Saved" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}
