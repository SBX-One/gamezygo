import * as React from "react";

export type ProductCardOrientation = "vertical" | "horizontal";
export type ProductCardState = "default" | "unavailable" | "pre-order";

export interface ProductCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Orientasi card: 'vertical' | 'horizontal' (default: 'vertical') */
  orientation?: ProductCardOrientation;
  /** Status ketersediaan: 'default' | 'unavailable' | 'pre-order' (default: 'default') */
  state?: ProductCardState;
  /** URL gambar cover game */
  imageSrc?: string;
  /** Alt text gambar cover */
  imageAlt?: string;
  /** Slot gambar kustom */
  imageSlot?: React.ReactNode;
  /** Nama platform (default: 'Steam') */
  platform?: React.ReactNode;
  /** Apakah menampilkan badge Best Seller (default: true pada horizontal) */
  isBestSeller?: boolean;
  /** Label badge Best Seller (default: 'Best Seller') */
  bestSellerLabel?: string;
  /** Daftar genre game untuk Pill secondary extrasmall (misal: ['Action', 'Adventure']) */
  genres?: string[];
  /** Judul game (misal: "Assassin's Creed Black Flag Resynced") */
  title: React.ReactNode;
  /** Harga asli yang dicoret (misal: 'Rp 439.000,00') */
  originalPrice?: React.ReactNode;
  /** Harga aktif / final (misal: 'Rp 219.500') */
  price: React.ReactNode;
  /** Diskon harga untuk Pill primary xs (misal: '-30%') */
  discount?: React.ReactNode;
  /** Teks info rilis untuk pre-order (misal: 'Release at 5 July') */
  releaseDate?: React.ReactNode;
  /** Teks kustom tombol aksi */
  buttonText?: React.ReactNode;
  /** Callback saat tombol aksi diklik */
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Link tujuan saat card diklik */
  href?: string;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
