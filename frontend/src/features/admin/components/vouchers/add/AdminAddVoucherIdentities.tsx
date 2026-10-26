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
  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Section Title (Matching Image 2: Voucher Identities) */}
      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        Voucher Identities
      </h2>

      {/* Row 1: Voucher Name and Voucher Code (Matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voucher Name */}
        <InputField
          label="VOUCHER NAME"
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nama voucher"
          className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white"
        />

        {/* Voucher Code */}
        <InputField
          label="VOUCHER CODE"
          type="text"
          value={formData.code}
          onChange={(e) => onChange({ code: e.target.value.toUpperCase() })}
          placeholder="Kode voucher"
          className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white uppercase tracking-wider"
        />
      </div>

      {/* Row 2: Discount Type (Percentage vs Fixed) & Value Input (Matching Image 2) */}
      <div>
        <label className="block text-body-xs font-normal text-gray-400 mb-2">
          DISCOUNT TYPE
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Toggle Buttons: Percentage | Fixed */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant={formData.discountType === "percentage" ? "active" : "inactive"}
              size="sm"
              onClick={() => onChange({ discountType: "percentage" })}
            >
              Percentage
            </Button>

            <Button
              type="button"
              variant={formData.discountType === "fixed" ? "active" : "inactive"}
              size="sm"
              onClick={() => onChange({ discountType: "fixed" })}
            >
              Fixed
            </Button>
          </div>

          {/* Discount Value Input */}
          <div className="flex-1 min-w-0">
            <InputField
              type="text"
              value={formData.discountValue}
              onChange={(e) => onChange({ discountValue: e.target.value })}
              placeholder={
                formData.discountType === "percentage" ? "10%" : "IDR 150,000"
              }
              className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
