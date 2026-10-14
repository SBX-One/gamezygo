import * as React from "react";
import { cn } from "@/lib/utils";
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
      {/* Section Title (Matching Image 4: Voucher Rules) */}
      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
        Voucher Rules
      </h2>

      {/* Field 1: Minimum Purchase Amount */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
          MINIMUM PURCHASE AMOUNT
        </label>
        <input
          type="text"
          value={formData.minPurchaseAmount}
          onChange={(e) => onChange({ minPurchaseAmount: e.target.value })}
          placeholder="IDR 200,000"
          className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Field 2: Max Usage */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
          MAX USAGE
        </label>
        <input
          type="text"
          value={formData.maxUsage}
          onChange={(e) => onChange({ maxUsage: e.target.value })}
          placeholder="Unlimited"
          className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>

      {/* Field 3: Limit Per User */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
          LIMIT PER USER
        </label>
        <input
          type="text"
          value={formData.limitPerUser}
          onChange={(e) => onChange({ limitPerUser: e.target.value })}
          placeholder="Unlimited"
          className="w-full h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
        />
      </div>
    </div>
  );
}
