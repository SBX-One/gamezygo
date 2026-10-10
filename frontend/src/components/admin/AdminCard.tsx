import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional title in the card header */
  title?: React.ReactNode;
  /** Optional right slot in the card header (e.g. dropdown, link) */
  headerRight?: React.ReactNode;
  /** If true, omits the top header and divider line */
  noHeader?: boolean;
  /** ClassName for the header wrapper */
  headerClassName?: string;
  /** ClassName for the content body wrapper */
  bodyClassName?: string;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

export function AdminCard({
  title,
  headerRight,
  noHeader = false,
  headerClassName,
  bodyClassName,
  className,
  children,
  ref,
  ...props
}: AdminCardProps) {
  const hasHeader = !noHeader && (title !== undefined || headerRight !== undefined);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-deep-blue-700 text-gray-100 shadow-sm transition-all flex flex-col relative h-full",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "rounded-t-xl bg-deep-blue-900 flex items-center justify-between px-6 py-4 border-b border-deep-blue-700 shrink-0 relative z-20 min-h-[72px] h-[72px]",
            headerClassName
          )}
        >
          {typeof title === "string" ? (
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {title}
            </h3>
          ) : (
            <div>{title}</div>
          )}

          {headerRight && (
            <div className="flex items-center gap-2 relative z-30">
              {headerRight}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "bg-deep-blue-950 flex-1 px-6 py-8 relative z-10 flex flex-col justify-between",
          hasHeader ? "rounded-b-xl" : "rounded-xl",
          bodyClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
