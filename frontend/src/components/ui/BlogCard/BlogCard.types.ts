import * as React from "react";

export interface BlogCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** URL gambar cover artikel blog */
  imageSrc?: string;
  /** Alt text untuk gambar cover */
  imageAlt?: string;
  /** Slot kustom untuk gambar */
  imageSlot?: React.ReactNode;
  /** Informasi tanggal/waktu (misal: '1 BULAN LALU') */
  date?: React.ReactNode;
  /** Judul artikel blog */
  title: React.ReactNode;
  /** Kategori atau tag untuk Pill secondary sm (misal: 'Review & Rekomendasi') */
  category?: React.ReactNode;
  /** Ringkasan atau deskripsi artikel */
  description?: React.ReactNode;
  /** URL tautan saat artikel diklik */
  href?: string;
  /** Callback saat card diklik */
  onClick?: () => void;
  /** React 19 native ref */
  ref?: React.Ref<HTMLElement>;
}
