import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard, AdminDropdown } from "@/components/admin";
import {
  MOCK_INCOME_SPREAD_PRODUCT_TYPE,
  MOCK_INCOME_SPREAD_PRODUCTS,
} from "../../data/admin-revenue-mock-data";
import { ADMIN_TIMEFRAMES } from "../../data/admin-mock-data";

export interface AdminIncomeSpreadCardProps {
  isEmpty?: boolean;
  className?: string;
}

export function AdminIncomeSpreadCard({
  isEmpty = false,
  className,
}: AdminIncomeSpreadCardProps) {
  const [activeTab, setActiveTab] = React.useState<"type" | "product">("type");
  const [selectedTimeframe, setSelectedTimeframe] = React.useState("this_week");

  const headerRight = (
    <AdminDropdown
      options={ADMIN_TIMEFRAMES}
      selectedValue={selectedTimeframe}
      onSelect={setSelectedTimeframe}
    />
  );

  const currentSegments =
    activeTab === "type"
      ? MOCK_INCOME_SPREAD_PRODUCT_TYPE
      : MOCK_INCOME_SPREAD_PRODUCTS;

  return (
    <AdminCard
      title="INCOME SPREAD"
      headerRight={headerRight}
      className={cn("w-full h-full", className)}
      bodyClassName="p-4 sm:p-6 flex flex-col justify-between gap-6"
    >
      {/* 1. Graphic Area (Pie Chart vs Empty State Header - Gambar 2) */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center text-center py-6 select-none">
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Tidak ada Riwayat
          </h4>
          <p className="text-xs sm:text-sm text-gray-400">
            Tidak ditemukan riwayat untuk kategori Income Spread.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center py-2">
          <svg
            viewBox="0 0 200 200"
            className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
          >
            {/* Slices of Pie Chart */}
            <path
              d="M 100 100 L 165 45 A 90 90 0 0 1 165 155 Z"
              fill="#FF5364"
              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
            />
            <path
              d="M 100 100 L 165 155 A 90 90 0 0 1 50 165 Z"
              fill="#5A232B"
              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
            />
            <path
              d="M 100 100 L 50 165 A 90 90 0 0 1 100 10 A 90 90 0 0 1 165 45 Z"
              fill="#9E3D48"
              className="transition-all duration-300 hover:opacity-90 cursor-pointer"
            />
          </svg>
        </div>
      )}

      {/* 2. Filter Switcher Pills */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("type")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none",
            activeTab === "type"
              ? "bg-[#FF5364] text-white shadow-sm shadow-[#FF5364]/30"
              : "bg-[#1E202B] text-gray-400 hover:text-white border border-deep-blue-700"
          )}
        >
          Product type
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("product")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none",
            activeTab === "product"
              ? "bg-[#FF5364] text-white shadow-sm shadow-[#FF5364]/30"
              : "bg-[#1E202B] text-gray-400 hover:text-white border border-deep-blue-700"
          )}
        >
          Product
        </button>
      </div>

      {/* 3. Breakdown Legend Cards */}
      <div className="space-y-2.5">
        {isEmpty ? (
          <>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-deep-blue-900/40 border border-deep-blue-700/60">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm bg-[#FF5364]" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Paket
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">
                -%
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-deep-blue-900/40 border border-deep-blue-700/60">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-deep-blue-700/80 bg-transparent" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Game Satuan
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">
                -%
              </span>
            </div>
          </>
        ) : (
          currentSegments.map((seg) => (
            <div
              key={seg.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-deep-blue-900/40 border border-deep-blue-700/60"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {seg.label}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">
                {seg.percentage}%
              </span>
            </div>
          ))
        )}
      </div>
    </AdminCard>
  );
}
