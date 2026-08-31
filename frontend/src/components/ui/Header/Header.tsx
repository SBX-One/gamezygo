import * as React from "react";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

export interface HeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Teks atau konten untuk badge Pill di atas */
  pillText?: React.ReactNode;
  /** Judul utama hero header */
  title?: React.ReactNode;
  /** Teks deskripsi atau subtitle kecil di sebelah kiri tombol */
  subtitle?: React.ReactNode;
  /** Label untuk tombol aksi utama */
  actionLabel?: React.ReactNode;
  /** Icon untuk tombol aksi utama */
  actionIcon?: React.ReactNode;
  /** Callback saat tombol aksi diklik */
  onActionClick?: () => void;
  /** React 19 native ref */
  ref?: React.Ref<HTMLElement>;
}

const FluentPlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4.5 h-4.5"
    {...props}
  >
    <path
      d="M5 5.27403C5 3.56703 6.826 2.48203 8.325 3.29703L20.687 10.024C22.253 10.876 22.253 13.124 20.687 13.976L8.325 20.702C6.826 21.518 5 20.432 5 18.726V5.27403Z"
      fill="currentColor"
    />
  </svg>
);

export function Header({
  pillText = "Promo Musim Panas Telah Datang!",
  title = "Pemilik Koleksi Game Terbesar Saat Ini!",
  subtitle = "Ingin Langsung Buka Semua? Beli Premium!",
  actionLabel = "Lihat Premium",
  actionIcon = <FluentPlayIcon />,
  onActionClick,
  className,
  ref,
  ...props
}: HeaderProps) {
  return (
    <header
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-6 py-12 px-4 select-none  mx-auto",
        className
      )}
      {...props}
    >
      {/* 1. Top Pill Badge (Medium Secondary) */}
      {pillText && (
        <Pill variant="secondary" size="md">
          {pillText}
        </Pill>
      )}

      {/* 2. Main Large Headline */}
      <h1 className="text-h1 font-bold text-white tracking-tight  leading-[1.15]">
        {title}
      </h1>

      {/* 3. Bottom Row (Subtitle + Secondary md Action Button) */}
      <div className="flex items-center gap-4 mt-2">
        {subtitle && (
          <p className="text-gray-400 text-body-sm font-normal text-right leading-snug">
            {subtitle}
          </p>
        )}

        {actionLabel && (
          <Button
            variant="secondary"
            size="md"
            leftIcon={actionIcon}
            onClick={onActionClick}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
