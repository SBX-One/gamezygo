import * as React from "react";
import { createPortal } from "react-dom";
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
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { AdminCheckbox } from "@/components/admin/AdminCheckbox";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
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
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  className?: string;
  isLoading?: boolean;
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
  currentPage,
  totalPages,
  onPageChange,
  className,
  isLoading = false,
}: AdminCatalogTableProps) {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [menuPos, setMenuPos] = React.useState<{
    top: number;
    left: number;
    openUpward: boolean;
  } | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close active dropdown menu when clicking outside or scrolling/resizing
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
        setMenuPos(null);
      }
    }
    function handleScrollOrResize() {
      setActiveMenuId(null);
      setMenuPos(null);
    }
    if (activeMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [activeMenuId]);

  const activeMenuItem = React.useMemo(
    () => (activeMenuId ? items.find((i) => i.id === activeMenuId) ?? null : null),
    [activeMenuId, items]
  );

  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));
  const hasSelected = selectedIds.length > 0;
  const displayTotal =
    items.length === 0
      ? 0
      : (totalGamesCount !== undefined ? totalGamesCount : items.length);

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
      {/* 1. Add New Button */}
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={onAddNew}
        leftIcon={<PlusIcon className="w-3.5 h-3.5" />}
        className="px-3 py-2"
      >
        <span>Add New</span>
      </Button>

      {/* 2. Delete Button (shown when items are selected or in filled state matching Image 3) */}
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
          Delete
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
            {/* Column 1: Switch spacer */}
            <AdminTableHead className="w-14 pl-6" />

            {/* Column 2: Product Name with select all checkbox */}
            <AdminTableHead className="min-w-65">
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
            <AdminTableHead className="min-w-11xl">Category</AdminTableHead>

            {/* Column 4: Price */}
            <AdminTableHead className="min-w-35">Price</AdminTableHead>

            {/* Column 5: Action 3-dots */}
            <AdminTableHead className="w-12 pr-6" />
          </tr>
        </AdminTableHeader>

        <AdminTableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <AdminTableRow key={`catalog-loading-${idx}`}>
                {/* Column 1: Switch Skeleton */}
                <AdminTableCell className="pl-6 w-14">
                  <div className="w-10 h-5 rounded-full bg-white/10 animate-pulse" />
                </AdminTableCell>

                {/* Column 2: Checkbox + Thumbnail + Title Skeleton */}
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                    <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse shrink-0" />
                    <div className="w-44 h-4 rounded bg-white/10 animate-pulse" />
                  </div>
                </AdminTableCell>

                {/* Column 3: Category Pills Skeleton */}
                <AdminTableCell>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-5 rounded-full bg-white/10 animate-pulse" />
                    <div className="w-20 h-5 rounded-full bg-white/10 animate-pulse" />
                  </div>
                </AdminTableCell>

                {/* Column 4: Price Skeleton */}
                <AdminTableCell>
                  <div className="w-24 h-4 rounded bg-white/10 animate-pulse" />
                </AdminTableCell>

                {/* Column 5: Action 3-dots Skeleton */}
                <AdminTableCell className="pr-6 text-right">
                  <div className="w-6 h-6 rounded-lg bg-white/10 animate-pulse ml-auto" />
                </AdminTableCell>
              </AdminTableRow>
            ))
          ) : items.length > 0 ? (
            items.map((item, idx) => {
              const isSelected = selectedIds.includes(item.id);
              const isMenuOpen = activeMenuId === item.id;
              const isNearBottom = items.length > 2 ? idx >= items.length - 2 : idx > 0;

              return (
                <AdminTableRow
                  key={item.id}
                  className={cn(
                    isSelected && "bg-white/2",
                    isMenuOpen && "relative z-30"
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
                      <CatalogProductThumbnail
                        src={item.imageSrc}
                        alt={item.name}
                      />
                      <span className="font-semibold text-white text-sm">
                        {item.name}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Column 3: Category Pills (max 2 pills, overflow as +N) */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.categories.slice(0, 2).map((cat, catIdx) => (
                        <Pill
                          key={`${item.id}-${cat}-${catIdx}`}
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
                          if (isMenuOpen) {
                            setActiveMenuId(null);
                            setMenuPos(null);
                            return;
                          }
                          const rect = e.currentTarget.getBoundingClientRect();
                          const menuWidth = 156;
                          const estimatedMenuHeight = 112;
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const openUpward = spaceBelow < estimatedMenuHeight + 16 && rect.top > estimatedMenuHeight;
                          setMenuPos({
                            top: openUpward ? rect.top - 6 : rect.bottom + 6,
                            left: Math.max(12, rect.right - menuWidth),
                            openUpward,
                          });
                          setActiveMenuId(item.id);
                        }}
                        aria-label="Aksi Produk"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <MoreVerticalIcon />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          ) : (
            /* EMPTY STATE ROW (Matching Image 4) */
            <tr>
              <td colSpan={5} className="py-20 px-6 text-center">
                <div className="flex flex-col items-center justify-center text-center mx-auto select-none">
                  {/* Gamepad Icon container with 16px radius */}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddNew}
                    leftIcon={<PlusIcon className="w-4 h-4 shrink-0" />}
                  >
                    <span>Tambah Produk</span>
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </AdminTableBody>
      </AdminTable>

      {typeof document !== "undefined" &&
        activeMenuItem &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              transform: menuPos.openUpward ? "translateY(-100%)" : undefined,
            }}
            className="z-9999 min-w-37.5 rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2 text-left"
          >
            <button
              type="button"
              onClick={() => {
                onEditItem?.(activeMenuItem);
                setActiveMenuId(null);
                setMenuPos(null);
              }}
              className="flex items-center gap-3 w-full px-2 py-1.5 rounded-lg text-sm font-medium text-white hover:bg-white/5 text-left transition-colors cursor-pointer select-none"
            >
              <EditIcon className="w-4.5 h-4.5 text-white shrink-0" strokeWidth={2} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteItem?.(activeMenuItem.id);
                setActiveMenuId(null);
                setMenuPos(null);
              }}
              className="flex items-center gap-3 w-full px-2 py-1.5 rounded-lg text-sm font-medium text-white hover:bg-white/5 text-left transition-colors cursor-pointer select-none"
            >
              <TrashIcon className="w-4.5 h-4.5 text-white shrink-0" strokeWidth={2} />
              <span>Delete</span>
            </button>
          </div>,
          document.body
        )}
    </AdminCard>
  );
}
