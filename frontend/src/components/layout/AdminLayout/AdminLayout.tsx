import * as React from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useUiStore } from "@/stores/use-ui-store";
import { useAuthStore } from "@/stores/use-auth-store";
import type { AdminLayoutProps } from "./AdminLayout.types";

export function AdminLayout({
  children,
  title = "Main Dashboard",
  activeNavId,
  headerRight,
  className,
  headerClassName,
}: AdminLayoutProps) {
  const router = useRouter();
  const { token, role, user } = useAuthStore();
  const { isAdminSidebarCollapsed, toggleAdminSidebar } = useUiStore();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

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

  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storeState = useAuthStore.getState();
      if (storeState.token && (storeState.role === "admin" || storeState.user?.role === "admin")) {
        return false;
      }
      try {
        const raw = localStorage.getItem("gamezygo-auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          const t = parsed?.state?.token;
          const r = parsed?.state?.role;
          const u = parsed?.state?.user;
          if (t && (r === "admin" || u?.role === "admin")) return false;
        }
        if (localStorage.getItem("gamezygo-admin-token")) return false;
      } catch {
        // ignore
      }
    }
    return true;
  });

  // Route protection: verify admin session on mount
  React.useEffect(() => {
    if (!router.isReady) return;

    const isAdmin =
      (token && (role === "admin" || user?.role === "admin")) || checkAdminAuth();

    if (!isAdmin) {
      const redirectTarget = encodeURIComponent(router.asPath || "/admin/dashboard");
      router.replace(`/login?redirect=${redirectTarget}`);
    } else {
      setTimeout(() => setIsCheckingAuth(false), 0);
    }
  }, [token, role, user, router, checkAdminAuth]);

  // Toggle handler for both desktop and mobile
  const handleToggleSidebar = () => {
    // If mobile, toggle mobile drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleAdminSidebar();
    }
  };

  if (isCheckingAuth) {
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
        <div className="w-full bg-deep-blue-950 border border-deep-blue-700 rounded-lg flex flex-col mb-4 shrink-0 overflow-hidden">
          {/* Top Navbar Header (Figma Image 2, 3, 4) */}
          <AdminHeader
            title={title}
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isAdminSidebarCollapsed}
            headerRight={headerRight}
            className={cn("sticky top-0 z-40 bg-deep-blue-950/95 backdrop-blur-sm", headerClassName)}
          />

          {/* Main Content Area: 32px gap from Navbar (Figma Image 1 auto-layout gap 32), 24px bottom padding */}
          <main className={cn("p-6 pt-8 pb-6 space-y-8 w-full", className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
