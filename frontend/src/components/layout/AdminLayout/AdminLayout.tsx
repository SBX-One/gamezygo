import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { useUiStore } from "@/stores/use-ui-store";
import type { AdminLayoutProps } from "./AdminLayout.types";

export function AdminLayout({
  children,
  title = "Main Dashboard",
  activeNavId,
  headerRight,
  className,
}: AdminLayoutProps) {
  const { isAdminSidebarCollapsed, toggleAdminSidebar } = useUiStore();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Toggle handler for both desktop and mobile
  const handleToggleSidebar = () => {
    // If mobile, toggle mobile drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      toggleAdminSidebar();
    }
  };

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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. Mobile Slide-Over Drawer Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-in-out h-full",
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
        <div className="w-full bg-deep-blue-950 border border-deep-blue-700 rounded-2xl flex flex-col mb-4 shrink-0 overflow-hidden">
          {/* Top Navbar Header (Figma Image 2, 3, 4) */}
          <AdminHeader
            title={title}
            onToggleSidebar={handleToggleSidebar}
            isSidebarCollapsed={isAdminSidebarCollapsed}
            headerRight={headerRight}
            className="sticky top-0 z-20 bg-deep-blue-950/95 backdrop-blur-sm"
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
