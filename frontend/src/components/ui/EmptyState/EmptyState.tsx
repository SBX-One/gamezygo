import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Icon di dalam badge kotak (default: Search icon) */
  icon?: React.ReactNode;
  /** Judul utama empty state */
  title?: React.ReactNode;
  /** Deskripsi / petunjuk di bawah judul */
  description?: React.ReactNode;
  /** Teks atau tombol untuk aksi kembali */
  backLabel?: React.ReactNode;
  /** Teks atau tombol untuk aksi pencarian / aksi utama */
  searchLabel?: React.ReactNode;
  /** Callback saat tombol kembali diklik */
  onBack?: () => void;
  /** Callback saat tombol pencarian diklik */
  onSearch?: () => void;
  /** Custom slot untuk aksi jika tidak menggunakan tombol default */
  actions?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

const FluentSearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    {...props}
  >
    <path
      d="M16.102 17.162C14.5177 18.4737 12.4892 19.1248 10.4375 18.9802C8.3858 18.8356 6.46864 17.9063 5.08408 16.3853C3.69952 14.8644 2.95396 12.8686 3.0022 10.8124C3.05045 8.75615 3.88879 6.79751 5.34315 5.34315C6.79751 3.88879 8.75615 3.05045 10.8124 3.0022C12.8686 2.95396 14.8644 3.69952 16.3853 5.08408C17.9063 6.46864 18.8356 8.3858 18.9802 10.4375C19.1248 12.4892 18.4737 14.5177 17.162 16.102L21.78 20.72C21.8537 20.7886 21.9128 20.8714 21.9538 20.9634C21.9947 21.0554 22.0168 21.1547 22.0186 21.2555C22.0203 21.3562 22.0018 21.4562 21.9641 21.5496C21.9264 21.643 21.8702 21.7278 21.799 21.799C21.7278 21.8702 21.643 21.9264 21.5496 21.9641C21.4562 22.0018 21.3562 22.0203 21.2555 22.0186C21.1547 22.0168 21.0554 21.9947 20.9634 21.9538C20.8714 21.9128 20.7886 21.8537 20.72 21.78L16.102 17.162ZM17.5 11C17.5 9.27607 16.8152 7.62277 15.5962 6.40378C14.3772 5.18479 12.7239 4.49997 11 4.49997C9.27607 4.49997 7.62277 5.18479 6.40378 6.40378C5.18479 7.62277 4.49997 9.27607 4.49997 11C4.49997 12.7239 5.18479 14.3772 6.40378 15.5962C7.62277 16.8152 9.27607 17.5 11 17.5C12.7239 17.5 14.3772 16.8152 15.5962 15.5962C16.8152 14.3772 17.5 12.7239 17.5 11Z"
      fill="currentColor"
    />
  </svg>
);

const FluentArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    {...props}
  >
    <path
      d="M10.7327 19.79C10.8777 19.9213 11.0683 19.9907 11.2638 19.9834C11.4593 19.9761 11.6442 19.8927 11.7791 19.7511C11.9139 19.6094 11.9881 19.4206 11.9858 19.225C11.9835 19.0294 11.9049 18.8425 11.7667 18.704L5.51566 12.75H20.2497C20.4486 12.75 20.6393 12.671 20.78 12.5303C20.9206 12.3897 20.9997 12.1989 20.9997 12C20.9997 11.8011 20.9206 11.6103 20.78 11.4697C20.6393 11.329 20.4486 11.25 20.2497 11.25H5.51566L11.7667 5.29502C11.9049 5.15658 11.9835 4.96962 11.9858 4.77402C11.9881 4.57841 11.9139 4.38964 11.7791 4.24797C11.6442 4.1063 11.4593 4.02293 11.2638 4.01566C11.0683 4.00838 10.8777 4.07777 10.7327 4.20902L3.31266 11.276C3.15058 11.4303 3.04494 11.6346 3.01266 11.856C2.99545 11.9516 2.99579 12.0495 3.01366 12.145C3.04616 12.3661 3.15178 12.57 3.31366 12.724L10.7327 19.79Z"
      fill="currentColor"
    />
  </svg>
);

export function EmptyState({
  icon,
  title = "Ups!... Hasil tidak ditemukan",
  description = "Coba cari hal lain!",
  backLabel = "Kembali",
  searchLabel = "Search",
  onBack,
  onSearch,
  actions,
  className,
  ref,
  ...props
}: EmptyStateProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 select-none mx-auto",
        className
      )}
      {...props}
    >
      {/* 1. Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-deep-blue-900 flex items-center justify-center text-gray-50  mb-6">
        {icon || <FluentSearchIcon className="w-8 h-8 text-gray-50" />}
      </div>

      {/* 2. Title */}
      <h3 className="text-gray-50 font-semibold text-h4 mb-2">
        {title}
      </h3>

      {/* 3. Description */}
      {description && (
        <p className="text-gray-400 text-body-sm font-normal mb-6 lg:max-w-3/6">
          {description}
        </p>
      )}

      {/* 4. Action Buttons (Secondary md) */}
      {actions ? (
        actions
      ) : (
        <div className="flex items-center gap-3">
          {backLabel && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FluentArrowLeftIcon className="w-4.5 h-4.5" />}
              onClick={onBack}
            >
              {backLabel}
            </Button>
          )}

          {searchLabel && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FluentSearchIcon className="w-4.5 h-4.5" />}
              onClick={onSearch}
            >
              {searchLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
