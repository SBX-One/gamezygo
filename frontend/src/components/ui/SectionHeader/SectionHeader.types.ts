import * as React from "react";

export type SectionHeaderType = "outer" | "nested";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tipe layout header seksi: 'outer' | 'nested' (default: 'outer') */
  type?: SectionHeaderType;
  /** Judul seksi (default: 'Tawaran Khusus!') */
  title?: React.ReactNode;
  /** Label untuk tombol aksi di sisi kanan (default: 'Lihat Semua') */
  actionLabel?: React.ReactNode;
  /** Apakah menampilkan tombol aksi kanan (default: true) */
  showAction?: boolean;
  /** URL tautan saat tombol aksi kanan diklik */
  actionHref?: string;
  /** Callback saat tombol aksi kanan diklik */
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback saat tombol kembali (left arrow) diklik pada tipe nested */
  onBackClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Apakah menampilkan garis border bawah linear secondary (default: true) */
  showBorder?: boolean;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
