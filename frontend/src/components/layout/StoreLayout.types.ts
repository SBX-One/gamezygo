import * as React from "react";
import type { NavbarVariant, NavbarUser, NavItem } from "@/components/ui/Navbar/Navbar.types";
import type { SidebarSection, SidebarItem } from "@/components/ui/Sidebar/Sidebar.types";

export interface StoreLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Konten halaman utama */
  children: React.ReactNode;
  /** Varian/mode tampilan navbar: 'guest' | 'login' | 'private' | 'back' (default: 'guest') */
  navbarVariant?: NavbarVariant;
  /** Daftar tautan navigasi di Navbar */
  navItems?: NavItem[];
  /** ID tautan navigasi Navbar yang sedang aktif */
  activeNavId?: string;
  /** ID item Sidebar yang sedang aktif (default: 'toko') */
  activeSidebarId?: string;
  /** Nilai pencarian pada input search Navbar */
  searchValue?: string;
  /** Placeholder input pencarian */
  searchPlaceholder?: string;
  /** Callback saat nilai pencarian berubah */
  onSearchChange?: (value: string) => void;
  /** Callback saat form pencarian disubmit */
  onSearchSubmit?: (value: string) => void;
  /** Callback saat tombol clear pencarian diklik */
  onSearchClear?: () => void;
  /** Callback saat tombol filter diklik */
  onFilterClick?: () => void;
  /** Callback saat tombol Login diklik */
  onLoginClick?: () => void;
  /** Callback saat tombol Sign Up diklik */
  onSignUpClick?: () => void;
  /** Callback saat tombol keranjang belanja diklik */
  onCartClick?: () => void;
  /** Callback saat item navigasi Navbar diklik */
  onNavItemClick?: (item: NavItem) => void;
  /** Callback saat item navigasi Sidebar diklik */
  onSidebarItemClick?: (item: SidebarItem) => void;
  /** Data profil user untuk avatar Navbar */
  user?: NavbarUser;
  /** Callback saat avatar user diklik */
  onUserClick?: () => void;
  /** Callback saat tombol dashboard di dropdown profil diklik */
  onDashboardClick?: () => void;
  /** Callback saat tombol logout di dropdown profil diklik */
  onLogoutClick?: () => void;
  /** Callback saat tombol pengaturan akun di dropdown profil diklik */
  onSettingsClick?: () => void;
  /** Mode sidebar: 'storefront' | 'dashboard' | 'auto' */
  sidebarMode?: "storefront" | "dashboard" | "auto";
  /** Sembunyikan navbar di layout jika diperlukan */
  hideNavbar?: boolean;
  /** Sembunyikan sidebar di layout jika diperlukan */
  hideSidebar?: boolean;
  /** Sembunyikan footer di layout jika diperlukan */
  hideFooter?: boolean;
  /** Kustomisasi sections pada Sidebar */
  sidebarSections?: SidebarSection[];
  /** Kustomisasi className untuk elemen main konten utama */
  contentClassName?: string;
  /** Judul halaman saat navbarVariant='back' (default: 'Artikel') */
  backTitle?: React.ReactNode;
  /** Callback saat tombol back diklik (mode back) */
  onBackClick?: () => void;
  /** Apakah terjadi error 500 pada halaman */
  isError?: boolean;
  /** Alias apakah terjadi error */
  hasError?: boolean;
  /** Callback reload saat error 500 */
  onReload?: () => void;
  /** Custom title untuk error 500 */
  errorTitle?: string;
  /** Custom deskripsi untuk error 500 */
  errorDescription?: string;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
