import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/ui/Sidebar";
import { Footer } from "@/components/ui/Footer";
import { FilterModal, type FilterValues } from "@/components/ui/FilterModal";
import { useRouter } from "next/router";
import { useUiStore } from "@/stores/use-ui-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useProductFilters } from "@/hooks/use-products";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { FluentWifiFilledIcon } from "@/components/shared/Error500View";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SidebarItem } from "@/components/ui/Sidebar/Sidebar.types";
import type { StoreLayoutProps } from "./StoreLayout.types";

/**
 * Mobile Drawer Close Icon (16px / w-4 h-4)
 */
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

export function StoreLayout({
  children,
  navbarVariant = "guest",
  navItems,
  activeNavId = "toko",
  activeSidebarId = "toko",
  searchValue,
  searchPlaceholder = "Cari game",
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onFilterClick,
  onLoginClick,
  onSignUpClick,
  onCartClick,
  onNavItemClick,
  onSidebarItemClick,
  user,
  onUserClick,
  onDashboardClick,
  onLogoutClick,
  onSettingsClick,
  sidebarMode,
  hideNavbar = false,
  hideSidebar = false,
  hideFooter = false,
  sidebarSections,
  contentClassName,
  backTitle,
  onBackClick,
  isError = false,
  hasError = false,
  onReload,
  errorTitle,
  errorDescription,
  className,
  ref,
  style,
  ...props
}: StoreLayoutProps) {
  const router = useRouter();
  const effectiveIsError = Boolean(isError || hasError);
  const {
    isSidebarOpen,
    toggleSidebar,
    isFilterModalOpen,
    toggleFilterModal,
  } = useUiStore();

  // Dynamic Filters from Guest API
  const { data: filtersData } = useProductFilters();
  const filterCategories = filtersData?.data?.categories?.map((c) => c.name);
  const filterLaunchers = filtersData?.data?.launcher?.map((l) => l.name);
  const filterSortOptions = filtersData?.data?.sort_options?.map((s) => s.label);

  const headerRef = React.useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = React.useState<number>(146);
  const effectiveHeaderHeight = hideNavbar ? 0 : headerHeight;

  // Global Auth Integration
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authLogout = useAuthStore((s) => s.logout);

  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const effectiveIsLoggedIn = hasMounted && isAuthenticated;
  const hasUser = effectiveIsLoggedIn || (hasMounted && Boolean(user));
  const effectiveVariant =
    !hasUser && (navbarVariant === "login" || navbarVariant === "private")
      ? "guest"
      : !hasUser && navbarVariant === "back"
      ? "back-guest"
      : hasUser && navbarVariant === "guest"
      ? "login"
      : hasUser && navbarVariant === "back-guest"
      ? "back"
      : navbarVariant;

  const effectiveUser =
    hasMounted && authUser
      ? {
          name: authUser.name,
          avatarUrl: authUser.avatarUrl,
        }
      : hasMounted
      ? user
      : undefined;

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      authLogout();
      router.push("/");
    }
  };

  const handleDashboard = () => {
    if (onDashboardClick) {
      onDashboardClick();
    } else if (user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/library");
    }
  };

  const handleSettings = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else if (onUserClick) {
      onUserClick();
    } else {
      router.push("/profile");
    }
  };

  const handleDefaultSearchSubmit = (val: string) => {
    if (onSearchSubmit) {
      onSearchSubmit(val);
    } else {
      const q = val.trim();
      if (q) {
        router.push(`/store?q=${encodeURIComponent(q)}`);
      } else {
        router.push("/store");
      }
    }
  };

  const handleGlobalFilterApply = (values?: FilterValues) => {
    toggleFilterModal(false);
    if (!values) {
      router.push("/store");
      return;
    }

    const params = new URLSearchParams();
    if (values.categories && values.categories.length > 0) {
      params.set("categories", values.categories.join(","));
    }
    if (values.genres && values.genres.length > 0) {
      params.set("genres", values.genres.join(","));
    }
    if (values.launchers && values.launchers.length > 0) {
      params.set("launchers", values.launchers.join(","));
    }
    if (values.priceRange) {
      if (values.priceRange[0] > 0) {
        params.set("minPrice", values.priceRange[0].toString());
      }
      if (values.priceRange[1] < 200000) {
        params.set("maxPrice", values.priceRange[1].toString());
      }
    }
    if (values.sort && values.sort !== "Terbaru") {
      params.set("sort", values.sort);
    }

    const qs = params.toString();
    router.push(qs ? `/store?${qs}` : "/store");
  };

  const handleGlobalFilterReset = () => {
    toggleFilterModal(false);
    if (router.pathname === "/store") {
      router.push("/store");
    }
  };

  React.useEffect(() => {
    if (hideNavbar) return;
    const updateHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        if (h > 0) {
          setHeaderHeight(h);
        }
      }
    };

    updateHeight();

    if (!headerRef.current) return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [hideNavbar]);

  // Close mobile sidebar on route / item click
  const handleSidebarItemClick = (item: SidebarItem) => {
    toggleSidebar(false);
    onSidebarItemClick?.(item);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-screen flex flex-col bg-deep-blue-950  text-gray-50 antialiased font-sans selection:bg-rose-600/30 selection:text-gray-50 w-full",
        className
      )}
      style={{
        ...style,
        "--header-height": `${effectiveHeaderHeight}px`,
      } as React.CSSProperties}
      {...props}
    >
      
      {/* ========================================================
          1. STICKY NAVBAR HEADER (Glassmorphic Dark Mode)
         ======================================================== */}
      {!hideNavbar && (
        <header
          ref={headerRef}
          className="sticky top-0 z-40 w-full max-w-full backdrop-blur-md bg-deep-blue-950/90 border-b border-b-gradient-secondary"
        >
          <div className="w-full">
            <Navbar
              variant={effectiveVariant}
              navItems={navItems}
              activeNavId={activeNavId}
              onNavItemClick={onNavItemClick}
              searchValue={searchValue}
              searchPlaceholder={searchPlaceholder}
              onSearchChange={onSearchChange}
              onSearchClear={onSearchClear}
              onSearchSubmit={handleDefaultSearchSubmit}
              onFilterClick={onFilterClick || (() => toggleFilterModal())}
              onLoginClick={onLoginClick || (() => router.push("/login"))}
              onSignUpClick={
                onSignUpClick || (() => router.push("/login?tab=signup"))
              }
              onCartClick={onCartClick || (() => router.push("/cart"))}
              onUserClick={handleSettings}
              onDashboardClick={handleDashboard}
              onSettingsClick={handleSettings}
              onLogoutClick={handleLogout}
              sidebarMode={sidebarMode}
              sidebarSections={sidebarSections}
              user={effectiveUser}
              backTitle={backTitle}
              onBackClick={onBackClick || (() => router.back())}
              className="w-full"
            />
          </div>
        </header>
      )}

      {/* ========================================================
          UNIVERSAL GLOBAL FILTER MODAL (Available across all pages)
         ======================================================== */}
      {!onFilterClick && (
        <FilterModal
          isOpen={isFilterModalOpen}
          variant="dialog"
          onClose={() => toggleFilterModal(false)}
          onApply={handleGlobalFilterApply}
          onReset={handleGlobalFilterReset}
          genres={
            filterCategories && filterCategories.length > 0
              ? filterCategories
              : undefined
          }
          launchers={
            filterLaunchers && filterLaunchers.length > 0
              ? filterLaunchers
              : undefined
          }
          sortOptions={
            filterSortOptions && filterSortOptions.length > 0
              ? filterSortOptions
              : undefined
          }
        />
      )}

      {/* ========================================================
          2. MOBILE SIDEBAR TOGGLE BAR (< lg Viewport)
         ======================================================== */}
      {/* {!hideSidebar && (
        <div
          style={{ top: `${effectiveHeaderHeight}px` }}
          className="lg:hidden flex items-center justify-between px-4 py-3 bg-deep-blue-900/60 border-b border-white/5 backdrop-blur-sm sticky z-30"
        >
          <button
            type="button"
            onClick={() => toggleSidebar(true)}
            className="h-11 px-4 flex items-center gap-2.5 rounded-lg bg-white/5 border border-gradient-secondary hover:bg-white/10 text-gray-100 text-label-sm font-semibold transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-gray-50/50"
            aria-label="Buka Menu Kategori"
          >
            <MenuIcon className="text-rose-400" />
            <span>Kategori & Menu Toko</span>
          </button>

          {onFilterClick && (
            <button
              type="button"
              onClick={onFilterClick}
              className="h-11 px-4 flex items-center gap-2 rounded-lg bg-deep-blue-800/80 border border-gradient-secondary hover:bg-deep-blue-700 text-label-sm font-semibold text-deep-blue-100 hover:text-gray-50 transition-colors cursor-pointer"
            >
              <span>Filter</span>
            </button>
          )}
        </div>
      )} */}

      {/* ========================================================
          3. MAIN LAYOUT BODY (Desktop Sidebar + Main Content)
         ======================================================== */}
      <div className="flex-1 w-full mx-auto flex flex-col lg:flex-row items-start">
        {/* DESKTOP SIDEBAR (Static/Sticky on lg+) */}
        {!hideSidebar && (
          <aside
            style={{
              position: "sticky",
              top: `${effectiveHeaderHeight}px`,
              height: `calc(100vh - ${effectiveHeaderHeight}px)`,
            }}
            className="hidden lg:block shrink-0 self-start overflow-y-auto"
          >
            <Sidebar
              sections={sidebarSections}
              activeId={activeSidebarId}
              onItemClick={onSidebarItemClick}
              className="h-full border-r-0 border-r-gradient-secondary"
            />
          </aside>
        )}

        {/* MAIN STORE CONTENT */}
        <main
          className={cn(
            "flex-1 min-w-0 max-w-full flex flex-col mb-11xl",
            contentClassName ?? "px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
          )}
        >
          <ErrorBoundary
            showBackButton={true}
            onReset={onReload}
            errorTitle={errorTitle}
            errorDescription={errorDescription}
          >
            {effectiveIsError ? (
              <div className="py-16 sm:py-24 flex items-center justify-center w-full">
                <EmptyState
                  icon={<FluentWifiFilledIcon className="w-8 h-8 text-gray-50" />}
                  title={errorTitle || "500: Terjadi Gangguan Server"}
                  description={
                    errorDescription ||
                    "Halaman sedang tidak dapat dijangkau. Silakan coba beberapa saat lagi."
                  }
                  backLabel="Kembali"
                  searchLabel="Muat Ulang"
                  onBack={() => window.history.back()}
                  onSearch={() =>
                    onReload ? onReload() : window.location.reload()
                  }
                />
              </div>
            ) : (
              children
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* ========================================================
          4. MOBILE SIDEBAR DRAWER (Sliding from Left)
         ======================================================== */}
      {hasMounted &&
        !hideSidebar &&
        isSidebarOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu Navigasi Sidebar"
            className="fixed inset-0 z-100 lg:hidden flex select-none"
          >
            {/* Backdrop Blur Overlay */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200 animate-fade-in"
              onClick={() => toggleSidebar(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div className="relative z-10 w-4/5 max-w-80 sm:max-w-90 bg-deep-blue-950 border-r border-gradient-secondary flex flex-col h-full overflow-y-auto transform transition-transform duration-200 animate-slide-in-left shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-b-gradient-secondary bg-deep-blue-950 shrink-0">
                <span className="text-label-md font-bold text-gradient-heading">
                  Menu & Kategori
                </span>
                <button
                  type="button"
                  onClick={() => toggleSidebar(false)}
                  className="h-11 w-11 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-50 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-gray-50/50"
                  aria-label="Tutup Menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Sidebar Component Content inside Drawer */}
              <div className="p-4 flex-1 overflow-y-auto">
                <Sidebar
                  sections={sidebarSections}
                  activeId={activeSidebarId}
                  onItemClick={handleSidebarItemClick}
                  className="border-none px-2 py-0 w-full min-w-0"
                />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ========================================================
          5. FOOTER
         ======================================================== */}
      {!hideFooter && <Footer className="mt-auto border-t border-t-gradient-secondary" />}
    </div>
  );
}
