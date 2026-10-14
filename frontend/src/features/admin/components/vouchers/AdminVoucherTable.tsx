import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import type { AdminVoucherItem } from "../../types/admin-voucher.types";

export interface AdminVoucherTableProps {
  items: AdminVoucherItem[];
  totalVouchersCount?: number;
  selectedIds: string[];
  isDraftViewActive?: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  onAddNew?: () => void;
  onToggleDraftView?: () => void;
  onBackFromDraft?: () => void;
  onDeleteSelected?: () => void;
  onEditItem?: (item: AdminVoucherItem) => void;
  onDeleteItem?: (id: string) => void;
  className?: string;
}

// Back Chevron Icon for Draft View (Matching Image 3)
const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// Storage/Draft Box Icon (Matching Image 2)
const DraftBoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="4" rx="1.5" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
    <line x1="10" y1="13" x2="14" y2="13" />
  </svg>
);

// Plus Icon (Matching Image 2 & Image 3)
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Vertical 3-dots Menu Icon
const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M4 6h16" />
    <path d="M5 6v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <line x1="9.5" y1="11" x2="9.5" y2="16.5" />
    <line x1="12" y1="11" x2="12" y2="16.5" />
    <line x1="14.5" y1="11" x2="14.5" y2="16.5" />
  </svg>
);

// Gamepad Icon for Empty State (Matching Image 2)
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

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function AdminVoucherTable({
  items,
  totalVouchersCount = 105,
  selectedIds,
  isDraftViewActive = false,
  onToggleSelectAll,
  onToggleSelectItem,
  onToggleStatus,
  onAddNew,
  onToggleDraftView,
  onBackFromDraft,
  onDeleteSelected,
  onEditItem,
  onDeleteItem,
  className,
}: AdminVoucherTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    }
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));
  const hasSelected = selectedIds.length > 0;
  const colSpanCount = isDraftViewActive ? 5 : 7;

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-deep-blue-950 border border-deep-blue-700 overflow-hidden shadow-sm select-none font-sans",
        className
      )}
    >
      {/* 1. Card Header */}
      {/* If Draft View (Image 3): [ < Back ] + TOTAL PRODUCT : 105 Vouchers ... [ + Add New ] */}
      {/* If Normal View (Image 2): TOTAL PRODUCT : 105 Vouchers ... [ Draft ] [ + Add New ] */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-deep-blue-700 bg-deep-blue-900">
        {/* Left Side Header */}
        <div className="flex items-center gap-3">
          {/* Back button shown in Draft View (Matching Image 3) */}
          {isDraftViewActive && (
            <button
              type="button"
              onClick={onBackFromDraft}
              className="h-8 px-3.5 rounded-xl border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-1.5 text-xs font-semibold text-white transition-colors cursor-pointer select-none"
            >
              <ChevronLeftIcon className="w-4 h-4 text-white shrink-0" />
              <span>Back</span>
            </button>
          )}

          {/* TOTAL PRODUCT : 105 Vouchers */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              TOTAL PRODUCT :
            </span>
            <span className="text-sm font-bold text-white">
              {totalVouchersCount} Vouchers
            </span>
          </div>
        </div>

        {/* Right Side Header */}
        <div className="flex items-center gap-3">
          {/* Delete Batch Button (Shown when items are selected) */}
          {hasSelected && (
            <button
              type="button"
              onClick={onDeleteSelected}
              className="h-8 px-3.5 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              <span>Hapus ({selectedIds.length})</span>
            </button>
          )}

          {/* Draft Button (Only shown in Normal View, omitted in Draft View per Image 3) */}
          {!isDraftViewActive && (
            <button
              type="button"
              onClick={onToggleDraftView}
              className="h-8 px-3.5 rounded-xl border border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer select-none"
            >
              <DraftBoxIcon className="w-4 h-4 text-white shrink-0" />
              <span>Draft</span>
            </button>
          )}

          {/* Add New Button (Matching Image 2 & Image 3) */}
          <button
            type="button"
            onClick={onAddNew}
            className="h-8 px-3.5 rounded-xl border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-2 text-xs font-semibold text-white transition-colors cursor-pointer select-none"
          >
            <PlusIcon className="w-4 h-4 text-white shrink-0" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* 2. Table Section */}
      <AdminTable>
        <AdminTableHeader>
          <tr>
            {/* Column 0: Switch Spacer */}
            <AdminTableHead className="w-14 pl-6" />

            {/* Column 1: Checkbox + Voucher Code */}
            <AdminTableHead className="min-w-56">
              <div className="flex items-center gap-3">
                <AdminCheckbox
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  ariaLabel="Pilih Semua Voucher"
                />
                <span>Voucher Code</span>
              </div>
            </AdminTableHead>

            {/* In Normal View: Usage & Reward Status are displayed (Image 2) */}
            {/* In Draft View: Usage & Reward Status are OMITTED (Image 3) */}
            {!isDraftViewActive && (
              <AdminTableHead className="min-w-28">Usage</AdminTableHead>
            )}

            {/* Value Column */}
            <AdminTableHead className="min-w-36">Value</AdminTableHead>

            {/* Reward Status (Omitted in Draft View) */}
            {!isDraftViewActive && (
              <AdminTableHead className="min-w-36">Reward Status</AdminTableHead>
            )}

            {/* Validity Period Column */}
            <AdminTableHead className="min-w-36">Validity Period</AdminTableHead>

            {/* Column Action 3-dots Header */}
            <AdminTableHead className="w-12 pr-6 text-right" aria-label="Aksi" />
          </tr>
        </AdminTableHeader>

        <AdminTableBody>
          {items.length > 0 ? (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isMenuOpen = activeMenuId === item.id;

              return (
                <AdminTableRow
                  key={item.id}
                  className={cn(isSelected && "bg-white/3")}
                >
                  {/* Column 0: Switch Active/Inactive */}
                  <AdminTableCell className="pl-6 w-14">
                    <AdminSwitch
                      checked={item.isActive}
                      onChange={(checked) => onToggleStatus(item.id, checked)}
                      ariaLabel={`Ubah status voucher ${item.code}`}
                    />
                  </AdminTableCell>

                  {/* Column 1: Checkbox + Voucher Code */}
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <AdminCheckbox
                        checked={isSelected}
                        onChange={() => onToggleSelectItem(item.id)}
                        ariaLabel={`Pilih voucher ${item.code}`}
                      />
                      <span className="font-semibold text-white text-sm tracking-wide">
                        {item.code}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Column 2: Usage (Only in Normal View) */}
                  {!isDraftViewActive && (
                    <AdminTableCell className="text-sm font-medium text-gray-300">
                      {item.usageCount}x
                    </AdminTableCell>
                  )}

                  {/* Column 3: Value */}
                  <AdminTableCell className="text-sm font-bold text-white">
                    {formatCurrency(item.discountAmount)}
                  </AdminTableCell>

                  {/* Column 4: Reward Status Badge (Only in Normal View) */}
                  {!isDraftViewActive && (
                    <AdminTableCell>
                      {item.status === "active" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#132B20] text-[#22C55E] border border-[#22C55E]/20">
                          Active
                        </span>
                      ) : item.status === "draft" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-800/30">
                          Draft
                        </span>
                      ) : item.status === "expired" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-950/40 text-rose-400 border border-rose-800/30">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-400 border border-gray-700/40">
                          Inactive
                        </span>
                      )}
                    </AdminTableCell>
                  )}

                  {/* Validity Period */}
                  <AdminTableCell className="text-sm text-gray-400 font-normal">
                    {item.validityPeriod}
                  </AdminTableCell>

                  {/* Column Action 3-dots Menu */}
                  <AdminTableCell className="pr-6 text-right">
                    <div
                      className="relative inline-block text-left"
                      ref={isMenuOpen ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuOpen ? null : item.id)
                        }
                        aria-label={`Menu opsi untuk voucher ${item.code}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <MoreVerticalIcon />
                      </button>

                      {/* Dropdown Menu Popover */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-50 w-44 rounded-xl bg-[#0F111A] border border-deep-blue-700 py-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditItem?.(item);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                          >
                            <EditIcon className="w-3.5 h-3.5" />
                            <span>Edit Voucher</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleStatus(item.id, !item.isActive);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-gray-400 inline-block" />
                            <span>
                              {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                            </span>
                          </button>
                          <div className="my-1 border-t border-deep-blue-700" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteItem?.(item.id);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                            <span>Hapus Voucher</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          ) : (
            /* Empty State Row (Matching Image 2) */
            <tr>
              <td colSpan={colSpanCount} className="py-24 px-6 text-center">
                <div className="flex flex-col items-center justify-center">
                  {/* Gamepad Icon Box (Matching Image 2) */}
                  <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
                    <GamepadIcon className="w-8 h-8 text-gray-200" />
                  </div>

                  {/* Title (Matching Image 2: Belum Ada Data Voucher) */}
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    Belum Ada Data Voucher
                  </h3>

                  {/* Description (Matching Image 2: Katalog voucher Anda saat ini masih kosong.) */}
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Katalog voucher Anda saat ini masih kosong.
                  </p>

                  {/* Button (Matching Image 2: + Tambah Voucher) */}
                  <button
                    type="button"
                    onClick={onAddNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161822] hover:bg-[#1E202B] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
                  >
                    <PlusIcon className="w-4 h-4 text-gray-300" />
                    <span>Tambah Voucher</span>
                  </button>
                </div>
              </td>
            </tr>
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
