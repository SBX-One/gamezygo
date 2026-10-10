import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminBadge } from "./AdminBadge";
import { AdminButton } from "./AdminButton";

export interface AdminListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  badgeText?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

export function AdminListItem({
  imageSrc,
  imageAlt,
  title,
  badgeText,
  actionLabel = "Lihat di Steam",
  actionHref,
  onActionClick,
  className,
  ref,
  ...props
}: AdminListItemProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 py-4 px-2 sm:px-4 border-b border-deep-blue-700 last:border-b-0 hover:bg-white/1.5 transition-colors",
        className
      )}
      {...props}
    >
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-11 h-14 sm:w-12 sm:h-16 shrink-0 rounded-md overflow-hidden bg-[#1E202B] border border-deep-blue-700">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="48px"
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white truncate">
            {title}
          </h4>

          {badgeText && (
            <div>
              <AdminBadge variant="count" size="sm">
                {badgeText}
              </AdminBadge>
            </div>
          )}
        </div>
      </div>

      {/* Right: Action Button */}
      {actionHref ? (
        <a
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <AdminButton variant="dark" size="sm">
            {actionLabel}
          </AdminButton>
        </a>
      ) : (
        <AdminButton
          variant="dark"
          size="sm"
          onClick={onActionClick}
          className="shrink-0"
        >
          {actionLabel}
        </AdminButton>
      )}
    </div>
  );
}
