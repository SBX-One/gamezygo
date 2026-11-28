import * as React from "react";

export interface TestimonialImage {
  id?: string;
  src?: string;
  alt?: string;
}

export interface TestimonialCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** URL foto avatar pengguna */
  avatarSrc?: string;
  /** Alt text untuk avatar */
  avatarAlt?: string;
  /** Slot avatar kustom */
  avatarSlot?: React.ReactNode;
  /** Teks rating (default: '5 Star') */
  rating?: React.ReactNode;
  /** Isi ulasan testimonial */
  review: React.ReactNode;
  /** Daftar thumbnail gambar screenshot gameplay / bukti. Jika bernilai false maka gallery disembunyikan. Jika tidak diisi, otomatis menampilkan 3 skeleton placeholder */
  images?: Array<TestimonialImage | string> | boolean;
  /** Nama pengguna / reviewer (misal: 'Dyven Siauw') */
  userName: React.ReactNode;
  /** Nama game atau info tambahan (misal: 'Black Myth Wukong, 2+') */
  gameName?: React.ReactNode;
  /** Balasan resmi dari Admin Gamezygo (opsional) */
  adminReply?: string | null;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}
