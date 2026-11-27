import * as React from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useUiStore } from "@/stores/use-ui-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { FluentWifiFilledIcon } from "@/components/shared/Error500View";
import { EmptyState } from "@/components/ui/EmptyState";
import { StoreLayout } from "@/components/layout/StoreLayout";
import type { AdminLayoutProps } from "./AdminLayout.types";

export function AdminLayout({
  children,
  title = "Main Dashboard",
  activeNavId,
  headerRight,
  className,
  headerClassName,
  isError = false,
  hasError = false,
  onReload,
  errorTitle,
  errorDescription,
}: AdminLayoutProps) {
  const router = useRouter();
  const { token, role, user } = useAuthStore();
  const { isAdminSidebarCollapsed, toggleAdminSidebar } = useUiStore();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const effectiveIsError = Boolean(isError || hasError);

  // Hydration-safe mounting flag (Server and initial Client render both return false)
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const checkAdminAuth = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    const storeState = useAuthStore.getState();
    if (storeState.token && (storeState.role === "admin" || storeState.user?.role === "admin")) {
      return true;
    }
    try {
      const raw = localStorage.getItem("gamezygo-auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const t = parsed?.state?.token;
        const r = parsed?.state?.role;
        const u = parsed?.state?.user;
        if (t && (r === "admin" || u?.role === "admin")) {
          return true;
        }
      }
      const adminToken = localStorage.getItem("gamezygo-admin-token");
      if (adminToken) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  const hasCustomerSession = React.useCallback(() => {
    if (typeof window === "undefined") return false;
    const storeState = useAuthStore.getState();
    if (
      storeState.token &&
      storeState.role !== "admin" &&
      storeState.user?.role !== "admin"
    ) {
      return true;
    }
    try {
      const raw = localStorage.getItem("gamezygo-auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const t = parsed?.state?.token;
        const r = parsed?.state?.role;
        const u = parsed?.state?.user;
        if (t && r !== "admin" && u?.role !== "admin") {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  }, []);

  const isAdmin =
    isMounted &&
    ((token && (role === "admin" || user?.role === "admin")) || checkAdminAuth());

  const isCustomerForbidden =
    isMounted &&
    !isAdmin &&
    (Boolean(token && role !== "admin" && user?.role !== "admin") ||
      hasCustomerSession());

  // Route protection: redirect unauthenticated guests to /login; preserve customer session with 403 UI
  React.useEffect(() => {
    if (!router.isReady || !isMounted) return;

    if (!isAdmin && !isCustomerForbidden) {
      const redirectTarget = encodeURIComponent(router.asPath || "/admin/dashboard");
      router.replace(`/admin/login?redirect=${redirectTarget}`);
    }
  }, [isAdmin, isCustomerForbidden, isMounted, router]);

  // Toggle handler for both desktop and mobile
  const handleToggleSidebar = () => {
    // If mobile, toggle mobile drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleAdminSidebar();
    }
  };

  if (isCustomerForbidden) {
    return (
      <StoreLayout
        navbarVariant="login"
        hideSidebar={true}
        user={
          user
            ? {
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
              }
            : undefined
        }
      >
        <div className="py-16 sm:py-24 flex items-center justify-center w-full">
          <EmptyState
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-gray-50"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            }
            title="403: Akses Ditolak"
            description="Anda tidak memiliki izin Administrator untuk mengakses halaman ini. Silakan kembali ke halaman sebelumnya atau menuju beranda."
            backLabel="Kembali"
            searchLabel="Beranda"
            onBack={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                router.push("/");
              }
            }}
            onSearch={() => router.push("/")}
          />
        </div>
      </StoreLayout>
    );
  }

  if (!isMounted || !isAdmin) {
    return (
      <div className="h-screen w-full bg-deep-blue-900 text-gray-100 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Memverifikasi akses Administrator Gamezygo...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-deep-blue-900 text-gray-100 flex flex-row overflow-hidden">
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <AdminSidebar
          activeId={activeNavId}
          isCollapsed={isAdminSidebarCollapsed}
        />
      </div>

      {/* 2. Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. Mobile Slide-Over Drawer Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-70 lg:hidden transition-transform duration-300 ease-in-out h-full",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar
          activeId={activeNavId}
          isCollapsed={false}
        />
      </div>

      {/* 4. Main Admin View Area - Fixed scroll container with min-h-0 */}
      <div className="flex-1 h-full min-w-0 min-h-0 flex flex-col overflow-y-auto py-2.5 px-3">
        {/* Main Panel Container with 16px Rounded Corners (Figma Image 1, 2, 3) */}
        <div className="w-full bg-deep-blue-950 rounded-lg flex flex-col mb-4 shrink-0 overflow-hidden">
          {/* Top Navbar Header (Figma Image 2, 3, 4) */}
          <AdminHeader
            title={title}
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isAdminSidebarCollapsed}
            headerRight={effectiveIsError ? null : headerRight}
            className={cn("sticky top-0 z-40 bg-deep-blue-950/95 backdrop-blur-sm", headerClassName)}
          />

          {/* Main Content Area: 32px gap from Navbar (Figma Image 1 auto-layout gap 32), 24px bottom padding */}
          <main className={cn("p-6 pt-8 pb-6 space-y-8 w-full", className)}>
            <ErrorBoundary
              showBackButton={false}
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
                      "Layanan admin sedang tidak dapat dijangkau. Silakan coba beberapa saat lagi."
                    }
                    backLabel=""
                    searchLabel="Muat Ulang"
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
      </div>
    </div>
  );
}
