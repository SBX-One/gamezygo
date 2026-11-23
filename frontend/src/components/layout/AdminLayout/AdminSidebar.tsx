import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import { adminLogoutApi } from "@/services/auth.service";
import type { AdminSidebarProps, AdminNavSection } from "./AdminLayout.types";

/**
 * Gamezygo Logo Emblem SVG
 */
const GamezygoEmblem = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="38"
    height="20"
    viewBox="0 0 45 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
      fill="currentColor"
    />
    <path
      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
      fill="currentColor"
    />
  </svg>
);

// Clean SVG icons matching Figma fluent icons
const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CrownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
  </svg>
);

const CatalogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="4" />
    <path d="M6 12h4m-2-2v4m7-2h.01m3-2h.01" />
  </svg>
);

const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const VoucherIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="8" width="4" height="12" rx="1" />
    <rect x="17" y="4" width="4" height="16" rx="1" />
  </svg>
);

const FaqIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const InstructionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const AnnouncementIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ArticleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ReviewIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CommunityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const DEFAULT_ADMIN_SECTIONS: AdminNavSection[] = [
  {
    id: "management-core",
    title: "MANAJEMEN",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
      { id: "pendapatan", label: "Pendapatan", href: "/admin/revenue", icon: <CrownIcon /> },
      { id: "katalog", label: "Katalog", href: "/admin/catalog", icon: <CatalogIcon /> },
      { id: "game-request", label: "Game Request", href: "/admin/requests", icon: <BookmarkIcon /> },
      { id: "kategori", label: "Kategori", href: "/admin/categories", icon: <CategoryIcon /> },
      { id: "pre-order", label: "Pre-order", href: "/admin/pre-orders", icon: <ClockIcon /> },
      { id: "paket", label: "Paket", href: "/admin/bundles", icon: <PackageIcon /> },
      { id: "voucher", label: "Voucher", href: "/admin/vouchers", icon: <VoucherIcon /> },
    ],
  },
  {
    id: "management-content",
    title: "MANAJEMEN",
    items: [
      { id: "faq", label: "FAQ", href: "/admin/faq", icon: <FaqIcon /> },
      { id: "instruksi", label: "Instruksi", href: "/admin/instructions", icon: <InstructionIcon /> },
      { id: "pengumuman", label: "Pengumuman", href: "/admin/announcements", icon: <AnnouncementIcon /> },
      { id: "artikel", label: "Artikel", href: "/admin/articles", icon: <ArticleIcon /> },
      { id: "ulasan", label: "Ulasan", href: "/admin/reviews", icon: <ReviewIcon /> },
      { id: "komunitas", label: "Komunitas", href: "/admin/community", icon: <CommunityIcon /> },
      { id: "pengguna", label: "Pengguna", href: "/admin/users", icon: <UsersIcon /> },
    ],
  },
];

export function AdminSidebar({
  sections = DEFAULT_ADMIN_SECTIONS,
  activeId,
  isCollapsed = false,
  className,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminLogoutApi();
    } catch {
      // Ignore network errors on logout call
    } finally {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <aside
      className={cn(
        // Background: deep-blue-900 (#15161D), Border: deep-blue-700 (#2F2F37)
        "flex flex-col bg-deep-blue-900 border-r border-deep-blue-700 transition-all duration-300 ease-in-out select-none shrink-0 z-30 h-full",
        // Width: Figma W 320 -> w-80 when expanded, w-20 when collapsed
        isCollapsed ? "w-20 px-2" : "w-80 px-8",
        className
      )}
    >
      {/* 1. Top Header Box: Gamezygo Red Logo + Text */}
      <div
        className={cn(
          "pt-8 flex items-center transition-all",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="text-[#FF5364] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <GamezygoEmblem />
          </div>
          {!isCollapsed && (
            <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              Gamezygo
            </span>
          )}
        </Link>
      </div>

      {/* Jarak dari Logo Header Box ke Section 1: tepat 40px (Figma Image 1: measurement 40) */}
      <div className="h-10 shrink-0" />

      {/* 2. Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-8 space-y-12">
        {sections.map((section, sIdx) => (
          <div key={section.id || sIdx} className="space-y-3">
            {/* Section Header Title: Ag Body/sm/Default · 14/140 (Figma Image 2) */}
            {!isCollapsed && (
              <div className="text-[14px] leading-[1.4] font-medium tracking-normal text-[#8D8D9E] uppercase select-none px-3">
                {section.title}
              </div>
            )}

            {/* Section Nav Items: Component Button size sm, H 40, px-3 py-2, gap-4 (16px) (Figma Image 3) */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  activeId === item.id ||
                  router.pathname === item.href ||
                  (item.href !== "/admin/dashboard" && router.pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      // Auto-layout: W Fill, H 40 (min-h-[40px]), px-3 (12px), py-2 (8px), gap-4 (16px)
                      "flex items-center gap-4 px-3 py-2 min-h-[40px] rounded-lg text-[14px] leading-[1.4] transition-all duration-150 group relative outline-none select-none",
                      isActive
                        ? "bg-[#1E202B] text-white font-semibold shadow-sm"
                        : "text-deep-blue-100 hover:text-white hover:bg-white/4 font-medium",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {/* Icon Slot: 20px / w-5 h-5 */}
                    <span
                      className={cn(
                        "w-5 h-5 shrink-0 flex items-center justify-center transition-colors",
                        isActive ? "text-white" : "text-[#8D8D9E] group-hover:text-white"
                      )}
                    >
                      {item.icon}
                    </span>

                    {/* Label Slot */}
                    {!isCollapsed && (
                      <span className="truncate whitespace-nowrap">
                        {item.label}
                      </span>
                    )}

                    {/* Badge if provided */}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto shrink-0">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Logout Action */}
      <div className="pt-3 pb-6 border-t border-deep-blue-700/60 mt-auto shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Keluar" : undefined}
          className={cn(
            "w-full flex items-center gap-4 px-3 py-2 min-h-[40px] rounded-lg text-[14px] leading-[1.4] transition-all duration-150 group outline-none select-none text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 cursor-pointer",
            isCollapsed && "justify-center px-2"
          )}
        >
          <span className="w-5 h-5 shrink-0 flex items-center justify-center text-rose-400 group-hover:text-rose-300 transition-colors">
            <LogOutIcon />
          </span>
          {!isCollapsed && (
            <span className="truncate whitespace-nowrap font-medium">
              Keluar
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
