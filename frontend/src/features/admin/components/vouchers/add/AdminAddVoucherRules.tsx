import * as React from "react";
import { cn } from "@/lib/utils";
import { InputField } from "@/components/ui/InputField";
import type { AdminAddVoucherFormData } from "../../../types/admin-voucher.types";

export interface AdminAddVoucherRulesProps {
  formData: AdminAddVoucherFormData;
  onChange: (fields: Partial<AdminAddVoucherFormData>) => void;
  className?: string;
}

export function AdminAddVoucherRules({
  formData,
  onChange,
  className,
}: AdminAddVoucherRulesProps) {
  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Section Title: Ag Heading/H5/Emph... · 20/120 (Figma Image 5: 1016 Fill x 24 Hug) */}
      <h2 className="text-[20px] leading-[1.2] font-semibold text-white tracking-tight">
        Voucher Rules
      </h2>

      {/* Field 1: Minimum Purchase Amount: Size Small (40px) */}
      <InputField
        size="sm"
        label="MINIMUM PURCHASE AMOUNT"
        type="text"
        value={formData.minPurchaseAmount}
        onChange={(e) => onChange({ minPurchaseAmount: e.target.value })}
        placeholder="IDR 200,000"
        className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white min-h-10 h-10"
      />

      {/* Field 2: Max Usage: Size Small (40px) */}
      <InputField
        size="sm"
        label="MAX USAGE"
        type="text"
        value={formData.maxUsage}
        onChange={(e) => onChange({ maxUsage: e.target.value })}
        placeholder="Unlimited"
        className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white min-h-10 h-10"
      />

      {/* Field 3: Limit Per User: Size Small (40px) */}
      <InputField
        size="sm"
        label="LIMIT PER USER"
        type="text"
        value={formData.limitPerUser}
        onChange={(e) => onChange({ limitPerUser: e.target.value })}
        placeholder="Unlimited"
        className="bg-deep-blue-900 border border-deep-blue-700 hover:border-gray-500 text-white min-h-10 h-10"
      />
    </div>
  );
}
