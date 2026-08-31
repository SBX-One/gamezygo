import * as React from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  /** Label teks untuk breadcrumb */
  label: React.ReactNode;
  /** URL link jika item bisa diklik */
  href?: string;
  /** Menandakan item aktif saat ini */
  isCurrent?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Daftar item breadcrumb */
  items?: BreadcrumbItem[];
  /** Custom separator icon (default: chevron right '>') */
  separator?: React.ReactNode;
  /** Konten manual jika tidak menggunakan array items */
  children?: React.ReactNode;
}

const DefaultSeparator = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 text-deep-blue-100/60 shrink-0"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function Breadcrumbs({
  items,
  separator = <DefaultSeparator />,
  className,
  children,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center flex-wrap gap-2 text-body-md select-none font-semibold",
        className
      )}
      {...props}
    >
      {items ? (
        <ol className="flex items-center flex-wrap gap-2 list-none p-0 m-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = item.isCurrent ?? isLast;

            return (
              <li key={index} className="flex items-center gap-2">
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className="text-white tracking-tight"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="text-deep-blue-100 hover:text-white transition-colors duration-150 font-normal"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-deep-blue-100 font-normal">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span aria-hidden="true" className="flex items-center">
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        children
      )}
    </nav>
  );
}
