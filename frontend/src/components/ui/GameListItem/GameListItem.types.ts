import * as React from "react";

export type GameListItemState =
  | "default"
  | "hover"
  | "focus"
  | "pressed"
  | "disabled";

export interface GameListItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** Judul game (misal: 'Grand Theft Auto V') */
  title: React.ReactNode;
  /** URL gambar cover game */
  imageSrc?: string;
  /** Alt text untuk gambar */
  imageAlt?: string;
  /** Slot gambar kustom */
  imageSlot?: React.ReactNode;
  /** Potongan harga untuk pill primary xs (misal: '-30%') */
  discount?: React.ReactNode;
  /** Harga asli yang dicoret (misal: 'Rp 439.000,00') */
  originalPrice?: React.ReactNode;
  /** Harga final / tidak dicoret (misal: 'Rp 219.500') */
  price: React.ReactNode;
  /** Paksa status tampilan untuk keperluan demo / preview */
  forceState?: GameListItemState;
  /** React 19 native ref */
  ref?: React.Ref<HTMLButtonElement>;
}
