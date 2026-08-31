import * as React from "react";

export type PricingCardType = "primary" | "secondary" | "paid";
export type PricingCardDirection = "vertical" | "horizontal";

export interface PricingCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tipe varian kartu: primary (merah), secondary (outline), atau paid (langganan aktif) */
  type?: PricingCardType;
  /** Orientasi layout: vertical (default) atau horizontal */
  direction?: PricingCardDirection;
  /** Icon opsional di dalam badge icon kotak */
  icon?: React.ReactNode;
  /** Judul paket (misal: 'Paket 1', 'Paket 2') */
  title: React.ReactNode;
  /** Nilai harga utama (misal: 'IDR 150,000') */
  price: React.ReactNode;
  /** Periode tagihan (misal: '/ Month') */
  period?: React.ReactNode;
  /** Daftar fitur paket */
  features?: React.ReactNode[];
  /** Teks untuk tombol aksi utama */
  actionText?: React.ReactNode;
  /** Icon untuk tombol aksi utama */
  actionIcon?: React.ReactNode;
  /** Callback saat tombol aksi utama diklik */
  onActionClick?: () => void;
  /** Teks untuk tombol aksi sekunder (khusus varian paid) */
  secondaryActionText?: React.ReactNode;
  /** Icon untuk tombol aksi sekunder (khusus varian paid, default: Phone icon) */
  secondaryActionIcon?: React.ReactNode;
  /** Callback saat tombol aksi sekunder diklik (khusus varian paid) */
  onSecondaryActionClick?: () => void;
  /** Informasi sisa waktu kedaluwarsa (khusus varian paid, misal: 'Berakhir dalam 30 hari') */
  expiryInfo?: React.ReactNode;
  /** Rentang tanggal masa aktif (khusus varian paid, misal: '22/07/2026 - 22/08/2026') */
  dateRangeInfo?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
