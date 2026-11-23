import * as React from "react";

export interface SidebarItem {
  /** Identifier unik untuk item */
  id: string;
  /** Label navigasi (misal: 'Toko', 'Paket', dsb) */
  label: string;
  /** Icon opsional kustom (default diambil otomatis jika ID cocok) */
  icon?: React.ReactNode;
  /** URL tautan navigasi opsional */
  href?: string;
  /** Slot badge tambahan di sebelah kanan */
  badge?: React.ReactNode;
  /** Status nonaktif item */
  disabled?: boolean;
}

export interface SidebarSection {
  /** Identifier grup navigasi */
  id?: string;
  /** Judul opsional untuk grup navigasi */
  title?: string;
  /** Daftar item di dalam grup navigasi ini */
  items: SidebarItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Kustomisasi daftar section/grup navigasi */
  sections?: SidebarSection[];
  /** ID item yang sedang aktif */
  activeId?: string;
  /** Callback saat salah satu item diklik */
  onItemClick?: (item: SidebarItem) => void;
  /** Slot kustom di bagian atas sidebar (misal: logo) */
  headerSlot?: React.ReactNode;
  /** Slot kustom di bagian bawah sidebar */
  footerSlot?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLElement>;
}
