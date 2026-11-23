import * as React from "react";

export interface FooterLink {
  /** Label link navigasi */
  label: string;
  /** URL tautan link */
  href?: string;
  /** Callback saat link diklik */
  onClick?: () => void;
}

export interface FooterColumn {
  /** Judul kolom navigasi */
  title: string;
  /** Daftar tautan di dalam kolom */
  links: FooterLink[];
}

export interface SocialLink {
  /** Icon opsional kustom (default: Plus icon) */
  icon?: React.ReactNode;
  /** URL tautan sosial media */
  href?: string;
  /** Callback saat tombol sosial media diklik */
  onClick?: () => void;
  /** Label aksesibilitas untuk screen reader */
  ariaLabel?: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Nama brand (default: 'Gamezygo') */
  brandName?: string;
  /** Icon/Logo kustom untuk brand di kiri atas */
  brandLogo?: React.ReactNode;
  /** URL tautan saat brand logo/nama diklik */
  brandHref?: string;
  /** Daftar kolom navigasi footer */
  columns?: FooterColumn[];
  /** Judul untuk kolom sosial media (default: 'Sosial Media') */
  socialTitle?: string;
  /** Daftar tombol sosial media */
  socialLinks?: SocialLink[];
  /** React 19 native ref */
  ref?: React.Ref<HTMLElement>;
}
