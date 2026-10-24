import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminAddVoucherFormData } from "../../../types/admin-voucher.types";

export interface AdminAddVoucherIdentitiesProps {
  formData: AdminAddVoucherFormData;
  onChange: (fields: Partial<AdminAddVoucherFormData>) => void;
  className?: string;
}

export function AdminAddVoucherIdentities({
  formData,
  onChange,
  className,
}: AdminAddVoucherIdentitiesProps) {
  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Section Title (Matching Image 2: Voucher Identities) */}
      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        Voucher Identities
      </h2>

      {/* Row 1: Voucher Name and Voucher Code (Matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voucher Name */}
        <div>
          <label className="block text-label-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
            VOUCHER NAME
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Nama voucher"
            className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        {/* Voucher Code */}
        <div>
          <label className="block text-label-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
            VOUCHER CODE
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
            placeholder="Kode voucher"
            className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-lg text-sm text-white placeholder-gray-500 uppercase tracking-wider focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Discount Type (Percentage vs Fixed) & Value Input (Matching Image 2) */}
      <div>
        <label className="block text-label-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
          DISCOUNT TYPE
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Toggle Buttons: Percentage | Fixed */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onChange({ discountType: "percentage" })}
              className={cn(
                "px-5 py-2.5 rounded-lg border text-label-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none",
                formData.discountType === "percentage"
                  ? "bg-[#131520] border-white/20 text-white shadow-sm"
                  : "bg-[#0D0E16] border-deep-blue-700 text-gray-400 hover:text-white"
              )}
            >
              Percentage
            </button>

            <button
              type="button"
              onClick={() => onChange({ discountType: "fixed" })}
              className={cn(
                "px-5 py-2.5 rounded-lg border text-label-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none",
                formData.discountType === "fixed"
                  ? "bg-[#131520] border-white/20 text-white shadow-sm"
                  : "bg-[#0D0E16] border-deep-blue-700 text-gray-400 hover:text-white"
              )}
            >
              Fixed
            </button>
          </div>

          {/* Discount Value Input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={formData.discountValue}
              onChange={(e) => onChange({ discountValue: e.target.value })}
              placeholder={
                formData.discountType === "percentage" ? "10%" : "IDR 150,000"
              }
              className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-lg text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
