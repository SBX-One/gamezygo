import * as React from "react";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/image-url";
import { CatalogProductThumbnail } from "./CatalogProductThumbnail";
import { cn } from "@/lib/utils";
import { AdminCard } from "@/components/admin/AdminCard";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import type { AdminCatalogItem } from "../../types/admin-catalog.types";

export interface AdminArchivedCatalogTableProps {
  items: AdminCatalogItem[];
  totalGamesCount?: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onUnarchiveItem?: (id: string) => void;
  onUnarchiveAll?: () => void;
  onDeleteSelected?: () => void;
  onAddNew?: () => void;
  className?: string;
  isLoading?: boolean;
}

const UnarchiveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" rx="1" />
    <polyline points="10 12 7 15 10 18" />
    <path d="M7 15h6a4 4 0 0 0 4-4" />
  </svg>
);

const GamepadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="6" width="20" height="12" rx="4" />
    <path d="M6 12h4m-2-2v4" />
    <circle cx="15.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="18" cy="13" r="1" fill="currentColor" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function AdminArchivedCatalogTable({
  items,
  totalGamesCount = 90,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectItem,
  onUnarchiveItem,
  onUnarchiveAll,
  onDeleteSelected,
  onAddNew,
  className,
  isLoading = false,
}: AdminArchivedCatalogTableProps) {
  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));
  const hasSelected = selectedIds.length > 0;
  const displayTotal = totalGamesCount !== undefined ? totalGamesCount : items.length;

  const cardHeaderTitle = (
    <div className="flex items-center gap-2 select-none shrink-0 whitespace-nowrap">
      <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase whitespace-nowrap">
        TOTAL PRODUCT :
      </span>
      <span className="text-sm font-bold text-white whitespace-nowrap">
        {displayTotal} Games Listed
      </span>
    </div>
  );

  const cardHeaderRight = (
    <div className="flex items-center gap-3 shrink-0 flex-wrap">
      {/* 1. Unarchived All Button */}
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={onUnarchiveAll}
        leftIcon={<UnarchiveIcon className="w-3.5 h-3.5" />}
        className="px-3 py-2"
      >
        <span>Unarchived All</span>
      </Button>

      {/* 2. Delete All Button */}
      {(hasSelected || items.length > 0) && (
        <Button
          type="button"
          variant="inactive"
          size="xs"
          onClick={onDeleteSelected}
          disabled={!hasSelected}
          className={cn(
            "px-3 py-2",
            hasSelected &&
              "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25"
          )}
        >
          Delete All
        </Button>
      )}
    </div>
  );

  return (
    <AdminCard
      title={cardHeaderTitle}
      headerRight={cardHeaderRight}
      headerResponsive={true}
      className={cn("w-full shadow-lg", className)}
      bodyClassName="p-0 overflow-x-auto"
    >
      <AdminTable>
        <AdminTableHeader>
          <tr>
            {/* Column 1: Checkbox + Product Name */}
            <AdminTableHead className="min-w-[280px] pl-6">
              <div className="flex items-center gap-3">
                <AdminCheckbox
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  ariaLabel="Pilih Semua Produk"
                />
                <span>Product Name</span>
              </div>
            </AdminTableHead>

            {/* Column 2: Category */}
            <AdminTableHead className="min-w-[220px]">Category</AdminTableHead>

            {/* Column 3: Price */}
            <AdminTableHead className="min-w-[160px]">Price</AdminTableHead>

            {/* Column 4: Action Unarchived button */}
            <AdminTableHead className="min-w-[140px] text-right pr-6" />
          </tr>
        </AdminTableHeader>

        <AdminTableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <AdminTableRow key={`archived-loading-${idx}`}>
                <AdminTableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                    <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
                    <div className="w-36 h-4 rounded bg-white/10 animate-pulse" />
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-20 h-5 rounded-full bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="w-24 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>
                <AdminTableCell className="text-right pr-6">
                  <div className="w-24 h-7 rounded bg-white/10 animate-pulse ml-auto" />
                </AdminTableCell>
              </AdminTableRow>
            ))
          ) : items.length > 0 ? (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <AdminTableRow
                  key={item.id}
                  className={cn(isSelected && "bg-white/[0.02]")}
                >
                  {/* Column 1: Checkbox + Thumbnail + Title */}
                  <AdminTableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <AdminCheckbox
                        checked={isSelected}
                        onChange={() => onToggleSelectItem(item.id)}
                        ariaLabel={`Pilih ${item.name}`}
                      />
                      <CatalogProductThumbnail
                        src={item.imageSrc}
                        alt={item.name}
                      />
                      <span className="font-semibold text-white text-sm">
                        {item.name}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Column 2: Category Pills (max 2 pills, overflow as +N) */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.categories.slice(0, 2).map((cat, catIdx) => (
                        <Pill key={`${item.id}-${cat}-${catIdx}`} variant="secondary" size="xs">
                          {cat}
                        </Pill>
                      ))}
                      {item.categories.length > 2 && (
                        <Pill variant="secondary" size="xs">
                          +{item.categories.length - 2}
                        </Pill>
                      )}
                    </div>
                  </AdminTableCell>

                  {/* Column 3: Formatted Price */}
                  <AdminTableCell className="font-medium text-white text-sm">
                    {formatCurrency(item.price)}
                  </AdminTableCell>

                  {/* Column 4: Unarchived Action Button */}
                  <AdminTableCell className="text-right pr-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => onUnarchiveItem?.(item.id)}
                      leftIcon={<UnarchiveIcon className="w-3.5 h-3.5 text-gray-300" />}
                    >
                      <span>Unarchived</span>
                    </Button>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          ) : (
            /* EMPTY STATE ROW (Matching Image 5) */
            <tr>
              <td colSpan={4} className="py-20 px-6 text-center">
                <div className="flex flex-col items-center justify-center text-center mx-auto select-none">
                  {/* Gamepad Icon container */}
                  <div className="w-16 h-16 rounded-lg bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
                    <GamepadIcon className="w-8 h-8 text-gray-200" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight whitespace-nowrap">
                    Belum Ada Data Game
                  </h4>

                  {/* Subtitle */}
                  <p className="text-label-xs sm:text-sm text-gray-400 mb-6 font-normal whitespace-nowrap">
                    Katalog toko Anda saat ini masih kosong.
                  </p>

                  {/* Action Button: + Tambah Produk */}
                  <button
                    type="button"
                    onClick={onAddNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-label-xs sm:text-sm font-medium text-white transition-colors cursor-pointer shadow-sm select-none"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Tambah Produk</span>
                  </button>
                </div>
              </td>
            </tr>
          )}
        </AdminTableBody>
      </AdminTable>
    </AdminCard>
  );
}
