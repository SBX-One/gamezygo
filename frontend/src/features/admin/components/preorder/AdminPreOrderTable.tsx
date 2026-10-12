import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import {
  PlusIcon,
  EditPencilIcon,
  TrashIcon,
  GamepadIcon,
} from "../catalog/section/AdminSectionIcons";
import type { PreOrderItem } from "../../types/admin-preorder.types";

export interface AdminPreOrderTableProps {
  items: PreOrderItem[];
  totalCount?: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onAddNew: () => void;
  onDeleteSelected: () => void;
  onEditItem?: (item: PreOrderItem) => void;
  onDeleteItem?: (id: string) => void;
  onContinueToList?: (item: PreOrderItem) => void;
  className?: string;
}

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

const ArrowRightThinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function AdminPreOrderTable({
  items,
  totalCount = 90,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectItem,
  onAddNew,
  onDeleteSelected,
  onEditItem,
  onDeleteItem,
  onContinueToList,
  className,
}: AdminPreOrderTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isAllSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  // Close 3-dots action menu on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        "rounded-2xl bg-deep-blue-950 border border-deep-blue-700 shadow-lg select-none overflow-hidden",
        className
      )}
    >
      {/* Top Header Bar (Matching Image 2 & Image 3) */}
      <div className="px-6 py-4.5 bg-deep-blue-900 border-b border-deep-blue-700 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Total Product Count */}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          TOTAL PRODUCT :{" "}
          <span className="text-gray-50 font-bold tracking-normal">
            {totalCount} Games Listed
          </span>
        </span>

        {/* Right: Actions (+ Add New & Delete Selected - Matching Image 4) */}
        <div className="flex items-center gap-3">
          {/* Add New Button (Image 4) */}
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer select-none"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>

          {/* Delete Selected Button (Image 4) */}
          <button
            type="button"
            onClick={selectedIds.length > 0 ? onDeleteSelected : undefined}
            disabled={selectedIds.length === 0}
            className={cn(
              "px-4 py-2 rounded-xl border border-white/10 text-xs sm:text-sm font-medium transition-colors select-none",
              selectedIds.length > 0
                ? "bg-white/5 hover:bg-rose-500/10 text-gray-200 hover:text-rose-300 border-white/10 hover:border-rose-500/40 cursor-pointer"
                : "bg-white/[0.02] text-gray-500 border-white/5 cursor-not-allowed"
            )}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto min-h-[380px]">
        {items.length > 0 ? (
          <table className="w-full text-left text-sm text-gray-300 border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-deep-blue-700 text-xs font-semibold text-gray-300 select-none">
                {/* Column 1: Checkbox + Product Name */}
                <th className="py-4 px-6 font-semibold w-[45%] min-w-[280px]">
                  <div className="flex items-center gap-3">
                    <AdminCheckbox
                      checked={isAllSelected}
                      onChange={onToggleSelectAll}
                      ariaLabel="Pilih Semua Produk"
                    />
                    <span>Product Name</span>
                  </div>
                </th>

                {/* Column 2: Category */}
                <th className="py-4 px-6 font-semibold w-[30%] min-w-[200px]">
                  Category
                </th>

                {/* Column 3: Price */}
                <th className="py-4 px-6 font-semibold w-[20%] min-w-[140px]">
                  Price
                </th>

                {/* Column 4: Action Menu */}
                <th className="py-4 px-6 text-right w-12" aria-label="Aksi" />
              </tr>
            </thead>

            {/* Table Body (Matching Image 3) */}
            <tbody className="divide-y divide-deep-blue-700/60">
              {items.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                const isNearBottom = idx >= Math.max(0, items.length - 2);

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "transition-colors",
                      isSelected
                        ? "bg-deep-blue-900/40 hover:bg-deep-blue-900/50"
                        : "hover:bg-deep-blue-900/25"
                    )}
                  >
                    {/* Column 1: Checkbox + Game Thumbnail + Title */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <AdminCheckbox
                          checked={isSelected}
                          onChange={() => onToggleSelectItem(item.id)}
                          ariaLabel={`Pilih ${item.title}`}
                        />
                        <button
                          type="button"
                          onClick={() => onEditItem?.(item)}
                          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
                        >
                          <div className="w-8 h-8 rounded-md overflow-hidden relative shrink-0 bg-deep-blue-900 border border-deep-blue-700/60 shadow-xs group-hover:border-indigo-400/80 transition-colors">
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              sizes="32px"
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <span className="font-semibold text-gray-100 group-hover:text-white group-hover:underline text-xs sm:text-sm whitespace-nowrap transition-colors">
                            {item.title}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Column 2: Category Pills (Action, Adventure, +2) */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.categories.slice(0, 2).map((cat) => (
                          <Pill
                            key={cat}
                            variant="secondary"
                            size="xs"
                            className="text-[11px] font-medium"
                          >
                            {cat}
                          </Pill>
                        ))}
                        {item.categories.length > 2 && (
                          <Pill
                            variant="secondary"
                            size="xs"
                            className="text-[11px] font-medium text-gray-400"
                          >
                            +{item.categories.length - 2}
                          </Pill>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Price (Rp 480.000) */}
                    <td className="py-3.5 px-6 text-gray-300 text-xs sm:text-sm font-medium">
                      {item.formattedPrice ||
                        `Rp ${item.price.toLocaleString("id-ID")}`}
                    </td>

                    {/* Column 4: 3-dots Menu Action & Dropdown (Matching Image 1 & Image 2) */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          title="Menu opsi"
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === item.id ? null : item.id
                            )
                          }
                          className={cn(
                            "p-1.5 rounded-lg transition-colors cursor-pointer",
                            activeMenuId === item.id
                              ? "text-white bg-white/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <MoreVerticalIcon className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu (Matching Image 1 & Image 2) */}
                        {activeMenuId === item.id && (
                          <div
                            ref={menuRef}
                            className={cn(
                              "absolute right-0 z-40 w-52 rounded-2xl bg-[#13151F] border border-[#2F2F37] shadow-2xl p-2 text-left animate-in fade-in zoom-in-95 duration-100 space-y-1.5 select-none",
                              idx === 0 ? "top-full mt-1.5" : "bottom-full mb-1.5"
                            )}
                          >
                            {/* 1. Continue to List (Image 1 & 2) */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onContinueToList?.(item);
                              }}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer group"
                            >
                              <span>Continue to List</span>
                              <ArrowRightThinIcon className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
                            </button>

                            {/* 2. Edit (Image 1 & 2) */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onEditItem?.(item);
                              }}
                              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                            >
                              <EditPencilIcon className="w-4 h-4 text-gray-300" />
                              <span>Edit</span>
                            </button>

                            {/* 3. Delete (Image 1 & 2) */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onDeleteItem?.(item.id);
                              }}
                              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                            >
                              <TrashIcon className="w-4 h-4 text-gray-300" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Empty State (Matching Image 4) */
          <div className="w-full">
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead>
                <tr className="border-b border-deep-blue-700 text-xs font-semibold text-gray-300 select-none">
                  <th className="py-4 px-6 font-semibold w-[45%] min-w-[280px]">
                    <div className="flex items-center gap-3">
                      <AdminCheckbox
                        checked={false}
                        disabled
                        ariaLabel="Pilih Semua Produk"
                      />
                      <span>Product Name</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 font-semibold w-[30%] min-w-[200px]">
                    Category
                  </th>
                  <th className="py-4 px-6 font-semibold w-[20%] min-w-[140px]">
                    Price
                  </th>
                  <th className="py-4 px-6 text-right w-12" aria-label="Aksi" />
                </tr>
              </thead>
            </table>

            {/* Empty State Centered Box (Matching Image 4) */}
            <div className="py-24 px-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
                <GamepadIcon className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Belum Ada Data Game
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 font-normal">
                Katalog toko Anda saat ini masih kosong.
              </p>
              <button
                type="button"
                onClick={onAddNew}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E202B] hover:bg-[#252837] border border-white/10 text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Tambah Produk</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
