import * as React from "react";
import Image from "next/image";
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
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import { Pill } from "@/components/ui/Pill";
import type { AdminCatalogItem } from "../../types/admin-catalog.types";

export interface AdminCatalogTableProps {
  items: AdminCatalogItem[];
  totalGamesCount?: number;
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onToggleStatus: (id: string, active: boolean) => void;
  onAddNew?: () => void;
  onDeleteSelected?: () => void;
  onEditItem?: (item: AdminCatalogItem) => void;
  onDeleteItem?: (id: string) => void;
  onArchiveItem?: (id: string) => void;
  className?: string;
}

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
    width="18"
    height="18"
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
    width="18"
    height="18"
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

export function AdminCatalogTable({
  items,
  totalGamesCount,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectItem,
  onToggleStatus,
  onAddNew,
  onDeleteSelected,
  onEditItem,
  onDeleteItem,
  onArchiveItem,
  className,
}: AdminCatalogTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close active dropdown menu when clicking outside
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
  const displayTotal =
    items.length === 0
      ? 0
      : (totalGamesCount !== undefined ? totalGamesCount : items.length);

  const cardHeaderTitle = (
    <div className="flex items-center gap-2 select-none">
      <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
        TOTAL PRODUCT :
      </span>
      <span className="text-sm font-bold text-white">
        {displayTotal} Games Listed
      </span>
    </div>
  );

  const cardHeaderRight = (
    <div className="flex items-center gap-3">
      {/* 1. Add New Button */}
      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-xs font-medium text-white transition-colors cursor-pointer shadow-sm select-none"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Add New</span>
      </button>

      {/* 2. Delete Button (shown when items are selected or in filled state matching Image 3) */}
      {(hasSelected || items.length > 0) && (
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={!hasSelected}
          className={cn(
            "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors select-none",
            hasSelected
              ? "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 cursor-pointer"
              : "bg-[#1E202B] border-deep-blue-700 text-gray-400 opacity-60 cursor-not-allowed"
          )}
        >
          Delete
        </button>
      )}
    </div>
  );

  return (
    <AdminCard
      title={cardHeaderTitle}
      headerRight={cardHeaderRight}
      className={cn("w-full shadow-lg", className)}
      bodyClassName="p-0 overflow-x-auto"
    >
      <AdminTable>
        <AdminTableHeader>
          <tr>
            {/* Column 1: Switch spacer */}
            <AdminTableHead className="w-14 pl-6" />

            {/* Column 2: Product Name with select all checkbox */}
            <AdminTableHead className="min-w-[260px]">
              <div className="flex items-center gap-3">
                <AdminCheckbox
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  ariaLabel="Pilih Semua Produk"
                />
                <span>Product Name</span>
              </div>
            </AdminTableHead>

            {/* Column 3: Category */}
            <AdminTableHead className="min-w-[200px]">Category</AdminTableHead>

            {/* Column 4: Price */}
            <AdminTableHead className="min-w-[140px]">Price</AdminTableHead>

            {/* Column 5: Action 3-dots */}
            <AdminTableHead className="w-12 pr-6" />
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
                  className={cn(
                    isSelected && "bg-white/[0.02]"
                  )}
                >
                  {/* Column 1: Switch Active/Inactive */}
                  <AdminTableCell className="pl-6 w-14">
                    <AdminSwitch
                      checked={item.isActive}
                      onChange={(checked) => onToggleStatus(item.id, checked)}
                      ariaLabel={`Ubah status ${item.name}`}
                    />
                  </AdminTableCell>

                  {/* Column 2: Checkbox + Thumbnail + Title */}
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <AdminCheckbox
                        checked={isSelected}
                        onChange={() => onToggleSelectItem(item.id)}
                        ariaLabel={`Pilih ${item.name}`}
                      />
                      <div className="relative w-8 h-10 rounded overflow-hidden bg-[#1E202B] border border-deep-blue-700 shrink-0">
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          sizes="32px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-white text-sm">
                        {item.name}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Column 3: Category Pills (max 2 pills, overflow as +N) */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.categories.slice(0, 2).map((cat) => (
                        <Pill
                          key={cat}
                          variant="secondary"
                          size="xs"
                        >
                          {cat}
                        </Pill>
                      ))}
                      {item.categories.length > 2 && (
                        <Pill
                          variant="secondary"
                          size="xs"
                        >
                          +{item.categories.length - 2}
                        </Pill>
                      )}
                    </div>
                  </AdminTableCell>

                  {/* Column 4: Formatted Price */}
                  <AdminTableCell className="font-medium text-white text-sm">
                    {formatCurrency(item.price)}
                  </AdminTableCell>

                  {/* Column 5: 3-dots action menu */}
                  <AdminTableCell className="pr-6 relative text-right">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : item.id);
                        }}
                        aria-label="Aksi Produk"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <MoreVerticalIcon />
                      </button>

                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 top-8 z-30 min-w-[150px] rounded-2xl bg-[#13151F] border border-white/10 p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2 text-left"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onEditItem?.(item);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-2 py-1.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 text-left transition-colors cursor-pointer select-none"
                          >
                            <EditIcon className="w-[18px] h-[18px] text-white shrink-0" strokeWidth={2} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteItem?.(item.id);
                              setActiveMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-2 py-1.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 text-left transition-colors cursor-pointer select-none"
                          >
                            <TrashIcon className="w-[18px] h-[18px] text-white shrink-0" strokeWidth={2} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          ) : (
            /* EMPTY STATE ROW (Matching Image 4) */
            <tr>
              <td colSpan={5} className="py-20 px-6 text-center">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto select-none">
                  {/* Gamepad Icon container with 16px radius */}
                  <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-white/5 flex items-center justify-center text-gray-300 mb-5 shadow-inner">
                    <GamepadIcon className="w-8 h-8 text-gray-200" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight whitespace-nowrap">
                    Belum Ada Data Game
                  </h4>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-gray-400 mb-6 font-normal whitespace-nowrap">
                    Katalog toko Anda saat ini masih kosong.
                  </p>

                  {/* Action Button: + Tambah Produk */}
                  <button
                    type="button"
                    onClick={onAddNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <PlusIcon className="w-4 h-4 shrink-0" />
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
