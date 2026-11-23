import * as React from "react";
import { cn } from "@/lib/utils";
import type {
  VoucherTargetGameItem,
  VoucherTargetUserItem,
} from "../../../types/admin-voucher-analytics.types";
import { FluentBookIcon } from "@/components/admin";

export interface AdminVoucherTargetSectionProps {
  games?: VoucherTargetGameItem[];
  users?: VoucherTargetUserItem[];
  className?: string;
}

const UserOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-gray-400"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GamepadEmptyIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

export function AdminVoucherTargetSection({
  games = [],
  users = [],
  className,
}: AdminVoucherTargetSectionProps) {
  const isGamesEmpty = games.length === 0;
  const isUsersEmpty = users.length === 0;

  const [visibleGamesCount, setVisibleGamesCount] = React.useState(10);
  const [visibleUsersCount, setVisibleUsersCount] = React.useState(10);

  // Reset pagination when data changes
  React.useEffect(() => {
    setVisibleGamesCount(10);
  }, [games.length]);

  React.useEffect(() => {
    setVisibleUsersCount(10);
  }, [users.length]);

  const handleGamesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      if (visibleGamesCount < games.length) {
        setVisibleGamesCount((prev) => Math.min(prev + 10, games.length));
      }
    }
  };

  const handleUsersScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60) {
      if (visibleUsersCount < users.length) {
        setVisibleUsersCount((prev) => Math.min(prev + 10, users.length));
      }
    }
  };

  const displayedGames = games.slice(0, visibleGamesCount);
  const displayedUsers = users.slice(0, visibleUsersCount);

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full select-none font-sans",
        className
      )}
    >
      {/* 1. Left Column: TARGET GAME */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] sm:text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
            TARGET GAME
          </h3>
          {games.length > 0 && (
            <span className="text-[11px] text-gray-500 font-medium">
              {displayedGames.length} dari {games.length} game
            </span>
          )}
        </div>
        <div className="w-full h-px bg-deep-blue-700/60 my-3" />

        {isGamesEmpty ? (
          /* Empty State for Target Game (Matching Image 3) */
          <div className="py-14 sm:py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 shadow-inner mb-4">
              <GamepadEmptyIcon className="w-7 h-7 text-slate-200" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              Anda Tidak Menambahkan
            </h4>
            <p className="text-label-xs sm:text-sm text-slate-400 font-normal">
              Anda tidak menambahkan game apapun.
            </p>
          </div>
        ) : (
          <div
            onScroll={handleGamesScroll}
            className="flex flex-col gap-3 w-full max-h-[560px] overflow-y-auto pr-1.5 overscroll-contain"
          >
            {displayedGames.map((game) => (
              <div
                key={game.id}
                className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 p-3 sm:p-3.5 flex items-center justify-between gap-4 transition-all duration-150 hover:border-deep-blue-600 shadow-xs"
              >
                {/* Left: Thumbnail & Title + Discount Badge */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-15 sm:w-13 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-deep-blue-900 border border-white/5">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&h=600&q=80";
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-start gap-1.5 min-w-0 flex-1">
                    <h4
                      className="text-sm sm:text-base font-semibold text-white truncate w-full"
                      title={game.title}
                    >
                      {game.title}
                    </h4>
                    {game.discountBadge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#38161A] text-[#DF3848] border border-[#BA343C]/40 shrink-0">
                        {game.discountBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Price with strike-through original price */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[11px] sm:text-label-xs text-gray-500 line-through">
                    {game.originalPrice}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {game.discountedPrice}
                  </span>
                </div>
              </div>
            ))}

            {visibleGamesCount < games.length && (
              <div className="py-2 text-center text-label-xs text-gray-500 animate-pulse">
                Scroll ke bawah untuk memuat game lainnya... ({displayedGames.length}/{games.length})
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Right Column: TARGET USER */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] sm:text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
            TARGET USER
          </h3>
          {users.length > 0 && (
            <span className="text-[11px] text-gray-500 font-medium">
              {displayedUsers.length} dari {users.length} user
            </span>
          )}
        </div>
        <div className="w-full h-px bg-deep-blue-700/60 my-3" />

        {isUsersEmpty ? (
          /* Empty State for Target User (Matching Image 3) */
          <div className="py-14 sm:py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 shadow-inner mb-4">
              <FluentBookIcon className="w-7 h-7 text-slate-200" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              Anda Tidak Menambahkan
            </h4>
            <p className="text-label-xs sm:text-sm text-slate-400 font-normal">
              Anda tidak menambahkan email siapapun.
            </p>
          </div>
        ) : (
          <div
            onScroll={handleUsersScroll}
            className="flex flex-col gap-3 w-full max-h-[560px] overflow-y-auto pr-1.5 overscroll-contain"
          >
            {displayedUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 px-4 py-3 sm:py-3.5 flex items-center gap-3.5 transition-all duration-150 hover:border-deep-blue-600 shadow-xs h-18 sm:h-20.5"
              >
                <div className="w-8 h-8 rounded-lg bg-deep-blue-900/80 border border-white/5 flex items-center justify-center shrink-0">
                  <UserOutlineIcon className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-200 truncate">
                  {user.email}
                </span>
              </div>
            ))}

            {visibleUsersCount < users.length && (
              <div className="py-2 text-center text-label-xs text-gray-500 animate-pulse">
                Scroll ke bawah untuk memuat user lainnya... ({displayedUsers.length}/{users.length})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
