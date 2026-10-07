import * as React from "react";

export type RequestCardVariant = "my-request" | "community" | "added";

export interface RequestListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  /** ID unik item request */
  id: string;
  /** Judul game yang di-request */
  title: string;
  /** URL cover thumbnail game */
  imageSrc: string;
  /** Alt teks untuk cover game */
  imageAlt?: string;
  /** Tanggal game di-request (misal: '22/07/2026') */
  requestDate: string;
  /** Jumlah pemilih / orang yang meminta game ini */
  requestCount: number;
  /** Varian tampilan tombol berdasarkan tab yang sedang aktif */
  variant: RequestCardVariant;
  /** Callback saat tombol aksi di sebelah kanan diklik */
  onActionClick?: (id: string) => void;
  /** Status apakah user sudah melakukan upvote (untuk tab community) */
  isUpvoted?: boolean;
  /** Status disabled */
  disabled?: boolean;
  /** URL / Link langsung ke detail game di Toko/Store */
  href?: string;
}
