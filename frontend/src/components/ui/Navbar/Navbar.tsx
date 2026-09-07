import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { NavbarProps, NavItem } from "./Navbar.types";

/**
 * Gamezygo Logo Emblem SVG
 */
const GamezygoEmblem = ({
  className,
  fill,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="45"
    height="24"
    viewBox="0 0 45 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path
      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
      fill={fill || "currentColor"}
    />
    <path
      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
      fill={fill || "currentColor"}
    />
  </svg>
);

/**
 * Fluent Search Icon (16px / w-4 h-4)
 */
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M16.102 17.162C14.5177 18.4737 12.4892 19.1248 10.4375 18.9802C8.3858 18.8356 6.46864 17.9063 5.08408 16.3853C3.69952 14.8644 2.95396 12.8686 3.0022 10.8124C3.05045 8.75615 3.88879 6.79751 5.34315 5.34315C6.79751 3.88879 8.75615 3.05045 10.8124 3.0022C12.8686 2.95396 14.8644 3.69952 16.3853 5.08408C17.9063 6.46864 18.8356 8.3858 18.9802 10.4375C19.1248 12.4892 18.4737 14.5177 17.162 16.102L21.78 20.72C21.8537 20.7886 21.9128 20.8714 21.9538 20.9634C21.9947 21.0554 22.0168 21.1547 22.0186 21.2555C22.0203 21.3562 22.0018 21.4562 21.9641 21.5496C21.9264 21.643 21.8702 21.7278 21.799 21.799C21.7278 21.8702 21.643 21.9264 21.5496 21.9641C21.4562 22.0018 21.3562 22.0203 21.2555 22.0186C21.1547 22.0168 21.0554 21.9947 20.9634 21.9538C20.8714 21.9128 20.7886 21.8537 20.72 21.78L16.102 17.162ZM17.5 11C17.5 9.27607 16.8152 7.62277 15.5962 6.40378C14.3772 5.18479 12.7239 4.49997 11 4.49997C9.27607 4.49997 7.62277 5.18479 6.40378 6.40378C5.18479 7.62277 4.49997 9.27607 4.49997 11C4.49997 12.7239 5.18479 14.3772 6.40378 15.5962C7.62277 16.8152 9.27607 17.5 11 17.5C12.7239 17.5 14.3772 16.8152 15.5962 15.5962C16.8152 14.3772 17.5 12.7239 17.5 11Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Dismiss / Clear Icon (16px / w-4 h-4)
 */
const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Filter Icon (16px / w-4 h-4)
 */
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M13.5 16C13.6989 16 13.8897 16.079 14.0303 16.2197C14.171 16.3603 14.25 16.5511 14.25 16.75C14.25 16.9489 14.171 17.1397 14.0303 17.2803C13.8897 17.421 13.6989 17.5 13.5 17.5H10.5C10.3011 17.5 10.1103 17.421 9.96967 17.2803C9.82902 17.1397 9.75 16.9489 9.75 16.75C9.75 16.5511 9.82902 16.3603 9.96967 16.2197C10.1103 16.079 10.3011 16 10.5 16H13.5ZM16.5 11C16.6989 11 16.8897 11.079 17.0303 11.2197C17.171 11.3603 17.25 11.5511 17.25 11.75C17.25 11.9489 17.171 12.1397 17.0303 12.2803C16.8897 12.421 16.6989 12.5 16.5 12.5H7.5C7.30109 12.5 7.11032 12.421 6.96967 12.2803C6.82902 12.1397 6.75 11.9489 6.75 11.75C6.75 11.5511 6.82902 11.3603 6.96967 11.2197C7.11032 11.079 7.30109 11 7.5 11H16.5ZM19.5 6C19.6989 6 19.8897 6.07902 20.0303 6.21967C20.171 6.36032 20.25 6.55109 20.25 6.75C20.25 6.94891 20.171 7.13968 20.0303 7.28033C19.8897 7.42098 19.6989 7.5 19.5 7.5H4.5C4.30109 7.5 4.11032 7.42098 3.96967 7.28033C3.82902 7.13968 3.75 6.94891 3.75 6.75C3.75 6.55109 3.82902 6.36032 3.96967 6.21967C4.11032 6.07902 4.30109 6 4.5 6H19.5Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Cart Icon (16px / w-4 h-4)
 */
const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M2.5 4.25C2.5 4.05109 2.57902 3.86032 2.71967 3.71967C2.86032 3.57902 3.05109 3.5 3.25 3.5H3.808C4.758 3.5 5.328 4.139 5.653 4.733C5.87 5.129 6.027 5.588 6.15 6.004L6.25 6H18.748C19.578 6 20.178 6.794 19.95 7.593L18.122 14.002C17.9581 14.5769 17.6114 15.0827 17.1343 15.4428C16.6572 15.803 16.0758 15.9979 15.478 15.998H9.53C8.92749 15.998 8.34165 15.8002 7.86252 15.4349C7.3834 15.0696 7.0375 14.557 6.878 13.976L6.118 11.204L4.858 6.956L4.857 6.948C4.701 6.381 4.555 5.85 4.337 5.454C4.128 5.069 3.96 5 3.809 5H3.25C3.05109 5 2.86032 4.92098 2.71967 4.78033C2.57902 4.63968 2.5 4.44891 2.5 4.25ZM7.573 10.84L8.324 13.579C8.474 14.121 8.967 14.498 9.53 14.498H15.478C15.7497 14.498 16.014 14.4095 16.2309 14.2458C16.4478 14.0821 16.6054 13.8523 16.68 13.591L18.417 7.5H6.585L7.559 10.787L7.573 10.84ZM11 19C11 19.5304 10.7893 20.0391 10.4142 20.4142C10.0391 20.7893 9.53043 21 9 21C8.46957 21 7.96086 20.7893 7.58579 20.4142C7.21071 20.0391 7 19.5304 7 19C7 18.4696 7.21071 17.9609 7.58579 17.5858C7.96086 17.2107 8.46957 17 9 17C9.53043 17 10.0391 17.2107 10.4142 17.5858C10.7893 17.9609 11 18.4696 11 19ZM9.5 19C9.5 18.8674 9.44732 18.7402 9.35355 18.6464C9.25979 18.5527 9.13261 18.5 9 18.5C8.86739 18.5 8.74021 18.5527 8.64645 18.6464C8.55268 18.7402 8.5 18.8674 8.5 19C8.5 19.1326 8.55268 19.2598 8.64645 19.3536C8.74021 19.4473 8.86739 19.5 9 19.5C9.13261 19.5 9.25979 19.4473 9.35355 19.3536C9.44732 19.2598 9.5 19.1326 9.5 19ZM18 19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21C15.4696 21 14.9609 20.7893 14.5858 20.4142C14.2107 20.0391 14 19.5304 14 19C14 18.4696 14.2107 17.9609 14.5858 17.5858C14.9609 17.2107 15.4696 17 16 17C16.5304 17 17.0391 17.2107 17.4142 17.5858C17.7893 17.9609 18 18.4696 18 19ZM16.5 19C16.5 18.8674 16.4473 18.7402 16.3536 18.6464C16.2598 18.5527 16.1326 18.5 16 18.5C15.8674 18.5 15.7402 18.5527 15.6464 18.6464C15.5527 18.7402 15.5 18.8674 15.5 19C15.5 19.1326 15.5527 19.2598 15.6464 19.3536C15.7402 19.4473 15.8674 19.5 16 19.5C16.1326 19.5 16.2598 19.4473 16.3536 19.3536C16.4473 19.2598 16.5 19.1326 16.5 19Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Feather Chevron Down Icon (16px / w-4 h-4)
 */
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Fluent Arrow Left Icon (16px / w-4 h-4)
 */
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M10.7327 19.79C10.8777 19.9213 11.0683 19.9907 11.2638 19.9834C11.4593 19.9761 11.6442 19.8927 11.7791 19.7511C11.9139 19.6094 11.9881 19.4206 11.9858 19.225C11.9835 19.0294 11.9049 18.8425 11.7667 18.704L5.51566 12.75H20.2497C20.4486 12.75 20.6393 12.671 20.78 12.5303C20.9206 12.3897 20.9997 12.1989 20.9997 12C20.9997 11.8011 20.9206 11.6103 20.78 11.4697C20.6393 11.329 20.4486 11.25 20.2497 11.25H5.51566L11.7667 5.29502C11.9049 5.15658 11.9835 4.96962 11.9858 4.77402C11.9881 4.57841 11.9139 4.38964 11.7791 4.24797C11.6442 4.1063 11.4593 4.02293 11.2638 4.01566C11.0683 4.00838 10.8777 4.07777 10.7327 4.20902L3.31266 11.276C3.15058 11.4303 3.04494 11.6346 3.01266 11.856C2.99545 11.9516 2.99579 12.0495 3.01366 12.145C3.04616 12.3661 3.15178 12.57 3.31366 12.724L10.7327 19.79Z"
      fill="currentColor"
    />
  </svg>
);

const defaultNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", isActive: true },
  { id: "toko", label: "Toko", href: "/store" },
  { id: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
  { id: "ulasan", label: "Ulasan", href: "/review" },
  { id: "artikel", label: "Artikel", href: "/blogs" },
];

export function Navbar({
  variant = "guest",
  navItems = defaultNavItems,
  activeNavId,
  onNavItemClick,
  searchValue = "",
  searchPlaceholder = "Cari di toko",
  onSearchChange,
  onSearchClear,
  onSearchSubmit,
  onFilterClick,
  onLoginClick,
  onSignUpClick,
  onCartClick,
  user,
  onUserClick,
  backTitle = "Artikel",
  onBackClick,
  className,
  ref,
  ...props
}: NavbarProps) {
  const [internalSearch, setInternalSearch] = React.useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalSearch(val);
    onSearchChange?.(val);
  };

  const handleClear = () => {
    setInternalSearch("");
    onSearchClear?.();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(internalSearch);
  };

  return (
    <header
      ref={ref}
      className={cn(
        "w-full bg-transparent flex flex-col select-none transition-colors ",
        className
      )}
      {...props}
    >
      {/* SVG Definition Gradient Primary untuk Logo Gamezygo */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient
            id="gamezygo-navbar-primary-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="50%" stopColor="#BF3E42" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================
          1. BARIS ATAS: Kiri (Logo W:60 H:32 + Divider + Nav Links) & Kanan (Search + Actions)
         ======================================================== */}
      <div className="w-full px-20 py-11 flex items-center justify-between">
        {variant === "back" ? (
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
              onClick={onBackClick}
              aria-label="Kembali"
            >
              <ArrowLeftIcon className="w-4 h-4 text-deep-blue-100" />
            </Button>
            <h1 className="text-body-lg font-semibold text-gray-50 tracking-normal">
              {backTitle}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-10">
            {/* Logo Gamezygo (Ukuran W 60 x H 32 -> w-15 h-8) */}
            <Link href="/" className="flex items-center shrink-0 outline-none">
              <GamezygoEmblem
                className="w-15 h-8"
                fill="url(#gamezygo-navbar-primary-gradient)"
              />
            </Link>

            {/* Divider Garis | dan Nav Items (Hanya untuk mode Guest & Login) */}
            {variant !== "private" && (
              <>
                <div className="h-5 w-px bg-white/15 shrink-0 hidden md:block" />

                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                  {navItems.map((item) => {
                    const isActive = activeNavId
                      ? activeNavId === item.id
                      : item.isActive;

                    return item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => onNavItemClick?.(item)}
                        className={cn(
                          "text-label-sm transition-colors duration-150 outline-none",
                          isActive
                            ? "font-semibold text-gray-200"
                            : "font-normal text-gray-400 hover:text-gray-200"
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavItemClick?.(item)}
                        className={cn(
                          "text-label-sm transition-colors duration-150 outline-none cursor-pointer",
                          isActive
                            ? "font-semibold text-gray-200"
                            : "font-normal text-gray-400 hover:text-gray-200"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </>
            )}
          </div>
        )}

        {/* Kanan: Search Input Field + Tombol Aksi */}
        {variant !== "back" && (
          <div className="flex items-center gap-3">
            {/* Search Input Field (Small 40px Hug, w-80) - Hanya untuk mode Guest & Login */}
            {variant !== "private" && (
              <form
                onSubmit={handleFormSubmit}
                className="relative hidden sm:flex items-center bg-deep-blue-950 border border-gradient-secondary rounded-lg px-3.5 py-2.5 h-10 w-64 md:w-80 gap-2.5 focus-within:border-deep-blue-100/40 transition-colors"
              >
                <SearchIcon className="w-4 h-4 text-deep-blue-100 shrink-0" />
                <input
                  type="text"
                  value={internalSearch}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-label-sm text-gray-50 placeholder:text-gray-400 outline-none tracking-normal"
                />
                {internalSearch && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-deep-blue-100 hover:text-gray-50 shrink-0 cursor-pointer outline-none"
                    aria-label="Hapus teks"
                  >
                    <DismissIcon className="w-4 h-4" />
                  </button>
                )}
              </form>
            )}

            {/* Filter Button (Secondary SM) - Hanya untuk mode Guest & Login */}
            {variant !== "private" && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                onClick={onFilterClick}
                aria-label="Filter"
              >
                <FilterIcon className="w-4 h-4 text-deep-blue-100" />
              </Button>
            )}

            {/* Action Buttons Sesuai Varian */}
            {variant === "guest" ? (
              /* Mode GUEST: Tombol Login (Secondary SM) & Sign Up (Primary SM) */
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 text-label-sm font-semibold cursor-pointer"
                  onClick={onLoginClick}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="px-4 py-2 text-label-sm font-semibold cursor-pointer"
                  onClick={onSignUpClick}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              /* Mode LOGIN & PRIVATE: Tombol Keranjang (Secondary SM) & User Profile Avatar (Secondary) */
              <div className="flex items-center gap-3">
                {/* Tombol Keranjang Belanja */}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                  onClick={onCartClick}
                  aria-label="Keranjang Belanja"
                >
                  <CartIcon className="w-4 h-4 text-deep-blue-100" />
                </Button>

                {/* User Avatar + Chevron Down */}
                <button
                  type="button"
                  onClick={onUserClick}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-gray-50/50"
                  aria-label="Menu Pengguna"
                >
                  <div className="w-7 h-7 rounded-full bg-deep-blue-700/80 border border-gradient-secondary overflow-hidden flex items-center justify-center shrink-0">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || "User Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : user?.avatarFallback ? (
                      user.avatarFallback
                    ) : (
                      <div className="w-full h-full bg-linear-to-tr from-rose-900 via-indigo-900 to-deep-blue-700 flex items-center justify-center text-label-xs font-bold text-gray-50">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-deep-blue-100" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          2. BARIS PEMBATAS BAWAH: Height 4 (h-4 = 16px), Warna #15161D (bg-deep-blue-900), Border Y Linear Gradient Secondary
         ======================================================== */}
      <div className="w-full h-4 bg-deep-blue-900 border-y border-y-gradient-secondary shrink-0" />
    </header>
  );
}
