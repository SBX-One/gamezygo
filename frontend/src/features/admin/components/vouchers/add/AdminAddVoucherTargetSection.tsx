import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AdminAddVoucherGameModal } from "./AdminAddVoucherGameModal";
import { AdminAddVoucherUserModal } from "./AdminAddVoucherUserModal";
import type {
  AdminAddVoucherFormData,
  VoucherTargetGame,
  VoucherTargetUser,
} from "../../../types/admin-voucher.types";
import { Pill } from "@/components/ui";
import { calculateDiscountedGamePrice } from "../../../utils/voucher-price-calculator";

export interface AdminAddVoucherTargetSectionProps {
  formData: AdminAddVoucherFormData;
  onChange: (fields: Partial<AdminAddVoucherFormData>) => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Gamepad Controller Icon for Empty State (Matching Image 3)
const GamepadControllerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
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
    <circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" />
    <circle cx="18" cy="13" r="0.8" fill="currentColor" />
  </svg>
);

// User Avatar Icon for Empty State (Matching Image 3)
const UserProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function AdminAddVoucherTargetSection({
  formData,
  onChange,
  className,
}: AdminAddVoucherTargetSectionProps) {
  const [isGameModalOpen, setIsGameModalOpen] = React.useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [visibleGamesCount, setVisibleGamesCount] = React.useState(10);
  const [visibleUsersCount, setVisibleUsersCount] = React.useState(10);

  const handleSaveGames = (games: VoucherTargetGame[]) => {
    onChange({ targetGames: games });
    setVisibleGamesCount(10);
  };

  const handleRemoveGame = (id: string) => {
    onChange({
      targetGames: formData.targetGames.filter((g) => g.id !== id),
    });
  };

  const handleSaveUsers = (users: VoucherTargetUser[]) => {
    onChange({ targetUsers: users });
    setVisibleUsersCount(10);
  };

  const handleRemoveUser = (id: string) => {
    onChange({
      targetUsers: formData.targetUsers.filter((u) => u.id !== id),
    });
  };

  const handleGamesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      if (visibleGamesCount < formData.targetGames.length) {
        setVisibleGamesCount((prev) => Math.min(prev + 10, formData.targetGames.length));
      }
    }
  };

  const handleUsersScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      if (visibleUsersCount < formData.targetUsers.length) {
        setVisibleUsersCount((prev) => Math.min(prev + 10, formData.targetUsers.length));
      }
    }
  };

  const displayedGames = formData.targetGames.slice(0, visibleGamesCount);
  const displayedUsers = formData.targetUsers.slice(0, visibleUsersCount);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 font-sans select-none",
        className
      )}
    >
      {/* 1. Left Column: TARGET GAME (Matching Image 3) */}
      <div className="space-y-4">
        {/* Column Header: TARGET GAME + Add New (Figma Image 4: 99 Hug x 20 Hug, Ag Body/sm/Default · 14/140) */}
        <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[1.4] font-normal text-gray-400 uppercase tracking-wider">
              TARGET GAME
            </span>
            {formData.targetGames.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {formData.targetGames.length} Terpilih
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsGameModalOpen(true)}
            leftIcon={<PlusIcon className="w-3.5 h-3.5 text-white shrink-0" />}
            className="px-3 py-2"
          >
            <span>Add New</span>
          </Button>
        </div>

        {/* Content: List or Empty State (Matching Image 3) */}
        <div>
          {formData.targetGames.length > 0 ? (
            <div
              onScroll={handleGamesScroll}
              className="max-h-[560px] overflow-y-auto space-y-2.5 pr-1.5 overscroll-contain"
            >
              {displayedGames.map((game) => {
                const calc =
                  game.discountPercentage > 0 && game.discountedPrice > 0
                    ? {
                        discountPercentage: game.discountPercentage,
                        discountedPrice: game.discountedPrice,
                      }
                    : calculateDiscountedGamePrice(
                        game.originalPrice,
                        formData.discountType,
                        formData.discountValue
                      );

                return (
                  <div
                    key={game.id}
                    className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-3 flex items-center justify-between gap-3 shadow-xs"
                  >
                    {/* Left: Thumbnail + Title + Badge */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-14 rounded-md overflow-hidden bg-black/40 border border-white/10 shrink-0">
                        <Image
                          src={game.imageSrc}
                          alt={game.title}
                          fill
                          sizes="44px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {game.title}
                        </h4>
                        <Pill size={"xs"} className="px-3 py-0.5">
                          -{calc.discountPercentage}%
                        </Pill>
                      </div>
                    </div>

                    <div className="flex gap-3 items-end">
                      {/* Middle: Prices */}
                      <div className="text-right shrink-0 px-2">
                        <div className="text-label-xs text-gray-500 line-through">
                          {formatCurrency(game.originalPrice)},00
                        </div>
                        <div className="text-sm font-bold text-white">
                          {formatCurrency(calc.discountedPrice)}
                        </div>
                      </div>

                      {/* Right: Remove Button */}
                      <Button
                        type="button"
                        variant="inactive"
                        size="sm"
                        onClick={() => handleRemoveGame(game.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}

              {visibleGamesCount < formData.targetGames.length && (
                <div className="py-2.5 text-center text-label-xs text-gray-400 bg-white/[0.02] border border-white/5 rounded-lg">
                  Menampilkan {displayedGames.length} dari {formData.targetGames.length} game. Scroll ke bawah untuk memuat lebih banyak.
                </div>
              )}
            </div>
          ) : (
            /* Empty State (Figma Image 4) */
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-lg bg-[#141622] border border-white/10 flex items-center justify-center text-white shadow-inner">
                <GamepadControllerIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                Belum Ada Ditambahkan
              </h3>
              <p className="mt-1 text-label-xs sm:text-sm text-gray-400">
                Anda belum menambahkan game apapun.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Column: USER (Figma Image 4: Ag Body/sm/Default · 14/140) */}
      <div className="space-y-4">
        {/* Column Header: USER + Add New */}
        <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
          <div className="flex items-center gap-2">
            <span className="text-[14px] leading-[1.4] font-normal text-gray-400 uppercase tracking-wider">
              USER
            </span>
            {formData.targetUsers.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {formData.targetUsers.length} Terpilih
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsUserModalOpen(true)}
            leftIcon={<PlusIcon className="w-3.5 h-3.5 text-white shrink-0" />}
            className="px-3 py-2"
          >
            <span>Add New</span>
          </Button>
        </div>

        {/* Content: List or Empty State (Figma Image 4) */}
        <div>
          {formData.targetUsers.length > 0 ? (
            <div
              onScroll={handleUsersScroll}
              className="max-h-[560px] overflow-y-auto space-y-2.5 pr-1.5 overscroll-contain"
            >
              {displayedUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-lg bg-deep-blue-900 border border-deep-blue-700 px-4 py-3 flex items-center justify-between gap-3 shadow-xs"
                >
                  {/* Left: Email */}
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {user.email}
                  </span>

                  {/* Right: Remove Button */}
                  <Button
                    type="button"
                    variant="inactive"
                    size="sm"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {visibleUsersCount < formData.targetUsers.length && (
                <div className="py-2.5 text-center text-label-xs text-gray-400 bg-white/[0.02] border border-white/5 rounded-lg">
                  Menampilkan {displayedUsers.length} dari {formData.targetUsers.length} user. Scroll ke bawah untuk memuat lebih banyak.
                </div>
              )}
            </div>
          ) : (
            /* Empty State (Figma Image 4) */
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-lg bg-[#141622] border border-white/10 flex items-center justify-center text-white shadow-inner">
                <UserProfileIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                Belum Ada Ditambahkan
              </h3>
              <p className="mt-1 text-label-xs sm:text-sm text-gray-400">
                Anda belum menambahkan akun siapapun.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Game (Matching Image 1) */}
      <AdminAddVoucherGameModal
        isOpen={isGameModalOpen}
        onClose={() => setIsGameModalOpen(false)}
        selectedGames={formData.targetGames}
        onSaveGames={handleSaveGames}
        discountType={formData.discountType}
        discountValue={formData.discountValue}
      />

      {/* Modal Add User (Matching Image 2) */}
      <AdminAddVoucherUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        selectedUsers={formData.targetUsers}
        onSaveUsers={handleSaveUsers}
      />
    </div>
  );
}
