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
  /** If true, stacks title and headerRight on small screens (flex-col) and row on tablet/desktop (sm:flex-row) */
  headerResponsive?: boolean;
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
  headerResponsive = false,
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
        "rounded-lg border border-deep-blue-700 text-gray-100 shadow-sm transition-all flex flex-col relative h-full",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "rounded-t-xl bg-deep-blue-900 border-b border-deep-blue-700 shrink-0 relative px-4 sm:px-6",
            headerResponsive
              ? "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 h-auto min-h-18 py-3.5 sm:py-4"
              : "flex items-center justify-between min-h-18 h-18 py-4",
            headerClassName
          )}
        >
          {typeof title === "string" ? (
            <h3 className="text-body-sm  text-gray-400 uppercase">
              {title}
            </h3>
          ) : (
            <div>{title}</div>
          )}

          {headerRight && (
            <div className="flex items-center gap-2 relative">
              {headerRight}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "bg-deep-blue-950 flex-1 px-6 py-8 relative flex flex-col justify-between",
          hasHeader ? "rounded-b-xl" : "rounded-lg",
          bodyClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Re-exports for backwards compatibility
export {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "./AdminTable";

