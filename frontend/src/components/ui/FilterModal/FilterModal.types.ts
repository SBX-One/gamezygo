import * as React from "react";

export interface FilterModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Apakah modal terbuka (jika digunakan sebagai overlay dialog) */
  isOpen?: boolean;
  /** Mode dialog overlay dengan backdrop atau inline card component (default: false) */
  isDialog?: boolean;
  /** Tipe tampilan filter: 'dropdown' (default), 'dialog' (modal di tengah), atau 'inline' */
  variant?: "dropdown" | "dialog" | "inline";
  /** Callback saat tombol close atau backdrop diklik */
  onClose?: () => void;
  /** Callback saat tombol Reset diklik */
  onReset?: () => void;
  /** Callback saat tombol Apply diklik */
  onApply?: () => void;
  /** Judul header modal (default: 'Filter & Sort') */
  title?: React.ReactNode;
  /** Daftar kategori filter teratas (default: Hot Deals, Best Seller, New Release, Coming Soon) */
  categories?: string[];
  /** Daftar genre utama */
  genres?: string[];
  /** Daftar launcher platform (default: Steam, Epic Game, EA, PS4) */
  launchers?: string[];
  /** Daftar opsi pengurutan (default: Terbaru, Nama (A - Z)) */
  sortOptions?: string[];
  /** Daftar tag / subgenre tambahan di bawah */
  tags?: string[];
  /** Batas minimum harga numerik (default: 0) */
  minPrice?: number;
  /** Batas maksimum harga numerik (default: 200000) */
  maxPrice?: number;
  /** Step pergeseran harga (default: 5000) */
  priceStep?: number;
  /** Nilai harga aktif [min, max] */
  priceRange?: [number, number];
  /** Callback saat range harga berubah */
  onPriceRangeChange?: (range: [number, number]) => void;
  /** Kontrol apakah slider range harga ditampilkan (default: true) */
  showPriceRange?: boolean;
  /** Daftar opsi status (e.g. Hot Deals, New Release, Coming Soon, Action) */
  statusOptions?: string[];
  /** Daftar opsi platform (e.g. Steam, Epic Games, Play Station) */
  platformOptions?: string[];
  /** Daftar opsi game (e.g. Elden Ring, Cyberpunk, GTA 6) */
  gameOptions?: string[];
  /** State pilihan aktif */
  selectedCategories?: string[];
  selectedGenres?: string[];
  selectedLaunchers?: string[];
  selectedSort?: string;
  selectedTags?: string[];
  selectedStatus?: string[];
  selectedPlatforms?: string[];
  selectedGames?: string[];
  onToggleCategory?: (category: string) => void;
  onToggleGenre?: (genre: string) => void;
  onToggleLauncher?: (launcher: string) => void;
  onSelectSort?: (sort: string) => void;
  onToggleTag?: (tag: string) => void;
  onToggleStatus?: (status: string) => void;
  onTogglePlatform?: (platform: string) => void;
  onToggleGame?: (game: string) => void;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
