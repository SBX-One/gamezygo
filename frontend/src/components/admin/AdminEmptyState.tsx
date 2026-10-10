import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdminButton } from "./AdminButton";

export interface AdminEmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Custom icon node inside dark badge (defaults to Fluent Book icon) */
  icon?: React.ReactNode;
  /** Primary title heading (defaults to 'Tidak ada Riwayat') */
  title?: React.ReactNode;
  /** Category name to build description: 'Tidak ditemukan riwayat untuk kategori {category}.' */
  category?: string;
  /** Custom full description text override */
  description?: React.ReactNode;
  /** Action button text label */
  actionLabel?: string;
  /** Action button icon (e.g. Plus icon or Arrow icon) */
  actionIcon?: React.ReactNode;
  /** Position of action icon relative to label */
  actionIconPosition?: "left" | "right";
  /** Click handler for action button */
  onAction?: () => void;
  /** Navigation link for action button if used as a link */
  actionHref?: string;
  /** Custom slot for actions if completely custom */
  action?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Fluent Book icon matching Gamezygo admin empty state designs (assets/svg/fluent_book-24-regular.svg)
 */
export const FluentBookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-gray-100"
    {...props}
  >
    <path d="M7 6C7 5.73478 7.10536 5.48043 7.29289 5.29289C7.48043 5.10536 7.73478 5 8 5H16C16.2652 5 16.5196 5.10536 16.7071 5.29289C16.8946 5.48043 17 5.73478 17 6V8C17 8.26522 16.8946 8.51957 16.7071 8.70711C16.5196 8.89464 16.2652 9 16 9H8C7.73478 9 7.48043 8.89464 7.29289 8.70711C7.10536 8.51957 7 8.26522 7 8V6ZM8.5 7.5H15.5V6.5H8.5V7.5ZM4 4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2H18C18.3283 2 18.6534 2.06466 18.9567 2.1903C19.26 2.31594 19.5356 2.50009 19.7678 2.73223C19.9999 2.96438 20.1841 3.23998 20.3097 3.54329C20.4353 3.84661 20.5 4.1717 20.5 4.5V18.75C20.5 18.9489 20.421 19.1397 20.2803 19.2803C20.1397 19.421 19.9489 19.5 19.75 19.5H5.5C5.5 19.7652 5.60536 20.0196 5.79289 20.2071C5.98043 20.3946 6.23478 20.5 6.5 20.5H19.75C19.9489 20.5 20.1397 20.579 20.2803 20.7197C20.421 20.8603 20.5 21.0511 20.5 21.25C20.5 21.4489 20.421 21.6397 20.2803 21.7803C20.1397 21.921 19.9489 22 19.75 22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5ZM5.5 18H19V4.5C19 4.23478 18.8946 3.98043 18.7071 3.79289C18.5196 3.60536 18.2652 3.5 18 3.5H6.5C6.23478 3.5 5.98043 3.60536 5.79289 3.79289C5.60536 3.98043 5.5 4.23478 5.5 4.5V18Z" />
  </svg>
);

export function AdminEmptyState({
  icon,
  title = "Tidak ada Riwayat",
  category,
  description,
  actionLabel,
  actionIcon,
  actionIconPosition = "left",
  onAction,
  actionHref,
  action,
  className,
  ref,
  ...props
}: AdminEmptyStateProps) {
  // Compute standard descriptive text if category given and description not explicitly provided
  const finalDescription =
    description ||
    (category
      ? `Tidak ditemukan riwayat untuk kategori ${category}.`
      : "Tidak ditemukan riwayat untuk data ini.");

  const buttonContent = (
    <AdminButton
      variant="dark"
      size="md"
      onClick={onAction}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E202B] hover:bg-[#252837] border border-deep-blue-700 text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-all shadow-sm"
    >
      {actionIcon && actionIconPosition === "left" && actionIcon}
      <span>{actionLabel}</span>
      {actionIcon && actionIconPosition === "right" && actionIcon}
    </AdminButton>
  );

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 sm:p-10 select-none mx-auto w-full",
        className
      )}
      {...props}
    >
      {/* 1. Icon Container with 16px border-radius and subtle dark frame */}
      <div className="w-16 h-16 rounded-2xl bg-[#161822] border border-white/5 flex items-center justify-center text-gray-100 mb-5 shadow-inner">
        {icon || <FluentBookIcon className="w-8 h-8 text-gray-200" />}
      </div>

      {/* 2. Bold Title */}
      <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {title}
      </h4>

      {/* 3. Description (2 lines constrained for elegant reading) */}
      {finalDescription && (
        <p className="text-xs sm:text-sm text-gray-400 font-normal text-center mb-6 leading-relaxed">
          {finalDescription}
        </p>
      )}

      {/* 4. Action Button (AdminButton variant="dark") */}
      {action ? (
        action
      ) : actionLabel ? (
        actionHref ? (
          <Link href={actionHref}>{buttonContent}</Link>
        ) : (
          buttonContent
        )
      ) : null}
    </div>
  );
}
