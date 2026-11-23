import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SectionHeaderProps } from "./SectionHeader.types";

/**
 * Fluent Arrow Right Icon (fluent_arrow-right-24-regular.svg)
 */
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M13.267 4.20902C13.122 4.07777 12.9314 4.00838 12.7359 4.01566C12.5404 4.02293 12.3555 4.1063 12.2206 4.24797C12.0857 4.38964 12.0115 4.57841 12.0138 4.77402C12.0161 4.96962 12.0948 5.15658 12.233 5.29502L18.484 11.25H3.75C3.55109 11.25 3.36032 11.329 3.21967 11.4697C3.07902 11.6103 3 11.8011 3 12C3 12.1989 3.07902 12.3897 3.21967 12.5303C3.36032 12.671 3.55109 12.75 3.75 12.75H18.484L12.233 18.704C12.0889 18.8411 12.0051 19.0299 12.0001 19.2288C11.9951 19.4277 12.0694 19.6204 12.2065 19.7645C12.3436 19.9087 12.5324 19.9924 12.7313 19.9974C12.9301 20.0024 13.1229 19.9281 13.267 19.791L20.687 12.724C20.8491 12.5697 20.9547 12.3655 20.987 12.144C21.0043 12.0481 21.004 11.9498 20.986 11.854C20.9533 11.6333 20.8477 11.4298 20.686 11.276L13.267 4.20902Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Arrow Left Icon (fluent_arrow-left-24-regular.svg)
 */
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M10.7327 19.79C10.8777 19.9213 11.0683 19.9907 11.2638 19.9834C11.4593 19.9761 11.6442 19.8927 11.7791 19.7511C11.9139 19.6094 11.9881 19.4206 11.9858 19.225C11.9835 19.0294 11.9049 18.8425 11.7667 18.704L5.51566 12.75H20.2497C20.4486 12.75 20.6393 12.671 20.78 12.5303C20.9206 12.3897 20.9997 12.1989 20.9997 12C20.9997 11.8011 20.9206 11.6103 20.78 11.4697C20.6393 11.329 20.4486 11.25 20.2497 11.25H5.51566L11.7667 5.29502C11.9049 5.15658 11.9835 4.96962 11.9858 4.77402C11.9881 4.57841 11.9139 4.38964 11.7791 4.24797C11.6442 4.1063 11.4593 4.02293 11.2638 4.01566C11.0683 4.00838 10.8777 4.07777 10.7327 4.20902L3.31266 11.276C3.15058 11.4303 3.04494 11.6346 3.01266 11.856C2.99545 11.9516 2.99579 12.0495 3.01366 12.145C3.04616 12.3661 3.15178 12.57 3.31366 12.724L10.7327 19.79Z"
      fill="currentColor"
    />
  </svg>
);

export function SectionHeader({
  type = "outer",
  title = "Tawaran Khusus!",
  actionLabel = "Lihat Semua",
  showAction = true,
  actionHref,
  onActionClick,
  onBackClick,
  showBorder = true,
  className,
  ref,
  ...props
}: SectionHeaderProps) {
  const isNested = type === "nested";

  return (
    <div
      ref={ref}
      className={cn(
        "w-full flex items-center justify-between select-none pb-6.5",
        showBorder && "border-b border-b-gradient-secondary",
        className
      )}
      {...props}
    >
      {/* Kiri: Title (Outer: text-h3 font-semibold) atau Back Button + Title (Nested: text-h5 font-semibold, gap-6) */}
      <div className="flex items-center gap-6 min-w-0">
        {isNested && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-10 h-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
            onClick={onBackClick}
            aria-label="Kembali"
          >
            <ArrowLeftIcon className="w-4 h-4 text-deep-blue-100" />
          </Button>
        )}

        {isNested ? (
          <h5 className="text-h5 font-semibold text-gray-50 tracking-normal truncate">
            {title}
          </h5>
        ) : (
          <h3 className="text-h3 font-semibold text-gray-50 tracking-normal truncate">
            {title}
          </h3>
        )}
      </div>

      {/* Kanan: Lihat Semua (Button ghost sm dengan right arrow icon) */}
      {showAction && actionLabel && (
        <div className="shrink-0">
          {actionHref ? (
            <Link href={actionHref} className="inline-block outline-none">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                className="cursor-pointer"
                onClick={onActionClick}
              >
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRightIcon className="w-4 h-4" />}
              className="cursor-pointer"
              onClick={onActionClick}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
