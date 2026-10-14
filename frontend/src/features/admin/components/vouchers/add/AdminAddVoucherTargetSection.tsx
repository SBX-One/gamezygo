import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminAddVoucherGameModal } from "./AdminAddVoucherGameModal";
import { AdminAddVoucherUserModal } from "./AdminAddVoucherUserModal";
import type {
  AdminAddVoucherFormData,
  VoucherTargetGame,
  VoucherTargetUser,
} from "../../../types/admin-voucher.types";

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

  const handleSaveGames = (games: VoucherTargetGame[]) => {
    onChange({ targetGames: games });
  };

  const handleRemoveGame = (id: string) => {
    onChange({
      targetGames: formData.targetGames.filter((g) => g.id !== id),
    });
  };

  const handleSaveUsers = (users: VoucherTargetUser[]) => {
    onChange({ targetUsers: users });
  };

  const handleRemoveUser = (id: string) => {
    onChange({
      targetUsers: formData.targetUsers.filter((u) => u.id !== id),
    });
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 font-sans select-none",
        className
      )}
    >
      {/* 1. Left Column: TARGET GAME (Matching Image 3) */}
      <div className="space-y-4">
        {/* Column Header: TARGET GAME + Add New */}
        <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-400 uppercase">
            TARGET GAME
          </span>
          <button
            type="button"
            onClick={() => setIsGameModalOpen(true)}
            className="h-8 px-3 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-1.5 text-xs font-semibold text-white transition-colors cursor-pointer select-none"
          >
            <PlusIcon className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Add New</span>
          </button>
        </div>

        {/* Content: List or Empty State (Matching Image 3) */}
        <div>
          {formData.targetGames.length > 0 ? (
            <div className="space-y-2.5">
              {formData.targetGames.map((game) => (
                <div
                  key={game.id}
                  className="rounded-xl bg-[#0D0F18] border border-white/10 p-3 flex items-center justify-between gap-3 shadow-xs"
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
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#BA343C] text-white">
                        -{game.discountPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Middle: Prices */}
                  <div className="text-right shrink-0 px-2">
                    <div className="text-xs text-gray-500 line-through">
                      {formatCurrency(game.originalPrice)},00
                    </div>
                    <div className="text-sm font-bold text-white">
                      {formatCurrency(game.discountedPrice)}
                    </div>
                  </div>

                  {/* Right: Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveGame(game.id)}
                    className="h-8 px-3.5 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State (Matching Image 3) */
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#141622] border border-white/10 flex items-center justify-center text-white shadow-inner">
                <GamepadControllerIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                Belum Ada Ditambahkan
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-400">
                Anda belum menambahkan game apapun.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Column: USER (Matching Image 3) */}
      <div className="space-y-4">
        {/* Column Header: USER + Add New */}
        <div className="flex items-center justify-between pb-2 border-b border-deep-blue-700/60">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-gray-400 uppercase">
            USER
          </span>
          <button
            type="button"
            onClick={() => setIsUserModalOpen(true)}
            className="h-8 px-3 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] flex items-center gap-1.5 text-xs font-semibold text-white transition-colors cursor-pointer select-none"
          >
            <PlusIcon className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Add New</span>
          </button>
        </div>

        {/* Content: List or Empty State (Matching Image 3) */}
        <div>
          {formData.targetUsers.length > 0 ? (
            <div className="space-y-2.5">
              {formData.targetUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl bg-[#0D0F18] border border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-xs"
                >
                  {/* Left: Email */}
                  <span className="text-sm font-medium text-gray-200 truncate">
                    {user.email}
                  </span>

                  {/* Right: Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="h-8 px-3.5 rounded-lg border border-white/10 bg-[#161823] hover:bg-[#1E202E] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State (Matching Image 3) */
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#141622] border border-white/10 flex items-center justify-center text-white shadow-inner">
                <UserProfileIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
                Belum Ada Ditambahkan
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-400">
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
