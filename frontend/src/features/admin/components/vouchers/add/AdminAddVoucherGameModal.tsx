import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEligibleVoucherProducts } from "@/hooks/use-admin-vouchers";
import { resolveImageUrl } from "@/utils/image-url";
import { Button } from "@/components/ui/Button";
import type { VoucherTargetGame } from "../../../types/admin-voucher.types";

export interface AdminAddVoucherGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGames: VoucherTargetGame[];
  onSaveGames: (games: VoucherTargetGame[]) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterFunnelIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function AdminAddVoucherGameModal({
  isOpen,
  onClose,
  selectedGames,
  onSaveGames,
  className,
}: AdminAddVoucherGameModalProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(selectedGames.map((g) => g.id))
  );
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedIds(new Set(selectedGames.map((g) => g.id)));
      setSearch("");
    }
  }

  const { data: eligibleRes, isLoading } = useEligibleVoucherProducts(
    { search: search.trim() || undefined, per_page: 50 },
    isOpen
  );

  const availableGames = React.useMemo(() => {
    const rows = eligibleRes?.products ?? [];
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      imageSrc: resolveImageUrl(p.image_url, "/assets/png/Banner.png"),
      price: p.price,
      categories: p.categories,
    }));
  }, [eligibleRes]);

  // Handle ESC key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredGames = availableGames.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const isAllSelected =
    filteredGames.length > 0 &&
    filteredGames.every((g) => selectedIds.has(g.id));

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      filteredGames.forEach((g) => next.delete(g.id));
    } else {
      filteredGames.forEach((g) => next.add(g.id));
    }
    setSelectedIds(next);
  };

  const handleToggleGame = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSave = () => {
    const selectedById = new Map(selectedGames.map((g) => [g.id, g]));
    const availableById = new Map(availableGames.map((g) => [g.id, g]));
    const selectedList: VoucherTargetGame[] = Array.from(selectedIds)
      .map((id) => {
        const g = availableById.get(id);
        if (g) {
          return {
            id: g.id,
            title: g.name,
            imageSrc: g.imageSrc,
            discountPercentage: 30,
            originalPrice: g.price,
            discountedPrice: Math.round(g.price * 0.7),
          };
        }
        return selectedById.get(id) ?? null;
      })
      .filter((item): item is VoucherTargetGame => item !== null);
    onSaveGames(selectedList);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-[760px] max-w-[95vw] rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 shadow-2xl space-y-4 text-left",
          className
        )}
      >
        {/* Header: Title + Close Icon (Matching Image 1) */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Add Game
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search Input Bar + Filter Button (Matching Image 1) */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari di toko"
              className="w-full h-11 pl-10 pr-10 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-label-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="absolute right-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Funnel Button (Matching Image 1) */}
          <button
            type="button"
            aria-label="Filter kategori"
            className="w-11 h-11 rounded-lg bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <FilterFunnelIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Games Table Card (Matching Image 1) */}
        <div className="rounded-lg border border-white/10 bg-[#0B0D14] overflow-hidden">
          {/* Table Header: Checkbox + Product Name | Category | Price */}
          <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between text-label-xs font-semibold text-gray-400 select-none bg-[#0E101A]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={cn(
                  "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0",
                  isAllSelected
                    ? "bg-[#181A24] border-white/40 text-white"
                    : "border-gray-600 bg-transparent hover:border-gray-400"
                )}
                aria-label="Pilih semua game"
              >
                {isAllSelected && <CheckIcon />}
              </button>
              <span>Product Name</span>
            </div>

            <div className="flex-1 text-center hidden sm:block">
              <span>Category</span>
            </div>

            <div className="w-28 text-right shrink-0">
              <span>Price</span>
            </div>
          </div>

          {/* Table Rows (Scrollable) */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-white/5">
            {isLoading ? (
              <div className="py-12 text-center text-label-xs text-gray-400">
                Memuat daftar game...
              </div>
            ) : filteredGames.length > 0 ? (
              filteredGames.map((game) => {
                const isSelected = selectedIds.has(game.id);
                return (
                  <div
                    key={game.id}
                    onClick={() => handleToggleGame(game.id)}
                    className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {/* Column 1: Checkbox + Thumbnail + Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors shrink-0",
                          isSelected
                            ? "bg-[#181A24] border-white/40 text-white"
                            : "border-gray-600 bg-transparent"
                        )}
                      >
                        {isSelected && <CheckIcon />}
                      </div>
                      <div className="relative w-7 h-7 rounded overflow-hidden shrink-0 bg-black/40 border border-white/10">
                        <Image
                          src={game.imageSrc}
                          alt={game.name}
                          fill
                          sizes="28px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="text-label-xs sm:text-sm font-semibold text-white truncate">
                        {game.name}
                      </span>
                    </div>

                    {/* Column 2: Category Pills */}
                    <div className="hidden sm:flex items-center gap-1.5 justify-center flex-1">
                      {game.categories.slice(0, 2).map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-gray-300 border border-white/10 bg-white/5"
                        >
                          {cat}
                        </span>
                      ))}
                      {game.categories.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium text-gray-400 border border-white/10 bg-white/5">
                          +{game.categories.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Column 3: Price */}
                    <div className="w-28 text-right shrink-0">
                      <span className="text-label-xs sm:text-sm font-semibold text-white">
                        {formatCurrency(game.price)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-label-xs text-gray-400">
                Tidak ada game yang sesuai pencarian &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Footer: Batalkan + Simpan (Matching Image 1) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Batalkan
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
