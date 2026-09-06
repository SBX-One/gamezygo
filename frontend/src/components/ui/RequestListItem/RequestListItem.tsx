import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button, Pill } from "@/components/ui";
import type { RequestListItemProps } from "./RequestListItem.types";

/**
 * Fluent Dismiss Icon (fluent_dismiss-24-regular.svg)
 */
const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Add Icon (fluent_add-24-regular.svg)
 */
const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V11.25H20C20.1989 11.25 20.3897 11.329 20.5303 11.4697C20.671 11.6103 20.75 11.8011 20.75 12C20.75 12.1989 20.671 12.3897 20.5303 12.5303C20.3897 12.671 20.1989 12.75 20 12.75H12.75V20C12.75 20.1989 12.671 20.3897 12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303C11.329 20.3897 11.25 20.1989 11.25 20V12.75H4C3.80109 12.75 3.61032 12.671 3.46967 12.5303C3.32902 12.3897 3.25 12.1989 3.25 12C3.25 11.8011 3.32902 11.6103 3.46967 11.4697C3.61032 11.329 3.80109 11.25 4 11.25H11.25V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Fluent Checkmark Icon (fluent_checkmark-24-regular.svg)
 */
const CheckmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.52985 12.97C4.38767 12.8375 4.19963 12.7654 4.00532 12.7688C3.81102 12.7722 3.62564 12.8509 3.48822 12.9883C3.35081 13.1258 3.2721 13.3111 3.26867 13.5054C3.26524 13.6997 3.33737 13.8878 3.46985 14.03L7.96985 18.53C8.11047 18.6704 8.3011 18.7493 8.49985 18.7493C8.6986 18.7493 8.88922 18.6704 9.02985 18.53L20.0298 7.52997C20.1623 7.38779 20.2344 7.19975 20.231 7.00545C20.2276 6.81114 20.1489 6.62576 20.0115 6.48835C19.8741 6.35093 19.6887 6.27222 19.4944 6.26879C19.3001 6.26537 19.112 6.33749 18.9698 6.46997L8.49985 16.94L4.52985 12.97Z"
      fill="currentColor"
    />
  </svg>
);

export function RequestListItem({
  id,
  title,
  imageSrc,
  imageAlt,
  requestDate,
  requestCount,
  variant,
  onActionClick,
  isUpvoted = false,
  disabled = false,
  className,
  ...props
}: RequestListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg bg-surface-secondary-default border border-white/5 hover:border-white/10 transition-all duration-150 select-none w-full",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* 1. Game Cover Image */}
      <div className="w-16.5 min-w-16.5 self-stretch rounded-md overflow-hidden bg-deep-blue-950 shrink-0 relative min-h-[76px] sm:min-h-[80px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="66px"
            className="object-cover rounded-md"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-label-xs text-gray-500">
            Game
          </div>
        )}
      </div>

      {/* 2. Text Details & Bottom Row */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
        {/* Top: Game Title & Request Date */}
        <div>
          <h3 className="font-semibold text-white text-body-md tracking-normal truncate leading-tight">
            {title}
          </h3>
          <span className="text-body-xs text-gray-400 font-normal leading-tight mt-0.5 block">
            Di Request: {requestDate}
          </span>
        </div>

        {/* Bottom Row: Pill & Action Button bersebrangan */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* People requested count badge */}
          <Pill variant="secondary" size="xs">
            {requestCount} orang meminta
          </Pill>

          {/* Action button based on variant */}
          <div className="shrink-0">
            {variant === "my-request" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onActionClick?.(id)}
                rightIcon={<DismissIcon />}
                aria-label={`Batalkan request ${title}`}
              >
                Requested
              </Button>
            )}

            {variant === "community" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onActionClick?.(id)}
                rightIcon={isUpvoted ? <CheckmarkIcon /> : <AddIcon />}
                aria-label={`Upvote request ${title}`}
              >
                {isUpvoted ? "Upvoted" : "Upvote"}
              </Button>
            )}

            {variant === "added" && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onActionClick?.(id)}
                aria-label={`Lihat game ${title} di Toko`}
              >
                Lihat di Toko
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


