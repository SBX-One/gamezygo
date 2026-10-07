import * as React from "react";

import type { SidebarSection } from "@/components/ui/Sidebar/Sidebar.types";

export type NavbarVariant = "guest" | "login" | "private" | "back";

export interface NavItem {
  /** Identifier unik link navigasi */
  id: string;
  /** Label teks navigasi */
  label: string;
  /** URL tautan */
  href?: string;
  /** Status aktif link */
  isActive?: boolean;
  /** Callback saat link diklik */
  onClick?: () => void;
}

export interface NavbarUser {
  /** Nama pengguna */
  name?: string;
  /** URL foto profil avatar */
  avatarUrl?: string;
  /** Fallback node untuk avatar jika gambar tidak ada */
  avatarFallback?: React.ReactNode;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Varian/mode tampilan navbar: 'guest' | 'login' | 'private' | 'back' (default: 'guest') */
  variant?: NavbarVariant;
  /** Daftar tautan navigasi */
  navItems?: NavItem[];
  /** ID tautan navigasi yang sedang aktif */
  activeNavId?: string;
  /** Callback saat item navigasi diklik */
  onNavItemClick?: (item: NavItem) => void;
  /** Nilai value dari search input */
  searchValue?: string;
  /** Placeholder untuk search input (default: 'Cari game') */
  searchPlaceholder?: string;
  /** Callback saat teks pencarian berubah */
  onSearchChange?: (value: string) => void;
  /** Callback saat tombol clear (x) pada search input diklik */
  onSearchClear?: () => void;
  /** Callback saat form pencarian disubmit */
  onSearchSubmit?: (value: string) => void;
  /** Callback saat tombol filter diklik */
  onFilterClick?: () => void;
  /** Callback saat tombol login diklik (mode guest) */
  onLoginClick?: () => void;
  /** Callback saat tombol sign up diklik (mode guest) */
  onSignUpClick?: () => void;
  /** Callback saat tombol keranjang belanja diklik */
  onCartClick?: () => void;
  /** Data profil user untuk avatar di sebelah kanan */
  user?: NavbarUser;
  /** Callback saat tombol profil user diklik */
  onUserClick?: () => void;
  /** Callback saat tombol dashboard di dropdown profil diklik */
  onDashboardClick?: () => void;
  /** Callback saat tombol logout di dropdown profil diklik */
  onLogoutClick?: () => void;
  /** Callback saat tombol pengaturan akun di dropdown profil diklik */
  onSettingsClick?: () => void;
  /** Mode sidebar hamburger mobile: 'storefront' | 'dashboard' | 'auto' */
  sidebarMode?: "storefront" | "dashboard" | "auto";
  /** Kustomisasi sections pada sidebar hamburger mobile */
  sidebarSections?: SidebarSection[];
  /** Judul halaman saat variant='back' (default: 'Artikel') */
  backTitle?: React.ReactNode;
  /** Callback saat tombol back diklik (mode back) */
  onBackClick?: () => void;
  /** React 19 native ref */
  ref?: React.Ref<HTMLElement>;
}
