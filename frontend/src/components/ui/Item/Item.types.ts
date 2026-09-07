import * as React from "react";

export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** ID unik item */
  id?: string;
  /** Judul item game */
  title: React.ReactNode;
  /** URL gambar cover game */
  imageSrc?: string;
  /** Alt text untuk gambar */
  imageAlt?: string;
  /** Badge / teks diskon (misal: '-30%') */
  discount?: React.ReactNode;
  /** Harga asli yang dicoret (misal: 'Rp 439.000,00') */
  originalPrice?: React.ReactNode;
  /** Harga final / harga beli (misal: 'Rp 219.500') */
  price: React.ReactNode;
  /** Callback saat tombol 'Beli Sekarang' diklik */
  onBuyNow?: () => void;
  /** Callback saat tombol hapus (trash) diklik */
  onDelete?: () => void;
  /** Teks pada tombol beli sekarang (default: 'Beli Sekarang') */
  buyNowText?: string;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
