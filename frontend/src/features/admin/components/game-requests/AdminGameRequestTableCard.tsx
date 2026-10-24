import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AdminCheckbox,
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminButton,
  AdminEmptyState,
} from "@/components/admin";
import { SteamIcon, PinIcon, PinOffIcon } from "./AdminGameRequestIcons";
import type { AdminGameRequestItem } from "../../types/admin-game-request.types";

export interface AdminGameRequestTableCardProps {
  sectionTitle: string;
  totalLabel: string;
  totalCount: number;
  items: AdminGameRequestItem[];
  selectedIds: string[];
  tabType?: "requested" | "accepted" | "declined";
  onToggleSelectAll: () => void;
  onToggleSelectItem: (id: string) => void;
  onPinToggle?: (id: string) => void;
  onAcceptItem?: (item: AdminGameRequestItem) => void;
  onDeclineItem?: (item: AdminGameRequestItem) => void;
  onAddProduct?: (item: AdminGameRequestItem) => void;
  onCancelItem?: (item: AdminGameRequestItem) => void;
  onAcceptAll?: () => void;
  onDeclineAll?: () => void;
  emptyDescription?: string;
  showCardHeaderActions?: boolean;
  className?: string;
}

function getEmptyDescription(sectionTitle: string): string {
  const lower = sectionTitle.toLowerCase();
  if (lower.includes("pinned")) {
    return "Anda belum menyematkan permintaan game apapun.";
  }
  if (lower.includes("requested")) {
    return "Belum ada riwayat permintaan game dari customer.";
  }
  if (lower.includes("accepted")) {
    return "Anda belum menyetujui permintaan game apapun.";
  }
  if (lower.includes("declined")) {
    return "Anda belum menolak permintaan game apapun.";
  }
  return "Tidak ditemukan data game pada bagian ini.";
}

export function AdminGameRequestTableCard({
  sectionTitle,
  totalLabel,
  totalCount,
  items,
  selectedIds,
  tabType,
  onToggleSelectAll,
  onToggleSelectItem,
  onPinToggle,
  onAcceptItem,
  onDeclineItem,
  onAddProduct,
  onCancelItem,
  onAcceptAll,
  onDeclineAll,
  emptyDescription,
  showCardHeaderActions = true,
  className,
}: AdminGameRequestTableCardProps) {
  const currentTab =
    tabType ||
    (sectionTitle.toLowerCase().includes("accepted")
      ? "accepted"
      : sectionTitle.toLowerCase().includes("declined")
      ? "declined"
      : "requested");

  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  // Determine pill badge color based on request count (Matches Image 3 & Image 4)
  const renderRequestBadge = (count: number) => {
    if (count >= 100) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-label-xs font-semibold bg-[#2a141b] text-rose-400 border border-rose-800/40">
          {count} Request
        </span>
      );
    }

    if (count >= 20) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-label-xs font-semibold bg-[#2a1d13] text-amber-400 border border-amber-700/40">
          {count} Request
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-label-xs font-semibold bg-[#0f291e] text-green-400 border border-green-800/40">
        {count} Request
      </span>
    );
  };

  return (
    <div className={cn("w-full space-y-3 font-sans select-none", className)}>
      {/* 1. Section Title above the Card (Matching Image 3 & Image 4) */}
      <h2 className="text-base sm:text-lg font-bold text-white tracking-normal">
        {sectionTitle}
      </h2>

      {/* 2. Main Card Container (Figma Dark Card with 16px radius) */}
      <div className="w-full rounded-lg bg-deep-blue-950 border border-deep-blue-700 overflow-hidden shadow-sm">
        {/* Card Header: TOTAL PRODUCT : count + Accept All & Decline All */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-3.5 sm:py-4.5 border-b border-deep-blue-700 bg-deep-blue-900">
          <div className="flex items-center gap-2 select-none shrink-0 whitespace-nowrap">
            <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase whitespace-nowrap">
              TOTAL PRODUCT :
            </span>
            <span className="text-label-xs font-semibold text-white whitespace-nowrap">
              {totalCount} {totalLabel}
            </span>
          </div>

          {showCardHeaderActions && (onAcceptAll || onDeclineAll) && (
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {onAcceptAll && (
                <AdminButton
                  variant="dark"
                  size="sm"
                  onClick={onAcceptAll}
                  disabled={items.length === 0}
                  className="border-white/10 bg-[#161823] hover:bg-[#1E202E]"
                >
                  Accept All
                </AdminButton>
              )}
              {onDeclineAll && (
                <AdminButton
                  variant="dark"
                  size="sm"
                  onClick={onDeclineAll}
                  disabled={items.length === 0}
                  className="border-white/10 bg-[#161823] hover:bg-[#1E202E]"
                >
                  Decline All
                </AdminButton>
              )}
            </div>
          )}
        </div>

        {/* Table Content using existing AdminTable components */}
        <AdminTable>
          <AdminTableHeader>
            <tr>
              {/* Column 1: Checkbox + Product Name */}
              <AdminTableHead className="py-4 pl-6 pr-4 w-70 sm:w-80">
                <div className="flex items-center gap-3">
                  <AdminCheckbox
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    ariaLabel={`Pilih Semua ${sectionTitle}`}
                  />
                  <span>Product Name</span>
                </div>
              </AdminTableHead>

              {/* Column 2: Request */}
              <AdminTableHead className="py-4 px-4 w-40">Request</AdminTableHead>

              {/* Column 3: First Request */}
              <AdminTableHead className="py-4 px-4 w-52">First Request</AdminTableHead>

              {/* Column 4: Actions (Pin, Steam, Accept, Decline) */}
              <AdminTableHead className="py-4 pr-6 pl-4 text-right" />
            </tr>
          </AdminTableHeader>

          <AdminTableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <AdminTableRow
                    key={item.id}
                    className={cn(
                      isSelected && "bg-white/3"
                    )}
                  >
                    {/* Column 1: Checkbox + Game Name */}
                    <AdminTableCell className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <AdminCheckbox
                          checked={isSelected}
                          onChange={() => onToggleSelectItem(item.id)}
                          ariaLabel={`Pilih ${item.name}`}
                        />
                        <span className="font-semibold text-white text-sm">
                          {item.name}
                        </span>
                      </div>
                    </AdminTableCell>

                    {/* Column 2: Request Badge (124 / 20 / 5 Request) */}
                    <AdminTableCell className="py-4 px-4">
                      {renderRequestBadge(item.requestCount)}
                    </AdminTableCell>

                    {/* Column 3: First Request Date & Time */}
                    <AdminTableCell className="py-4 px-4 text-label-xs text-white font-mono">
                      {item.firstRequest}
                    </AdminTableCell>

                    {/* Column 4: Action Buttons (Pin, View on Steam, Accept, Decline) */}
                    <AdminTableCell className="py-4 pr-6 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. If Accepted (Matching Gambar 1): View on Steam + Add Product + Cancel */}
                        {currentTab === "accepted" ? (
                          <>
                            {/* View on Steam Button */}
                            <a
                              href={
                                item.steamUrl ||
                                `https://store.steampowered.com/search/?term=${encodeURIComponent(
                                  item.name
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 px-3.5 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-2 text-label-xs font-semibold text-white transition-colors cursor-pointer select-none"
                            >
                              <SteamIcon className="w-4 h-4 text-white shrink-0" />
                              <span>View on Steam</span>
                            </a>

                            {/* Add Product Button (Gambar 1) */}
                            <AdminButton
                              variant="dark"
                              size="sm"
                              onClick={() => onAddProduct?.(item)}
                              className="h-8 border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white px-3.5 rounded-lg font-semibold text-label-xs"
                            >
                              Add Product
                            </AdminButton>

                            {/* Cancel Button (Gambar 1) */}
                            <AdminButton
                              variant="dark"
                              size="sm"
                              onClick={() => onCancelItem?.(item)}
                              className="h-8 border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white px-3.5 rounded-lg font-semibold text-label-xs"
                            >
                              Cancel
                            </AdminButton>
                          </>
                        ) : currentTab === "declined" ? (
                          /* 2. If Declined (Matching Gambar 2): View on Steam + Cancel */
                          <>
                            {/* View on Steam Button */}
                            <a
                              href={
                                item.steamUrl ||
                                `https://store.steampowered.com/search/?term=${encodeURIComponent(
                                  item.name
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 px-3.5 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-2 text-label-xs font-semibold text-white transition-colors cursor-pointer select-none"
                            >
                              <SteamIcon className="w-4 h-4 text-white shrink-0" />
                              <span>View on Steam</span>
                            </a>

                            {/* Cancel Button (Gambar 2) */}
                            <AdminButton
                              variant="dark"
                              size="sm"
                              onClick={() => onCancelItem?.(item)}
                              className="h-8 border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white px-3.5 rounded-lg font-semibold text-label-xs"
                            >
                              Cancel
                            </AdminButton>
                          </>
                        ) : (
                          /* 3. If Requested / Pinned: Pin + View on Steam + Accept + Decline */
                          <>
                            {/* Pin / Unpin Button */}
                            <button
                              type="button"
                              onClick={() => onPinToggle?.(item.id)}
                              title={item.isPinned ? "Lepas Sematan" : "Sematkan Game"}
                              aria-label={item.isPinned ? "Lepas Sematan" : "Sematkan Game"}
                              className="h-8 w-8 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                              {item.isPinned ? <PinOffIcon /> : <PinIcon />}
                            </button>

                            {/* View on Steam Button */}
                            <a
                              href={
                                item.steamUrl ||
                                `https://store.steampowered.com/search/?term=${encodeURIComponent(
                                  item.name
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 px-3.5 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-2 text-label-xs font-semibold text-white transition-colors cursor-pointer select-none"
                            >
                              <SteamIcon className="w-4 h-4 text-white shrink-0" />
                              <span>View on Steam</span>
                            </a>

                            {/* Accept Button */}
                            <AdminButton
                              variant="dark"
                              size="sm"
                              onClick={() => onAcceptItem?.(item)}
                              className="h-8 border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white px-3.5 rounded-lg font-semibold text-label-xs"
                            >
                              Accept
                            </AdminButton>

                            {/* Decline Button */}
                            <AdminButton
                              variant="dark"
                              size="sm"
                              onClick={() => onDeclineItem?.(item)}
                              className="h-8 border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white px-3.5 rounded-lg font-semibold text-label-xs"
                            >
                              Decline
                            </AdminButton>
                          </>
                        )}
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })
            ) : (
              /* Empty State row (Matching Image 2, Image 3 & Image 4) */
              <tr>
                <td colSpan={4} className="py-20 px-6">
                  <AdminEmptyState
                    title="Tidak Ada Data Game"
                    description={
                      emptyDescription || getEmptyDescription(sectionTitle)
                    }
                    className="p-0 sm:p-0"
                  />
                </td>
              </tr>
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
}
