import type * as React from "react";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Halaman aktif saat ini (1-indexed) */
  currentPage: number;
  /** Total jumlah halaman */
  totalPages: number;
  /** Callback saat pengguna memilih halaman baru */
  onPageChange: (page: number) => void;
  /** Jumlah sibling page yang ditampilkan di sekitar current page (default: 1) */
  siblingCount?: number;
}
