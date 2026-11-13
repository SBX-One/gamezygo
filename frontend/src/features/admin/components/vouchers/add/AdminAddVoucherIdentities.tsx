import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
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
  const handleTypeChange = (type: "percentage" | "fixed") => {
    if (type === formData.discountType) return;
    if (type === "percentage") {
      onChange({
        discountType: "percentage",
        discountValue: formData.discountValue.includes("IDR") ? "10%" : formData.discountValue || "10%",
      });
    } else {
      onChange({
        discountType: "fixed",
        discountValue: formData.discountValue.includes("%") ? "IDR 150,000" : formData.discountValue || "IDR 150,000",
      });
    }
  };

  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Section Title: Ag Heading/H5/Emph... · 20/120 (Figma Image 1) */}
      <h2 className="text-[20px] leading-[1.2] font-semibold text-white tracking-tight">
        Voucher Identities
      </h2>

      {/* Row 1: Voucher Name and Voucher Code (Figma Image 1: 496 Fill x 40 Hug) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voucher Name: Size Small (40px) */}
        <InputField
          size="sm"
          label="VOUCHER NAME"
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nama voucher"
          className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white min-h-10 h-10"
        />

        {/* Voucher Code: Size Small (40px) */}
        <InputField
          size="sm"
          label="VOUCHER CODE"
          type="text"
          value={formData.code}
          onChange={(e) =>
            onChange({
              code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
            })
          }
          placeholder="Kode voucher"
          className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white uppercase font-medium min-h-10 h-10"
        />
      </div>

      {/* Row 2: Discount Type (Percentage vs Fixed) & Value Input (Figma Image 2 & 3: 110 Hug x 40 min) */}
      <div className="space-y-2">
        {/* Typography: Ag Body/xs/Default · 12/140 */}
        <label className="block text-[12px] leading-[1.4] font-normal text-gray-400 uppercase tracking-wider">
          DISCOUNT TYPE
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Toggle Buttons: Percentage | Fixed (110 Hug x 40 min) */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant={formData.discountType === "percentage" ? "active" : "inactive"}
              size="sm"
              onClick={() => handleTypeChange("percentage")}
              className="w-[110px] min-h-10 h-10 justify-center text-label-sm font-semibold"
            >
              Percentage
            </Button>

            <Button
              type="button"
              variant={formData.discountType === "fixed" ? "active" : "inactive"}
              size="sm"
              onClick={() => handleTypeChange("fixed")}
              className="w-[110px] min-h-10 h-10 justify-center text-label-sm font-semibold"
            >
              Fixed
            </Button>
          </div>

          {/* Discount Value Input: Size Small (40px) */}
          <div className="flex-1 min-w-0">
            <InputField
              size="sm"
              type="text"
              value={formData.discountValue}
              onChange={(e) => onChange({ discountValue: e.target.value })}
              placeholder={
                formData.discountType === "percentage" ? "10%" : "IDR 150,000"
              }
              className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white font-medium min-h-10 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
